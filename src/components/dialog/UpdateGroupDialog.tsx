import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Camera, Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";

import { useConversationStore } from "../../store/conversationStore";
import { useUserStore } from "../../store/userStore";

import type { ApiResponse } from "../../types/response/api.response";
import type {
  UploadResponse,
} from "../../types/response/response.type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UpdateGroupDialog({
  open,
  onOpenChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selectedConversation, updateGroupInfo, loading ,loadConversations} =
    useConversationStore();

  const { uploadImage } = useUserStore();

  const [groupName, setGroupName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!open || !selectedConversation) return;

    setGroupName(selectedConversation.name || "");
    setAvatar(selectedConversation.avatarGroup || "");
  }, [open, selectedConversation]);

  const handleSelectAvatar = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const result: ApiResponse<UploadResponse> =
      await uploadImage(file);

    if (result.code !== 200 || !result.data) {
      toast.error(result.message);
      return;
    }

    setAvatar(result.data.url);
    toast.success("Tải ảnh thành công");
  };

  const handleUpdateGroup = async () => {
    if (!selectedConversation) return;

    try {
      const result = await updateGroupInfo(
        selectedConversation.conversationId,
        {
          name: groupName.trim(),
          avatarGroup: avatar,
        }
      );

      if (result.code === 200) {
        toast.success(
          "Cập nhật thông tin nhóm thành công"
        );
        loadConversations();
        onOpenChange(false);
        return;
      }

      toast.error(result.message);
    } catch (error) {
      const err = error as ApiResponse<void>;
      toast.error(err.message);
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
          dark:border-cyan-500/20
          dark:bg-[#0f1720]
        "
      >
        <DialogHeader>
          <DialogTitle>
            Cập nhật nhóm chat
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
                "
              />
            ) : (
              <div
                className="
                  flex h-24 w-24
                  items-center justify-center
                  rounded-full
                  bg-gray-100
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
              onClick={() =>
                fileInputRef.current?.click()
              }
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
              text-muted-foreground
            "
          >
            Avatar nhóm
          </p>
        </div>

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

        <div className="flex justify-end">
          <Button
            onClick={handleUpdateGroup}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}