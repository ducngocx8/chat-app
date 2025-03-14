import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState } from "@/store";
import { connectSocket } from "@/config/socket";
import { IUser, setUser } from "@/slices/authSlice";
import { setUserJoin, setUsers } from "@/slices/userListSlice";
import HeaderMemo from "@/components/simple/Header";
import UserOnlineListMemo from "@/components/users/UserOnlineList";
import ChatHistoryListMemo from "@/components/history/ChatHistoryList";
import ChatBoxMemo from "../components/chat/ChatMain";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy thông tin user đang đăng nhập
  const user_login = useSelector(
    (state: RootState) => state.auth.user,
    shallowEqual
  );
  // Lấy thông tin user vừa vào chát (User cuối cùng)
  const user_join_last = useSelector(
    (state: RootState) => state.userList.user_join_last,
    shallowEqual
  );

  // console.log("user_login", user);

  useEffect(() => {
    if (!user_login) {
      navigate("/login", { replace: true });
      return;
    }
    const socket = connectSocket();
    socket.on("connect", () => {
      // TH Refresh lại page => Bắt đầu kết nối lại => Kết nối thành công => Vào socket.on("connect", callback)
      socket.emit("user_connected", {
        name: user_login.name,
        address: user_login.address,
      });
    });
    socket.on("userInfo", (user: IUser) => {
      dispatch(setUser(user));
    });
    socket.on("user_join_last", (user: IUser) => {
      dispatch(setUserJoin(user));
    });

    // Mới ADD
    const handleGetUserOnline = (user_list: IUser[]) => {
      dispatch(setUsers(user_list));
    };

    socket.on("getOnlineUsers", handleGetUserOnline); // Đăng ký sự kiện và lắng nghe

    return () => {
    };
  }, [user_login, navigate, dispatch]);

  if (!user_login) return null;

  return (
    <div className="w-screen h-screen flex flex-col">
      <HeaderMemo user_login={user_login} />
      <div className="flex flex-col lg:flex-row h-[90vh]">
        <UserOnlineListMemo user_login={user_login} />
        <ChatBoxMemo user_login={user_login} />
        <ChatHistoryListMemo user_login={user_login} />
      </div>
      <div className="flex justify-center items-center p-2 hidden lg:flex">
        <span>SIMPLE CHAT APP 2025</span>
        {user_join_last && (
          <span className="text-blue-500 m-2">
            {`${user_join_last.name} vừa tham gia chat.`}
          </span>
        )}
      </div>
    </div>
  );
};

export default Chat;
