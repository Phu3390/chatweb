import type { FriendRequestStatus } from "../types/enums/enums.type";
import type { ApiResponse } from "../types/response/api.response";
import type { FriendRequestResponse, UserResponse } from "../types/response/response.type";
import { axiosClient } from "./axios";

export const userService = {
  search: async (keyword: string): Promise<ApiResponse<UserResponse[]>> => {
    return axiosClient.get<UserResponse[]>(
      `/api/search?keyword=${encodeURIComponent(keyword)}`
    );
  },

  countFriendInvitation: async (): Promise<ApiResponse<number>> => {
    return axiosClient.get<number>(`/api/friendinvitations/count`);
  },

  getFriendInvitation: async (): Promise<ApiResponse<FriendRequestResponse[]>> => {
    return axiosClient.get<FriendRequestResponse[]>(`/api/friendinvitations`);
  },

  getFriendStatus: async (status: FriendRequestStatus): Promise<ApiResponse<FriendRequestResponse[]>> => {
    return axiosClient.get<FriendRequestResponse[]>(`/api/friendstatus?status=${status}`);
  },

  removeFriend: async (friendId: string): Promise<ApiResponse<void>> => {
    return axiosClient.delete<void>(`/friends/remove/${friendId}`);
  }
  
  
}