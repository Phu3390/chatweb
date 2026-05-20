import { create } from "zustand";
import type { SendFriendRequest } from "../types/request/friend.request";
import type { ApiResponse } from "../types/response/api.response";
import { friendService } from "../services/friend.service";
type FriendState = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  loading: boolean;
  error: string | null;

  sendFriendRequest: (payload: SendFriendRequest) => Promise<unknown>;
};

export const useFriendStore = create<FriendState>((set) => ({
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  loading: false,
  error: null,

  sendFriendRequest: async (payload: SendFriendRequest) => {
    try {
      set({ loading: true });
      set({ error: null });

      const result: ApiResponse<void> =
        await friendService.sendFriendRequest(payload);
      if (result.code === 200 && result.data) {
        return true;
      }
      throw result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message});
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
