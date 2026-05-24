import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar"

import ThemeToggle from "../providers/ThemeToggle"
import ConversationItem from "../sidebar/ConversationItem"
import { LogOut, Plus, User } from "lucide-react"
import { ConversationType } from "../../types/enums/enums.type"
import { useAuthStore } from "../../store/authStore"
import FriendSearchDialog from "../dialog/FriendSearchDialog"
import { useState } from "react"
import { useConversationStore } from "../../store/conversationStore"
import UserProfileDialog from "../dialog/UserProfileDialog"

export function AppSidebar() {
  const {conversations} = useConversationStore()
  const { logout, user } = useAuthStore()

  const [openProfile, setOpenProfile] = useState(false);
  const handleOpenProfile = () => {
    setOpenProfile(true);
  }

  const [openSearch, setOpenSearch] = useState(false);
  const handleOpenSearch = () => {
      setOpenSearch(true);
  }
  return (
    
    <Sidebar
      collapsible="offcanvas"
      className="
        border-r order-white/10

        bg-slate-100 text-slate-900
        dark:bg-[#0f172a] dark:text-white
      "
    >
      
      <FriendSearchDialog open={openSearch} onOpenChange={setOpenSearch}/>
      <UserProfileDialog open={openProfile} onOpenChange={setOpenProfile}/>

      {/* HEADER */}
      <SidebarHeader
        className="
          border-b border-white/10

          bg-white/70 backdrop-blur-md
          dark:bg-[#111827]
        "
      >
        <div className="flex items-center justify-between">
          <h3
            className="
              bg-gradient-to-r from-cyan-400 to-blue-500
              bg-clip-text text-lg font-extrabold text-transparent
            "
          >
            ChatWeb
          </h3>

          <ThemeToggle />
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent
           className="
          bg-slate-100
          dark:bg-[#0f172a]
        ">
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>

        {/* ===== GROUP CHAT ===== */}
        <div className="mb-2 mt-2 flex items-center justify-between px-2">
          <span className="text-xs font-semibold uppercase text-sidebar-foreground/60">
            Nhóm
          </span>

          <button
            className="
              flex h-6 w-6 items-center justify-center
              rounded-md

              bg-sidebar-accent
              hover:bg-sidebar-accent/80

              text-sidebar-foreground/70
              hover:text-sidebar-foreground

              transition
            "
          >
            <Plus size={14} />
          </button>
        </div>

        {conversations
          .filter(c => c.type === ConversationType.GROUP)
          .map((conversation) => (
            <SidebarMenuItem key={conversation.conversationId}>
              <ConversationItem conversation={conversation} />
            </SidebarMenuItem>
          ))}

        {/* ===== FRIENDS ===== */}
        <div className="mb-2 mt-6 flex items-center justify-between px-2">
          <span className="text-xs font-semibold uppercase text-sidebar-foreground/60">
            Bạn bè
          </span>

          <button
            className="
              flex h-6 w-6 items-center justify-center
              rounded-md
              bg-sidebar-accent
              hover:bg-sidebar-accent/80
              text-sidebar-foreground/70
              hover:text-sidebar-foreground
              transition" onClick={handleOpenSearch}
          >
            <Plus size={14} />
          </button>
        </div>

        {conversations
          .filter(c => c.type === ConversationType.PRIVATE)
          .map((conversation) => (
            <SidebarMenuItem key={conversation.conversationId}>
              <ConversationItem conversation={conversation} />
            </SidebarMenuItem>
          ))}

      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</SidebarContent>

      {/* FOOTER */}
<SidebarFooter
  className="
    border-t border-white/10

    bg-slate-100/80 backdrop-blur-md
    dark:bg-[#111827]
  "
>
  {user && (
    <div
      className="
        flex items-center justify-between
        p-3
        rounded-xl

        hover:bg-black/5
        dark:hover:bg-white/5

        transition
      "
    >
      {/* LEFT: USER INFO */}
      <div onClick={handleOpenProfile} className="flex items-center gap-3 min-w-0">
        {/* AVATAR */}
        {user.avatar ? (
          <img
            src={user.avatar}
            className="
              h-10 w-10
              rounded-xl
              object-cover
              border border-white/10
            "
          />
        ) : (
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl

              bg-white/40 dark:bg-white/5
              border border-white/10

              text-slate-700 dark:text-white/60
            "
          >
            <User size={18} />
          </div>
        )}

        {/* NAME */}
        <span
          
          className="
            text-sm font-semibold
            text-slate-900 dark:text-white
            truncate
          "
        >
          {user.fullName}
        </span>
      </div>

      {/* RIGHT: LOGOUT */}
      <button
        onClick={() => logout?.()}
        className="
          flex h-9 w-9 items-center justify-center

          rounded-lg
          hover:bg-red-500/10
          text-slate-600
          dark:text-white/60

          hover:text-red-500
          transition
        "
      >
        <LogOut size={18} />
      </button>
    </div>
  )}
      </SidebarFooter>
    </Sidebar>
  )
}