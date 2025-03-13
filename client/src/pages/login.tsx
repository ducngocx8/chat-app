import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { LoginForm } from "@/components/LoginForm";
import { connectSocket } from "@/config/socket";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      connectSocket();
      navigate("/chat", { replace: true });
    }
  }, [dispatch, navigate, user]);

  return user ? (
    <></>
  ) : (
    <div className="w-screen !overflow-hidden">
      <LoginForm />
    </div>
  );
};

export default Login;
