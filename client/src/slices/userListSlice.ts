import { IUser } from "@/slices/authSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserListState {
  users: IUser[];
  user_join_last: IUser | null;
}

const initialState: UserListState = {
  users: [],
  user_join_last: null,
};

const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
    setUserJoin: (state, action: PayloadAction<IUser>) => {
      state.user_join_last = action.payload;
    },
  },
});

export const { setUsers, setUserJoin } = userListSlice.actions;
export default userListSlice.reducer;
