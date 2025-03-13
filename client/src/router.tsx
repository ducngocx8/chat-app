import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Chat from "@/pages/chat";
import Login from "@/pages/login";
import Logout from "@/pages/logout";
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/chat",
      element: <Chat />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
