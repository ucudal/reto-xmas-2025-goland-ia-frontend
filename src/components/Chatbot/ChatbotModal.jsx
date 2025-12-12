import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatServices from '../../services/ChatServices';

function formatTime(date = new Date()) {
  // Formato hh:mm AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return `${hours}:${minutes} ${ampm}`;
}

export default function ChatbotModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?',
      time: formatTime()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    const text = input?.trim();
    if (!text) return;

    const userMsg = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      time: formatTime()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await ChatServices.askAI(text);
      const answer = res?.answer ?? 'Lo siento, no tengo una respuesta para eso.';

      const botMsg = {
        id: `${Date.now()}-bot`,
        role: 'assistant',
        content: answer,
        time: formatTime()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = {
        id: `${Date.now()}-bot-err`,
        role: 'assistant',
        content: 'Hubo un error al obtener la respuesta.',
        time: formatTime()
      };
      setMessages((prev) => [...prev, errMsg]);
      console.error(err);
    } finally {
      setIsLoading(false);
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
            <div className="leading-tight">
              <div className="text-lg font-semibold">GOLAND Chat</div>
              <div className="text-xs text-white flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                <span>online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 p-1 rounded transition-colors"
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

          {isLoading && (
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