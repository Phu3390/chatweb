import type { FriendRequestStatus } from "../enums/enums.type"

export interface SendFriendRequest {
  receiverId: string 
}

export interface FriendRequestAction {
  requestId: string 
  status: FriendRequestStatus
}