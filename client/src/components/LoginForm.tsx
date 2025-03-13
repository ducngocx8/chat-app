import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocket } from "@/config/socket";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { IUser, setUser } from "@/slices/authSlice";
import { setUserJoin, setUsers } from "@/slices/userListSlice";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Họ tên từ 3 ký tự trở lên.",
    })
    .max(10, {
      message: "Họ tên tối đa 10 ký tự.",
    }),
  address: z
    .string()
    .min(2, {
      message: "Địa chỉ từ 2 ký tự trở lên.",
    })
    .max(10, {
      message: "Địa chỉ tối đa 10 ký tự.",
    }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const socket = connectSocket();
    socket.emit("user_connected", {
      name: values.name,
      address: values.address,
    });

    socket.on("userInfo", (user: IUser) => {
      dispatch(setUser(user));
    });

    socket.on("user_join_last", (user: IUser) => {
      dispatch(setUserJoin(user));
    });

    const handleGetUserOnline = (user_list: IUser[]) => {
      dispatch(setUsers(user_list));
    };

    socket.on("getOnlineUsers", handleGetUserOnline);
    navigate("/chat", { replace: true });
  }

  useEffect(() => {
    if (user && getSocket().connected) {
      navigate("/chat", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div
      className={cn(
        "w-full items-center flex flex-col justify-center !overflow-hidden",
        className
      )}
      {...props}
    >
      <Card className="w-100">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập thông tin họ tên đầy đủ và địa chỉ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Họ tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-2"></div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full !bg-gray-900 mt-5">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
