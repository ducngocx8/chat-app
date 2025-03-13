import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { IUser } from "@/slices/authSlice";
import { IMessage } from "@/slices/chatSlice";

export default function ChatHistoryItem({
  user,
  onClick,
  message_end,
  user_login,
}: {
  user: IUser | null;
  user_login: IUser;
  onClick: (user: IUser | null) => void;
  message_end: IMessage;
}) {
  const { avatar, name, online, address } = user!;
  return (
    <Card
      onClick={() => onClick(user!)}
      className="flex flex-row items-center relative p-2 cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        {online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Thông tin người dùng */}
      <CardContent className="p-0">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{"Sống tại: " + address}</p>
        <p className="text-sm text-gray-500">
          {(user_login.user_id === message_end.sender_id ? "Bạn: " : "") +
            (message_end.text
              ? message_end.text
              : message_end.filename
              ? "Đã đính kèm một file"
              : message_end.image
              ? "Đã gửi một hình ảnh"
              : "")}
        </p>
        <p className="text-sm text-gray-500">{"Lúc: " + message_end.time}</p>
      </CardContent>
    </Card>
  );
}
