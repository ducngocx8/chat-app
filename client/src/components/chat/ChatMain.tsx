import { memo, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import dayjs from "dayjs";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatFrame from "@/components/chat/ChatFrame";
import { BACKEND_BASE, getSocket } from "@/config/socket";
import { IUser } from "@/slices/authSlice";
import { RootState } from "@/store";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IMessage, setMessage, setSelectedUser } from "@/slices/chatSlice";
import { EmojiClickData } from "emoji-picker-react";

let typingTimeout: NodeJS.Timeout;

// Hàm tạo key chung cho hai user
const getChatKey = (user1: string, user2: string) => {
  return `chat_${[user1, user2].sort().join("_")}`;
};

// Hàm load tin nhắn từ localStorage
const loadMessages = (user1: string, user2: string) => {
  const key = getChatKey(user1, user2);
  const storedMessages = localStorage.getItem(key);
  return storedMessages ? JSON.parse(storedMessages) : [];
};

// Hàm lưu tin nhắn vào localStorage
const saveMessages = (user1: string, user2: string, messages: IMessage[]) => {
  const key = getChatKey(user1, user2);
  localStorage.setItem(key, JSON.stringify(messages));
};

function ChatMain({ user_login }: { user_login: IUser }) {
  const [typingUser, setTypingUser] = useState<IUser | null>(null);
  const dispatch = useDispatch();
  const user_choose = useSelector(
    (state: RootState) => state.chat.selectedUser,
    shallowEqual
  );

  const messages = useSelector(
    (state: RootState) => state.chat.messages,
    shallowEqual
  );
  const [input, setInput] = useState("");
  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    // Xử lý nhận tin nhắn từ sever
    const handleMessage = (message_receive: IMessage) => {
      message_receive.time = dayjs().format("HH:mm:ss");
      const load_messages_first = loadMessages(
        message_receive.sender_id,
        message_receive.receiver_id
      );
      const message_arr = [...load_messages_first, message_receive];
      saveMessages(
        message_receive.sender_id,
        message_receive.receiver_id,
        message_arr
      );

      console.log("message_receive", message_receive);
      // VD A nhắn cho C, C chọn nhắn cho B => C nhận được tin nhắn (=> C Hiện tin nhăn của A)
      dispatch(setMessage([...load_messages_first, message_receive]));
      // console.log("receiver_info 123:", message_receive.sender_info);
      dispatch(setSelectedUser(message_receive.sender_info || null));
    };
    socket.on("receive_message", handleMessage);

    socket.on("typing", (sender: IUser) => {
      if (sender.user_id === user_choose?.user_id) {
        setTypingUser(sender);
      } else {
        setTypingUser(null);
      }
    });

    socket.on("stopTyping", (sender: IUser) => {
      if (typingUser?.user_id === sender.user_id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("stopTyping", (sender: IUser) => {
        if (typingUser?.user_id === sender.user_id) {
          setTypingUser(null);
        }
      });
      socket.off("typing", (sender: IUser) => {
        if (sender.user_id === user_choose?.user_id) {
          setTypingUser(sender);
        } else {
          setTypingUser(null);
        }
      });
    };
  }, [messages, dispatch, socket, typingUser, user_choose]);

  useEffect(() => {
    // Lưu lại tin nhắn sau khi thay đổi người dùng login / người chát
    if (user_choose) {
      const chat_list_begin = loadMessages(
        user_login.user_id,
        user_choose.user_id
      );
      // console.log("chat_list_begin", chat_list_begin);
      dispatch(setMessage([...chat_list_begin]));
    }
  }, [user_choose, user_login, dispatch]);

  const sendMessage = () => {
    if (!input.trim()) return;

    if (!user_choose?.user_id) {
      alert("Vui lòng chọn người gửi");
      return;
    }
    const newMessage: IMessage = {
      message_id: String(Date.now()),
      sender_id: user_login.user_id,
      receiver_id: user_choose?.user_id || "",
      text: input,
      image: "",
      file: "",
      filename: "",
      time: dayjs().format("HH:mm:ss"),
      sender_info: user_login,
      receiver_info: user_choose,
    };

    const socket = getSocket();

    if (!socket.connected) {
      alert("Không thể gửi tin nhắn, socket chưa kết nối!");
      return;
    }
    socket.emit("send_message", newMessage, (response: { status: boolean }) => {
      console.log("ack", response);
      if (response.status) {
        console.log("Gửi tin nhắn thành công");
        const message_arr = [...messages, newMessage];
        saveMessages(newMessage.sender_id, newMessage.receiver_id, message_arr);
        dispatch(setMessage([...messages, newMessage]));
      } else {
        alert("Hiện tại người dùng không online...");
      }
    });
    setInput("");
  };

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setInput((prev) => prev + emojiObject.emoji);
  };

  const handleTyping = () => {
    socket.emit("typing", {
      sender_id: user_login.user_id,
      receiver_id: user_choose?.user_id || "",
    });
  };

  const handleStopTyping = () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", {
        sender_id: user_login.user_id,
        receiver_id: user_choose?.user_id || "",
      });
    }, 1000);
  };

  // Upload image Server
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user_choose?.user_id) {
      alert("Vui lòng chọn người gửi");
      return;
    }
    if (!e.target?.files) {
      // console.log("e.target?.files[0]", "file không hợp lệ");
      return;
    }
    const fileImage = {
      preview: URL.createObjectURL(e.target?.files[0]),
      data: e.target.files[0],
    };

    // console.log("fileImage", fileImage);

    const formData = new FormData();
    formData.append("photo", fileImage.data);
    const response = await fetch(`${BACKEND_BASE}/image/web`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!result.status) {
      // console.log(result);
      alert("Upload Image thất bại");
      return;
    }
    // console.log(result);

    const newMessage: IMessage = {
      message_id: String(Date.now()),
      sender_id: user_login.user_id,
      receiver_id: user_choose?.user_id || "",
      text: "",
      file: "",
      filename: "",
      image: result.uri,
      time: dayjs().format("HH:mm:ss"),
      sender_info: user_login,
      receiver_info: user_choose,
    };

    socket.emit("send_message", newMessage, (response: { status: boolean }) => {
      console.log("ack", response);
      if (response.status) {
        console.log("Gửi tin nhắn thành công");
        const message_arr = [...messages, newMessage];
        saveMessages(newMessage.sender_id, newMessage.receiver_id, message_arr);
        dispatch(setMessage([...messages, newMessage]));
      } else {
        alert("Hiện tại người dùng không online...");
      }
    });
  };

  // Upload file Server
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user_choose?.user_id) {
      alert("Vui lòng chọn người gửi");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) {
      console.error("Không có file hợp lệ");
      return;
    }

    // Kiểm tra định dạng file
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file PDF hoặc Word (.doc, .docx)");
      return;
    }

    // Kiểm tra kích thước file (giới hạn 1MB)
    if (file.size > 1 * 1024 * 1024) {
      alert("File quá lớn! (Tối đa 1MB)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BACKEND_BASE}/file/web`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.status) {
        console.error("Upload thất bại:", result);
        alert("Upload file thất bại");
        return;
      }

      // console.log("Upload thành công:", result);

      // Gửi tin nhắn chứa file
      const newMessage: IMessage = {
        message_id: String(Date.now()),
        sender_id: user_login.user_id,
        receiver_id: user_choose?.user_id || "",
        text: "",
        image: "",
        filename: result.filename,
        file: result.uri, // URL của file trên server
        time: dayjs().format("HH:mm:ss"),
        sender_info: user_login,
        receiver_info: user_choose,
      };

      socket.emit(
        "send_message",
        newMessage,
        (response: { status: boolean }) => {
          console.log("ack", response);
          if (response.status) {
            console.log("GỬi tin nhắn thành công");
            const message_arr = [...messages, newMessage];
            saveMessages(
              newMessage.sender_id,
              newMessage.receiver_id,
              message_arr
            );
            dispatch(setMessage([...message_arr]));
          } else {
            alert("Hiện tại người dùng không online...");
          }
        }
      );
    } catch (error) {
      alert("Có lỗi xảy ra khi upload file " + error);
    }
  };

  return (
    <Card className="mx-auto p-4 m-0 !bg-gray-100 text-white flex flex-col flex-2 rounded-none">
      <ChatHeader />
      <ChatFrame messages={messages} user_login={user_login} />
      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        handleTyping={handleTyping}
        handleStopTyping={handleStopTyping}
        typingUser={typingUser}
        handleEmojiClick={handleEmojiClick}
        handleUploadImage={handleUploadImage}
        handleUploadFile={handleUploadFile}
        user_choose={user_choose}
      />
    </Card>
  );
}

const ChatMainMemo = memo(ChatMain);
export default ChatMainMemo;
