import type { ConversationParticipantRole, ConversationType } from "../enums/enums.type"

export interface CreateConversationRequest {
  type: ConversationType
  name?: string
  participantIds: string[] 
}

export interface AddParticipantRequest {
  conversationId: string 
  userId: string 
  role: ConversationParticipantRole
}