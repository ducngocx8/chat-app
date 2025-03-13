import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  user_id: string;
  name: string;
  address: string;
  avatar: string;
  online: boolean;
}

interface AuthState {
  user: IUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
