import { useEffect, useRef } from "react"
import { User } from "lucide-react"

import { useConversationStore } from "../../store/conversationStore"
import { useMessageStore } from "../../store/messageStore"
import { useAuthStore } from "../../store/authStore"
export default function ChatConversation() {
  const selectedConversation = useConversationStore(
    (s) => s.selectedConversation
  )

  const currentUser = useAuthStore(
    (s) => s.user
  )

  const {
    messagePage,
    loading,
    loadmessages,
  } = useMessageStore()

  const messages = messagePage?.content ?? []

  const hasMore = messagePage?.hasMore ?? false
  const containerRef = useRef<HTMLDivElement>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages.length])
  const markConversationRead =useConversationStore(s => s.markConversationRead);

  // LOAD FIRST
  useEffect(() => {
    if (!selectedConversation?.conversationId) return
    markConversationRead(selectedConversation.conversationId);
    useConversationStore.getState().updateConversation(selectedConversation.conversationId)
    loadmessages({
      conversationId:
        selectedConversation.conversationId,
      size: 20,
    })
  }, [selectedConversation])

  // AUTO SCROLL BOTTOM
  useEffect(() => {
    const container =
      containerRef.current

    if (!container) return

    container.scrollTop =
      container.scrollHeight
  }, [selectedConversation])

  // LOAD MORE
  const handleScroll = async () => {
    const container = containerRef.current
    if (!container) return

    if (container.scrollTop <= 0 && hasMore && !loading) {
      const oldestMessage =
        messages[0]

      if (!oldestMessage) return

      const previousHeight = container.scrollHeight

      const success =
        await loadmessages({conversationId: selectedConversation!.conversationId, before: oldestMessage.createdAt, size: 20,}, true)

      if (success) {
        requestAnimationFrame(() => {
          const newHeight =
            container.scrollHeight
          container.scrollTop =
            newHeight - previousHeight
        })
      }
    }
  }

    // EMPTY
    if (!selectedConversation) {
      return (
        <div
          className="
            flex h-full w-full items-center
            justify-center

            bg-[#f4f6fb]
            dark:bg-[#0f172a]

            text-slate-400
          "
        >
          Chọn một cuộc trò chuyện
        </div>
      )
    }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="
        flex h-full w-full flex-col
        overflow-y-auto

        bg-[#f4f6fb]
        dark:bg-[#0f172a]

        px-4 py-4
      "
    >
      {/* LOADING */}
      {loading &&
        messages.length > 0 && (
          <div
            className="
              mb-4 text-center
              text-xs text-slate-400
            "
          >
            Đang tải tin nhắn...
          </div>
        )}

      {/* EMPTY MESSAGE */}
      {!loading &&
        messages.length === 0 && (
          <div
            className="
              flex flex-1 items-center
              justify-center

              text-slate-400
            "
          >
            Chưa có tin nhắn
          </div>
        )}

      {/* MESSAGE LIST */}
      <div
        className="
          flex w-full flex-col
          gap-2
        "
      >
        {messages.map(
          (message, index) => {
            const isMine =
              message.sender.id ===
              currentUser?.id

            const prevMessage =
              messages[index - 1]

            const showAvatar =
              !isMine &&
              (!prevMessage ||
                prevMessage.sender.id !==
                  message.sender.id)

            return (
              <div
                key={message.id}
                className={`
                  flex w-full items-end gap-2 px-2

                  ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }
                `}
              >
                
                {/* AVATAR */}
                {!isMine && (
                  
                  <div
                    className="
                      w-8 shrink-0
                    "
                  >
                    {showAvatar ? (
                      
                      message.sender
                        .avatar ? (
                        <img
                          src={
                            message.sender
                              .avatar
                          }
                          className="
                            h-8 w-8 rounded-full

                            border border-slate-200
                            dark:border-slate-700

                            object-cover
                          "
                        />
                        
                      ) : (
                        <div
                          className="
                            flex h-8 w-8
                            items-center
                            justify-center

                            rounded-full

                            border border-slate-200
                            dark:border-slate-700

                            bg-white
                            dark:bg-slate-800
                          "
                        >
                          <User
                            size={15}
                            className="
                              text-slate-500
                              dark:text-slate-300
                            "
                          />
                        </div>
                      )
                    ) : null}
                  </div>
                )}

                {/* BUBBLE */}
                <div
                  className={`
                    max-w-[75%] min-w-[120px]

                    px-4 py-2.5

                    text-[15px]
                    leading-relaxed

                    shadow-sm

                    ${
                      isMine
                        ? `
                          rounded-2xl
                          rounded-br-md

                          bg-[#0084ff]
                          text-white
                        `
                        : `
                          rounded-2xl
                          rounded-bl-md

                          bg-white
                          dark:bg-slate-800

                          text-slate-800
                          dark:text-white
                        `
                    }
                  `}
                >
                  {/* CONTENT */}
                  {!isMine && showAvatar && (
                  <div
                    className="
                      mb-1 text-[13px]
                      font-semibold

                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {message.sender.fullName}
                  </div>
                )}
                  <p
                    className="
                      whitespace-pre-wrap
                      break-words
                    "
                  >
                    {message.content}
                  </p>

                  {/* TIME */}
                  <div
                    className={`
                      mt-1 text-[10px]

                      ${
                        isMine
                          ? "text-cyan-100"
                          : `
                            text-slate-400
                            dark:text-slate-500
                          `
                      }
                    `}
                  >
                    {new Date(
                      message.createdAt
                    ).toLocaleTimeString(
                      [],
                      {
                        hour:
                          "2-digit",
                        minute:
                          "2-digit",
                      }
                    )}
                  </div>
                </div>
              </div>
            )
          }
        )}
        <div ref={bottomRef} />
      </div>
    </div >
  )
}