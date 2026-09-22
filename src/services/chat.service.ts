import {  Conversation,
  Message, } from '@/types/chat';
import { api } from './api';

export const createConversation = async (
  talentId: number,
): Promise<Conversation> => {
  const response = await api.post(
    '/api/conversations/',
    {
      talent: talentId,
    },
  );

  return response.data;
};

export const getConversationMessages = async (
  conversationId: string,
): Promise<Message[]> => {
  const response = await api.get(
    `/api/conversations/${conversationId}/messages/`,
  );

  return response.data;
};

export const sendMessage = async (
  conversationId: string,
  text: string,
): Promise<Message> => {
  const response = await api.post(
    `/api/conversations/${conversationId}/messages/`,
    {
      message_type: 'text',
      text: text.trim(),
    },
  );

  return response.data;
};


export const getConversations = async (): Promise<
  Conversation[]
> => {
  const response = await api.get(
    '/api/conversations/',
  );

  return response.data;
};


export const markConversationAsRead = async (
  conversationId: string,
): Promise<void> => {
  await api.post(
    `/api/conversations/${conversationId}/read/`,
  );
};




