export const ConversationParticipantRole = {
  MEMBER: "MEMBER",
  ADMIN: "ADMIN",
} as const

export type ConversationParticipantRole =
  (typeof ConversationParticipantRole)[keyof typeof ConversationParticipantRole]

export const ConversationType = {
  PRIVATE: "PRIVATE",
  GROUP: "GROUP",
} as const

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType]

export const FriendRequestStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const

export type FriendRequestStatus =
  (typeof FriendRequestStatus)[keyof typeof FriendRequestStatus]

export const MessageType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  FILE: "FILE",
} as const

export type MessageType =
  (typeof MessageType)[keyof typeof MessageType]

export const UserStatus = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
} as const

export type UserStatus =
  (typeof UserStatus)[keyof typeof UserStatus]