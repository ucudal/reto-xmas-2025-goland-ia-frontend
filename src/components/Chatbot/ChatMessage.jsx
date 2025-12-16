import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Copy, ThumbsUp, ThumbsDown, Pencil, Check, X } from 'lucide-react';

export default function ChatMessage({
  id,
  type,
  text,
  time,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  onReply,
  onEdit,
  liked = false,
  disliked = false
}) {
  const isUser = type === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const textareaRef = useRef(null);

  // Sincronizar editText cuando text cambia externamente
  useEffect(() => {
    if (!isEditing) {
      setEditText(text);
    }
  }, [text, isEditing]);

  // Contenedor principal: group para detectar hover (columna: burbuja + hora)
  const containerClass = `group relative flex ${isUser ? 'justify-end' : 'justify-start'} flex-col items-${isUser ? 'end' : 'start'}`;

  // Burbuja: estilos diferentes para user/bot
  const bubbleBase = 'inline-block max-w-[72%] px-4 py-3 rounded-[12px]';
  const bubbleClass = isUser
    ? `${bubbleBase} bg-[#25D366] text-white rounded-br-[6px]`
    : `${bubbleBase} bg-white text-gray-900 border border-[rgba(0,0,0,0.06)] rounded-bl-[6px]`;

  const timeClass = `text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`;
  const buttonBase = "p-1 hover:bg-gray-100 rounded-full transition-all duration-200";

  const handleCopy = () => {
    if (onCopy) {
      onCopy(id);
    }
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Error al copiar:', err);
    });
  };

  const handleThumbsUp = () => {
    if (onThumbsUp) {
      onThumbsUp(id);
    }
  };

  const handleThumbsDown = () => {
    if (onThumbsDown) {
      onThumbsDown(id);
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditText(text);
    // Focus al textarea después del render
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }, 0);
  };

  const handleEditSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== text && onEdit) {
      // Llamar al padre con el nuevo texto
      onEdit(id, trimmedText);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleEditCancel();
    }
  };

  return (
    <div className={containerClass} style={{ gap: '0.25rem' }}>
      {isUser ? (
        isEditing ? (
          // MODO EDICIÓN - Textarea editable
          <div className="flex flex-col gap-2 w-[72%] max-w-[72%]">
            <div className="flex items-end gap-2">
              {/* Botones guardar/cancelar */}
              <div className="flex gap-1">
                <button
                  onClick={handleEditSave}
                  aria-label="Guardar"
                  className={`${buttonBase} bg-green-500 hover:bg-green-600 text-white`}
                  style={{ border: 'none' }}
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleEditCancel}
                  aria-label="Cancelar"
                  className={`${buttonBase} bg-gray-500 hover:bg-gray-600 text-white`}
                  style={{ border: 'none' }}
                >
                  <X size={16} />
                </button>
              </div>
              {/* Textarea editable - Texto negro legible */}
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-white text-black border border-gray-300 rounded-[6px] px-3 py-2 placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[40px] max-h-[150px]"
                placeholder="Edita tu mensaje..."
                rows={1}
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              />
            </div>
            <div className={`${timeClass} text-gray-400`}>{time}</div>
          </div>
        ) : (
          // MODO NORMAL (usuario)
          <div className="flex items-end gap-2">
            <button
              onClick={handleEditStart}
              aria-label="Editar mensaje"
              className={`${buttonBase} opacity-0 group-hover:opacity-100`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <Pencil size={18} color="#374151" />
            </button>
            <div className={bubbleClass} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {text}
            </div>
          </div>
        )
      ) : (
        // MODO BOT (sin editar)
        <div className={bubbleClass} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <div>{text}</div>

          {/* Iconos dentro de la burbuja (debajo del texto) */}
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => onReply && onReply(id)}
              aria-label="Regenerar respuesta"
              className={`${buttonBase} hover:scale-110`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <RotateCcw size={16} color="#075E54" />
            </button>

            <button
              onClick={handleCopy}
              aria-label="Copiar mensaje"
              className={`${buttonBase} hover:scale-110`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <Copy size={16} color="#075E54" />
            </button>

            <button
              onClick={handleThumbsUp}
              aria-label="Me gusta"
              className={`${buttonBase} hover:scale-110 ${liked ? 'bg-green-100 text-green-600 shadow-md' : ''}`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <ThumbsUp size={16} fill={liked ? "#059669" : "none"} color={liked ? "#059669" : "#075E54"} />
            </button>

            <button
              onClick={handleThumbsDown}
              aria-label="No me gusta"
              className={`${buttonBase} hover:scale-110 ${disliked ? 'bg-red-100 text-red-600 shadow-md' : ''}`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <ThumbsDown size={16} fill={disliked ? "#DC2626" : "none"} color={disliked ? "#DC2626" : "#075E54"} />
            </button>
          </div>
        </div>
      )}

      {/* Hora debajo de la burbuja (solo en modo normal) */}
      {(!isUser || !isEditing) && time && (
        <div className={timeClass}>
          {time}
        </div>
      )}
    </div>
  );
}