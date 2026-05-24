import { useEffect } from "react";

import toast from "react-hot-toast";

import { stompClient } from "../lib/socket";

import { useAuthStore } from "./authStore";

import { useUserStore } from "./userStore";

import { useConversationStore } from "./conversationStore";

import { useMessageStore } from "./messageStore";

import type {
  ConversationSummaryResponse,
  FriendRealtimeResponse,
  MessageResponse,
} from "../types/response/response.type";

export const useSocketRealtime = (conversationId?: string) => {
  const user = useAuthStore((s) => s.user);

  const onConversationRealtime = useConversationStore(
    (s) => s.onConversationRealtime,
  );

  useEffect(() => {
    if (!user) return;

    if (stompClient.active) return;

    stompClient.onConnect = () => {
      console.log("SOCKET CONNECTED");

      // FRIEND REQUEST
      stompClient.subscribe(`/topic/friend-request/${user.id}`, (message) => {
        const data: FriendRealtimeResponse = JSON.parse(message.body);
        toast.success(`${data.sender.fullName} đã gửi lời mời kết bạn`);
        useUserStore.getState().getCountFriendInvitation();
      });
      
      stompClient.subscribe(`/topic/conversations/${user.id}`, (message) => {
        const data: ConversationSummaryResponse = JSON.parse(message.body);
        console.log("Received conversation realtime:", data);
        onConversationRealtime(data);
      });

      if (conversationId) {
        stompClient.subscribe(
          `/topic/conversation/${conversationId}`,
          (message) => {
            const data: MessageResponse = JSON.parse(message.body);
            useMessageStore.getState().addMessage(data);
          },
        );
      }
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [user?.id, conversationId]);
};
