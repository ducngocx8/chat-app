// 🔥 Dữ liệu mẫu danh sách người dùng online
// const chat_history_list = [
//   {
//     message_id: "1741773911521",
//     sender_id: "OEt83oEVxKmakJeFAAAl",
//     receiver_id: "8IHQfZsp5qkzci9QAAAj",
//     text: "Xin chào",
//     image: "",
//     file: "",
//     filename: "",
//     time: "17:05:11",
//     sender_info: {
//       user_id: "OEt83oEVxKmakJeFAAAl",
//       name: "Văn Hải",
//       address: "Thanh Hóa",
//       avatar: "https://randomuser.me/api/portraits/women/2.jpg",
//       online: true,
//     },
//     receiver_info: {
//       user_id: "8IHQfZsp5qkzci9QAAAj",
//       name: "Đức Ngọc",
//       address: "Nghệ An",
//       avatar: "https://randomuser.me/api/portraits/women/2.jpg",
//       online: true,
//     },
//   },
// ];

import ChatHistoryItem from "@/components/history/ChatHistoryItem";
import { IUser } from "@/slices/authSlice";
import { setSelectedUser } from "@/slices/chatSlice";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface IMessage {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  image: string;
  file: string;
  filename: string;
  time: string;
  sender_info?: IUser;
  receiver_info?: IUser;
}

export default function ChatHistoryList({ user_login }: { user_login: IUser }) {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [history_list, setHistoryList] = useState<IMessage[]>([]);

  useEffect(() => {
    const getChatDataFromLocalStorage = () => {
      const chatData: IMessage[] = [];
      Object.entries(localStorage).forEach(([key, value]) => {
        if (key.startsWith("chat_")) {
          const value_chat = JSON.parse(value);
          if (Array.isArray(value_chat)) {
            const chat_last: IMessage = value_chat[value_chat.length - 1];
            if (
              chat_last &&
              (chat_last.receiver_id === user_login.user_id ||
                chat_last.sender_id === user_login.user_id)
            ) {
              chatData.push(value_chat[value_chat.length - 1]);
            }
          }
        }
      });
      setHistoryList([...chatData]);
    };

    getChatDataFromLocalStorage();
  }, [messages]);

  const user_choose = useSelector(
    (state: RootState) => state.chat.selectedUser
  );

  const handleUserClick = (user_click: IUser | null) => {
    if (
      user_click === null ||
      user_login.user_id === user_click.user_id ||
      user_click.user_id === user_choose?.user_id
    ) {
      return;
    }
    dispatch(setSelectedUser(user_click));
  };

  console.log("history_list", history_list);

  return (
    <div className="p-6 bg-gray-100 flex-1 border-l border-gray-300 shadow-sm h-full">
      <h2 className="text-xl font-bold mb-4">Lịch sử chát</h2>
      <div className="space-y-3 h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-4 pb-2">
        {history_list.map((msg) => (
          <ChatHistoryItem
            key={msg.message_id}
            user={
              msg.sender_id === user_login.user_id
                ? msg.receiver_info || null
                : msg.sender_info || null
            }
            message_end={msg}
            user_login={user_login}
            onClick={() => {
              handleUserClick(
                msg.sender_id === user_login.user_id
                  ? msg.receiver_info || null
                  : msg.sender_info || null
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
