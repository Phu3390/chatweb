import { useEffect } from "react";
import toast from "react-hot-toast";

import { stompClient } from "../lib/socket";

import { useUserStore } from "../store/userStore";
import type { FriendRealtimeResponse, MessageResponse } from "../types/response/response.type";
import { useMessageStore } from "./messageStore";


type Props = {
  userId?: string;
};

type PropsMessage={
  conversationId?: string;
}

export const useFriendRealtime = ({
  userId,
}: Props) => {
  useEffect(() => {
    if (!userId) return;
    // if (stompClient.active) return;
    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/friend-request/${userId}`, (message) => {
          const data: FriendRealtimeResponse = JSON.parse(message.body);
          toast.success( `${data.sender.fullName} đã gửi lời mời kết bạn`);
          useUserStore.getState().getCountFriendInvitation();
        }
      );
    };
    stompClient.activate();
  }, [userId]);
};

export const useChatRealtime = ({ conversationId,}: PropsMessage) => {
  useEffect(() => {
    if (!conversationId) return
    console.log("connecting to chat realtime for conversationId:", conversationId);
    const subscription = stompClient.subscribe(`/topic/conversation/${conversationId}`, (message) => {
          const data: MessageResponse = JSON.parse(message.body)
          useMessageStore.getState().addMessage(data)
        }
      )
    return () => {
      subscription.unsubscribe()
    }
  }, [conversationId])
}