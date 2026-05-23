import {  useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { User, Check, X } from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { Loader2 } from "lucide-react"
import { FriendRequestStatus } from "../../types/enums/enums.type";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../types/response/api.response";
import type { FriendRequestAction } from "../../types/request/friend.request";
import { useFriendStore } from "../../store/friendStore";
import { useAuthStore } from "../../store/authStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TabType = "received" | "sent" | "rejected";

export default function FriendInvitationDialog({open, onOpenChange }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("received");
  const [hiddenRequests, setHiddenRequests] = useState<string[]>([]);

  const {friendInvitationResult, getFriendInvitation, getFriendStatus, loading} = useUserStore();
  const{ actionFriendRequest} = useFriendStore();

  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "received") {
      await getFriendInvitation();
    } else if (tab === "rejected") {
      await getFriendStatus(FriendRequestStatus.REJECTED);
    }else if (tab === "sent") {
      await getFriendStatus(FriendRequestStatus.PENDING);
    }
  }

  const handleCheck = async (userId: string, requestId: string, status: FriendRequestStatus ) => {
    const payload: FriendRequestAction = { requestId: userId, status: status};
    console.log(payload);
    if(status === FriendRequestStatus.ACCEPTED) {
       const result : ApiResponse<void> = await actionFriendRequest(payload);
        if (result.code === 200) {
            toast.success("Đã chấp nhận lời mời kết bạn");
            setHiddenRequests((prev) => [
              ...prev,
              requestId,]);
              useUserStore.getState().getCountFriendInvitation();
              useAuthStore.getState().initAuth();
            return;
          }
          toast.error(result.message);
    } else if(status === FriendRequestStatus.REJECTED) {
      const result : ApiResponse<void> = await actionFriendRequest(payload);
        if (result.code === 200) {
            toast.error("Đã từ chối lời mời kết bạn");
              setHiddenRequests((prev) => [
              ...prev,
              requestId,]);
              useUserStore.getState().getCountFriendInvitation();
              useAuthStore.getState().initAuth();
            return;
          }
        toast.error(result.message);
    }
  }

  const currentList = friendInvitationResult.filter((item) =>!hiddenRequests.includes(item.id)).map(
  (item) => {
    if (activeTab === "received") {
      return {
        requestId: item.id,
        user: item.sender,
      };
    }
    return {
      requestId: item.id,
      user: item.receiver,
    };
  }
);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          bg-white text-black
          dark:bg-[#0f1720] dark:text-white
          border-gray-200 dark:border-cyan-500/20
          max-w-lg
        "
      >
        <DialogHeader>
          <DialogTitle>
            Danh sách lời mời kết bạn
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={
              activeTab === "received"
                ? "default"
                : "outline"
            }
            onClick={() =>handleTabChange("received")}
            className="flex-1 dark:border-cyan-500/20">
            Đã nhận
          </Button>

          <Button
            variant={
              activeTab === "sent"
                ? "default"
                : "outline"
            }
            onClick={() =>
              handleTabChange("sent")}
            className="flex-1 dark:border-cyan-500/20">
            Đã gửi
          </Button>

          {/* <Button
            variant={
              activeTab === "rejected"
                ? "default"
                : "outline"
            }
            onClick={() =>handleTabChange("rejected")}
            className="flex-1 dark:border-cyan-500/20">
            Bị từ chối
          </Button> */}
        </div>

        {/* List */}
        <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          )}

          {!loading &&
            currentList.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-500 dark:text-gray-400">
                Không có dữ liệu
              </div>
            )}

          {!loading &&
            currentList.map((item) => (
              <div
                key={item.requestId}
                className="
                  flex items-center justify-between
                  p-3 rounded-xl
                  bg-gray-100 text-black
                  dark:bg-[#111b24] dark:text-white
                "
              >
                <div className="flex items-center gap-3">
                  {item.user.avatar ? (
                    <img
                      src={item.user.avatar}
                      className="
                        w-10 h-10 rounded-full
                        border border-gray-200
                        dark:border-cyan-500/20
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-10 h-10 rounded-full
                        bg-gray-200 dark:bg-[#1a2632]
                        flex items-center justify-center
                      "
                    >
                      <User
                        className="
                          w-5 h-5
                          text-gray-500 dark:text-gray-400
                        "
                      />
                    </div>
                  )}

                  <span className="font-medium">
                    {item.user.fullName}
                  </span>
                </div>

                {/* Actions */}
                {activeTab ===
                  "received" && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleCheck(item.user.id, item.requestId, FriendRequestStatus.ACCEPTED)}>
                      <Check className="w-4 h-4" />
                    </Button>

                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCheck(item.user.id, item.requestId, FriendRequestStatus.REJECTED)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {activeTab === "sent" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled
                  >
                    Đã gửi
                  </Button>
                )}

                {activeTab ===
                  "rejected" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled
                  >
                    Đã từ chối
                  </Button>
                )}
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}