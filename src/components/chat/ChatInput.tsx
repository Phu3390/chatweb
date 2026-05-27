import { Send,ImagePlus, Loader2 } from "lucide-react"
import { useMessageStore } from "../../store/messageStore"
import type { SendMessageRequest } from "../../types/request/message.request";
import { MessageType } from "../../types/enums/enums.type";
import { useConversationStore } from "../../store/conversationStore";
import { useState } from "react";
import { useRef } from "react";
import { useUserStore } from "../../store/userStore";


export default function ChatInput() {
  const {sendMessage,} = useMessageStore();
  const {selectedConversation} = useConversationStore()
  const [content, setContent] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, loading } = useUserStore();

  const handleSendImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file || !selectedConversation) return;
    try {
      const uploadResult = await uploadImage(file);
      if (
        uploadResult.code !== 200 ||
        !uploadResult.data
      ) {
        return;
      }
      await sendMessage({
        conversationId:
          selectedConversation.conversationId,
        content: uploadResult.data.url,
        messageType: MessageType.IMAGE,
      });
    } finally {
      e.target.value = "";
    }
  };

  const handleSendMessage = async () => {
    if(!selectedConversation) return
    if(content.trim() === "") return
    const payload: SendMessageRequest = {
      conversationId: selectedConversation?.conversationId,
      content: content,
      messageType: MessageType.TEXT
    }
    try {
      await sendMessage(payload)
      setContent("")
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }
  return (
    <div
      className="
        border-t
        border-slate-200
        bg-white
        p-3

        dark:border-white/10
        dark:bg-[#0f172a]
      "
    >
      <div
        className="
          flex items-center gap-3
          rounded-xl
          border

          border-slate-200
          bg-slate-100

          px-4

          dark:border-white/10
          dark:bg-[#111b24]
        "
      >
        <input
          placeholder="Nhập tin nhắn..."
          className="
            h-14 flex-1
            bg-transparent
            outline-none

            text-slate-900
            placeholder:text-slate-400

            dark:text-white
            dark:placeholder:text-white/40
          "
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl

            bg-cyan-400
            text-black

            transition
            hover:scale-105
            hover:bg-cyan-300
          "
          onClick={handleSendMessage}
        >
          
          <Send size={18} />
        </button>
          <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleSendImage}
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl
            text-cyan-400
            transition
            hover:bg-slate-200
            disabled:opacity-50
            disabled:cursor-not-allowed
            dark:hover:bg-white/10
          "
        >
          {loading ? (
            <Loader2
              size={20}
              className="animate-spin"
            />
          ) : (
            <ImagePlus size={20} />
          )}
        </button>
      </div>
    </div>
  )
}