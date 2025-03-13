import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userListReducer from "./slices/userListSlice";
import chatReducer from "./slices/chatSlice";

import storage from "redux-persist/lib/storage"; // Lưu vào localStorage
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    userList: userListReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Bỏ qua kiểm tra serializable
    }),
});

export const persistor = persistStore(store);
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
