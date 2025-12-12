import React from 'react';
import { RotateCcw, Copy, ThumbsUp, ThumbsDown, Pencil } from 'lucide-react';

export default function ChatMessage({
  id,
  type,
  text,
  time,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  onReply,
  onEdit
}) {
  const isUser = type === 'user';

  // Contenedor principal: group para detectar hover (columna: burbuja + hora)
  const containerClass = `group relative flex ${isUser ? 'justify-end' : 'justify-start'} flex-col items-${isUser ? 'end' : 'start'}`;

  // Burbuja: estilos diferentes para user/bot
  const bubbleBase = 'inline-block max-w-[72%] px-4 py-3 rounded-[12px]';
  const bubbleClass = isUser
    ? `${bubbleBase} bg-[#25D366] text-white rounded-br-[6px]`
    : `${bubbleBase} bg-white text-gray-900 border border-[rgba(0,0,0,0.06)] rounded-bl-[6px]`;

  const timeClass = `text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`;

  return (
    <div className={containerClass} style={{ gap: '0.25rem' }}>
      {/* Row that contains pencil (left) + bubble for user messages, or just bubble for bot */}
      {isUser ? (
        <div className="flex items-end gap-2">
          {/* Pencil: aparece al hacer hover del group (ahora dentro del flujo, a la izquierda) */}
          <button
            onClick={() => onEdit && onEdit(id)}
            aria-label="Editar mensaje"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
            style={{ background: 'transparent', border: 'none' }}
          >
            <Pencil size={18} color="#374151" />
          </button>

          <div className={bubbleClass} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {text}
          </div>
        </div>
      ) : (
        <div className={bubbleClass} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <div>{text}</div>

          {/* Iconos dentro de la burbuja (debajo del texto) */}
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => onReply && onReply(id)}
              aria-label="Responder"
              className="p-1"
              style={{ background: 'transparent', border: 'none' }}
            >
              <RotateCcw size={16} color="#075E54" />
            </button>

            <button
              onClick={() => onCopy && onCopy(id)}
              aria-label="Copiar"
              className="p-1"
              style={{ background: 'transparent', border: 'none' }}
            >
              <Copy size={16} color="#075E54" />
            </button>

            <button
              onClick={() => onThumbsUp && onThumbsUp(id)}
              aria-label="Me gusta"
              className="p-1"
              style={{ background: 'transparent', border: 'none' }}
            >
              <ThumbsUp size={16} color="#075E54" />
            </button>

            <button
              onClick={() => onThumbsDown && onThumbsDown(id)}
              aria-label="No me gusta"
              className="p-1"
              style={{ background: 'transparent', border: 'none' }}
            >
              <ThumbsDown size={16} color="#075E54" />
            </button>
          </div>
        </div>
      )}

      {/* Hora debajo de la burbuja */}
      {time && (
        <div className={timeClass}>
          {time}
        </div>
      )}
    </div>
  );
}