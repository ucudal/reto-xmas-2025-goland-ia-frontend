import React from 'react';

export default function ChatMessage({ type, text }) {
    return (
        <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                    type === 'user'
                        ? 'bg-verde text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
            >
                {text}
            </div>
        </div>
    );
}