import type {  ConversationType } from "../enums/enums.type"

export interface CreateConversationRequest {
  avatarGroup?: string
  type: ConversationType
  name?: string
  participantIds: string[] 
}

export interface AddParticipantRequest {
  userId: string 
}

export interface UpdateConversationRequest{
  name?: string
  avatarGroup?: string
}