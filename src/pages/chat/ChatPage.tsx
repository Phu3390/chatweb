import { useEffect, useRef } from "react";
import ChatLayout from "../../layouts/ChatLayout";
import { useAuthStore } from "../../store/authStore";
import Loading from "../../components/common/Loading";
import {  useConversationStore } from "../../store/conversationStore";
import { useUserStore } from "../../store/userStore";
import ChatConversation from "../../components/chat/ChatConversation";
import { useSocketRealtime } from "../../store/useSocketRealtime";
import { toast } from "react-hot-toast";

export default function ChatPage() {
  const user = useAuthStore((state) => state.user)
  const { countFriendInvitation, getCountFriendInvitation} = useUserStore();
  const conversations = useConversationStore((state) => state.conversations)
  const loading = useAuthStore((state) => state.loading)
  const selectedConversation = useConversationStore((s) => s.selectedConversation)
   const setSelectedConversation = useConversationStore((s) => s.setSelectedConversation)
  const hasShownToast = useRef(false);
  useEffect(() => {
    const init = async () => {
        await useAuthStore.getState().initAuth()
        await useConversationStore.getState().loadConversations()
        await getCountFriendInvitation()}
      setSelectedConversation(undefined)
    init()
       if (!user) return;
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("oauth");
    if (success === "true" && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.success("Đăng nhập thành công!");
    }
  }, [location.search]);

  useSocketRealtime(selectedConversation?.conversationId)

  if (loading || !user) {
    return (
      <Loading />
    )
  }

  return (
   <ChatLayout
      conversations={conversations}
      user={user}
      headerName={
        selectedConversation?.type === "GROUP"
          ? selectedConversation.name
          : selectedConversation?.targetUser?.fullName
      }
      headerAvatar={
        selectedConversation?.type === "GROUP"
          ? selectedConversation.avatarGroup
          : selectedConversation?.targetUser?.avatar
      }
      countFriendInvitation={countFriendInvitation}
    >
      <div
      className="
        flex h-full flex-1
        min-h-0
      "
    >
        {/* Select a conversation */}
         <ChatConversation />
      </div>
    </ChatLayout>
  )
}