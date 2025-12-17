import React, { useState, useEffect, useCallback } from 'react';
import ChatbotModal from './ChatbotModal';

const STORAGE_KEY = 'goland-chat-conversation';
const SEEN_KEY = 'goland-chat-seen';

function getUnreadCount() {
  try {
    const convRaw = localStorage.getItem(STORAGE_KEY);
    const seenRaw = localStorage.getItem(SEEN_KEY);
    const conv = convRaw ? JSON.parse(convRaw) : null;
    const seen = seenRaw ? JSON.parse(seenRaw) : null;
    const totalAssistant = (conv?.messages || []).filter((m) => m.role === 'assistant').length;
    const seenCount = seen?.count ?? 0;
    return Math.max(0, totalAssistant - seenCount);
  } catch {
    return 0;
  }
}

export default function ChatbotButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [unread, setUnread] = useState(0);

  // Actualizar unread periódicamente cuando el chat está cerrado
  useEffect(() => {
    if (isVisible) {
      setUnread(0);
      return;
    }
    // Leer al montar y cuando se cierra
    setUnread(getUnreadCount());

    // Polling cada 500ms para detectar nuevos mensajes (el modal puede seguir corriendo)
    const interval = setInterval(() => {
      setUnread(getUnreadCount());
    }, 500);

    // Escuchar cambios en storage (por si otra pestaña actualiza)
    const handleStorage = () => setUnread(getUnreadCount());
    window.addEventListener('storage', handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [isVisible]);

  const handleOpen = useCallback(() => {
    setIsMounted(true);
    setIsVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    // Solo ocultar, no desmontar (el modal sigue procesando si hay un run activo)
    setIsVisible(false);
  }, []);

  return (
    <>
      <button
        aria-label="Open Chatbot"
        onClick={handleOpen}
        className="fixed shadow-2xl bottom-10 right-10 bg-verde hover:bg-green-600 z-50 p-4 rounded-full hover:-translate-y-2 transform transition-all ease-in-out duration-300 flex items-center justify-center cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bot"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>

        {!isVisible && unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1 shadow-md">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {isMounted && <ChatbotModal onClose={handleClose} visible={isVisible} />}
    </>
  );
}
