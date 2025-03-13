import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import { IUser } from "@/slices/authSlice";
import { IMessage } from "@/slices/chatSlice";

const ChatFrame = ({
  messages,
  user_login,
}: {
  messages: IMessage[];
  user_login: IUser;
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-4">
      {messages.map((msg) => (
        <motion.div
          key={msg.message_id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-end gap-2 mb-3 ${
            msg.sender_id === user_login.user_id
              ? "justify-end"
              : "justify-start"
          }`}
        >
          {msg.sender_id !== user_login.user_id && (
            <Bot className="w-8 h-8 text-gray-400 bg-gray-800 p-1 rounded-full" />
          )}
          <div
            className={`p-3 rounded-2xl max-w-[75%] ${
              msg.sender_id === user_login.user_id
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <p>
              {msg.text ? (
                msg.text
              ) : msg.image ? (
                <img className="max-w-3xs" src={msg.image} />
              ) : (
                <>
                  {msg.filename} |{" "}
                  <a href={msg.file} target="_blank">
                    Truy cập
                  </a>
                </>
              )}
            </p>
            <p className="text-xs text-gray-400 text-right mt-1">{msg.time}</p>
          </div>
          {msg.sender_id === user_login.user_id && (
            <User className="w-8 h-8 text-white bg-sky-500/75 p-1 rounded-full" />
          )}
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatFrame;
