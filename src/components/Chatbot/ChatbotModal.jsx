import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatServices from '../../services/ChatServices';
import { RotateCcw, Copy } from 'lucide-react';

function formatTime(date = new Date()) {
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
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [typingMessage, setTypingMessage] = useState(null);
  const [showTypingDots, setShowTypingDots] = useState(false); // Solo 3 puntitos
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage, showTypingDots]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Mensaje copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // ⏳ SOLO 3 PUNTITOS por 1 SEGUNDO (SIN NINGUNA BURBUJA DE TEXTO)
  const showTypingDotsOnly = () => {
    setShowTypingDots(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setShowTypingDots(false);
        resolve();
      }, 1000); // 1 segundo
    });
  };

  // 🎬 EFECTO DE ESCRITURA POR CARACTERES (50ms)
  const startTypingEffect = async (fullText, messageId) => {
    await showTypingDotsOnly();

    const emptyBotMsg = {
      id: messageId,
      role: 'assistant',
      content: '',
      time: formatTime(),
      isTyping: true
    };
    setMessages(prev => [...prev, emptyBotMsg]);
    setTypingMessage({ id: messageId, fullText, currentIndex: 0 });

    let currentIndex = 0;
    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        const newIndex = currentIndex + 1;

        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId
              ? { ...msg, content: fullText.slice(0, newIndex), isTyping: true }
              : msg
          )
        );

        currentIndex = newIndex;
      } else {
        clearInterval(typingIntervalRef.current);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: fullText, isTyping: false }
              : msg
          )
        );
        setTypingMessage(null);
      }
    }, 50);
  };

  const regenerateResponse = async () => {
    if (!lastUserMessage) return;
    setIsLoading(true);

    try {
      const res = await ChatServices.askAI(lastUserMessage);
      const answer = res?.answer ?? 'Lo siento, no tengo una respuesta para eso.';
      const newMessageId = `${Date.now()}-bot-regen`;
      await startTypingEffect(answer, newMessageId);
    } catch (err) {
      const errMsgId = `${Date.now()}-bot-err`;
      await startTypingEffect('Hubo un error al obtener la respuesta.', errMsgId);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      copyToClipboard(message.content);
    }
  };

  const handleReply = () => {
    regenerateResponse();
  };

  const handleThumbsUp = (messageId) => {
    console.log('Thumbs up:', messageId);
  };

  const handleThumbsDown = (messageId) => {
    console.log('Thumbs down:', messageId);
  };

  const handleEdit = (messageId, newText) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: newText, time: formatTime() }
          : msg
      )
    );
  };

  const getGolandInfoMessage = () => {
    return '🌿 GoLand Uruguay es una empresa pionera en la producción e industrialización de alimentos a base de semillas de cáñamo en Uruguay y la región. ¡Productos naturales, veganos y sustentables! 💚';
  };

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
    setLastUserMessage(text);
    setIsLoading(true);

    try {
      const lower = text.toLowerCase();
      const shouldSendGolandInfo =
        lower.includes('info') || lower.includes('informacion') || lower.includes('información');

      if (shouldSendGolandInfo) {
        const golandMsgId = `${Date.now()}-bot-goland-uy`;
        const golandText = getGolandInfoMessage();
        await startTypingEffect(golandText, golandMsgId);
      } else {
        const res = await ChatServices.askAI(text);
        const answer = res?.answer ?? 'Lo siento, no tengo una respuesta para eso.';
        const botMsgId = `${Date.now()}-bot`;
        await startTypingEffect(answer, botMsgId);
      }
    } catch (err) {
      const errMsgId = `${Date.now()}-bot-err`;
      await startTypingEffect('Hubo un error al obtener la respuesta.', errMsgId);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              type={msg.role === 'user' ? 'user' : 'bot'}
              text={msg.content}
              time={msg.time}
              isTyping={msg.isTyping}
              onCopy={handleCopy}
              onReply={handleReply}
              onThumbsUp={handleThumbsUp}
              onThumbsDown={handleThumbsDown}
              onEdit={handleEdit}
            />
          ))}

          {/* ⏳ SOLO 3 PUNTITOS (sin texto de "escribiendo") */}
          {showTypingDots && (
            <div className="flex items-center space-x-2 justify-start p-2">
              <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg inline-flex items-center">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse" style={{ animationDelay: '150ms' }}>●</span>
                <span className="animate-pulse" style={{ animationDelay: '300ms' }}>●</span>
              </div>
            </div>
          )}

          {isLoading && !typingMessage && !showTypingDots && (
            <div className="flex items-center space-x-2 justify-start">
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
