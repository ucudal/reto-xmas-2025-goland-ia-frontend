import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AgUIService from '../../services/AgUIService';

const STORAGE_KEY = 'goland-chat-conversation';

function formatTime(date = new Date()) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return `${hours}:${minutes} ${ampm}`;
}

function loadConversationFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        messages: data.messages || [
          {
            id: '1',
            role: 'assistant',
            content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?',
            time: formatTime()
          }
        ],
        threadId: data.threadId || null,
      };
    }
  } catch (error) {
    console.error('Error loading conversation from storage:', error);
  }
  return {
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?',
        time: formatTime()
      }
    ],
    threadId: null,
  };
}

export default function ChatbotModal({ onClose }) {
  const { messages: initialMessages, threadId: initialThreadId } = loadConversationFromStorage();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(initialThreadId);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Guardar conversación en localStorage cuando cambien messages o threadId
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        messages,
        threadId,
      }));
    } catch (error) {
      console.error('Error saving conversation to storage:', error);
    }
  }, [messages, threadId]);

  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    const text = input?.trim();
    if (!text) return;

    setInput('');
    setIsLoading(true);

    try {
      const agUIMessages = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: text,
        },
      ];

      await AgUIService.runAgent({
        threadId,
        messages: agUIMessages,
        onThreadId: (newThreadId) => {
          if (!threadId) {
            setThreadId(newThreadId);
          }
        },
        onMessagesChanged: (sdkMessages) => {
          const uiMessages = sdkMessages.map((msg) => {
            const existing = messages.find((m) => m.id === msg.id);
            return {
              id: msg.id,
              role: msg.role,
              content: typeof msg.content === 'string' ? msg.content : '',
              time: existing?.time || formatTime(),
            };
          });
          setMessages(uiMessages);
        },
        onRunFinished: () => {
          setIsLoading(false);
        },
        onRunError: (errorEvent) => {
          const errMsg = {
            id: `${Date.now()}-error`,
            role: 'assistant',
            content: errorEvent.message || 'Hubo un error al obtener la respuesta.',
            time: formatTime(),
          };
          setMessages((prev) => [...prev, errMsg]);
          setIsLoading(false);
        },
      });
    } catch (err) {
      const errMsg = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: 'Hubo un error al obtener la respuesta.',
        time: formatTime(),
      };
      setMessages((prev) => [...prev, errMsg]);
      setIsLoading(false);
      console.error(err);
    }
  };

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
              type={msg.role === 'user' ? 'user' : 'bot'}
              text={msg.content}
              time={msg.time}
            />
          ))}

          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg inline-flex items-center">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-150">●</span>
                <span className="animate-pulse delay-300">●</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}