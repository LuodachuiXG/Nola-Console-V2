import { createBrowserRouter, redirect } from "react-router";
import App from "@/App.tsx";
import useUserStore from "@/hooks/stores/use-user-store.ts";
import Routers from "@/routers/Routers.tsx";

/**
 * 未登录跳转到登录页
 */
const authLoader = () => {
  const isLogin = useUserStore.getState().isLogin;
  if (!isLogin) {
    // 还未登录
    throw redirect("/console");
  }

  // 继续正常加载路由
  return null;
};

/**
 * 已登录跳转到概述页
 */
const loginLoader = () => {
  const isLogin = useUserStore.getState().isLogin;
  if (isLogin) {
    // 已登录
    throw redirect("/console/overview");
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: "/console",
    element: <App />,
    children: [
      {
        index: true,
        element: Routers.Login.element,
        loader: loginLoader,
      },
      {
        path: Routers.Overview.path,
        element: Routers.Overview.element,
        loader: authLoader,
      },
      {
        path: Routers.Post.path,
        element: Routers.Post.element,
        loader: authLoader,
      },
    ],
  },
]);
