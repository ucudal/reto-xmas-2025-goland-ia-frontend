import React, { useRef } from 'react';
import { Send, Square, Paperclip, X, File, FileText, Image, FileCode, FileSpreadsheet, Mic, StopCircle, Trash2 } from 'lucide-react';

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
  onSendAudio,
  isLoading,
  isTypingBot,
  selectedFiles,
  onFilesSelected,
  onRemoveFile,
}) {
  const fileInputRef = useRef(null);

  const {
    isRecording,
    audioBlob,
    duration,
    start,
    stop,
    reset
  } = useAudioRecorder();

  const audioMode =
    isRecording ? 'recording' :
      audioBlob ? 'preview' :
        'idle';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (audioMode === 'preview') {
      onSendAudio({
        blob: audioBlob,
        duration,
      });
      reset();
      return;
    }


    if (selectedFiles?.length) {
      onSendFiles(selectedFiles);
      return;
    }

    if (input.trim()) {
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

  function useAudioRecorder() {
    const mediaRecorderRef = React.useRef(null);
    const chunksRef = React.useRef([]);
    const [isRecording, setIsRecording] = React.useState(false);
    const [audioBlob, setAudioBlob] = React.useState(null);
    const [duration, setDuration] = React.useState(0);
    const timerRef = React.useRef(null);

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    };

    const stop = () => {
      mediaRecorderRef.current?.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
    };

    const reset = () => {
      setAudioBlob(null);
      setDuration(0);
    };

    return { isRecording, audioBlob, duration, start, stop, reset };
  }



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

      <form onSubmit={handleSubmit} className='p-4 flex gap-2 items-center w-full'>
        {/* INPUT FILE */}
        <input
          ref={fileInputRef}
          type='file'
          multiple
          className='hidden'
          onChange={handleFileSelect}
        />

        {audioMode === 'idle' && (
          <>
            {/* MIC */}
            <button
              type='button'
              onClick={start}
              className='p-2 text-gray-600 hover:bg-gray-100 rounded-full'
              aria-label='Grabar audio'
            >
              <Mic size={20} />
            </button>

            {/* ATTACH */}
            <button
              type='button'
              onClick={handleAttachClick}
              disabled={isLoading && !isTypingBot}
              className='p-2 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50'
            >
              <Paperclip size={20} />
            </button>

            {/* INPUT TEXTO */}
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading && !isTypingBot}
              placeholder={isTypingBot ? 'El bot está respondiendo...' : 'Escribe tu mensaje...'}
              className='flex-1 border border-gray-300 rounded-full px-3 py-2'
            />

            {/* SEND / STOP */}
            {isTypingBot ? (
              <button type='submit' className='bg-red-500 text-white px-3 py-2 rounded-full'>
                <Square size={18} />
              </button>
            ) : (
              <button
                type='submit'
                disabled={!input.trim() && !selectedFiles?.length}
                className='bg-verde text-white px-3 py-2 rounded-full disabled:opacity-50'
              >
                <Send size={20} />
              </button>
            )}
          </>
        )}

        {audioMode === 'recording' && (
          <div className='flex items-center justify-center gap-4 w-full'>
            <span className='text-sm'>Grabando… {duration}s</span>
            <button
              type='button'
              onClick={stop}
              className='p-2 bg-red-500 text-white rounded-full'
            >
              <StopCircle size={20} />
            </button>
          </div>
        )}

        {audioMode === 'preview' && (
          <div className='flex items-center gap-3 w-full'>
            <audio src={URL.createObjectURL(audioBlob)} controls className='flex-1' />

            <button type='button' onClick={reset} className='p-2 hover:bg-gray-100 rounded-full'>
              <Trash2 size={18} />
            </button>

            <button type='submit' className='bg-verde text-white px-3 py-2 rounded-full'>
              <Send size={20} />
            </button>
          </div>
        )}
      </form>

    </div>
  );
}
