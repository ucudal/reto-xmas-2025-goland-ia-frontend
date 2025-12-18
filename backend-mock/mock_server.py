#!/usr/bin/env python3

import json
import time
import uuid
import os
import glob
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pypdf import PdfReader
from openai import OpenAI

from ag_ui.core import (
    RunStartedEvent,
    RunFinishedEvent,
    TextMessageStartEvent,
    TextMessageContentEvent,
    TextMessageEndEvent,
    StepStartedEvent,
    StepFinishedEvent
)

# Cargar variables de entorno (.env)
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuración OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_client = None

if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    print(f"✅ OpenAI API Key detectada. Modo Inteligente ACTIVADO.")
else:
    print(f"⚠️ No se detectó OPENAI_API_KEY. Modo Mock (Respuestas predefinidas) ACTIVADO.")


# --- RESPUESTAS MOCK (FALLBACK) ---
MOCK_RESPONSES = {
    "hola": {
        "keywords": ["hola", "buenos días", "buenas tardes", "buenas noches", "hi", "hello", "saludos"],
        "response": "**¡Hola! Soy el asistente de Goland. ¿En qué puedo ayudarte hoy?**"
    },
    "productos": {
        "keywords": ["producto", "productos", "qué tienen", "qué venden", "catálogo", "qué ofrecen"],
        "response": "**Tenemos una amplia variedad de productos a base de cáñamo: semillas, aceites, proteínas y más. ¿Te interesa alguno en particular?**"
    },
    "precio": {
        "keywords": ["precio", "precios", "cuánto cuesta", "costo", "valor", "tarifa"],
        "response": "**Los precios varían según el producto. Te recomiendo visitar nuestra tienda online en shop.goland-group.com para ver los precios actualizados.**"
    },
    "ingredientes": {
        "keywords": ["ingrediente", "ingredientes", "qué contiene", "de qué está hecho", "composición", "natural"],
        "response": "**Nuestros productos están hechos con ingredientes 100% naturales, sin conservantes artificiales, veganos y sin gluten. ¿Quieres saber más sobre algún producto específico?**"
    },
    "envio": {
        "keywords": ["envío", "envio", "entrega", "shipping", "delivery", "enviar", "cuánto tarda"],
        "response": "**Realizamos envíos a todo Uruguay. El tiempo de entrega depende de tu ubicación, generalmente entre 3 a 7 días hábiles.**"
    },
    "default": {
        "keywords": [],
        "response": "**Gracias por tu consulta. Nuestro equipo está aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?**"
    }
}

# --- Carga de Contexto (PDFs) ---
PRODUCT_CONTEXT = """
Eres el asistente virtual experto de Goland Group.
Tu objetivo es EXCLUSIVAMENTE ayudar a los clientes con información sobre nuestros productos de cáñamo (Hemp), la empresa y temas relacionados (nutrición, sostenibilidad).

REGLAS DE COMPORTAMIENTO (GUARDRAILS):
1. Si el usuario pregunta sobre temas ajenos a Goland, cáñamo, nutrición o deportes, responde educadamente que solo puedes asistir con temas relacionados a la marca.
2. NO respondas preguntas de cultura general, matemáticas, programación, política o competencia, a menos que se relacione directamente con el cáñamo.
3. Mantén un tono profesional, cercano y enfocado en la venta y soporte.
4. Si la información NO está en los documentos ni en tu conocimiento base, NO inventes. Indica al usuario que puede buscar ese dato oficial en https://goland-group.com/ o escribir a contacto.

Responde de manera amable, concisa y profesional.

INFORMACIÓN DE PRODUCTOS BASE:
1. Crema de Maní & Hemp Protein: Snack saludable, proteína vegetal, fibra. Ideal untar o batidos.
2. Hemp Coffee (Moka): Café molido con 20% proteína de cáñamo. Energía + Nutrición.
3. Hemp Protein: Proteína vegetal completa.
4. Hemp Hearts: Semillas descascaradas, ricas en omegas.
5. Hemp Seed Oil: Aceite prensado en frío.

INFORMACIÓN ADICIONAL DE DOCUMENTOS:
"""

def load_pdf_context():
    global PRODUCT_CONTEXT
    # Detectar ruta relativa al script para soportar ejecución desde root o desde la carpeta
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "data")
    pdf_pattern = os.path.join(data_dir, "*.pdf")
    
    pdf_files = glob.glob(pdf_pattern)
    if not pdf_files:
        print(f"ℹ️ No se encontraron PDFs en {data_dir}")
        return

    print(f"📄 Cargando {len(pdf_files)} documentos PDF desde {data_dir}...")
    pdf_text = ""
    for pdf_path in pdf_files:
        try:
            reader = PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            pdf_text += f"\n--- Contenido de {os.path.basename(pdf_path)} ---\n{text}\n"
        except Exception as e:
            print(f"❌ Error leyendo {pdf_path}: {e}")
    
    PRODUCT_CONTEXT += pdf_text
    print("✅ Contexto actualizado con PDFs.")

# Cargar contexto al inicio
if OPENAI_API_KEY:
    load_pdf_context()


def get_mock_response(user_message):
    """Lógica original de respuestas estáticas"""
    message_lower = user_message.lower().strip()
    for key, data in MOCK_RESPONSES.items():
        if key == "default": continue
        for keyword in data["keywords"]:
            if keyword in message_lower:
                return data["response"]
    return MOCK_RESPONSES["default"]["response"]


def stream_openai_response(messages_history):
    """Generador que consume la API de OpenAI"""
    try:
        # Preparar mensajes con el System Prompt
        system_msg = {"role": "system", "content": PRODUCT_CONTEXT}
        full_messages = [system_msg] + messages_history

        stream = openai_client.chat.completions.create(
            model="gpt-3.5-turbo", # O "gpt-4" si tienes acceso y prefieres
            messages=full_messages,
            stream=True
        )

        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content: # Filter empty content here too
                yield content

    except Exception as e:
        print(f"❌ Error OpenAI: {e}")
        yield f" [Error de conexión con OpenAI: {str(e)}. Usando respuesta de respaldo] "


def generate_events(payload):
    """Genera eventos para el frontend (Stream)"""
    thread_id = payload.get("threadId") or str(uuid.uuid4())
    run_id = str(uuid.uuid4())
    message_id = str(uuid.uuid4())
    
    # IDs para los pasos
    thinking_step = str(uuid.uuid4())
    search_step = str(uuid.uuid4())
    response_step = str(uuid.uuid4())

    # Extraer historial
    messages = payload.get("messages", [])
    
    # 1. Inicio del Run
    yield RunStartedEvent(thread_id=thread_id, run_id=run_id)

    # 2. Paso: Pensando (Simulado para UI feedback)
    yield StepStartedEvent(step_id=thinking_step, stepName="reasoning")
    time.sleep(0.5) # Pequeña pausa para que se vea el "Pensando..."
    yield StepFinishedEvent(step_id=thinking_step, stepName="reasoning")

    # 3. Paso: Buscando (Simulado para que se vea "Buscando información...")
    yield StepStartedEvent(step_id=search_step, stepName="tool:mock_search")
    time.sleep(0.5)
    yield StepFinishedEvent(step_id=search_step, stepName="tool:mock_search")

    # 4. Paso: Escribiendo (Generación de respuesta)
    yield StepStartedEvent(step_id=response_step, stepName="response")
    yield TextMessageStartEvent(message_id=message_id, role="assistant")

    # Generar Contenido
    if openai_client:
        # MODO AI
        openai_messages = []
        for m in messages:
            role = m.get("role", "user")
            content = m.get("content", "")
            # Filtrar mensajes vacíos
            if content:
                openai_messages.append({"role": role, "content": content})
        
        # Stream de OpenAI
        for chunk_text in stream_openai_response(openai_messages):
            if chunk_text and len(chunk_text) > 0:
                yield TextMessageContentEvent(message_id=message_id, delta=chunk_text)
            
    else:
        # MODO MOCK
        user_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break
        
        response_text = get_mock_response(user_message)
        
        # Simular typing
        chunk_size = 5
        for i in range(0, len(response_text), chunk_size):
            chunk = response_text[i:i + chunk_size]
            yield TextMessageContentEvent(message_id=message_id, delta=chunk)
            time.sleep(0.02) 

    # 5. Finalizar mensaje y paso
    yield TextMessageEndEvent(message_id=message_id)
    yield StepFinishedEvent(step_id=response_step, stepName="response")

    # 6. Fin del Run
    yield RunFinishedEvent(thread_id=thread_id, run_id=run_id)




@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok", 
        "mode": "AI (OpenAI)" if openai_client else "Mock",
        "has_pdfs": "pdf" in PRODUCT_CONTEXT.lower()
    })

@app.route('/v1/agent', methods=['POST'])
def agent():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "No payload provided"}), 400
        
        def event_stream():
            for event in generate_events(payload):
                event_dict = event.model_dump(mode='json', by_alias=True, exclude_none=True)
                yield f"data: {json.dumps(event_dict)}\n\n"
        
        return Response(
            event_stream(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        )
    
    except Exception as e:
        print(f"Error en /agent: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("---------------------------------------------------------")
    print(f"🚀 Backend iniciado en http://localhost:8080")
    print(f"🤖 Modo: {'OPENAI (Inteligente)' if openai_client else 'MOCK (Respuestas Fijas)'}")
    print("---------------------------------------------------------")
    app.run(host='0.0.0.0', port=8080, debug=True)
