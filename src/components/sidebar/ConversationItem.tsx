// components/sidebar/ConversationItem.tsx

import { User } from "lucide-react"
import { SidebarMenuButton } from "../ui/sidebar"
import { ConversationType } from "../../types/enums/enums.type"

import type { ConversationSummaryResponse } from "../../types/response/response.type"
import { useConversationState } from "../../store/conversationStore"

interface Props {
  conversation: ConversationSummaryResponse
}

export default function ConversationItem({ conversation }: Props) {
  const isPrivate = conversation.type === ConversationType.PRIVATE
    const setSelectedConversation = useConversationState(
    (s) => s.setSelectedConversation
  )


  const displayName = isPrivate
    ? conversation.targetUser?.fullName
    : conversation.name

  const avatar = isPrivate
    ? conversation.targetUser?.avatar
    : undefined

  return (
    <SidebarMenuButton
      className="
        relative h-16 rounded-2xl px-3

        border border-transparent
        transition-all duration-200

        /* ===== BASE (works both themes) ===== */
        text-sidebar-foreground

        /* ===== HOVER ===== */
        hover:bg-sidebar-accent/60
        hover:border-sidebar-border

        /* ===== ACTIVE ===== */
        data-[active=true]:bg-sidebar-accent
        data-[active=true]:border-sidebar-border
        data-[active=true]:text-sidebar-foreground
      "  onClick={() => setSelectedConversation(conversation)}
    >
      {/* AVATAR */}
      {avatar ? (
        <img
          src={avatar}
          className="
            h-11 w-11 rounded-2xl
            border border-sidebar-border
            object-cover
            shadow-sm
          "
        />
      ) : (
        <div
          className="
            flex h-11 w-11 items-center justify-center
            rounded-2xl

            bg-sidebar-accent
            border border-sidebar-border

            text-sidebar-foreground/70
          "
        >
          <User size={18} />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* NAME + BADGE */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="
              truncate text-[15px] font-semibold
              text-sidebar-foreground
            "
          >
            {displayName}
          </span>

          {conversation.unreadCount > 0 && (
            <div
              className="
                flex h-5 min-w-5 items-center justify-center
                rounded-full

                bg-cyan-500
                text-black

                px-1.5 text-[10px] font-bold

                shadow-[0_0_10px_rgba(34,211,238,0.4)]
              "
            >
              {conversation.unreadCount}
            </div>
          )}
        </div>

        {/* LAST MESSAGE */}
        {conversation.lastMessage && (
          <span
            className="
              truncate text-xs
              text-sidebar-foreground/60
            "
          >
            {conversation.lastMessage}
          </span>
        )}
      </div>
    </SidebarMenuButton>
  )
}