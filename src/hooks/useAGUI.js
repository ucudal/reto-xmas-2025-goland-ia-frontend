import { useState, useCallback, useRef, useEffect } from 'react';

const AG_UI_SERVER_URL = import.meta.env.VITE_AG_UI_SERVER_URL || 'http://localhost:3001';

/**
 * Hook personalizado para integrar con servidor AG-UI usando Server-Sent Events
 * 
 * @returns {Object} Objeto con estado y funciones para interactuar con AG-UI
 */
const SESSION_STORAGE_KEY = 'ag-ui-session-id';

export function useAGUI() {
  const [isConnected, setIsConnected] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    // Cargar session_id desde localStorage al inicializar
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SESSION_STORAGE_KEY) || null;
    }
    return null;
  });
  
  const eventSourceRef = useRef(null);
  const abortControllerRef = useRef(null);
  const messageBufferRef = useRef('');

  // Guardar session_id en localStorage cuando cambie
  useEffect(() => {
    if (sessionId && typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    } else if (!sessionId && typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [sessionId]);

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Maneja eventos del protocolo AG-UI
   * Debe definirse antes de sendMessage porque se usa dentro de él
   */
  const handleAGUIEvent = useCallback((eventType, data) => {
    switch (eventType) {
      case 'agent:start':
        setIsConnected(true);
        setIsThinking(true);
        // El backend devuelve session_id en la respuesta
        if (data.session_id) {
          setSessionId(data.session_id);
        }
        break;

      case 'agent:thinking':
        setIsThinking(true);
        setIsStreaming(false);
        break;

      case 'agent:message_start':
        setIsThinking(false);
        setIsStreaming(true);
        messageBufferRef.current = '';
        setCurrentMessage('');
        break;

      case 'agent:message':
        if (data.content) {
          if (data.isComplete) {
            // Mensaje completo
            setCurrentMessage(data.content);
            messageBufferRef.current = data.content;
            setIsStreaming(false);
          } else {
            // Caracter individual (streaming)
            messageBufferRef.current += data.content;
            setCurrentMessage(messageBufferRef.current);
          }
        }
        break;

      case 'agent:done':
        setIsStreaming(false);
        setIsThinking(false);
        setIsConnected(false);
        // El backend puede devolver session_id también en agent:done
        if (data.session_id) {
          setSessionId(data.session_id);
        }
        break;

      case 'agent:error':
        setError(data.error || 'Error desconocido');
        setIsStreaming(false);
        setIsThinking(false);
        setIsConnected(false);
        break;

      default:
        console.log('Evento AG-UI no manejado:', eventType, data);
    }
  }, []);

  /**
   * Envía un mensaje al agente usando el protocolo AG-UI
   * Contrato según backend: { message: string, session_id?: UUID }
   * 
   * @param {string} message - Mensaje del usuario
   * @returns {Promise<void>}
   */
  const sendMessage = useCallback(async (message) => {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    // Limpiar estado anterior
    setError(null);
    setCurrentMessage('');
    setIsThinking(false);
    setIsStreaming(false);
    messageBufferRef.current = '';

    try {
      // Crear AbortController para poder cancelar la petición
      abortControllerRef.current = new AbortController();

      // Preparar body según contrato del backend
      // Primer mensaje: no envía session_id, luego sí lo envía
      const requestBody = {
        message: message.trim()
      };
      
      // Solo agregar session_id si existe (no en el primer mensaje)
      if (sessionId) {
        requestBody.session_id = sessionId;
      }

      // Hacer POST request que iniciará el stream SSE
      const response = await fetch(`${AG_UI_SERVER_URL}/api/ag-ui/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      // Leer el stream SSE
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = null;

      setIsConnected(true);

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsStreaming(false);
          setIsThinking(false);
          setIsConnected(false);
          break;
        }

        // Decodificar chunk
        buffer += decoder.decode(value, { stream: true });
        
        // Procesar líneas completas
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Guardar línea incompleta

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (line.startsWith('event:')) {
            currentEvent = line.substring(6).trim();
          } else if (line.startsWith('data:')) {
            const dataStr = line.substring(5).trim();
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                handleAGUIEvent(currentEvent || 'message', data);
              } catch (e) {
                console.warn('Error parseando datos SSE:', e, dataStr);
              }
            }
            currentEvent = null; // Reset después de procesar datos
          } else if (line === '') {
            // Línea vacía indica fin de evento
            currentEvent = null;
          }
        }
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Petición cancelada');
        return;
      }
      console.error('Error en useAGUI:', error);
      setError(error.message || 'Error al conectar con el servidor AG-UI');
      setIsConnected(false);
      setIsThinking(false);
      setIsStreaming(false);
    }
  }, [sessionId, handleAGUIEvent]);

  /**
   * Cancela la petición actual
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsConnected(false);
    setIsThinking(false);
    setIsStreaming(false);
    setCurrentMessage('');
    messageBufferRef.current = '';
  }, []);

  /**
   * Limpia el estado
   */
  const reset = useCallback(() => {
    cancel();
    setError(null);
    // Opcional: limpiar session_id si quieres empezar nueva conversación
    // setSessionId(null);
  }, [cancel]);

  /**
   * Limpia la sesión (útil para empezar nueva conversación)
   * También limpia los mensajes asociados a esa sesión
   */
  const clearSession = useCallback(() => {
    const currentSessionId = sessionId;
    setSessionId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      // Limpiar mensajes de esta sesión
      if (currentSessionId) {
        localStorage.removeItem(`ag-ui-messages-${currentSessionId}`);
      }
    }
  }, [sessionId]);

  /**
   * Envía feedback al servidor AG-UI
   * 
   * @param {string} messageId - ID del mensaje
   * @param {string} feedbackType - 'positive' o 'negative'
   * @returns {Promise<void>}
   */
  const sendFeedback = useCallback(async (messageId, feedbackType) => {
    try {
      const response = await fetch(`${AG_UI_SERVER_URL}/api/ag-ui/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_id: messageId,
          feedback_type: feedbackType,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      console.log('Feedback enviado:', data);
      return data;
    } catch (error) {
      console.error('Error al enviar feedback:', error);
      throw error;
    }
  }, [sessionId]);

  return {
    // Estado
    isConnected,
    isThinking,
    isStreaming,
    currentMessage,
    error,
    sessionId,
    
    // Funciones
    sendMessage,
    cancel,
    reset,
    sendFeedback,
    clearSession
  };
}

export default useAGUI;

