import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus, File, Image, Send, Smile } from "lucide-react";
import { IUser } from "@/slices/authSlice";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { memo, useState } from "react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down";

const ChatInput = ({
  input,
  setInput,
  sendMessage,
  handleStopTyping,
  handleTyping,
  typingUser,
  handleEmojiClick,
  handleUploadImage,
  handleUploadFile,
  user_choose,
}: {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  handleStopTyping: () => void;
  handleTyping: () => void;
  typingUser: IUser | null;
  handleEmojiClick: (emojiObject: EmojiClickData) => void;
  handleUploadImage: (ee: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadFile: (ee: React.ChangeEvent<HTMLInputElement>) => void;
  user_choose: IUser | null;
}) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  return (
    <div className="flex items-center gap-2 mt-4 relative">
      <div className="absolute text-center text-gray-900 -top-7">
        {typingUser ? typingUser.name + " đang nhập..." : ""}
      </div>
      <Button
        disabled={user_choose ? false : true}
        className={
          user_choose
            ? "!bg-gray-900 !hover:bg-blue-700 relative !cursor-pointer hidden lg:inline"
            : "!bg-gray-300 !hover:bg-blue-700 relative !cursor-pointer hidden lg:inline"
        }
      >
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleUploadFile(e);
          }}
          className="top-0 right-0 left-0 bottom-0 absolute opacity-0"
          name="file"
          type="file"
        />
        <File className="w-5 h-5" />
      </Button>
      <Input
        disabled={user_choose ? false : true}
        className="flex-1 text-gray-900"
        placeholder="Nhập tin nhắn..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : handleTyping())}
        onKeyUp={handleStopTyping}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={
              user_choose
                ? "!bg-gray-900 !hover:bg-blue-700 inline lg:hidden"
                : "!bg-gray-300 !hover:bg-blue-700 inline lg:hidden"
            }
          >
            <CirclePlus className="w-5 h-5 !cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Gửi hình ảnh
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleUploadImage(e);
                }}
                className="top-0 right-0 left-0 bottom-0 absolute opacity-0 !cursor-pointer"
                name="hinh_anh"
                type="file"
              />
              <Image className="w-5 h-5 !cursor-pointer" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              Gửi file
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleUploadFile(e);
                }}
                className="top-0 right-0 left-0 bottom-0 absolute opacity-0"
                name="file"
                type="file"
              />
              <File className="w-5 h-5" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowPicker(!showPicker)}>
              {showPicker ? "Ẩn Emoji" : "Hiện Emoji"}{" "}
              <Smile className="w-5 h-5" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {showPicker && (
        <EmojiPicker
          className="!absolute !bottom-13"
          skinTonesDisabled
          emojiStyle={EmojiStyle["APPLE"]}
          onEmojiClick={(emojiObject: EmojiClickData) =>
            handleEmojiClick(emojiObject)
          }
        />
      )}
      <Button
        disabled={user_choose ? false : true}
        onClick={() => setShowPicker(!showPicker)}
        className={
          user_choose
            ? "!bg-gray-900 !hover:bg-blue-700 hidden lg:inline"
            : "!bg-gray-300 !hover:bg-blue-700 hidden lg:inline"
        }
      >
        <Smile className="w-5 h-5" />
      </Button>
      <Button
        disabled={user_choose ? false : true}
        className={
          user_choose
            ? "!bg-gray-900 !hover:bg-blue-700 relative !cursor-pointer hidden lg:inline"
            : "!bg-gray-300 !hover:bg-blue-700 relative !cursor-pointer hidden lg:inline"
        }
      >
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleUploadImage(e);
          }}
          className="top-0 right-0 left-0 bottom-0 absolute opacity-0 !cursor-pointer"
          name="hinh_anh"
          type="file"
        />
        <Image className="w-5 h-5 !cursor-pointer" />
      </Button>
      <Button
        disabled={user_choose ? false : true}
        onClick={sendMessage}
        className="!bg-green-500 hover:bg-blue-700"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default memo(ChatInput);
