// 🔥 Dữ liệu mẫu danh sách người dùng online
// const user_list = [
//   {
//     id: "1",
//     name: "Nguyễn Văn A",
//     address: "Hà Nội, Việt Nam",
//     avatar: "https://randomuser.me/api/portraits/men/1.jpg",
//     online: true,
//   },
//   {
//     id: "2",
//     name: "Trần Thị B",
//     address: "TP. Hồ Chí Minh, Việt Nam",
//     avatar: "https://randomuser.me/api/portraits/women/2.jpg",
//     online: true,
//   },
//   {
//     id: "3",
//     name: "Phạm Văn C",
//     address: "Đà Nẵng, Việt Nam",
//     avatar: "https://randomuser.me/api/portraits/men/3.jpg",
//     online: true,
//   },
// ];

import UserOnlineItemMemo from "@/components/users/UserOnlineItem";
// import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { IUser } from "@/slices/authSlice";
import { setSelectedUser } from "@/slices/chatSlice";
import { RootState } from "@/store";
import { memo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

function UserOnlineList({ user_login }: { user_login: IUser }) {
  const dispatch = useDispatch();
  // const user_online_list = useOnlineUsers();

  const user_online_list = useSelector(
    (state: RootState) => state.userList.users,
    shallowEqual
  );

  const user_choose = useSelector(
    (state: RootState) => state.chat.selectedUser,
    shallowEqual
  );
  const handleUserClick = (user_click: IUser) => {
    if (
      user_login.user_id === user_click.user_id ||
      user_click.user_id === user_choose?.user_id
    ) {
      return;
    }
    console.log("Selected user:", user_click);
    dispatch(setSelectedUser(user_click));
  };

  console.log("user_online_list", user_online_list);

  return (
    <div className="p-6 bg-gray-100 flex-1 border-b lg:border-r border-gray-300 shadow-sm">
      <h2 className="text-xl font-bold mb-4">🟢 Người dùng đang online</h2>
      <div className="space-y-3 h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-4 pb-2">
        {user_online_list.map((user_item) => (
          <UserOnlineItemMemo
            key={user_item.user_id}
            user={user_item}
            onClick={() => {
              handleUserClick(user_item);
            }}
          />
        ))}
      </div>
    </div>
  );
}

const UserOnlineListMemo = memo(UserOnlineList);
export default UserOnlineListMemo;
