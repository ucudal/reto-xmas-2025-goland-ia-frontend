import React from 'react';
import {
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  File,
  FileText,
  Image,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Función para obtener icono según tipo de archivo
function getFileIcon(fileType) {
  if (!fileType) return File;
  if (fileType.startsWith('image/')) return Image;
  if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return FileSpreadsheet;
  if (fileType.includes('code') || fileType.includes('text')) return FileCode;
  return File;
}

export default function ChatMessage({
  id,
  type,
  text,
  time,
  messageType,
  fileInfo,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  feedback,
  copied,
  reloading,
  onReload,
  onEdit,
  actionsDisabled,
}) {
  const isUser = type === 'user';
  const isFileMessage = messageType === 'file';
  const isAudioMessage = messageType === 'audio';

  const iconBtnBase =
    'p-1.5 rounded transition-all duration-150 cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2';
  const iconBtnDisabled = 'opacity-40 cursor-not-allowed hover:scale-100';

  const containerClass = `group relative flex ${isUser ? 'justify-end' : 'justify-start'
    } flex-col items-${isUser ? 'end' : 'start'}`;

  const bubbleBase = 'max-w-[72%] px-4 py-3 rounded-[12px] break-words';
  const bubbleClass = isUser
    ? `${bubbleBase} bg-[#25D366] text-white rounded-br-[6px]`
    : `${bubbleBase} bg-white text-gray-900 border border-[rgba(0,0,0,0.06)] rounded-bl-[6px]`;

  const timeClass = `text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'
    }`;

  return (
    <div className={containerClass} style={{ gap: '0.25rem' }}>
      {isUser ? (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit && onEdit(id)}
            aria-label="Editar mensaje"
            title="Editar"
            disabled={actionsDisabled}
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 flex-shrink-0 ${actionsDisabled ? iconBtnDisabled : 'cursor-pointer'
              }`}
            type="button"
          >
            <Pencil size={18} color="#374151" />
          </button>

          <div className={bubbleClass} style={{ whiteSpace: 'pre-wrap' }}>
            {isAudioMessage ? (
              <audio
                src={fileInfo?.url}
                controls
                className="w-full max-w-[220px]"
              />
            ) : isFileMessage && fileInfo ? (
              <div className="flex items-center gap-3">
                {(() => {
                  const FileIcon = getFileIcon(fileInfo.type);
                  return <FileIcon size={20} className="flex-shrink-0" />;
                })()}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium truncate">{fileInfo.name}</span>
                  <span className="text-xs opacity-90">
                    {fileInfo.formattedSize || fileInfo.size}
                  </span>
                </div>
              </div>
            ) : (
              text
            )}
          </div>
        </div>
      ) : (
        <div className={bubbleClass}>
          <ReactMarkdown>{text}</ReactMarkdown>

          <div className="mt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onReload && onReload(id)}
              aria-label="Regenerar"
              disabled={actionsDisabled}
              className={`${iconBtnBase} hover:bg-gray-100 ${actionsDisabled ? iconBtnDisabled : ''
                }`}
              type="button"
            >
              <RotateCcw
                size={16}
                color="#075E54"
                className={reloading ? 'animate-spin' : ''}
              />
            </button>

            <button
              onClick={() => onCopy && onCopy(id)}
              aria-label="Copiar"
              disabled={actionsDisabled}
              className={`${iconBtnBase} ${copied ? 'bg-green-50' : 'hover:bg-gray-100'
                } ${actionsDisabled ? iconBtnDisabled : ''}`}
              type="button"
            >
              <Copy size={16} color={copied ? '#25D366' : '#075E54'} />
            </button>

            <button
              onClick={() => onThumbsUp && onThumbsUp(id)}
              aria-label="Me gusta"
              aria-pressed={feedback === 'up'}
              disabled={actionsDisabled}
              className={`${iconBtnBase} ${feedback === 'up' ? 'bg-green-50' : 'hover:bg-gray-100'
                } ${actionsDisabled ? iconBtnDisabled : ''}`}
              type="button"
            >
              <ThumbsUp size={16} color={feedback === 'up' ? '#25D366' : '#075E54'} />
            </button>

            <button
              onClick={() => onThumbsDown && onThumbsDown(id)}
              aria-label="No me gusta"
              aria-pressed={feedback === 'down'}
              disabled={actionsDisabled}
              className={`${iconBtnBase} ${feedback === 'down' ? 'bg-red-50' : 'hover:bg-gray-100'
                } ${actionsDisabled ? iconBtnDisabled : ''}`}
              type="button"
            >
              <ThumbsDown size={16} color={feedback === 'down' ? '#EF4444' : '#075E54'} />
            </button>
          </div>
        </div>
      )}

      {time && <div className={timeClass}>{time}</div>}
    </div>
  );
}
