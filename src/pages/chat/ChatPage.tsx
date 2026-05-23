import { useEffect } from "react";
import ChatLayout from "../../layouts/ChatLayout";
import { useAuthStore } from "../../store/authStore";
import Loading from "../../components/common/Loading";
import { useConversationState } from "../../store/conversationStore";
import { useUserStore } from "../../store/userStore";
import { useFriendRealtime } from "../../store/useFriendRealtime";
import ChatConversation from "../../components/chat/ChatConversation";

export default function ChatPage() {
  const user = useAuthStore((state) => state.user)
  const { countFriendInvitation, getCountFriendInvitation} = useUserStore();
  const conversations = useAuthStore((state) => state.conversations)
  const loading = useAuthStore((state) => state.loading)
  const selectedConversation = useConversationState((s) => s.selectedConversation)
   const setSelectedConversation = useConversationState((s) => s.setSelectedConversation)
  useEffect(() => {
    const init = async () => {
        await useAuthStore.getState().initAuth()
        await getCountFriendInvitation()}
      setSelectedConversation(undefined)
    init()
       if (!user) return;
  }, [])

  useFriendRealtime({userId: user?.id})

  if (loading || !user) {
    return (
      <Loading />
    )
  }

  return (
    <ChatLayout conversations={conversations} user={user} headerName={selectedConversation?.targetUser?.fullName}
    headerAvatar={selectedConversation?.targetUser?.avatar} countFriendInvitation={countFriendInvitation}>
      <div className="flex h-full items-center justify-center text-slate-400">
        {/* Select a conversation */}
         <ChatConversation />
      </div>
    </ChatLayout>
  )
}