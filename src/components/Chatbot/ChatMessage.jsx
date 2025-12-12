import React from 'react';

export default function ChatMessage({ type, text, time }) {
    const alignClass = type === 'user' ? 'justify-end' : 'justify-start';
    const bubbleClass =
        type === 'user'
            ? 'bg-verde text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none';

    return (
        <div className={`flex ${alignClass} flex-col items-${type === 'user' ? 'end' : 'start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${bubbleClass}`}>
                {text}
            </div>
            {time && (
                <div className={`text-xs text-gray-500 mt-1 ${type === 'user' ? 'text-right' : 'text-left'}`}>
                    {time}
                </div>
            )}
        </div>
    );
}