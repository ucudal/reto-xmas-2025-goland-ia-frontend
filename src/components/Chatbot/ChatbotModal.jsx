import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatbotModal({ onClose }) {
    const { messages, input, setInput, handleSubmit, isLoading } = useChat({
        api: '/api/chat', // Ruta a tu backend API
        initialMessages: [
            { id: '1', role: 'assistant', content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?' }
        ]
    });
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onSendMessage = (e) => {
        e?.preventDefault?.();
        handleSubmit(e);
    };

    return (
        <div className="fixed inset-0 bg-transparent flex items-end justify-end p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm h-96 flex flex-col">
                {/* Header */}
                <div className="bg-green-300 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img 
                            src="https://f.fcdn.app/assets/commerce/shop.goland-group.com/968a_263c/public/web/favicon.ico"
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
                    {messages.map((msg) => (
                        <ChatMessage 
                            key={msg.id} 
                            type={msg.role === 'user' ? 'user' : 'bot'} 
                            text={msg.content} 
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
                    onSendMessage={onSendMessage}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}