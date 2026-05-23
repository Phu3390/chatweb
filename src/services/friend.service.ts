import type { FriendRequestAction, SendFriendRequest } from "../types/request/friend.request";
import type { ApiResponse } from "../types/response/api.response";
import axiosClient from "./axios";

export const friendService = {
  sendFriendRequest: async (payload: SendFriendRequest): Promise<
    ApiResponse<void>
  > => {
    return axiosClient.post<void, SendFriendRequest>("/friends/request", payload);
  },

  actionFriendRequest: async (payload: FriendRequestAction,): Promise<ApiResponse<void>> => {
    return axiosClient.post<void, FriendRequestAction>("/friends/action", payload);
  },
};
