import {
  FriendRequestStatus,
  type ConversationParticipantRole,
  type ConversationType,
  type MessageType,
} from "../enums/enums.type";

export interface AuthResponse {
  token: string;
  isAuth: boolean;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email?: string;
  avatar?: string;
}

export interface UploadResponse {
  url: string;
}

export interface FriendRequestResponse{
  id: string;
  sender: UserResponse;
  receiver: UserResponse;
  status: FriendRequestStatus;
  createdAt: Date;
}

export interface FriendRealtimeResponse {
  requestId: string;
  sender: UserResponse;
}

export interface ParticipantResponse {
  userId: string;
  fullName: string;
  avatar?: string;
  role: ConversationParticipantRole;
  isMuted: boolean;
  lastReadAt?: string;
  joinedAt: string;
}

export interface ConversationResponse {
  conversationId: string;
  type: ConversationType;
  name?: string;
  createdAt: string;
  participants: ParticipantResponse[];
}

export interface ConversationSummaryResponse {
  conversationId: string;
  type: ConversationType;
  name?: string;
  targetUser?: UserResponse;
  lastMessage?: string;
  lastMessageType?: MessageType;
  lastSenderId?: string;
  lastSenderName?: string;
  lastMessageAt?: string;
  unreadCount: number;
  avatarGroup?: string;
  role?: ConversationParticipantRole;
}

export interface MessageResponse{
  id: string;
  conversation: ConversationResponse;
  sender: UserResponse;
  content: string;
  messageType: MessageType;
  createdAt: string;
}


export interface FriendResponse {
  requestId: string;

  senderId: string;
  senderName: string;

  receiverId: string;
  receiverName: string;

  status: string;

  createdAt: string;
}

export interface MessageResponse {
  messageId: string;

  conversation: ConversationResponse;

  sender: UserResponse;

  content: string;

  messageType: MessageType;

  createdAt: string;
}
