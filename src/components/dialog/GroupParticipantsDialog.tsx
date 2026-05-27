import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { MoreVertical, User } from "lucide-react";

import { useConversationStore } from "../../store/conversationStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../types/response/api.response";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function GroupParticipantsDialog({
  open,
  onOpenChange,
}: Props) {
  const {
    participantResponses,
    getConversationParticipants,
    loading,
    selectedConversation,
    kickMemberGroup,
    setRoleAdmin,
  } = useConversationStore();

  const {user} = useAuthStore();
  const myParticipant = participantResponses.find(p => p.userId === user?.id);

  const isAdmin = myParticipant?.role === "ADMIN";

  const handleKickMember = async (userId: string) => {
    if (!selectedConversation) return;
    try{
      await kickMemberGroup(selectedConversation.conversationId, userId);
      getConversationParticipants(selectedConversation.conversationId);
      toast.success("Kick thành công");
    }catch(error){
       const err = error as ApiResponse<void>;
        toast.error(err.message);
    }
  }
    const handleSetRoleAdmin = async (userId: string) => {
    if (!selectedConversation) return;
    try{
      await setRoleAdmin(selectedConversation.conversationId, userId);
      getConversationParticipants(selectedConversation.conversationId);
      toast.success("Cập nhật vai trò thành công");
    }catch(error){
       const err = error as ApiResponse<void>;
        toast.error(err.message);
    }
  }


  useEffect(() => {
    if (!open) {
      useConversationStore.setState({
        participantResponses: [],
      });
      return;
    }

    if (selectedConversation) {
      getConversationParticipants(
        selectedConversation.conversationId
      );
    }
  }, [open, selectedConversation?.conversationId]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-w-md
          bg-white
          dark:bg-[#0f172a]
        "
      >
        <DialogHeader>
          <DialogTitle>
            Thành viên nhóm
          </DialogTitle>
        </DialogHeader>

        <div
          className="
            max-h-[400px]
            space-y-2
            overflow-y-auto
          "
        >
          {loading ? (
            <div className="text-center py-4">
              Đang tải...
            </div>
          ) : (
            participantResponses.map((participant) => (
              <div
                key={participant.userId}
                className="
                  flex items-center
                  justify-between
                  rounded-lg
                  p-2
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
              >
                <div className="flex items-center gap-3">
                  {participant.avatar ? (
                    <img
                      src={participant.avatar}
                      className="
                        h-10 w-10
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-full
                        bg-slate-200
                        dark:bg-slate-700
                      "
                    >
                      <User size={18} />
                    </div>
                  )}

                  <div>
                    <p className="font-medium">
                      {participant.fullName}
                    </p>

                    <p
                      className="
                        text-xs
                        text-slate-500
                      "
                    >
                       {participant.role === "ADMIN"
                        ? "Quản trị viên"
                        : "Thành viên"}
                    </p>
                  </div>
                </div>
                
            {isAdmin && participant.userId !== user?.id && participant.role !== "ADMIN" && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Quản lý thành viên</DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleSetRoleAdmin(participant.userId)}>
                  Thăng làm quản trị viên
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => handleKickMember(participant.userId)}
                  className="text-red-500 focus:text-red-500">
                  Xóa khỏi nhóm
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}