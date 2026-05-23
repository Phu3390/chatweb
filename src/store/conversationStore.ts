import { create } from "zustand"
import type { ConversationSummaryResponse } from "../types/response/response.type"
type ConversationState = {
    selectedConversation: ConversationSummaryResponse | null
    setSelectedConversation: (conversation?: ConversationSummaryResponse) => void
}


export const useConversationState = create<ConversationState>((set) => ({   

    selectedConversation: null,

    setSelectedConversation: (conversation) =>
        set({selectedConversation: conversation,}),
    
}))