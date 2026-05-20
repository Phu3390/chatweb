import { useEffect } from "react";
import ChatLayout from "../../layouts/ChatLayout";
import { useAuthStore } from "../../store/authStore";
import Loading from "../../components/common/Loading";
import { useConversationState } from "../../store/conversationStore";
import { useUserStore } from "../../store/userStore";

export default function ChatPage() {
  const user = useAuthStore((state) => state.user)

  const countFriendInvitation = useUserStore((state) => state.countFriendInvitation)

  const conversations = useAuthStore(
    (state) => state.conversations
  )
  const loading = useAuthStore((state) => state.loading)
  const selectedConversation = useConversationState(
  (s) => s.selectedConversation
)

  useEffect(() => {
    const init = async () => {
        await useAuthStore.getState().initAuth()
      }
    init()
  }, [])

  if (loading || !user) {
    return (
      <Loading />
    )
  }

  return (
    <ChatLayout conversations={conversations} user={user} headerName={selectedConversation?.targetUser?.fullName}
    headerAvatar={selectedConversation?.targetUser?.avatar} countFriendInvitation={countFriendInvitation}>
      <div className="flex h-full items-center justify-center text-slate-400">
        Select a conversation
      </div>
    </ChatLayout>
  )
}