import { create } from "zustand";
import type { ConversationSummaryResponse } from "../types/response/response.type";
import { conversationService } from "../services/conversation.service";
import type { ApiResponse } from "../types/response/api.response";
type ConversationState = {
  selectedConversation: ConversationSummaryResponse | null;
  conversations: ConversationSummaryResponse[];
  loading: boolean;
  error: string | null;

  setSelectedConversation: (conversation?: ConversationSummaryResponse) => void;
  setConversations: (conversations: ConversationSummaryResponse[]) => void;

  markConversationRead: (conversationId: string) => void;

  updateConversation: (conversationId: string) => void;
  loadConversations: () => Promise<void>;
  clearConversationState: () => void;
  onConversationRealtime: (conversation: ConversationSummaryResponse) => void
};

export const useConversationStore = create<ConversationState>((set) => ({
  selectedConversation: null,
  conversations: [],
  loading: false,
  error: null,

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
      set({loading: false,});
    }
  },
  clearConversationState: () => set({ selectedConversation: null, conversations: [], loading: false, error: null }),
   
  onConversationRealtime: (realtimeConversation) => {
    set((state) => {const conversations = [...state.conversations,]

    const index = conversations.findIndex((c) =>
              c.conversationId ===realtimeConversation.conversationId)
    const isOpening = state.selectedConversation?.conversationId === realtimeConversation.conversationId
    if (index === -1) {
      return {conversations: [{
            ...realtimeConversation,
            unreadCount:
            isOpening ? 0 : realtimeConversation.unreadCount,}, ...conversations,],
            }
          }

    const oldConversation = conversations[index]
    const updatedConversation = {...oldConversation,
      lastMessage:
        realtimeConversation.lastMessage,
      lastMessageAt:
        realtimeConversation.lastMessageAt,
      lastSenderId:
        realtimeConversation.lastSenderId,
      lastSenderName:
        realtimeConversation.lastSenderName,
      unreadCount:
        isOpening
          ? 0
          : realtimeConversation.unreadCount,
    }
    conversations.splice(index, 1)
    conversations.unshift(updatedConversation)
    return {conversations,}
      })
    },
    

    updateConversation: (conversationId: string): Promise<ApiResponse<void>> => {
      try {
        const result : Promise<ApiResponse<void>> = conversationService.updateLastReadAt(conversationId)
        return result
      }catch (error) {
        const errorResponse = error as ApiResponse<null>;
        set({ error: errorResponse.message });
        return Promise.reject(errorResponse)
      }
    },

    markConversationRead: (conversationId: string) =>set((state) => ({conversations: state.conversations.map((c) =>
                c.conversationId === conversationId ? { ...c, unreadCount: 0,} : c ),})),
}));
