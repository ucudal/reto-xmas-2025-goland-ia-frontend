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
  onReload,
  onEdit,
  feedback,
  copied,
  reloading
}) {
  const isUser = type === 'user';

  const iconBtnBase =
    'p-1.5 rounded transition-all duration-150 cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2';

  // Contenedor principal: group para detectar hover (columna: burbuja + hora)
  const containerClass = `group relative flex ${isUser ? 'justify-end' : 'justify-start'} flex-col items-${isUser ? 'end' : 'start'}`;

  // Burbuja: estilos diferentes para user/bot
  // break-words = overflow-wrap: break-word (solo corta palabras MUY largas que no caben)
  const bubbleBase = 'max-w-[72%] px-4 py-3 rounded-[12px] break-words';
  const bubbleClass = isUser
    ? `${bubbleBase} bg-[#25D366] text-white rounded-br-[6px]`
    : `${bubbleBase} bg-white text-gray-900 border border-[rgba(0,0,0,0.06)] rounded-bl-[6px]`;

  const timeClass = `text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`;

  return (
    <div className={containerClass} style={{ gap: '0.25rem' }}>
      {/* Row that contains bubble for user messages, or bubble + actions for bot */}
      {isUser ? (
        <div className="flex items-center justify-end gap-2 min-w-0 w-full">
          {/* Lápiz a la izquierda de la burbuja */}
          <button
            onClick={() => onEdit && onEdit(id)}
            aria-label="Editar mensaje"
            title="Editar"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 flex-shrink-0"
            style={{ background: 'transparent', border: 'none' }}
            type="button"
          >
            <Pencil size={16} color="#374151" />
          </button>

          <div className={`${bubbleClass} min-w-0`}>
            {text}
          </div>
        </div>
      ) : (
        <div className={`${bubbleClass} min-w-0`}>
          <div>{text}</div>

          {/* Iconos dentro de la burbuja (debajo del texto) */}
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => onReload && onReload(id)}
              aria-label="Regenerar"
              className={`${iconBtnBase} hover:bg-gray-100`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <RotateCcw size={16} color="#075E54" className={reloading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => onCopy && onCopy(id)}
              aria-label="Copiar"
              className={`${iconBtnBase} ${copied ? 'bg-green-50' : 'hover:bg-gray-100'}`}
              style={{ background: 'transparent', border: 'none' }}
            >
              <Copy size={16} color={copied ? '#25D366' : '#075E54'} />
            </button>

            <button
              onClick={() => onThumbsUp && onThumbsUp(id)}
              aria-label="Me gusta"
              aria-pressed={feedback === 'up'}
              className={`${iconBtnBase} ${feedback === 'up' ? 'bg-green-50' : 'hover:bg-gray-100'}`}
              style={{ background: 'transparent', border: 'none' }}
            >
                <ThumbsUp size={16} color={feedback === 'up' ? '#25D366' : '#075E54'} />
            </button>

            <button
              onClick={() => onThumbsDown && onThumbsDown(id)}
              aria-label="No me gusta"
              aria-pressed={feedback === 'down'}
              className={`${iconBtnBase} ${feedback === 'down' ? 'bg-red-50' : 'hover:bg-gray-100'}`}
              style={{ background: 'transparent', border: 'none' }}
            >
                <ThumbsDown size={16} color={feedback === 'down' ? '#EF4444' : '#075E54'} />
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