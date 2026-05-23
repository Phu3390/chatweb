import { create } from "zustand";
import type { FriendRequestAction, SendFriendRequest } from "../types/request/friend.request";
import type { ApiResponse } from "../types/response/api.response";
import { friendService } from "../services/friend.service";
type FriendState = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  loading: boolean;
  error: string | null;

  sendFriendRequest: (payload: SendFriendRequest) => Promise<ApiResponse<void>>;
  actionFriendRequest: (payload: FriendRequestAction) => Promise<ApiResponse<void>>;
};

export const useFriendStore = create<FriendState>((set) => ({
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  loading: false,
  error: null,

  sendFriendRequest: async (payload: SendFriendRequest): Promise<ApiResponse<void>> => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await friendService.sendFriendRequest(payload);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<void>;
      set({ error: errorResponse.message});
      return errorResponse;
    } finally {
      set({ loading: false });
    }
  },
  actionFriendRequest: async (payload: FriendRequestAction): Promise<ApiResponse<void>> => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await friendService.actionFriendRequest(payload);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<void>;
      set({ error: errorResponse.message});
      return errorResponse;
    } finally {
      set({ loading: false });
    }
  },
}));
