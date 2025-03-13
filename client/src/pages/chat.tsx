import UserList from "@/components/users/UserOnlineList";
import ChatBox from "../components/chat/ChatBox";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { connectSocket } from "@/config/socket";
import { IUser, setUser } from "@/slices/authSlice";
import ChatHistoryList from "@/components/history/ChatHistoryList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_login = useSelector((state: RootState) => state.auth.user);

  // console.log("user_login", user);

  useEffect(() => {
    if (!user_login) {
      navigate("/login", { replace: true });
    } else {
      // TH Refresh lại page => Bắt đầu kết nối lại => Kết nối thành công => Vào socket.on("connect", callback)
      const socket = connectSocket();
      socket.on("connect", () => {
        socket.emit("user_connected", {
          name: user_login.name,
          address: user_login.address,
        });
      });
      socket.on("userInfo", (user: IUser) => {
        dispatch(setUser(user));
      });
    }
    return () => {};
  }, [user_login, navigate, dispatch]);

  if (!user_login) return null;

  return (
    <div className="w-screen h-screen">
      <div className="w-screen flex flex-row justify-between items-center bg-gray-50 pl-10 pr-10 pt-2 pb-2 border-b-2 border-gray-300">
        <div className="">SIMPLE CHAT APP</div>
        <div className="flex flex-row items-center">
          <img className="ml-2 w-7 h-7" src={user_login.avatar} />
          <div className="ml-2">
            Tên tài khoản: <b>{user_login.name}</b>
          </div>
          <div className="ml-2">-</div>
          <div className="ml-2">{"Địa chỉ: " + user_login.address}</div>
        </div>
        <Button className="!bg-gray-900">
          <Link className="!text-white" to={"/logout"}>
            Logout
          </Link>
        </Button>
      </div>
      <div className="flex flex-row">
        <UserList user_login={user_login} />
        <ChatBox user_login={user_login} />
        <ChatHistoryList user_login={user_login} />
      </div>
    </div>
  );
};

export default Chat;
