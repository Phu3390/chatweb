import { create } from "zustand";
import type { FriendRequestResponse, UserResponse } from "../types/response/response.type";
import type { ApiResponse } from "../types/response/api.response";
import { userService } from "../services/user.service";
import type { FriendRequestStatus } from "../types/enums/enums.type";
type UserState = {
  searchResults: UserResponse[];
  countFriendInvitation?: number;
  friendInvitationResult: FriendRequestResponse[];


  setSearchResults: (searchResults: UserResponse[]) => void;
  setCountFriendInvitation: (count: number) => void;
  setFriendInvitationResult: (result: FriendRequestResponse[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  loading: boolean;
  error: string | null;

  searchUsers: (keyword: string) => Promise<unknown>;
  getCountFriendInvitation: () => Promise<unknown>;
  getFriendInvitation: () => Promise<unknown>;
  getFriendStatus: (status: FriendRequestStatus) => Promise<unknown>;
  removeFriend: (friendId: string) => Promise<ApiResponse<void>>;

};

export const useUserStore = create<UserState>((set) => ({
  searchResults: [],

  countFriendInvitation: 0,
  friendInvitationResult: [],

  setSearchResults: (searchResults: UserResponse[]) =>
    set({searchResults,}),

  setCountFriendInvitation: (countFriendInvitation: number) =>
    set({countFriendInvitation,}),

  setFriendInvitationResult: (friendInvitationResult: FriendRequestResponse[]) =>
     set({friendInvitationResult,}),

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

  getCountFriendInvitation: async () => {
    try {
      set({ loading: true });
      set({ error: null });

      const result: ApiResponse<number> = await userService.countFriendInvitation();
      if (result.code === 200) {
        set({ countFriendInvitation: result.data ?? 0});
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

  getFriendInvitation: async (): Promise<unknown> => {
     try {
          set({ loading: true });
          set({ error: null });
          const result = await userService.getFriendInvitation();
          if(result.code === 200 && result.data) {
            set({ friendInvitationResult: result.data ?? [] });
            return true;
          }
          throw result;
        } catch (error) {
         const errorResponse = error as ApiResponse<null>
          set({ error: errorResponse.message});
          return false
        } finally {
          set({ loading: false });
        }
      },

    getFriendStatus: async (status: FriendRequestStatus): Promise<unknown> => {
      try {
          set({ loading: true });
          set({ error: null });
          const result = await userService.getFriendStatus(status);
          if(result.code === 200 && result.data) {
            set({ friendInvitationResult: result.data ?? [] });
            return true;
          }
          throw result;
        } catch (error) {
         const errorResponse = error as ApiResponse<null>
          set({ error: errorResponse.message});
          return false
        } finally {
          set({ loading: false });
        }
    },

    removeFriend: async (friendId: string): Promise<ApiResponse<void>> => {
      try {
        set({ loading: true });
        set({ error: null });
        const result = await userService.removeFriend(friendId);
        return result;
      } catch (error) {
        const errorResponse = error as ApiResponse<void>;
        set({ error: errorResponse.message });
        return errorResponse;
      } finally {
        set({ loading: false });
      }
    }
}));
