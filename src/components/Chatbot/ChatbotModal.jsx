import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AgUIService from '../../services/AgUIService';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'goland-chat-conversation';
const SEEN_KEY = 'goland-chat-seen';

function formatTime(date = new Date()) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return `${hours}:${minutes} ${ampm}`;
}

function loadConversationFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        messages: data.messages || [
          {
            id: '1',
            role: 'assistant',
            content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?',
            time: formatTime(),
          },
        ],
        threadId: data.threadId || null,
      };
    }
  } catch (error) {
    console.error('Error loading conversation from storage:', error);
  }
  return {
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?',
        time: formatTime(),
      },
    ],
    threadId: null,
  };
}

function markAsSeen(msgs) {
  try {
    const count = (msgs || []).filter((m) => m.role === 'assistant').length;
    localStorage.setItem(SEEN_KEY, JSON.stringify({ count }));
  } catch (e) {
    console.error('[Chatbot][markAsSeen] Error saving seen messages to localStorage:', e);
  }
}

export default function ChatbotModal({ onClose, visible = true }) {
  const { messages: initialMessages, threadId: initialThreadId } = loadConversationFromStorage();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(initialThreadId);
  const messagesEndRef = useRef(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [reloadingMessageId, setReloadingMessageId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [draftBeforeEdit, setDraftBeforeEdit] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const cancelRunRef = useRef(false);
  const [agentStatus, setAgentStatus] = useState(null); // null | 'thinking' | 'searching' | 'writing'
  const [runStatus, setRunStatus] = useState('idle'); // idle | loading | stopped | error
  const [errorText, setErrorText] = useState(null);
  const lastRunRef = useRef(null); // { messagesForAgent, forceNewThread, label }

  useEffect(() => {
    if (visible && runStatus === 'idle') {
      markAsSeen(messages);
    }
  }, [messages, visible, runStatus]);

  const toUserFriendlyError = (errLike) => {
    const raw =
      typeof errLike === 'string'
        ? errLike
        : errLike?.message || errLike?.error || errLike?.toString?.() || '';
    const msg = String(raw || '').toLowerCase();

    if (!msg) return 'Algo salió mal. Probá de nuevo.';
    if (msg.includes('failed to fetch') || msg.includes('networkerror')) {
      return 'No pudimos conectar. Probá de nuevo.';
    }
    if (msg.includes('cors')) {
      return 'No pudimos conectar. Probá de nuevo.';
    }
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return 'Tardó demasiado. Probá de nuevo.';
    }
    if (msg.includes('500') || msg.includes('internal server error')) {
      return 'Hubo un problema. Probá de nuevo.';
    }
    if (msg.includes('404') || msg.includes('not found')) {
      return 'No pudimos conectar. Probá de nuevo.';
    }

    return 'Algo salió mal. Probá de nuevo.';
  };

  const getSdkMessageId = (msg) =>
    msg?.id ?? msg?.messageId ?? msg?.metadata?.id ?? null;
  const getWelcomeConversation = () => ({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?',
        time: formatTime(),
      },
    ],
    threadId: null,
  });

  const handleNewConversation = () => {
    
    // Liberar URLs de previews de imágenes
    messages.forEach((m) => {
      if (m.fileInfo?.previewUrl) {
        URL.revokeObjectURL(m.fileInfo.previewUrl);
      }
    });
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing conversation from storage:', error);
    }   

    const fresh = getWelcomeConversation();
    setIsLoading(false);
    setRunStatus('idle');
    setErrorText(null);
    setCopiedMessageId(null);
    setReloadingMessageId(null);
    setEditingMessageId(null);
    setDraftBeforeEdit('');
    setSelectedFiles([]);
    setThreadId(fresh.threadId);
    setMessages(fresh.messages);
  };

  const stopRun = () => {
    cancelRunRef.current = true;
    setIsLoading(false);
    setRunStatus('stopped');
  };

  const retryLastRun = async () => {
    const last = lastRunRef.current;
    if (!last) return;
    setErrorText(null);
    setRunStatus('loading');
    setIsLoading(true);
    try {
      await runAgentWithMessages({
        messagesForAgent: last.messagesForAgent,
        // Si veníamos de STOP/error, es más seguro forzar nuevo thread
        forceNewThread: true,
      });
    } catch (e) {
      // runAgentWithMessages ya marca error
    }
  };

  const runAgentWithMessages = async ({ messagesForAgent, forceNewThread = false }) => {
    try {
      cancelRunRef.current = false;
      setErrorText(null);
      setRunStatus('loading');
      setAgentStatus('thinking');
      setIsLoading(true);

      await AgUIService.runAgent({
        threadId: forceNewThread ? null : threadId,
        messages: messagesForAgent,

        onThreadId: (newThreadId) => {
          // Si forzamos thread nuevo, siempre actualizamos. Si no, solo si todavía es null.
          setThreadId((prev) => {
            if (forceNewThread) return newThreadId;
            return prev || newThreadId;
          });
        },

        // 🔹 STEPS (AG-UI CORE)
        onStepStarted: (event) => {
          if (cancelRunRef.current) return;

          const stepName = event?.stepName;
          console.log('STEP STARTED:', stepName);

          if (stepName === 'reasoning') {
            setAgentStatus('thinking');
          } else if (stepName?.startsWith('tool')) {
            setAgentStatus('searching');
          } else if (stepName === 'response') {
            setAgentStatus('writing');
          }
        },

        onStepFinished: () => {
          if (cancelRunRef.current) return;
        },

        onMessagesChanged: (sdkMessages) => {
          if (cancelRunRef.current) return;
          // Importante: usar el estado previo para no quedar con "messages" viejo (closure)
          setMessages((prev) =>
            sdkMessages.map((msg) => {
              const normalizedId = getSdkMessageId(msg) || `${msg?.role || 'msg'}-${crypto?.randomUUID?.() || Date.now()}`;
              const existing = prev.find((m) => m.id === normalizedId);
              return {
                id: normalizedId,
                role: msg.role,
                content: typeof msg.content === 'string' ? msg.content : '',
                time: existing?.time || formatTime(),
                feedback: existing?.feedback || null,
              };
            })
          );
        },

        onRunFinished: () => {
          if (cancelRunRef.current) return;
          setIsLoading(false);
          setRunStatus('idle');
          setAgentStatus(null);
        },

        onRunError: (errorEvent) => {
          if (cancelRunRef.current) return;
          setRunStatus('error');
          setErrorText(toUserFriendlyError(errorEvent));
          const errMsg = {
            id: `${Date.now()}-error`,
            role: 'assistant',
            content: 'Hubo un error al obtener la respuesta.',
            time: formatTime(),
          };
          setMessages((prev) => [...prev, errMsg]);
          setIsLoading(false);
          setAgentStatus(null);
        },
      });
    } catch (err) {
      if (!cancelRunRef.current) {
        setRunStatus('error');
        setErrorText(toUserFriendlyError(err));
        setIsLoading(false);
        setAgentStatus(null);
      }
      console.error('AG-UI run error (debug):', err);
      throw err;
    } finally {
      setReloadingMessageId(null);
    }
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Guardar conversación en localStorage cuando cambien messages o threadId
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages,
          threadId,
        })
      );
    } catch (error) {
      console.error('Error saving conversation to storage:', error);
    }
  }, [messages, threadId]);

  const sendText = async (rawText) => {
    // STOP: corta actualizaciones de UI del run actual
    if (isLoading) {
      stopRun();
      return;
    }

    const text = rawText?.trim();
    if (!text) return;

    setInput('');
    setIsLoading(true);
    setRunStatus('loading');
    setErrorText(null);

    try {
      // Modo edición: reemplaza el mensaje user editado, recorta historial y re-genera respuesta
      if (editingMessageId) {
        const editIdx = messages.findIndex((m) => m.id === editingMessageId);
        if (editIdx === -1) {
          setIsLoading(false);
          setEditingMessageId(null);
          return;
        }
        if (messages[editIdx]?.role !== 'user') {
          setIsLoading(false);
          setEditingMessageId(null);
          return;
        }

        const updated = messages.map((m, i) =>
          i === editIdx ? { ...m, content: text, time: formatTime() } : m
        );
        const kept = updated.slice(0, editIdx + 1);
        const agentMessages = kept.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Reset del thread: conversación “nueva” a partir del historial editado
        setThreadId(null);
        setMessages(kept);
        setEditingMessageId(null);
        setDraftBeforeEdit('');
        lastRunRef.current = { messagesForAgent: agentMessages, forceNewThread: true, label: 'edit' };
        await runAgentWithMessages({ messagesForAgent: agentMessages, forceNewThread: true });
        return;
      }

            // crear mensaje user
      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        time: formatTime(),
      };

      // renderizarlo inmediatamente
      setMessages((prev) => [...prev, userMessage]);

      // historial para el agente
      const agUIMessages = [
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: text },
      ];

      lastRunRef.current = { messagesForAgent: agUIMessages, forceNewThread: false, label: 'send' };
      await runAgentWithMessages({ messagesForAgent: agUIMessages, forceNewThread: false });
    } catch (err) {
      const errMsg = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: 'Hubo un error al obtener la respuesta.',
        time: formatTime(),
      };
      setMessages((prev) => [...prev, errMsg]);
      setIsLoading(false);
      setRunStatus('error');
      setErrorText(toUserFriendlyError(err));
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    await sendText(input);
  };

  const handleEditMessage = (messageId) => {
    if (isLoading) return;
    const msg = messages.find((m) => m.id === messageId);
    if (!msg || msg.role !== 'user') return;
    setDraftBeforeEdit(input);
    setEditingMessageId(messageId);
    setInput(msg.content || '');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setInput(draftBeforeEdit || '');
    setDraftBeforeEdit('');
  };

  const handleCopy = async (messageId) => {
    const msg = messages.find((m) => m.id === messageId);
    const textToCopy = msg?.content ?? '';
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      // Fallback simple
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopiedMessageId(messageId);
    window.setTimeout(() => {
      setCopiedMessageId((prev) => (prev === messageId ? null : prev));
    }, 900);
  };

  const setFeedback = (messageId, feedback) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback } : m))
    );
  };

  const handleReload = async (assistantMessageId) => {
    if (isLoading) return;
    // Regenerar: recorta el historial hasta el último mensaje de usuario previo a ese assistant
    const idx = messages.findIndex((m) => m.id === assistantMessageId);
    if (idx === -1) return;

    let lastUserIdx = -1;
    for (let i = idx; i >= 0; i--) {
      if (messages[i]?.role === 'user') {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;

    const kept = messages.slice(0, lastUserIdx + 1);
    const agentMessages = kept.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Reset del thread: nuevo run, pero con el mismo historial “hasta el user”
    try {
      setIsLoading(true);
      setRunStatus('loading');
      setErrorText(null);
      setThreadId(null);
      setMessages(kept);
      setReloadingMessageId(assistantMessageId);
      lastRunRef.current = { messagesForAgent: agentMessages, forceNewThread: true, label: 'reload' };
      await runAgentWithMessages({ messagesForAgent: agentMessages, forceNewThread: true });
    } catch (err) {
      setIsLoading(false);
      setRunStatus('error');
      setErrorText(toUserFriendlyError(err));
      console.error(err);
    }
  };

  // Función para formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Manejar selección de archivos
  const handleFilesSelected = (files) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Remover archivo del preview
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Enviar archivos
  const handleSendFiles = async (files) => {
    if (!files || files.length === 0) return;

    // Crear mensajes de usuario para cada archivo
    const fileMessages = files.map((file) => {
    const isImage = file.type.startsWith('image/');
    return {
      id: `file-${Date.now()}-${Math.random()}`,
      role: 'user',
      type: 'file',
      content: file.name,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        formattedSize: formatFileSize(file.size),
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
      },
      time: formatTime(),
    };
  });

    // Agregar mensajes de usuario
    setMessages((prev) => [...prev, ...fileMessages]);

    // Agregar mensaje hardcoded del asistente
    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content:
        'Archivo recibido. Por el momento no es posible generar una respuesta.',
      time: formatTime(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Limpiar archivos seleccionados
    setSelectedFiles([]);
  };

  return (
    <div className={`fixed inset-0 bg-transparent flex items-end justify-end p-4 z-50 ${visible ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm h-[36rem] flex flex-col">
        {/* Header */}
        <div className='bg-green-300 text-white p-4 rounded-t-lg flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <img
              src='https://f.fcdn.app/assets/commerce/shop.goland-group.com/968a_263c/public/web/favicon.ico'
              alt='GoLand icon'
              className='w-6 h-6'
            />
            <div className='leading-tight text-black'>
              <div className='text-lg font-semibold'>GOLAND Chat</div>
              <div className='text-xs text-white flex items-center gap-2'>
                <span className='inline-block w-2 h-2 bg-green-500 rounded-full' />
                <span className='text-black'>online</span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={handleNewConversation}
              className='flex items-center hover:bg-green-200 p-2 rounded transition-all duration-150 text-black cursor-pointer hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
              aria-label='Nueva conversación'
              title='Nueva conversación'
              type='button'
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={onClose}
              className='hover:bg-green-200 p-1 rounded transition-colors text-black'
              aria-label='Close Chatbot'
              type='button'
            >
              ✕
            </button>
          </div>
        </div>

        {(runStatus === 'error' || runStatus === 'stopped') && (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between border-b ${runStatus === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-yellow-50 text-yellow-800 border-yellow-100'
              }`}
          >
            <span>
              {runStatus === 'error'
                ? `Error: ${errorText || 'Hubo un error.'}`
                : 'Respuesta detenida.'}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={retryLastRun}
                className="underline underline-offset-2"
              >
                Reintentar
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunStatus('idle');
                  setErrorText(null);
                }}
                className="underline underline-offset-2"
              >
                Ocultar
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className='flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3'>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              type={msg.role === 'user' ? 'user' : 'bot'}
              text={msg.content}
              time={msg.time}
              messageType={msg.type}
              fileInfo={msg.fileInfo}
              feedback={msg.feedback}
              copied={copiedMessageId === msg.id}
              reloading={reloadingMessageId === msg.id}
              actionsDisabled={runStatus === 'loading'}
              onCopy={handleCopy}
              onThumbsUp={(id) => setFeedback(id, 'up')}
              onThumbsDown={(id) => setFeedback(id, 'down')}
              onReload={handleReload}
              onEdit={handleEditMessage}
            />
          ))}

          {runStatus === 'loading' && (
            <div className="flex justify-start">
              <div className="bg-white border border-[rgba(0,0,0,0.06)] text-gray-800 px-3 py-2 rounded-[12px] rounded-bl-[6px] shadow-sm max-w-[72%]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">
                    {agentStatus === 'searching' ? 'Buscando...' :
                      agentStatus === 'writing' ? 'Escribiendo...' :
                        'Pensando...'}
                  </span>
                  <span className="inline-flex items-center gap-1" aria-label="Pensando">
                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
                  </span>
                </div>
              </div>
            </div>
          )}


          {/* Sugerencias (solo si aún no hay mensajes del usuario) */}
          {!messages.some((m) => m.role === 'user') && (
            <div className='mt-2 flex flex-wrap gap-2'>
              {[
                'Quiero info de GoLand Uruguay',
                'Recomendame un pack para empezar',
                '¿Qué productos de cáñamo venden?',
              ].map((s) => (
                <button
                  key={s}
                  type='button'
                  onClick={() => sendText(s)}
                  className='text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors'
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {editingMessageId && (
          <div className='px-4 pt-3 pb-1 text-xs text-gray-600 flex items-center justify-between'>
            <span>Editando mensaje…</span>
            <button
              type='button'
              onClick={handleCancelEdit}
              className='text-gray-700 hover:text-black underline underline-offset-2'
            >
              Cancelar
            </button>
          </div>
        )}
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          onSendFiles={handleSendFiles}
          isLoading={isLoading}
          isTypingBot={runStatus === 'loading'}
          selectedFiles={selectedFiles}
          onFilesSelected={handleFilesSelected}
          onRemoveFile={handleRemoveFile}
        />
      </div>
    </div>
  );
}
