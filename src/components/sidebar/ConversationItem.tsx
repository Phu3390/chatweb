import { MoreHorizontal, User } from "lucide-react"
import { SidebarMenuButton } from "../ui/sidebar"
import { ConversationType, MessageType } from "../../types/enums/enums.type"

import type { ConversationSummaryResponse } from "../../types/response/response.type"
import {  useConversationStore } from "../../store/conversationStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useUserStore } from "../../store/userStore"
import toast from "react-hot-toast"
import type { ApiResponse } from "../../types/response/api.response"
import GroupParticipantsDialog from "../dialog/GroupParticipantsDialog"
import { useState } from "react"
import AddMemberDialog from "../dialog/AddMemberDialog"
import UpdateGroupDialog from "../dialog/UpdateGroupDialog"

interface Props {
  conversation: ConversationSummaryResponse
}

export default function ConversationItem({ conversation }: Props) {
  const isPrivate = conversation.type === ConversationType.PRIVATE

  const displayName = isPrivate ? conversation.targetUser?.fullName : conversation.name
  const avatar = isPrivate ? conversation.targetUser?.avatar : conversation.avatarGroup
  const [openMembers, setOpenMembers] = useState(false);
  const handleOpenMembers = () => {
      setOpenMembers(true);
  }

  const [openFriendNotInGroup, setOpenFriendNotInGroup] = useState(false);
  const handleOpenFriendNotInGroup = () => {
      setOpenFriendNotInGroup(true);
  }

    const [openUpdateGroupInfo, setOpenUpdateGroupInfo] = useState(false);
  const handleOpenUpdateGroupInfo = () => {
      setOpenUpdateGroupInfo(true);
  }
  const {leaveConversationGroup, setSelectedConversation, loadConversations, removeGroupChat} = useConversationStore();

  const isAdmin = conversation.role === "ADMIN";

  const { removeFriend } = useUserStore();

  const handleRemoveGroupChat = async () => {
    try {
        await removeGroupChat(conversation.conversationId);
        await loadConversations();
        toast.success("Xóa nhóm chat thành công");
    } catch (error) {
        const err = error as ApiResponse<void>;
        toast.error(err.message);
    }
  }

  const handleLeaveGroup = async () => {
    try {
        await leaveConversationGroup(conversation.conversationId);
        toast.success("Rời nhóm thành công");
        await loadConversations();
    } catch (error) {
        const err = error as ApiResponse<void>;
        toast.error(err.message);
    }
  }

  const handleClickRemoveFriend = async (id: string) => {
      const result: ApiResponse<void> = await removeFriend(id)
      if(result.code === 200) {
        toast.success("Hủy kết bạn thành công");
        await loadConversations();
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
    <GroupParticipantsDialog
      open={openMembers}
      onOpenChange={setOpenMembers}
    />
    <AddMemberDialog
      open={openFriendNotInGroup}
      onOpenChange={setOpenFriendNotInGroup}
    />
    <UpdateGroupDialog
      open={openUpdateGroupInfo}
      onOpenChange={setOpenUpdateGroupInfo}
    />


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
           {conversation.unreadCount > 5 ? "5+"  : conversation.unreadCount}
          </div>
        )}

        {/* PUSH MENU TO RIGHT */}
        <div className="flex-1" />

        {/* MENU */}
        <DropdownMenu onOpenChange={(open) => { if (open) {setSelectedConversation(conversation);}}}>
          <DropdownMenuTrigger asChild>
            <button
              className="
                opacity-100
                transition-all

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
                    handleLeaveGroup()
                  }}
                >
                  Rời nhóm
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenMembers();
                  }}
                >
                  Xem thành viên
                </DropdownMenuItem>
                {isAdmin && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenFriendNotInGroup();
                  }}
                >
                  Thêm thành viên
                </DropdownMenuItem>
                )}
                {isAdmin && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenUpdateGroupInfo();
                  }}
                >
                  Sửa thông tin nhóm
                </DropdownMenuItem>
                )}
                 {isAdmin && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveGroupChat();
                  }}
                >
                  Giải tán nhóm
                </DropdownMenuItem>
                )}
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
          {conversation.lastMessageType === MessageType.IMAGE
          ? "📷 Ảnh"
          : conversation.lastMessage || "Chưa có tin nhắn"}
      </div>
    </div>
  </SidebarMenuButton>
)
}