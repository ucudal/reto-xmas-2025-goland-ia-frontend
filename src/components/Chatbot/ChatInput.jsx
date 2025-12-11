import React from 'react';

export default function ChatInput({ input, setInput, onSendMessage }) {
    return (
        <div className="border-t p-4 flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-verde"
            />
            <button
                onClick={onSendMessage}
                className="bg-verde hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
                Enviar
            </button>
        </div>
    );
}