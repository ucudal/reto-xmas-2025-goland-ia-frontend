import { HttpAgent } from '@ag-ui/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * @param {Object} params
 * @param {string} params.threadId
 * @param {Array} params.messages
 * @param {Function} params.onThreadId
 * @param {Function} params.onMessagesChanged
 * @param {Function} params.onRunFinished
 * @param {Function} params.onRunError
 * @param {Function} params.onStepStarted
 * @param {Function} params.onStepFinished
 */
export async function runAgent({
  threadId,
  messages,
  onThreadId,
  onMessagesChanged,
  onRunFinished,
  onRunError,
  onStepStarted,
  onStepFinished,
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
      // 🔹 RUN START
      onRunStartedEvent: ({ event }) => {
        if (event.threadId) {
          onThreadId?.(event.threadId);
        }
      },

      // 🔹 STEPS (AG-UI CORE)
      onStepStartedEvent: ({ event }) => {
        onStepStarted?.(event);
      },

      onStepFinishedEvent: ({ event }) => {
        onStepFinished?.(event);
      },

      // 🔹 MENSAJES
      onMessagesChanged: ({ messages: sdkMessages }) => {
        onMessagesChanged?.(sdkMessages);
      },

      // 🔹 RUN FINISHED
      onRunFinishedEvent: ({ event, result: runResult }) => {
        onRunFinished?.(event, runResult);
      },

      // 🔹 ERROR
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
