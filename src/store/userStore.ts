import { create } from "zustand";
import type { UserResponse } from "../types/response/response.type";
import type { ApiResponse } from "../types/response/api.response";
import { userService } from "../services/user.service";
type UserState = {
  searchResults: UserResponse[];
  countFriendInvitation?: number;

  setSearchResults: (searchResults: UserResponse[]) => void;
  setCountFriendInvitation: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  loading: boolean;
  error: string | null;

  searchUsers: (keyword: string) => Promise<unknown>;
};

export const useUserStore = create<UserState>((set) => ({
  searchResults: [],

  countFriendInvitation: 0,

  setSearchResults: (searchResults: UserResponse[]) =>
    set({
      searchResults,
    }),

  setCountFriendInvitation: (countFriendInvitation: number) =>
    set({
      countFriendInvitation,
    }),

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  loading: false,
  error: null,

  searchUsers: async (keyword: string) => {
    try {
      set({ loading: true });
      set({ error: null });

      const result: ApiResponse<UserResponse[]> =
        await userService.search(keyword);
      if (result.code === 200 && result.data) {
        set({ searchResults: result.data });
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

  countFriendInvitations: async () => {
    try {
      set({ loading: true });
      set({ error: null });

      const result: ApiResponse<number> = await userService.countFriendInvitation();
      if (result.code === 200 && result.data) {
        set({ countFriendInvitation: result.data });
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
  }
}));
