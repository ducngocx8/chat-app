import { Button } from "@/components/ui/button";
import { IUser } from "@/slices/authSlice";
import { memo } from "react";
import { Link } from "react-router-dom";

function Header({ user_login }: { user_login: IUser | null }) {
  console.log("CHẠY LẠI HEADER");
  return (
    <div className="w-screen flex flex-col lg:flex-row justify-between items-center bg-gray-50 pl-10 pr-10 pt-2 pb-2 border-b-2 border-gray-300">
      <div className="">
        <Link to={"/"}>SIMPLE CHAT APP</Link>
      </div>
      {user_login && (
        <div className="flex flex-row items-center mt-2 lg:mt-0">
          <img className="ml-2 w-7 h-7" src={user_login.avatar} />
          <div className="ml-2">
            <span className="hidden lg:inline">Tên tài khoản: </span>
            <b>{user_login.name}</b>
          </div>
          <div className="ml-2">-</div>
          <div className="ml-2">
            <span className="hidden lg:inline">Địa chỉ: </span>
            {user_login.address}
          </div>
        </div>
      )}
      <Button className="!bg-gray-900 mt-2 lg:mt-0">
        {user_login ? (
          <Link className="!text-white" to={"/logout"}>
            Logout
          </Link>
        ) : (
          <Link className="!text-white" to={"/login"}>
            Login
          </Link>
        )}
      </Button>
    </div>
  );
}

const HeaderMemo = memo(Header);
export default HeaderMemo;
