import Header from "@/components/simple/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function App() {
  const user_login = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Header user_login={user_login} />
      <div className="h-[100%] flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Simple Chat App</CardTitle>
            <CardDescription>
              {user_login
                ? "Bạn đã có tài khoản rồi. Tham gia chát ngay!"
                : "Bạn chưa đăng nhập tài khoản. Đăng nhập để tham gia chát ngay!"}
            </CardDescription>
          </CardHeader>
          {user_login && (
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label>Họ tên</Label>
                    <Input
                      disabled
                      id="name"
                      placeholder="Name"
                      value={user_login?.name}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Địa chỉ</Label>
                    <Input
                      disabled
                      id="address"
                      placeholder="Address"
                      value={user_login?.address}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          )}
          <CardFooter className="flex justify-between">
            <span></span>
            <Button className="!bg-gray-800">
              {user_login ? (
                <Link className="!text-white" to="/chat">
                  Tham gia
                </Link>
              ) : (
                <Link className="!text-white" to="/login">
                  Đăng nhập
                </Link>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
