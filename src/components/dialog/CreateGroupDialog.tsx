import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Camera, Check, Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";

import { useUserStore } from "../../store/userStore";
import { useConversationStore } from "../../store/conversationStore";

import { ConversationType } from "../../types/enums/enums.type";
import type { UploadResponse, UserResponse } from "../../types/response/response.type";
import { validateFormCreateGroup } from "../../utils/validate";
import type { ApiResponse } from "../../types/response/api.response";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateGroupDialog({open, onOpenChange,}: Props) {
  const {
    myFriends,
    getMyFriends,
    loading: friendLoading,
  } = useUserStore();

  const {
    createConversation,
    loading,
  } = useConversationStore();
  const { uploadImage } = useUserStore();

  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    getMyFriends();
    setGroupName("");
    setSelectedUsers([]);
    setSearch("");
  }, [open]);

  const filteredFriends = useMemo(() => {
    return myFriends.filter((friend) =>
      friend.fullName
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [myFriends, search]);

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

    const handleSelectAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const result: ApiResponse<UploadResponse> = await uploadImage(file);

    if (result.code !== 200 || !result.data) {
        toast.error(result.message);
        return;
      }
      setAvatar(result.data.url);
      toast.success("Tải ảnh thành công");
    };


  const handleCreateGroup = async () => {

    const resultMessage = validateFormCreateGroup({groupName, selectedUsers});

    if (resultMessage) {
      toast.error(resultMessage);
      return;
    }

    try {
      const result = await createConversation({
        avatarGroup: avatar,
        type: ConversationType.GROUP,
        name: groupName,
        participantIds: selectedUsers,
      });

      if (result.code === 200) {
        toast.success("Tạo nhóm thành công");
        onOpenChange(false);
        return;
      }

      toast.error(result.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
          text-black
          dark:border-cyan-500/20
          dark:bg-[#0f1720]
          dark:text-white
        "
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={18} />
            Tạo nhóm chat
          </DialogTitle>
        </DialogHeader>

        <div
            className="
                flex flex-col
                items-center
                gap-2
            "
            >
            <div className="relative">
                {avatar ? (
                <img
                    src={avatar}
                    alt="Group avatar"
                    className="
                    h-24 w-24
                    rounded-full
                    object-cover
                    border-2
                    border-gray-200
                    dark:border-cyan-500/20
                    "
                />
                ) : (
                <div
                    className="
                    flex h-24 w-24
                    items-center justify-center
                    rounded-full
                    bg-gray-100
                    dark:bg-[#1a2632]
                    "
                >
                    <Users
                    className="
                        h-10 w-10
                        text-gray-400
                    "
                    />
                </div>
                )}

                <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                    absolute bottom-0 right-0
                    flex h-8 w-8
                    items-center justify-center
                    rounded-full
                    bg-cyan-500
                    text-white
                "
                >
                <Camera size={16} />
                </button>

                <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleSelectAvatar}
                />
            </div>

            <p
                className="
                text-sm
                text-gray-500
                dark:text-gray-400
                "
            >
                Avatar nhóm
            </p>
            </div>

        {/* Tên nhóm */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Tên nhóm
          </p>

          <Input
            placeholder="Nhập tên nhóm..."
            value={groupName}
            onChange={(e) =>
              setGroupName(e.target.value)
            }
          />
        </div>

        {/* Tìm kiếm */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Thành viên
          </p>

          <Input
            placeholder="Tìm bạn bè..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Danh sách bạn bè */}
        <div
          className="
            max-h-[350px]
            overflow-y-auto
            rounded-md
            border
            p-2
          "
        >
          {friendLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Không có bạn bè nào
            </p>
          ) : (
            filteredFriends.map((friend: UserResponse) => {
              const checked = selectedUsers.includes(
                friend.id
              );

              return (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() =>
                    toggleUser(friend.id)
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

        <p className="text-sm text-muted-foreground">
          Đã chọn {selectedUsers.length} thành viên
        </p>

        <div className="flex justify-end">
          <Button
            onClick={handleCreateGroup}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo nhóm"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}