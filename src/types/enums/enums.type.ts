export const ConversationParticipantRole = {
  MEMBER: "member",
  ADMIN: "admin",
} as const

export type ConversationParticipantRole =
  (typeof ConversationParticipantRole)[keyof typeof ConversationParticipantRole]

export const ConversationType = {
  PRIVATE: "private",
  GROUP: "group",
} as const

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType]

export const FriendRequestStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const

export type FriendRequestStatus =
  (typeof FriendRequestStatus)[keyof typeof FriendRequestStatus]

export const MessageType = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
} as const

export type MessageType =
  (typeof MessageType)[keyof typeof MessageType]

export const UserStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
} as const

export type UserStatus =
  (typeof UserStatus)[keyof typeof UserStatus]