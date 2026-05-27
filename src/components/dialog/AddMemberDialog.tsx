import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, User, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useConversationStore } from "../../store/conversationStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { AddParticipantRequest } from "../../types/request/conversation.request";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddMemberDialog({open, onOpenChange,}: Props) {
  const {
    friendsNotInGroup,
    getFriendsNotInGroup,
    loading,
    selectedConversation,
    addParticipant,
  } = useConversationStore();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const filteredFriends = useMemo(() => {
  return friendsNotInGroup.filter((friend) =>
    friend.fullName
      .toLowerCase()
      .includes(search.toLowerCase())
  );
}, [friendsNotInGroup, search]);

  const handleSumitAdd = async () => {
    if(!selectedUsers) {
        return;
    }
    const conversationId = selectedConversation?.conversationId;
    if(!conversationId) {
        return;
    }
    const participants: AddParticipantRequest[] = selectedUsers.map((userId) => ({userId,}));
    const result = await addParticipant(participants, conversationId);
    if(result.code === 200) {
        toast.success("Thêm thành viên thành công");
        onOpenChange(false);
        return;
    }
    toast.error(result.message);
  }

  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      return;
    }
    if(!selectedConversation) {
        return;
    }

    if (selectedConversation) {
      getFriendsNotInGroup(selectedConversation.conversationId);
    }
  }, [open, selectedConversation?.conversationId]);


  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
        <DialogContent
        className="
            max-w-lg
            border-gray-200
            bg-white
            dark:border-cyan-500/20
            dark:bg-[#0f1720]
        "
        >
        <DialogHeader>
            <DialogTitle>
            Thêm thành viên
            </DialogTitle>
        </DialogHeader>

        <Input
            placeholder="Tìm bạn bè..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <div
            className="
            mt-3
            max-h-[350px]
            overflow-y-auto
            rounded-md
            border
            p-2
            "
        >
            {loading ? (
            <div className="flex justify-center py-6">
                <Loader2 className="animate-spin" />
            </div>
            ) : filteredFriends.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
                Không có bạn bè nào
            </p>
            ) : (
            filteredFriends.map((friend) => {
                const checked = selectedUsers.includes(
                friend.id
                );

                return (
                <button
                    key={friend.id}
                    type="button"
                    onClick={() =>
                    setSelectedUsers((prev) =>
                        checked
                        ? prev.filter(
                            (id) => id !== friend.id
                            )
                        : [...prev, friend.id]
                    )
                    }
                    className="
                    flex w-full items-center justify-between
                    rounded-md p-2
                    transition hover:bg-muted
                    "
                >
                    <div className="flex items-center gap-3">
                    {friend.avatar ? (
                        <img
                        src={friend.avatar}
                        alt={friend.fullName}
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
                            bg-gray-200
                        "
                        >
                        <Users size={16} />
                        </div>
                    )}

                    <div className="text-left">
                        <p className="font-medium">
                        {friend.fullName}
                        </p>

                        <p
                        className="
                            text-xs
                            text-muted-foreground
                        "
                        >
                        {friend.email}
                        </p>
                    </div>
                    </div>

                    <div
                    className={`
                        flex h-6 w-6 items-center justify-center
                        rounded-full border
                        ${
                        checked
                            ? "border-cyan-500 bg-cyan-500 text-white"
                            : ""
                        }
                    `}
                    >
                    {checked && (
                        <Check size={14} />
                    )}
                    </div>
                </button>
                );
            })
            )}
        </div>

        <div
            className="
            mt-3
            flex items-center
            justify-between
            "
        >
            <p className="text-sm text-muted-foreground">
            Đã chọn {selectedUsers.length} thành viên
            </p>

            {selectedUsers.length > 0 && (
            <Button
                onClick={() => {
                handleSumitAdd();
                }}
            >
                Thêm ({selectedUsers.length})
            </Button>
            )}
        </div>
        </DialogContent>
        </Dialog>
        );
}