import type {
  AddParticipantRequest,
  CreateConversationRequest,
  UpdateConversationRequest,
} from "../types/request/conversation.request";
import type { ApiResponse } from "../types/response/api.response";
import type {
  ConversationResponse,
  ConversationSummaryResponse,
  ParticipantResponse,
  UserResponse,
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

  addParticipant: async (payload: AddParticipantRequest[], conversationId: string): Promise<ApiResponse<void>> => {
    return axiosClient.post<void>(`/conversations/addGroup/${conversationId}`,payload, );
  },

  updateLastReadAt: async (conversationId: string): Promise<ApiResponse<void>> => {
    return axiosClient.put(`/conversations/lastreadat/${conversationId}`);
  },

  getConversationParticipants: async (conversationId: string,): Promise<ApiResponse<ParticipantResponse[]>> => {
    return axiosClient.get<ParticipantResponse[]>(`/conversations/${conversationId}`);
  },

  leaveConversationGroup: async (conversationId: string): Promise<ApiResponse<void>> => {
    return axiosClient.delete(`/conversations/leavegroup/${conversationId}`);
  },
  
  kickMemberGroup: async (conversationId: string, userId: string): Promise<ApiResponse<void>> => {
    return axiosClient.delete(`/conversations/kick/${conversationId}/${userId}`);
  },
  setRoleAdmin: async (conversationId: string, userId: string): Promise<ApiResponse<void>> => {
    return axiosClient.put(`/conversations/setroleadmin/${conversationId}/${userId}`);
  },
  getFriendsNotInGroup: async (conversationId: string): Promise<ApiResponse<UserResponse[]>> => {
    return axiosClient.get<UserResponse[]>(`/conversations/friendnotingroup/${conversationId}`);
  },
  updateGroupInfo: async (conversationId: string, info: UpdateConversationRequest): Promise<ApiResponse<void>> => {
    return axiosClient.put(`/conversations/updategroup/${conversationId}`, info);
  },
  removeGroupChat: async (conversationId: string): Promise<ApiResponse<void>> => {
    return axiosClient.delete(`/conversations/removegroup/${conversationId}`);
  },
};
