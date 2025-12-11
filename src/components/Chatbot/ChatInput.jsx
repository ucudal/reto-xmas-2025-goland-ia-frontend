import React from 'react';

export default function ChatInput({ input, setInput, onSendMessage, isLoading }) {
    return (
        <form onSubmit={onSendMessage} className="border-t p-4 flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-verde disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-verde hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Enviando...' : 'Enviar'}
            </button>
        </form>
    );
}