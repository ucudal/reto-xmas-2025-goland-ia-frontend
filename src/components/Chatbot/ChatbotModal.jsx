import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatbotModal({ onClose }) {
    const [messages, setMessages] = useState([
        { type: 'bot', text: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = () => {
        if (input.trim() === '') return;

        // Agregar mensaje del usuario
        setMessages([...messages, { type: 'user', text: input }]);
        setInput('');

        setIsTyping(true);

        // Simular respuesta de la IA
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { type: 'bot', text: 'Esta es una respuesta simulada de la IA. Pronto implementaremos la integración real.' }
            ]);
            setIsTyping(false);
        }, 1200);
    };

    return (
       <div className="fixed inset-0 bg-transparent flex items-end justify-end p-4 z-50">

            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm h-96 flex flex-col">
                {/* Header */}
                <div className="bg-green-300  text-white p-4 rounded-t-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img 
                            src ="https://f.fcdn.app/assets/commerce/shop.goland-group.com/968a_263c/public/web/favicon.ico"
                            alt="GoLand icon"
                            className="w-6 h-6"
                        
                        />
                        <h2 className="text-lg font-semibold">Chatbot IA</h2>
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
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} type={msg.type} text={msg.text} />
                    ))}
                    {isTyping && (
                    <div className="flex items-center space-x-2">
                        <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg inline-flex items-center">
                            <span className="animate-pulse">●</span>
                            <span className="animate-pulse delay-150">●</span>
                            <span className="animate-pulse delay-300">●</span>
                        </div>
                    </div>
                    )}
                </div>

                {/* Input */}
                <ChatInput input={input} setInput={setInput} onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}