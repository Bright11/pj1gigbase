export interface ConversationUser {
  id: string;
  username: string;
}

export interface ConversationParticipant {
  id: number;
  user: ConversationUser;
  joined_at: string;
  last_read_at: string | null;
  is_active: boolean;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  last_message: Message | null;
  unread_count:number;
  updated_at: string;
  is_active: boolean;
}

export interface ChatUser {
  id: string;
  username: string;
}

export interface MessageAttachment {
  id: string | number;
  file_url?: string | null;
  file?: string | null;
  file_type?: string | null;
}

export interface Message {
  id: string | number;
  conversation: string;
  sender: ChatUser;
  message_type: string;
  text: string | null;
  attachments: MessageAttachment[];
  created_at: string;
  edited_at: string | null;
  is_deleted: boolean;
  is_read:boolean;
}