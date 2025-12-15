import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cargar datos de QA
const qaDataPath = join(__dirname, '../src/data/qa.json');
let qaData = [];

try {
  const qaFile = readFileSync(qaDataPath, 'utf-8');
  qaData = JSON.parse(qaFile);
  console.log(`✅ Cargados ${qaData.length} pares de pregunta-respuesta`);
} catch (error) {
  console.error('❌ Error al cargar qa.json:', error.message);
}

// Función para buscar respuesta en QA
function findAnswer(question) {
  const qLower = question.trim().toLowerCase();
  
  // Búsqueda exacta
  const exactMatch = qaData.find(
    q => q.question.trim().toLowerCase() === qLower
  );
  
  if (exactMatch) {
    return exactMatch.answer;
  }
  
  // Búsqueda parcial (contiene palabras clave)
  const keywords = qLower.split(/\s+/).filter(w => w.length > 2);
  const partialMatch = qaData.find(q => {
    const qLowerData = q.question.trim().toLowerCase();
    return keywords.some(keyword => qLowerData.includes(keyword));
  });
  
  if (partialMatch) {
    return partialMatch.answer;
  }
  
  return null;
}

// Función para enviar evento SSE según protocolo AG-UI
function sendSSEEvent(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// Función para simular streaming de texto caracter por caracter
async function streamText(res, text, delay = 30) {
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    sendSSEEvent(res, 'agent:message', {
      type: 'text',
      content: char,
      isComplete: false
    });
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AG-UI Mock Server está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Función para generar UUID simple (mock)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Endpoint AG-UI principal - Implementa protocolo AG-UI con SSE
// Contrato según backend: { message: string, session_id?: UUID }
app.post('/api/ag-ui/run', async (req, res) => {
  try {
    const { message, session_id } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'El campo "message" es requerido y debe ser un string',
        code: 'MISSING_MESSAGE'
      });
    }

    const question = message.trim();
    
    // Si no hay session_id, es el primer mensaje - generar uno nuevo
    // Si hay session_id, usar el existente (continuación de conversación)
    const currentSessionId = session_id || generateUUID();

    // Configurar headers para SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Evento: Agente comenzó a procesar
    // Devolver session_id en la respuesta (según contrato backend)
    sendSSEEvent(res, 'agent:start', {
      session_id: currentSessionId,
      timestamp: new Date().toISOString()
    });

    // Evento: Agente está pensando
    sendSSEEvent(res, 'agent:thinking', {
      message: 'Procesando tu pregunta...',
      timestamp: new Date().toISOString()
    });

    // Simular tiempo de procesamiento (300-800ms)
    const thinkingTime = Math.floor(Math.random() * 500) + 300;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    // Buscar respuesta
    const answer = findAnswer(question);

    if (!answer) {
      // Evento: Error o respuesta no encontrada
      sendSSEEvent(res, 'agent:error', {
        error: 'No se encontró una respuesta para esa pregunta',
        code: 'ANSWER_NOT_FOUND',
        timestamp: new Date().toISOString()
      });
      
      sendSSEEvent(res, 'agent:done', {
        session_id: currentSessionId,
        timestamp: new Date().toISOString()
      });
      
      res.end();
      return;
    }

    // Evento: Agente comenzó a responder
    sendSSEEvent(res, 'agent:message_start', {
      timestamp: new Date().toISOString()
    });

    // Stream de respuesta caracter por caracter
    await streamText(res, answer, 20); // 20ms por caracter

    // Evento: Mensaje completo
    sendSSEEvent(res, 'agent:message', {
      type: 'text',
      content: answer,
      isComplete: true,
      timestamp: new Date().toISOString()
    });

    // Evento: Agente terminó
    // Devolver session_id en la respuesta final
    sendSSEEvent(res, 'agent:done', {
      session_id: currentSessionId,
      timestamp: new Date().toISOString()
    });

    res.end();

  } catch (error) {
    console.error('Error en /api/ag-ui/run:', error);
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
        message: error.message
      });
    } else {
      sendSSEEvent(res, 'agent:error', {
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      sendSSEEvent(res, 'agent:done', {
        timestamp: new Date().toISOString()
      });
      res.end();
    }
  }
});

// Endpoint legacy (mantener compatibilidad)
app.post('/api/chat', async (req, res) => {
  try {
    const { question, conversation_id } = req.body;
    
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: 'La pregunta es requerida',
        code: 'MISSING_QUESTION'
      });
    }
    
    // Simular latencia de red (opcional, entre 200-800ms)
    const delay = Math.floor(Math.random() * 600) + 200;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const answer = findAnswer(question);
    
    if (!answer) {
      return res.status(404).json({
        error: 'No se encontró una respuesta para esa pregunta',
        code: 'ANSWER_NOT_FOUND',
        question: question
      });
    }
    
    res.json({
      answer: answer,
      question: question,
      conversation_id: conversation_id || null,
      timestamp: new Date().toISOString(),
      source: 'qa.json'
    });
    
  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
      message: error.message
    });
  }
});

// Endpoint para obtener todas las preguntas disponibles (útil para debugging)
app.get('/api/qa', (req, res) => {
  res.json({
    total: qaData.length,
    questions: qaData.map(q => q.question)
  });
});

// Endpoint para buscar preguntas similares
app.get('/api/qa/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      error: 'Parámetro de búsqueda "q" es requerido'
    });
  }
  
  const searchLower = q.toLowerCase();
  const results = qaData.filter(item => 
    item.question.toLowerCase().includes(searchLower) ||
    item.answer.toLowerCase().includes(searchLower)
  );
  
  res.json({
    query: q,
    results: results,
    count: results.length
  });
});

// Endpoint para recibir feedback del usuario (like/dislike)
app.post('/api/ag-ui/feedback', (req, res) => {
  try {
    const { message_id, feedback_type, session_id } = req.body;
    
    if (!message_id || !feedback_type) {
      return res.status(400).json({
        error: 'message_id y feedback_type son requeridos',
        code: 'MISSING_PARAMS'
      });
    }

    if (!['positive', 'negative'].includes(feedback_type)) {
      return res.status(400).json({
        error: 'feedback_type debe ser "positive" o "negative"',
        code: 'INVALID_FEEDBACK_TYPE'
      });
    }

    // Aquí podrías guardar el feedback en una base de datos
    console.log(`📊 Feedback recibido: ${feedback_type} para mensaje ${message_id} en sesión ${session_id || 'N/A'}`);

    res.json({
      success: true,
      message_id,
      feedback_type,
      session_id: session_id || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en /api/ag-ui/feedback:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
      message: error.message
    });
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method
  });
});

// Manejo de errores
app.use((err, req, res) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor AG-UI Mock ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/ag-ui/run (Protocolo AG-UI con SSE)`);
  console.log(`   - POST /api/ag-ui/feedback (Feedback like/dislike)`);
  console.log(`   - POST /api/chat (Legacy)`);
  console.log(`   - GET  /api/qa`);
  console.log(`   - GET  /api/qa/search?q=<query>`);
});
