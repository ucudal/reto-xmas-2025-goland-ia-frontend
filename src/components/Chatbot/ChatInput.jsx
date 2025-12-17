import React, { useRef } from 'react';
import { Send, Square, Paperclip, X, File, FileText, Image, FileCode, FileSpreadsheet } from 'lucide-react';

// Función para formatear tamaño de archivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Función para obtener icono según tipo de archivo
function getFileIcon(file) {
  const type = file.type || '';
  if (type.startsWith('image/')) return Image;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return FileSpreadsheet;
  if (type.includes('code') || type.includes('text')) return FileCode;
  return File;
}

export default function ChatInput({
  input,
  setInput,
  onSendMessage,
  onSendFiles,
  isLoading,
  isTypingBot,
  selectedFiles,
  onFilesSelected,
  onRemoveFile,
}) {
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles && selectedFiles.length > 0) {
      onSendFiles(selectedFiles);
    } else if (input.trim()) {
      onSendMessage(e);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Resetear el input para permitir seleccionar el mismo archivo de nuevo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='border-t'>
      {/* Preview de archivos */}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className='px-4 pt-3 pb-2 flex flex-wrap gap-2'>
          {selectedFiles.map((file, index) => {
            const FileIcon = getFileIcon(file);
            return (
              <div
                key={index}
                className='flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm'
              >
                <FileIcon size={16} className='text-gray-600 flex-shrink-0' />
                <div className='flex flex-col min-w-0 flex-1'>
                  <span className='text-gray-800 truncate max-w-[150px]' title={file.name}>
                    {file.name}
                  </span>
                  <span className='text-xs text-gray-500'>{formatFileSize(file.size)}</span>
                </div>
                <button
                  type='button'
                  onClick={() => onRemoveFile(index)}
                  className='ml-1 p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0'
                  aria-label='Quitar archivo'
                >
                  <X size={14} className='text-gray-600' />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit} className='p-4 flex gap-2'>
        <input
          ref={fileInputRef}
          type='file'
          multiple
          className='hidden'
          onChange={handleFileSelect}
          aria-label='Seleccionar archivos'
        />
        
        <button
          type='button'
          onClick={handleAttachClick}
          disabled={isLoading && !isTypingBot}
          className='flex items-center justify-center p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          aria-label='Adjuntar archivo'
        >
          <Paperclip size={20} />
        </button>

        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isTypingBot ? 'El bot está respondiendo...' : 'Escribe tu mensaje...'
          }
          disabled={isLoading && !isTypingBot}
          className='flex-1 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-verde disabled:opacity-50'
        />

        {isTypingBot ? (
          // 🛑 BOTÓN STOP
          <button
            type='submit'
            className='bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full transition-colors flex items-center justify-center'
            aria-label='Detener respuesta'
          >
            <Square size={18} />
          </button>
        ) : (
          // ✉️ BOTÓN ENVIAR
          <button
            type='submit'
            disabled={isLoading || (!input.trim() && (!selectedFiles || selectedFiles.length === 0))}
            className='bg-verde hover:bg-green-600 text-white px-3 py-2 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center'
            aria-label='Enviar mensaje'
          >
            <Send size={20} />
          </button>
        )}
      </form>
    </div>
  );
}
