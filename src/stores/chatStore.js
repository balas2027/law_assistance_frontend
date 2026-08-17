import { create } from 'zustand';
import { createChatApi, fetchChatApi, fetchChatsApi, sendMessageApi } from '../lib/api/chat';
import { demoChatSession } from '../types/chat';
import { uid } from '../lib/utils';

export const useChatStore = create((set, get) => ({
  chats: [demoChatSession],
  activeChat: demoChatSession,
  messages: demoChatSession.messages,
  loading: false,

  loadChats: async () => {
    set({ loading: true });
    const chats = await fetchChatsApi();
    set({ chats, loading: false });
  },

  selectChat: async (chatId) => {
    set({ loading: true });
    const chat = await fetchChatApi(chatId);
    set({ activeChat: chat, messages: chat.messages, loading: false });
    return chat;
  },

  newChat: async (prompt) => {
    const chat = await createChatApi(prompt);
    set((state) => ({ chats: [chat, ...state.chats], activeChat: chat, messages: [] }));
    return chat;
  },

  sendMessage: async (content) => {
    const userMessage = {
      id: uid('msg'),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, userMessage] }));
    await sendMessageApi(get().activeChat.id, content);

    const assistantMessage = {
      id: uid('msg'),
      role: 'assistant',
      timestamp: new Date().toISOString(),
      content: `Thank you for your question. I am analyzing "${content}" against verified Indian jurisprudence and will respond with grounded citations shortly.`,
    };
    set((state) => ({ messages: [...state.messages, assistantMessage] }));
    return assistantMessage;
  },

  reset: () =>
    set({
      chats: [demoChatSession],
      activeChat: demoChatSession,
      messages: demoChatSession.messages,
      loading: false,
    }),
}));
