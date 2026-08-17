import { demoChatSession } from '../../types/chat';

export async function fetchChatsApi() {
  return Promise.resolve([demoChatSession]);
}

export async function fetchChatApi(chatId) {
  const chat = { ...demoChatSession, id: chatId };
  return Promise.resolve(chat);
}

export async function createChatApi(prompt) {
  return Promise.resolve({
    id: `chat_${Date.now()}`,
    title: prompt.slice(0, 40),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  });
}

export async function sendMessageApi(_chatId, _content) {
  return Promise.resolve();
}
