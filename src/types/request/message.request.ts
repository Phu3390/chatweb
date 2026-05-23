import type { MessageType } from "../enums/enums.type"

export interface SendMessageRequest {
  conversationId: string 
  content: string
  messageType: MessageType
}

export interface MessageQuery{
  conversationId: string
  before?: Date
  size?: number
}