import { create } from 'zustand';
import { createChatApi, fetchChatApi, fetchChatsApi, saveChatSessionApi, sendMessageApi } from '../lib/api/chat';
import { demoChatSession } from '../types/chat';
import { uid } from '../lib/utils';
import { useLanguageStore } from './languageStore';

export const useChatStore = create((set, get) => ({
  chats: [demoChatSession],
  activeChat: demoChatSession,
  messages: demoChatSession.messages,
  loading: false,
  selectedSourceType: 'all',

  setSelectedSourceType: (sourceType) => set({ selectedSourceType: sourceType }),

  loadChats: async () => {
    set({ loading: true });
    try {
      const chats = await fetchChatsApi();
      set({ chats, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  selectChat: async (chatId) => {
    set({ loading: true });
    try {
      const chat = await fetchChatApi(chatId);
      set({ activeChat: chat, messages: chat.messages || [], loading: false });
      return chat;
    } catch {
      set({ loading: false });
    }
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

    const newMessages = [...get().messages, userMessage];
    set({ messages: newMessages, loading: true });

    const currentLanguage = useLanguageStore.getState().preferred_language;

    let assistantMessage;
    try {
      const response = await sendMessageApi({
        query: content,
        source_type: get().selectedSourceType,
        top_k: 5,
        selected_language: currentLanguage,
      });

      assistantMessage = {
        id: uid('msg'),
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: response.answer,
        source_type: response.source_type,
        sources: response.sources || [],
        language_mismatch_suggestion: response.language_mismatch_suggestion || null,
      };
    } catch (error) {
      assistantMessage = {
        id: uid('msg'),
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: `I encountered an issue retrieving legal information: ${error.message || 'Unable to connect to service'}. Please verify that the backend API server is running.`,
        isError: true,
        sources: [],
        language_mismatch_suggestion: null,
      };
    }

    const updatedMessages = [...get().messages, assistantMessage];
    const currentActive = get().activeChat || {};
    const updatedActiveChat = {
      ...currentActive,
      title: currentActive.title && currentActive.title !== 'New Legal Query' ? currentActive.title : content.slice(0, 40),
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
    };

    set({ messages: updatedMessages, activeChat: updatedActiveChat, loading: false });

    // Save updated session to storage
    saveChatSessionApi(updatedActiveChat).catch(() => {});

    return assistantMessage;
  },

  reset: () =>
    set({
      chats: [demoChatSession],
      activeChat: demoChatSession,
      messages: demoChatSession.messages,
      loading: false,
      selectedSourceType: 'all',
    }),
}));
