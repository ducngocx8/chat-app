import { IUser } from "@/slices/authSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserListState {
  users: IUser[];
}

const initialState: UserListState = {
  users: [],
};

const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<IUser>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.user_id !== action.payload);
    },
  },
});

export const { setUsers, addUser, removeUser } = userListSlice.actions;
export default userListSlice.reducer;
