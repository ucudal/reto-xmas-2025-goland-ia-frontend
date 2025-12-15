import React from 'react';
import { Send, Square } from 'lucide-react';

export default function ChatInput({
  input,
  setInput,
  onSendMessage,
  isLoading,
  isTypingBot
}) {
  const handleSubmit = (e) => {
    onSendMessage(e);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isTypingBot ? 'El bot está respondiendo...' : 'Escribe tu mensaje...'}
        disabled={isLoading && !isTypingBot} 
        className="flex-1 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-verde disabled:opacity-50"
      />

      {isTypingBot ? (
        // 🛑 BOTÓN STOP
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full transition-colors flex items-center justify-center"
          aria-label="Detener respuesta"
        >
          <Square size={18} className="mr-1" />
          Stop
        </button>
      ) : (
        // ✉️ BOTÓN ENVIAR
        <button
          type="submit"
          disabled={isLoading}
          className="bg-verde hover:bg-green-600 text-white px-3 py-2 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
          aria-label="Enviar mensaje"
        >
          <Send size={20} />
        </button>
      )}
    </form>
  );
}
