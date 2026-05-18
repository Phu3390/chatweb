import type { MessageType } from "../enums/enums.type"

export interface SendMessageRequest {
  conversationId: string 
  content: string
  messageType: MessageType
}