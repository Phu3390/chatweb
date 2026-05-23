import { create } from "zustand"
import type { MessageQuery, SendMessageRequest } from "../types/request/message.request"
import type { ApiResponse, PageResponse } from "../types/response/api.response"
import type { MessageResponse } from "../types/response/response.type"
import { messageService } from "../services/message.service"

type MessageState = {
    queryMessage: MessageQuery | null
    messages: MessageResponse[] 
    messagePage: PageResponse<MessageResponse[]> | null

    loading: boolean;
    error: string | null;

    setQueryMessage: (query: MessageQuery | null) => void;
    setMessagePage: (
        page: PageResponse<MessageResponse[]>
    ) => void




    setMessages: (messages: MessageResponse[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    loadmessages: (query: MessageQuery) => Promise<boolean>;
    prependMessages: (
        page: PageResponse<MessageResponse[]>
    ) => void

    addMessage: (
        message: MessageResponse
        ) => void
    sendMessage: (payload: SendMessageRequest) => Promise<MessageResponse>;
}

export const useMessageStore = create<MessageState>((set,get) => ({
    queryMessage: null,
    loading: false,
    error: null,
    messages: [],
    messagePage: null,

    setMessagePage: (messagePage) =>
    set({ messagePage }),
    setQueryMessage: (queryMessage) => set({queryMessage,}),
    setMessages: (messages) => set({ messages }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),

    clearMessages: () =>
      set({
        messagePage: null,
      }),
    
    prependMessages: (page) => set((state) => {
        if (!state.messagePage) {
        return {
            messagePage: page,
        }
        }
        return {
        messagePage: {
            ...page,
            content: [
            ...page.content,
            ...state.messagePage.content,
            ],
        },
        }
    }),


    loadmessages: async (query: MessageQuery,  append = false): Promise<boolean> => {
       try {
            set({ loading: true });
            set({ error: null });
            const result:ApiResponse<PageResponse<MessageResponse[]>> = await messageService.loadmessages(query);
            if (result.code !== 200 || !result.data) {
            throw result
            }
            if (append) {
                get().prependMessages(result.data)
                } else {
                get().setMessagePage(result.data)
                }

            return true

        } catch (error) {
            const errorResponse = error as ApiResponse<null>;
            set({ error: errorResponse.message });
            return false;
        } finally {
            set({ loading: false });
          }
    },

    addMessage: (message) => set((state) => {
        if (!state.messagePage) {
            return {
                messagePage: { content: [message],
                size: 20,
                returned: 1,
                cursor: null,
                nextCursor: null,
                hasMore: false,
                },
            }
        }
        return {
            messagePage: { ...state.messagePage, content: [...state.messagePage.content,message,], returned: state.messagePage.returned + 1,},
        }
    }),
    sendMessage: async (payload: SendMessageRequest): Promise<MessageResponse> => {
        try {
            set({ loading: true });
            set({ error: null });
            const result: ApiResponse<MessageResponse> = await messageService.sendMessage(payload);
            if (result.code !== 200 || !result.data) {
                throw result;
            }
            return result.data;
        } catch (error) {
            const errorResponse = error as ApiResponse<null>;
            set({ error: errorResponse.message });
            return errorResponse as unknown as MessageResponse;
        } finally {
            set({ loading: false });
        }
    }
}))
