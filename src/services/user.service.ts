import type { ApiResponse } from "../types/response/api.response";
import type { UserResponse } from "../types/response/response.type";
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
  
}