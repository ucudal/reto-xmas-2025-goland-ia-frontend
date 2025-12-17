#!/usr/bin/env python3

import json
import time
import uuid
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from ag_ui.core import (
    RunStartedEvent,
    RunFinishedEvent,
    TextMessageStartEvent,
    TextMessageContentEvent,
    TextMessageEndEvent
)

app = Flask(__name__)
CORS(app)  # Permitir CORS para desarrollo

# Respuestas hardcodeadas según el mensaje del usuario
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

def get_mock_response(user_message):
    message_lower = user_message.lower().strip()
    
    # Buscar coincidencias con keywords
    for key, data in MOCK_RESPONSES.items():
        if key == "default":
            continue
        for keyword in data["keywords"]:
            if keyword in message_lower:
                return data["response"]
    
    return MOCK_RESPONSES["default"]["response"]

def generate_events(payload):
    # Extraer datos del payload
    thread_id = payload.get("threadId") or str(uuid.uuid4())
    run_id = str(uuid.uuid4())
    message_id = str(uuid.uuid4())
    
    # Obtener el último mensaje del usuario
    messages = payload.get("messages", [])
    user_message = ""
    if messages:
        # Buscar el último mensaje del usuario (puede no ser el último en la lista)
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break
    
    # Obtener respuesta mock
    response_text = get_mock_response(user_message)
    
    events = [
        RunStartedEvent(thread_id=thread_id, run_id=run_id),
        TextMessageStartEvent(message_id=message_id, role="assistant")
    ]
    
    # Simular streaming: dividir la respuesta en chunks
    chunk_size = 3
    for i in range(0, len(response_text), chunk_size):
        chunk = response_text[i:i + chunk_size]
        events.append(TextMessageContentEvent(message_id=message_id, delta=chunk))
    
    events.extend([
        TextMessageEndEvent(message_id=message_id),
        RunFinishedEvent(thread_id=thread_id, run_id=run_id)
    ])
    
    return events

@app.route('/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({"status": "ok", "service": "goland-mock-backend"})

@app.route('/v1/agent', methods=['POST'])
def agent():
    """Endpoint principal que simula el agente ag-ui"""
    try:
        # Obtener payload del request
        payload = request.get_json()
        
        if not payload:
            return jsonify({"error": "No payload provided"}), 400
        
        events = generate_events(payload)
        
        def event_stream():
            for event in events:
                event_dict = event.model_dump(mode='json', by_alias=True, exclude_none=True)
                yield f"data: {json.dumps(event_dict)}\n\n"
                time.sleep(0.05)
        
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
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Iniciando backend mock en http://localhost:8080")
    print("Endpoint: POST http://localhost:8080/v1/agent")
    print("Health check: GET http://localhost:8080/health")
    app.run(host='0.0.0.0', port=8080, debug=True)

