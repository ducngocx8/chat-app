import UserList from "@/components/users/UserOnlineList";
import ChatBox from "../components/chat/ChatBox";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { connectSocket } from "@/config/socket";
import { IUser, setUser } from "@/slices/authSlice";
import ChatHistoryList from "@/components/history/ChatHistoryList";
import Header from "@/components/simple/Header";
import { setUserJoin } from "@/slices/userListSlice";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_login = useSelector((state: RootState) => state.auth.user);
  const user_join_last = useSelector(
    (state: RootState) => state.userList.user_join_last
  );

  // console.log("user_login", user);

  useEffect(() => {
    if (!user_login) {
      navigate("/login", { replace: true });
    } else {
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
        console.log("VÀO ĐÂY 1111");
        dispatch(setUserJoin(user));
      });
    }
    return () => {};
  }, [user_login, navigate, dispatch]);

  if (!user_login) return null;

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header user_login={user_login} />
      <div className="flex flex-col lg:flex-row h-[90vh]">
        <UserList user_login={user_login} />
        <ChatBox user_login={user_login} />
        <ChatHistoryList user_login={user_login} />
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
