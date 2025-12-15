import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAGUI } from '../../hooks/useAGUI';

const MESSAGES_STORAGE_KEY = 'ag-ui-messages';
const SESSION_MESSAGES_KEY_PREFIX = 'ag-ui-messages-';

function formatTime(date = new Date()) {
  // Formato hh:mm AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return `${hours}:${minutes} ${ampm}`;
}

// Función para obtener la clave de almacenamiento basada en session_id
function getMessagesStorageKey(sessionId) {
  if (sessionId) {
    return `${SESSION_MESSAGES_KEY_PREFIX}${sessionId}`;
  }
  return MESSAGES_STORAGE_KEY; // Para mensajes sin sesión
}

// Función para cargar mensajes desde localStorage
function loadMessagesFromStorage(sessionId) {
  if (typeof window === 'undefined') return null;
  
  try {
    const storageKey = getMessagesStorageKey(sessionId);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validar que sea un array
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error al cargar mensajes desde localStorage:', error);
  }
  return null;
}

// Función para guardar mensajes en localStorage
function saveMessagesToStorage(messages, sessionId) {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = getMessagesStorageKey(sessionId);
    // Filtrar mensajes temporales (thinking, streaming vacíos)
    const messagesToSave = messages.filter(msg => 
      !msg.isThinking && 
      !(msg.isStreaming && !msg.content) &&
      msg.content !== ''
    );
    localStorage.setItem(storageKey, JSON.stringify(messagesToSave));
  } catch (error) {
    console.error('Error al guardar mensajes en localStorage:', error);
  }
}

export default function ChatbotModal({ onClose }) {
  // Mensaje inicial por defecto
  const initialMessage = {
    id: '1',
    role: 'assistant',
    content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?',
    time: formatTime()
  };

  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const streamingMessageIdRef = useRef(null);
  const previousSessionIdRef = useRef(null);

  // Hook AG-UI para manejar streaming y estados
  const {
    isThinking,
    isStreaming,
    currentMessage,
    error,
    sendMessage,
    reset,
    sendFeedback,
    sessionId
  } = useAGUI();

  // Cargar mensajes desde localStorage al inicializar o cuando cambie sessionId
  useEffect(() => {
    if (sessionId && sessionId !== previousSessionIdRef.current) {
      // Nueva sesión o cambio de sesión - cargar mensajes guardados
      const loadedMessages = loadMessagesFromStorage(sessionId);
      if (loadedMessages && loadedMessages.length > 0) {
        setMessages(loadedMessages);
      } else {
        // Si no hay mensajes guardados, empezar con mensaje inicial
        setMessages([initialMessage]);
      }
      previousSessionIdRef.current = sessionId;
    } else if (!sessionId && previousSessionIdRef.current) {
      // Se perdió la sesión - cargar mensajes sin sesión
      const loadedMessages = loadMessagesFromStorage(null);
      if (loadedMessages && loadedMessages.length > 0) {
        setMessages(loadedMessages);
      } else {
        setMessages([initialMessage]);
      }
      previousSessionIdRef.current = null;
    } else if (!sessionId && !previousSessionIdRef.current) {
      // Primera carga sin sesión - intentar cargar mensajes sin sesión
      const loadedMessages = loadMessagesFromStorage(null);
      if (loadedMessages && loadedMessages.length > 0) {
        setMessages(loadedMessages);
      }
    }
  }, [sessionId]);

  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    // Solo guardar si hay mensajes reales (no solo el inicial)
    if (messages.length > 1 || (messages.length === 1 && messages[0].id !== '1')) {
      saveMessagesToStorage(messages, sessionId);
    }
  }, [messages, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMessage]);

  // Efecto para manejar el streaming de mensajes
  useEffect(() => {
    if (isStreaming && currentMessage) {
      // Actualizar mensaje en streaming
      setMessages((prev) => {
        const updated = [...prev];
        const streamingIndex = updated.findIndex(
          msg => msg.id === streamingMessageIdRef.current
        );
        
        if (streamingIndex !== -1) {
          updated[streamingIndex] = {
            ...updated[streamingIndex],
            content: currentMessage,
            isStreaming: true
          };
        }
        
        return updated;
      });
    } else if (!isStreaming && currentMessage && streamingMessageIdRef.current) {
      // Finalizar streaming
      setMessages((prev) => {
        const updated = [...prev];
        const streamingIndex = updated.findIndex(
          msg => msg.id === streamingMessageIdRef.current
        );
        
        if (streamingIndex !== -1) {
          updated[streamingIndex] = {
            ...updated[streamingIndex],
            content: currentMessage,
            isStreaming: false,
            time: formatTime()
          };
        }
        
        return updated;
      });
      streamingMessageIdRef.current = null;
    }
  }, [isStreaming, currentMessage]);

  // Efecto para mostrar estado de "pensando"
  useEffect(() => {
    if (isThinking && !streamingMessageIdRef.current) {
      const thinkingMsg = {
        id: `thinking-${Date.now()}`,
        role: 'assistant',
        content: 'Pensando...',
        time: formatTime(),
        isThinking: true
      };
      setMessages((prev) => [...prev, thinkingMsg]);
    } else if (!isThinking) {
      // Remover mensaje de "pensando" si existe
      setMessages((prev) => prev.filter(msg => !msg.isThinking));
    }
  }, [isThinking]);

  // Efecto para manejar errores
  useEffect(() => {
    if (error && streamingMessageIdRef.current) {
      // Reemplazar el mensaje vacío con el error
      setMessages((prev) => {
        const updated = [...prev];
        const errorIndex = updated.findIndex(
          msg => msg.id === streamingMessageIdRef.current
        );
        
        if (errorIndex !== -1) {
          // Reemplazar mensaje vacío con error
          updated[errorIndex] = {
            ...updated[errorIndex],
            content: `Lo siento, no puedo responder esa pregunta.`,
            isError: true,
            isStreaming: false,
            time: formatTime()
          };
        }
        
        return updated;
      });
      
      // Limpiar referencia
      streamingMessageIdRef.current = null;
    }
  }, [error]);

  const handleSendMessage = async (e, messageText = null) => {
    e?.preventDefault?.();
    const text = (messageText || input)?.trim();
    if (!text) return;

    // Agregar mensaje del usuario
    const userMsg = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      time: formatTime()
    };
    setMessages((prev) => [...prev, userMsg]);
    
    // Limpiar input solo si no es un reenvío
    if (!messageText) {
      setInput('');
    }

    // Crear mensaje placeholder para el asistente (se actualizará con streaming)
    const botMsgId = `${Date.now()}-bot`;
    streamingMessageIdRef.current = botMsgId;
    
    const botMsg = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      time: formatTime(),
      isStreaming: true
    };
    setMessages((prev) => [...prev, botMsg]);

    // Enviar mensaje usando AG-UI
    // El hook maneja el session_id automáticamente
    await sendMessage(text);
  };

  // Función para copiar mensaje al portapapeles
  const handleCopy = async (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.content) {
      try {
        await navigator.clipboard.writeText(message.content);
        // Opcional: mostrar notificación de éxito
        console.log('Mensaje copiado al portapapeles');
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    }
  };

  // Función para reenviar mensaje (reply) - genera nueva respuesta
  const handleReply = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.content) {
      // Reenviar el mensaje del bot como nueva pregunta del usuario
      // Esto generará una nueva respuesta del agente
      handleSendMessage(null, message.content);
    }
  };

  // Función para editar mensaje del usuario - solo carga en input sin eliminar
  const handleEdit = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.role === 'user' && message.content) {
      // Solo poner el mensaje en el input para editar
      // NO eliminar mensajes anteriores
      setInput(message.content);
      // Opcional: hacer scroll al input
      setTimeout(() => {
        const inputElement = document.querySelector('input[type="text"]');
        inputElement?.focus();
      }, 100);
    }
  };

  // Función para like (feedback positivo)
  const handleThumbsUp = async (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      // Marcar mensaje como liked
      setMessages((prev) => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, liked: true, disliked: false }
          : msg
      ));
      
      // Enviar feedback al servidor AG-UI
      try {
        await sendFeedback(messageId, 'positive');
      } catch (err) {
        console.error('Error al enviar feedback positivo:', err);
      }
    }
  };

  // Función para dislike (feedback negativo)
  const handleThumbsDown = async (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      // Marcar mensaje como disliked
      setMessages((prev) => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, liked: false, disliked: true }
          : msg
      ));
      
      // Enviar feedback al servidor AG-UI
      try {
        await sendFeedback(messageId, 'negative');
      } catch (err) {
        console.error('Error al enviar feedback negativo:', err);
      }
    }
  };

  // Función para limpiar mensajes de una sesión específica
  const clearMessages = () => {
    setMessages([initialMessage]);
    if (sessionId) {
      const storageKey = getMessagesStorageKey(sessionId);
      localStorage.removeItem(storageKey);
    } else {
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    }
  };

  // Limpiar al cerrar (opcional - puedes comentar esto si quieres mantener los mensajes)
  useEffect(() => {
    return () => {
      // No resetear automáticamente para mantener persistencia
      // reset();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-transparent flex items-end justify-end p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm h-[36rem] flex flex-col">
        {/* Header */}
        <div className="bg-green-300 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://f.fcdn.app/assets/commerce/shop.goland-group.com/968a_263c/public/web/favicon.ico"
              alt="GoLand icon"
              className="w-6 h-6"
            />
            <div className="leading-tight text-black">
              <div className="text-lg font-semibold">GOLAND Chat</div>
              <div className="text-xs text-white flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-black">online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-green-700 p-1 rounded transition-colors text-black"
            aria-label="Close Chatbot"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className=" flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              type={msg.role === 'user' ? 'user' : 'bot'}
              text={msg.content}
              time={msg.time}
              onCopy={handleCopy}
              onReply={handleReply}
              onEdit={handleEdit}
              onThumbsUp={handleThumbsUp}
              onThumbsDown={handleThumbsDown}
              liked={msg.liked}
              disliked={msg.disliked}
            />
          ))}

          {/* Indicador de streaming (cursor parpadeante) */}
          {isStreaming && currentMessage && (
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isLoading={isThinking || isStreaming}
        />
      </div>
    </div>
  );
}