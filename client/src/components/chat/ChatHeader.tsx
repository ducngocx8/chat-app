import { RootState } from "@/store";
import { Bot } from "lucide-react";
import { useSelector } from "react-redux";

const ChatHeader = () => {
  const currentReceiver = useSelector(
    (state: RootState) => state.chat.selectedUser
  );
  return (
    <div className="flex items-center gap-3 p-3 border-b border-gray-700">
      <Bot className="w-10 h-10 text-white bg-gray-700 p-2 rounded-full" />
      <div>
        <p className="font-semibold text-lg text-gray-900">
          {currentReceiver?.name || "BOT CHAT"}
        </p>
        <p className="text-green-400 text-sm">🟢 Đang hoạt động</p>
      </div>
    </div>
  );
};

export default ChatHeader;
