import { create } from "zustand";
import type {
  ConversationResponse,
  ConversationSummaryResponse,
  ParticipantResponse,
  UserResponse,
} from "../types/response/response.type";
import { conversationService } from "../services/conversation.service";
import type { ApiResponse } from "../types/response/api.response";
import type { AddParticipantRequest, CreateConversationRequest, UpdateConversationRequest,  } from "../types/request/conversation.request";
type ConversationState = {
  selectedConversation: ConversationSummaryResponse | null;
  conversations: ConversationSummaryResponse[];
  loading: boolean;
  error: string | null;
  participantResponses: ParticipantResponse[];

  friendsNotInGroup: UserResponse[];

  setSelectedConversation: (conversation?: ConversationSummaryResponse) => void;
  setConversations: (conversations: ConversationSummaryResponse[]) => void;

  markConversationRead: (conversationId: string) => void;

  createConversation: (
    req: CreateConversationRequest,
  ) => Promise<ApiResponse<ConversationResponse>>;
  updateConversation: (conversationId: string) => void;
  loadConversations: () => Promise<void>;
  clearConversationState: () => void;
  onConversationRealtime: (conversation: ConversationSummaryResponse) => void;
  getConversationParticipants: (conversationId: string,) => Promise<ApiResponse<ParticipantResponse[]>>;
  leaveConversationGroup: (conversationId: string) => Promise<ApiResponse<void>>;
  kickMemberGroup: (conversationId: string, userId: string) => Promise<ApiResponse<void>>;
  setRoleAdmin: (conversationId: string, userId: string) => Promise<ApiResponse<void>>;
  getFriendsNotInGroup: (conversationId: string) => Promise<ApiResponse<UserResponse[]>>;
  updateGroupInfo: (conversationId: string, info: UpdateConversationRequest) => Promise<ApiResponse<void>>;
  removeGroupChat: (conversationId: string) => Promise<ApiResponse<void>>;
};

export const useConversationStore = create<ConversationState>((set) => ({
  participantResponses: [],
  selectedConversation: null,
  conversations: [],
  loading: false,
  error: null,
  friendsNotInGroup: [],

  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),

  setConversations: (conversations) => set({ conversations }),

  loadConversations: async () => {
    try {
      set({
        loading: true,
      });

      const res = await conversationService.getMyConversations();

      if (res.code === 200 && res.data) {
        set({
          conversations: res.data,
        });
      }
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
    } finally {
      set({ loading: false });
    }
  },

  
  clearConversationState: () =>
    set({
      selectedConversation: null,
      conversations: [],
      loading: false,
      error: null,
    }),

  onConversationRealtime: (realtimeConversation) => {
    set((state) => {
      const conversations = [...state.conversations];

      const index = conversations.findIndex(
        (c) => c.conversationId === realtimeConversation.conversationId,
      );
      const isOpening =
        state.selectedConversation?.conversationId ===
        realtimeConversation.conversationId;
      if (index === -1) {
        return {
          conversations: [
            {
              ...realtimeConversation,
              unreadCount: isOpening ? 0 : realtimeConversation.unreadCount,
            },
            ...conversations,
          ],
        };
      }

      const oldConversation = conversations[index];
      const updatedConversation = {
        ...oldConversation,
        lastMessage: realtimeConversation.lastMessage,
        lastMessageAt: realtimeConversation.lastMessageAt,
        lastSenderId: realtimeConversation.lastSenderId,
        lastSenderName: realtimeConversation.lastSenderName,
        unreadCount: isOpening ? 0 : realtimeConversation.unreadCount,
      };
      conversations.splice(index, 1);
      conversations.unshift(updatedConversation);
      return { conversations };
    });
  },

  updateConversation: (conversationId: string): Promise<ApiResponse<void>> => {
    try {
      const result: Promise<ApiResponse<void>> =
        conversationService.updateLastReadAt(conversationId);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }
  },

  markConversationRead: (conversationId: string) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.conversationId === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    })),
    
  createConversation: async (
    req: CreateConversationRequest,
  ): Promise<ApiResponse<ConversationResponse>> => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.createConversation(req);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }finally {
      set({ loading: false });
    }
  },
  getConversationParticipants: async (conversationId: string,) => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.getConversationParticipants(conversationId);
      if(result.code === 200 && result.data){
        set({ participantResponses: result.data });
      }
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }
    finally {
      set({ loading: false });
    }
  },
  leaveConversationGroup: async (conversationId: string) => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.leaveConversationGroup(conversationId);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }
    finally {
      set({ loading: false });
    }
  },
  kickMemberGroup: async (conversationId: string, userId: string) => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.kickMemberGroup(conversationId, userId);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }
    finally {
      set({ loading: false });
    }
  },
  setRoleAdmin: async (conversationId: string, userId: string) => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.setRoleAdmin(conversationId, userId);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }finally {
      set({ loading: false });
    } 
  },
  getFriendsNotInGroup: async (conversationId: string) => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.getFriendsNotInGroup(conversationId);
      if(result.code === 200 && result.data){
        set({ friendsNotInGroup: result.data });
      }
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }finally {
      set({ loading: false });
    }
  },
  addParticipant: async (payload: AddParticipantRequest[], conversationId: string) => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.addParticipant(payload, conversationId);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }finally {
      set({ loading: false });
    }
  },
  updateGroupInfo: async (conversationId: string, info: UpdateConversationRequest) => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.updateGroupInfo(conversationId, info);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }finally {
      set({ loading: false });
    }
  },
  removeGroupChat: async (conversationId: string) => {
    try {
      set({ loading: true });
      set({ error: null });
      const result = await conversationService.removeGroupChat(conversationId);
      return result;
    } catch (error) {
      const errorResponse = error as ApiResponse<null>;
      set({ error: errorResponse.message });
      return Promise.reject(errorResponse);
    }finally {
      set({ loading: false });
    }
  },
}));
