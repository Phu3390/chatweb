import { MoreHorizontal, User } from "lucide-react"
import { SidebarMenuButton } from "../ui/sidebar"
import { ConversationType } from "../../types/enums/enums.type"

import type { ConversationSummaryResponse } from "../../types/response/response.type"
import { useConversationState } from "../../store/conversationStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useUserStore } from "../../store/userStore"
import toast from "react-hot-toast"
import { useAuthStore } from "../../store/authStore"
import type { ApiResponse } from "../../types/response/api.response"

interface Props {
  conversation: ConversationSummaryResponse
}

export default function ConversationItem({ conversation }: Props) {
  const isPrivate = conversation.type === ConversationType.PRIVATE
  const setSelectedConversation = useConversationState((s) => s.setSelectedConversation)

  const displayName = isPrivate ? conversation.targetUser?.fullName : conversation.name
  const avatar = isPrivate ? conversation.targetUser?.avatar : undefined
  const { removeFriend } = useUserStore();

  const handleClickRemoveFriend = async (id: string) => {
      const result: ApiResponse<void> = await removeFriend(id)
      if(result.code === 200) {
        toast.success("Hủy kết bạn thành công");
        useAuthStore.getState().initAuth();
        return
      }
      toast.error(result.message);
  }

  return (
  <SidebarMenuButton
    className="
      group relative h-[72px] rounded-2xl px-3 py-2

      border border-transparent
      transition-all duration-200

      text-sidebar-foreground

      hover:bg-sidebar-accent/60
      hover:border-sidebar-border

      data-[active=true]:bg-sidebar-accent
      data-[active=true]:border-sidebar-border
      data-[active=true]:shadow-sm
    "
    onClick={() => setSelectedConversation(conversation)}
  >
    {/* AVATAR */}
    <div className="relative shrink-0">
      {avatar ? (
        <img
          src={avatar}
          className="
            h-12 w-12 rounded-full
            object-cover
            border border-sidebar-border
          "
        />
      ) : (
        <div
          className="
            flex h-12 w-12 items-center justify-center
            rounded-full

            bg-sidebar-accent
            border border-sidebar-border

            text-sidebar-foreground/70
          "
        >
          <User size={18} />
        </div>
      )}

      {/* ONLINE DOT */}
      {/* <div
        className="
          absolute bottom-0 right-0
          h-3.5 w-3.5 rounded-full
          border-2 border-sidebar
          bg-emerald-500
        "
      /> */}
    </div>

    {/* CONTENT */}
    <div className="ml-3 flex min-w-0 flex-1 flex-col justify-center">
      
      {/* TOP ROW */}
      <div className="flex items-center gap-2">
        
        {/* NAME */}
        <span
          className="
            truncate
            text-[15px]
            font-semibold
            text-sidebar-foreground
          "
        >
          {displayName}
        </span>

        {/* UNREAD */}
        {conversation.unreadCount > 0 && (
          <div
            className="
              flex h-5 min-w-5 items-center justify-center
              rounded-full
              bg-cyan-500
              px-1.5

              text-[10px]
              font-bold
              text-white
            "
          >
            {conversation.unreadCount}
          </div>
        )}

        {/* PUSH MENU TO RIGHT */}
        <div className="flex-1" />

        {/* MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="
                opacity-0
                transition-all

                group-hover:opacity-100

                flex h-8 w-8 items-center justify-center
                rounded-lg

                hover:bg-sidebar-accent
              "
            >
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
              w-44
              border-sidebar-border
              bg-sidebar
            "
          >
            {isPrivate ? (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClickRemoveFriend(
                      conversation.targetUser?.id || ""
                    )
                  }}
                >
                  Hủy kết bạn
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Rời nhóm")
                  }}
                >
                  Rời nhóm
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Xem thành viên")
                  }}
                >
                  Xem thành viên
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* LAST MESSAGE */}
      <div
        className="
          mt-1
          truncate
          text-sm
          text-sidebar-foreground/60
        ">
        {conversation.lastMessage || "Chưa có tin nhắn"}
      </div>
    </div>
  </SidebarMenuButton>
)
}