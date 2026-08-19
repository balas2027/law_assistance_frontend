import { useChatStore } from '../stores/chatStore';

export const useChat = () => {
  const chats = useChatStore((s) => s.chats);
  const activeChat = useChatStore((s) => s.activeChat);
  const messages = useChatStore((s) => s.messages);
  const loading = useChatStore((s) => s.loading);
  const selectedSourceType = useChatStore((s) => s.selectedSourceType);
  const setSelectedSourceType = useChatStore((s) => s.setSelectedSourceType);
  const loadChats = useChatStore((s) => s.loadChats);
  const selectChat = useChatStore((s) => s.selectChat);
  const newChat = useChatStore((s) => s.newChat);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const reset = useChatStore((s) => s.reset);

  return {
    chats,
    activeChat,
    messages,
    loading,
    selectedSourceType,
    setSelectedSourceType,
    loadChats,
    selectChat,
    newChat,
    sendMessage,
    reset,
  };
};

