import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { User } from "lucide-react";
import { useFriendStore } from "../../store/friendStore";
import type { SendFriendRequest } from "../../types/request/friend.request";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../types/response/api.response";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FriendSearchDialog({ open, onOpenChange }: Props) {
  const [keyword, setKeyword] = useState("");
  const {loading, searchResults, searchUsers} = useUserStore();
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const sendFriendRequest = useFriendStore((state) => state.sendFriendRequest);
  const handleSearch = () => {
    searchUsers(keyword);
  };

const handleAddFriend = async (id: string) => {
  const payload: SendFriendRequest = { receiverId: id,};
    const result : ApiResponse<void> =
    await sendFriendRequest(payload);
  if (result.code === 200) {
    setSentRequests((prev) => [...prev,id]);
    toast.success("Đã gửi yêu cầu kết bạn");
    return;
  }
  toast.error(result.message);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent  className="bg-white text-black dark:bg-[#0f1720] dark:text-white
    border-gray-200 dark:border-cyan-500/20">
        <DialogHeader>
          <DialogTitle>Tìm bạn bè</DialogTitle>
        </DialogHeader>

        {/* search */}
        <div className="flex gap-2 mt-3 ">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Nhập tên hoặc email..."
            className="
            bg-white text-black
            dark:bg-[#111b24] dark:text-white
            border-gray-200 dark:border-cyan-500/20
            placeholder:text-gray-400 dark:placeholder:text-gray-500"/>
          <Button  className=" bg-black text-white dark:bg-cyan-500 dark:text-black" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* results */}
        <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
          {loading && <p className="text-sm text-gray-400">Đang tìm...</p>}

        {!loading && searchResults?.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Không tìm thấy người dùng
          </p>
        )}

          {!loading && searchResults?.length > 0 &&
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-100 text-black
                     dark:bg-[#111b24] dark:text-white transition-colors">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                  <img
                    src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200 dark:border-cyan-500/20"/>) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1a2632] flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>)}
                  <span>{user.fullName}</span>
                </div>

                {sentRequests.includes(user.id) ? (
                  <Button size="sm" disabled>
                    Đã gửi yêu cầu
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleAddFriend(user.id)}>
                    Kết bạn
                  </Button>
                )}
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}