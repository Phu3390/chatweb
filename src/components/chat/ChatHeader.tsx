import { useState } from "react"
import FriendInvitationDialog from "../dialog/FriendInvitationDialog"
import { SidebarTrigger } from "../ui/sidebar"
import { Bell, User } from "lucide-react"
import { useUserStore } from "../../store/userStore"

interface Props {
  name?: string
  avatar?: string

  countFriendInvitation?: number
}

export default function ChatHeader({
  name,
  avatar,
  countFriendInvitation,
}: Props) {
   const [openSearch, setOpenSearch] = useState(false);
    const handleOpenSearch = () => {
      useUserStore.getState().getFriendInvitation();
      setOpenSearch(true);
    }
  return (
    <header className="flex h-16 items-center border-b border-border px-4">

      {/* DIALOGS */}
      <FriendInvitationDialog open={openSearch} onOpenChange={setOpenSearch}/>
      
      {/* LEFT */}
      <div className="flex items-center gap-3 flex-1">
        <SidebarTrigger />

        {name ? (
          <div className="flex items-center gap-3">
            {avatar ? (
              <img
                src={avatar}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                <User size={18} />
              </div>
            )}

            <h2 className="text-sm md:text-base font-semibold truncate text-slate-900 dark:text-white">
              {name}
            </h2>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#111b24] transition"
          onClick={handleOpenSearch}>
          <Bell size={18} />

      {countFriendInvitation && countFriendInvitation > 0 ? (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
          {countFriendInvitation}
        </span>
      ) : null }
        </button>
      </div>

    </header>
  )
}