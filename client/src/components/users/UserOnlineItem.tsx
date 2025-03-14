import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { IUser } from "@/slices/authSlice";
import { memo } from "react";

function UserOnlineItem({
  user,
  onClick,
}: {
  user: IUser;
  onClick: (user: IUser) => void;
}) {
  const { avatar, name, online, address } = user;
  return (
    <Card
      onClick={() => onClick(user)}
      className="flex flex-row items-center relative pl-2 cursor-pointer"
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
      </CardContent>
    </Card>
  );
}

const UserOnlineItemMemo = memo(UserOnlineItem);
export default UserOnlineItemMemo;
