import { HttpAgent } from '@ag-ui/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * @param {Object} params - Parámetros para ejecutar el agente
 * @param {string} params.threadId - ID del thread de conversación
 * @param {Array} params.messages - Array de mensajes en formato ag-ui
 * @param {Function} params.onThreadId - Callback cuando se obtiene el threadId
 * @param {Function} params.onMessagesChanged - Callback cuando cambian los mensajes (sincroniza con el SDK)
 * @param {Function} params.onRunFinished - Callback cuando termina el run
 * @param {Function} params.onRunError - Callback cuando hay un error
 * @returns {Promise<Object>} Resultado con newMessages del SDK
 */
export async function runAgent({ 
  threadId, 
  messages, 
  onThreadId,
  onMessagesChanged,
  onRunFinished,
  onRunError
}) {
  const agent = new HttpAgent({
    url: `${API_URL}/v1/agent`,
    headers: {
      'Content-Type': 'application/json',
    },
    threadId: threadId || undefined,
    initialMessages: messages || [],
  });

  const result = await agent.runAgent(
    {
      tools: [],
      context: [],
      forwardedProps: {},
      state: {},
    },
    {
      onRunStartedEvent: ({ event }) => {
        if (event.threadId) {
          onThreadId?.(event.threadId);
        }
      },
      onMessagesChanged: ({ messages: sdkMessages }) => {
        onMessagesChanged?.(sdkMessages);
      },
      onRunFinishedEvent: ({ event, result: runResult }) => {
        onRunFinished?.(event, runResult);
      },
      onRunErrorEvent: ({ event }) => {
        onRunError?.(event);
      },
    }
  );

  return result;
}

export default {
  runAgent,
};

