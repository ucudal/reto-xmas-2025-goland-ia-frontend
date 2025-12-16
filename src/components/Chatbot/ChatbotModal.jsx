import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AgUIService from '../../services/AgUIService';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'goland-chat-conversation';

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
            time: formatTime()
          }
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
        time: formatTime()
      }
    ],
    threadId: null,
  };
}

export default function ChatbotModal({ onClose }) {
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

  const getSdkMessageId = (msg) => msg?.id ?? msg?.messageId ?? msg?.metadata?.id ?? null;
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing conversation from storage:', error);
    }

    const fresh = getWelcomeConversation();
    setIsLoading(false);
    setCopiedMessageId(null);
    setReloadingMessageId(null);
    setEditingMessageId(null);
    setDraftBeforeEdit('');
    setThreadId(fresh.threadId);
    setMessages(fresh.messages);
  };

  const runAgentWithMessages = async ({ messagesForAgent, forceNewThread = false }) => {
    try {
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
      onMessagesChanged: (sdkMessages) => {
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
        setIsLoading(false);
      },
      onRunError: (errorEvent) => {
        const errMsg = {
          id: `${Date.now()}-error`,
          role: 'assistant',
          content: errorEvent.message || 'Hubo un error al obtener la respuesta.',
          time: formatTime(),
        };
        setMessages((prev) => [...prev, errMsg]);
        setIsLoading(false);
      },
      });
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        messages,
        threadId,
      }));
    } catch (error) {
      console.error('Error saving conversation to storage:', error);
    }
  }, [messages, threadId]);

  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    const text = input?.trim();
    if (!text) return;

    setInput('');
    setIsLoading(true);

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
        const agentMessages = kept.map((m) => ({ role: m.role, content: m.content }));

        // Reset del thread: conversación “nueva” a partir del historial editado
        setThreadId(null);
        setMessages(kept);
        setEditingMessageId(null);
        setDraftBeforeEdit('');
        await runAgentWithMessages({ messagesForAgent: agentMessages, forceNewThread: true });
        return;
      }

      const agUIMessages = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: text,
        },
      ];

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
      console.error(err);
    }
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
    const agentMessages = kept.map((m) => ({ role: m.role, content: m.content }));

    // Reset del thread: nuevo run, pero con el mismo historial “hasta el user”
    try {
      setIsLoading(true);
      setThreadId(null);
      setMessages(kept);
      setReloadingMessageId(assistantMessageId);
      await runAgentWithMessages({ messagesForAgent: agentMessages, forceNewThread: true });
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-end justify-end p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm h-[36rem] flex flex-col">
        {/* Header */}
        <div className="bg-green-300 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://f.fcdn.app/assets/commerce/shop.goland-group.com/968a_263c/public/web/favicon.ico"
              alt="GoLand icon"
              className="w-6 h-6"
            />
            <div className="leading-tight text-black">
              <div className="text-lg font-semibold">GOLAND Chat</div>
              <div className="text-xs text-white flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-black">online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewConversation}
              className="flex items-center hover:bg-green-200 p-2 rounded transition-all duration-150 text-black cursor-pointer hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              aria-label="Nueva conversación"
              title="Nueva conversación"
              type="button"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={onClose}
              className="hover:bg-green-700 p-1 rounded transition-colors text-black"
              aria-label="Close Chatbot"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className=" flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              type={msg.role === 'user' ? 'user' : 'bot'}
              text={msg.content}
              time={msg.time}
              feedback={msg.feedback}
              copied={copiedMessageId === msg.id}
              reloading={reloadingMessageId === msg.id}
              onCopy={handleCopy}
              onThumbsUp={(id) => setFeedback(id, 'up')}
              onThumbsDown={(id) => setFeedback(id, 'down')}
              onReload={handleReload}
              onEdit={handleEditMessage}
            />
          ))}

          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg inline-flex items-center">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-150">●</span>
                <span className="animate-pulse delay-300">●</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {editingMessageId && (
          <div className="px-4 pt-3 pb-1 text-xs text-gray-600 flex items-center justify-between">
            <span>Editando mensaje…</span>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-gray-700 hover:text-black underline underline-offset-2"
            >
              Cancelar
            </button>
          </div>
        )}
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}