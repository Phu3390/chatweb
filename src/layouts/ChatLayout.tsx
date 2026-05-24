import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import { AppSidebar } from "../components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import type { ConversationSummaryResponse, UserResponse } from "../types/response/response.type";

interface Props {
  conversations: ConversationSummaryResponse[]
  children: React.ReactNode
  user: UserResponse


  headerName?: string
  headerAvatar?: string

  countFriendInvitation?: number
}

export default function ChatLayout({conversations, user, children, headerName, headerAvatar, countFriendInvitation}: Props) {
  return (
  <SidebarProvider>
    <div className="flex h-screen w-full overflow-hidden">

      <AppSidebar conversations={conversations} user={user} />

      <SidebarInset className="flex flex-1 flex-col min-w-0">

        {/* HEADER */}
        <div className="shrink-0">
          <ChatHeader
            name={headerName}
            avatar={headerAvatar}
            countFriendInvitation={countFriendInvitation}
          />
        </div>

        {/* CONTENT */}
        <main className="flex flex-1 flex-col overflow-hidden min-h-0">
          {children}
         
        </main>

        {/* INPUT */}
        {headerName && (
          <div className="shrink-0">
            <ChatInput />
          </div>
        )}

      </SidebarInset>
    </div>
  </SidebarProvider>
  )
}