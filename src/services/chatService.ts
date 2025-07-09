import api from './api';

export const getConversations = async () => {
  const res = await api.get('/chat/conversations');
  return res.data;
};

export const getMessages = async (userId: string) => {
  const res = await api.get(`/chat/with/${userId}`);
  return res.data;
};

export const sendMessage = async (recipient: string, content: string, chatType: 'user' | 'support' = 'user') => {
  const res = await api.post('/chat', { recipient, content, chatType });
  return res.data;
};