import qaData from '../data/qa.json';

// Configuración del servidor mock
const MOCK_SERVER_URL = import.meta.env.VITE_MOCK_SERVER_URL || 'http://localhost:3001';
const USE_MOCK_SERVER = import.meta.env.VITE_USE_MOCK_SERVER !== 'false'; // Por defecto true

/**
 * Busca respuesta en el archivo local qa.json
 */
function findLocalAnswer(question) {
    const qLower = question.trim().toLowerCase();
    
    // Búsqueda exacta
    const exactMatch = qaData.find(
        q => q.question.trim().toLowerCase() === qLower
    );
    
    if (exactMatch) {
        return exactMatch.answer;
    }
    
    // Búsqueda parcial
    const keywords = qLower.split(/\s+/).filter(w => w.length > 2);
    const partialMatch = qaData.find(q => {
        const qLowerData = q.question.trim().toLowerCase();
        return keywords.some(keyword => qLowerData.includes(keyword));
    });
    
    return partialMatch ? partialMatch.answer : null;
}

/**
 * Obtiene respuesta del servidor mock AG-UI
 */
async function askAIViaServer(question) {
    try {
        const response = await fetch(`${MOCK_SERVER_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { answer: data.answer };
    } catch (error) {
        console.error('Error al conectar con el servidor mock:', error);
        // Fallback a búsqueda local si el servidor falla
        const localAnswer = findLocalAnswer(question);
        if (localAnswer) {
            return { answer: localAnswer };
        }
        throw error;
    }
}

/**
 * Función principal para obtener respuesta de IA
 * Usa el servidor mock si está disponible, sino busca localmente
 */
export async function askAI(question) {
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
        throw new Error('La pregunta es requerida');
    }

    // Si está configurado para usar el servidor mock
    if (USE_MOCK_SERVER) {
        try {
            return await askAIViaServer(question);
        } catch (error) {
            // Si falla el servidor, intentar búsqueda local como fallback
            console.warn('Servidor mock no disponible, usando búsqueda local:', error.message);
            const localAnswer = findLocalAnswer(question);
            return {
                answer: localAnswer || 'Lo siento, no puedo responder esa pregunta.'
            };
        }
    }

    // Modo local (sin servidor)
    const answer = findLocalAnswer(question);
    return {
        answer: answer || 'Lo siento, no puedo responder esa pregunta.'
    };
}

export default {
    askAI
};
