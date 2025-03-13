import { IUser } from "@/slices/authSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMessage {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  image: string;
  file: string;
  filename: string;
  time: string;
  sender_info?: IUser;
  receiver_info?: IUser;
}

interface ChatState {
  selectedUser: IUser | null;
  messages: IMessage[];
}

const initialState: ChatState = {
  selectedUser: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<IUser | null>) => {
      state.selectedUser = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    setMessage: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
  },
});

export const { setSelectedUser, setMessage, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
