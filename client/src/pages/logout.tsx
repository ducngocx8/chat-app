import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/slices/authSlice";
import { disconnectSocket } from "@/config/socket";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setUser(null));
    disconnectSocket();
    navigate("/login", { replace: true });
  });

  return <></>;
};

export default Logout;
