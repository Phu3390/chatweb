import type {
  AddParticipantRequest,
  CreateConversationRequest,
} from "../types/request/conversation.request";
import type { ApiResponse } from "../types/response/api.response";
import type {
  ConversationResponse,
  ConversationSummaryResponse,
} from "../types/response/response.type";
import axiosClient from "./axios";

export const conversationService = {
  getMyConversations: async (): Promise<
    ApiResponse<ConversationSummaryResponse[]>
  > => {
    return axiosClient.get<ConversationSummaryResponse[]>("/conversations");
  },

  createConversation: async (
    payload: CreateConversationRequest,
  ): Promise<ApiResponse<ConversationResponse>> => {
    return axiosClient.post<ConversationResponse, CreateConversationRequest>(
      "/conversations",
      payload,
    );
  },

  addParticipant: async (
    payload: AddParticipantRequest,
  ): Promise<ApiResponse<void>> => {
    return axiosClient.post<void, AddParticipantRequest>(
      "/conversations/participants",
      payload,
    );
  },

  updateLastReadAt: async (conversationId: string): Promise<ApiResponse<void>> => {
    return axiosClient.put(`/conversations/lastreadat/${conversationId}`);
  },
};
