import type { MessageQuery, SendMessageRequest } from "../types/request/message.request";
import type { ApiResponse, PageResponse } from "../types/response/api.response";
import type { MessageResponse } from "../types/response/response.type";
import { axiosClient } from "./axios";

export const messageService = {

    loadmessages: async (payload: MessageQuery): Promise<ApiResponse<PageResponse<MessageResponse[]>>> => {
         return axiosClient.get<PageResponse<MessageResponse[]>>("/message/loadmessages",  payload)
      },

    sendMessage: async (payload: SendMessageRequest): Promise<ApiResponse<MessageResponse>> => {
        return axiosClient.post<MessageResponse>("/message/send", payload)
    }
      
}