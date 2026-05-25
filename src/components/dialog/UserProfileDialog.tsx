import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  Camera,
  Loader2,
  Save,
  User,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../types/response/api.response";
import { useUserStore } from "../../store/userStore";
import type { UploadResponse, UserResponse } from "../../types/response/response.type";
import { validateFormUpdateProfile } from "../../utils/validate";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserProfileDialog({
  open,
  onOpenChange,
}: Props) {

  const {user,initAuth} = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {updateProfile, loading, uploadImage} = useUserStore();


  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

useEffect(() => {
  if (!user || !open) return;
  setForm({
    fullName: user.fullName || "",
    email: user.email || "",
    avatar: user.avatar || "",
  });
}, [open]);
  const handleUpdate = async () => {
        const errorMsg = validateFormUpdateProfile(form);
    if (errorMsg) {
      toast.error(errorMsg)
      return
    }

    const result: ApiResponse<UserResponse> = await updateProfile(form);
    if (result.code === 200) {
      toast.success("Cập nhật thông tin thành công");
      onOpenChange(false);
      initAuth();
      return;
    }
    toast.error(result.message);

  };

  const handleSelectAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const result: ApiResponse<UploadResponse> = await uploadImage(file);

    if (result.code !== 200 || !result.data) {
        toast.error(result.message);
        return;
      }
      setForm((prev) => ({
        ...prev,
        avatar: result.data.url,
      }));

      toast.success("Tải ảnh thành công");
    };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-w-md

          border-gray-200
          bg-white
          text-black

          dark:border-cyan-500/20
          dark:bg-[#0f1720]
          dark:text-white
        "
      >

        <DialogHeader>
          <DialogTitle>
            Thông tin cá nhân
          </DialogTitle>
        </DialogHeader>

        {/* AVATAR */}
        <div
          className="
            mt-4
            flex flex-col
            items-center
          "
        >
          <div className="relative">

            {form?.avatar ? (
              <img
                src={form.avatar}
                className="
                  h-24 w-24
                  rounded-full
                  border-2

                  border-gray-200
                  dark:border-cyan-500/20

                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex h-24 w-24
                  items-center
                  justify-center

                  rounded-full

                  bg-gray-100
                  dark:bg-[#1a2632]
                "
              >
                <User
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
                shadow-md
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
              mt-3 text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Avatar
          </p>
        </div>

        {/* FORM */}
        <div className="mt-6 space-y-4">

          {/* FULLNAME */}
          <div>
            <p
              className="
                mb-2 text-sm
                font-medium
              "
            >
              Họ và tên
            </p>

            <Input
              value={form?.fullName || ""}
              name="fullName"
              onChange={handleChange}
              placeholder="Nhập họ tên"
            />
          </div>

          {/* EMAIL */}
          <div>
            <p
              className="
                mb-2 text-sm
                font-medium
              "
            >
              Email
            </p>

            <Input
              value={form?.email || ""}
              name="email"
              placeholder="Nhập email"
              onChange={handleChange}
            />
          </div>
          </div>

        {/* ACTION */}
        <div
          className="
            mt-6 flex
            justify-end
          "
        >
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="
              min-w-[140px]
            "
          >
            {loading ? (
              <>
                <Loader2
                  className="
                    mr-2 h-4 w-4
                    animate-spin
                  "
                />
                Đang cập nhật
              </>
            ) : (
              <>
                <Save
                  className="
                    mr-2 h-4 w-4
                  "
                />
                Cập nhật
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}