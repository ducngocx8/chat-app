import { useEffect } from "react";
import { getSocket } from "@/config/socket";
import { IUser } from "@/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setUsers } from "@/slices/userListSlice";

export function useOnlineUsers() {
  const dispatch = useDispatch();
  const user_login_list = useSelector(
    (state: RootState) => state.userList.users
  );
  useEffect(() => {
    const socket = getSocket();
    const handleGetUserOnline = (user_list: IUser[]) => {
      dispatch(setUsers(user_list));
    };

    socket.on("getOnlineUsers", handleGetUserOnline); // Đăng ký sự kiện và lắng nghe

    return () => {
      socket.off("getOnlineUsers", handleGetUserOnline);
    };
  }, [dispatch]);

  return user_login_list;
}
