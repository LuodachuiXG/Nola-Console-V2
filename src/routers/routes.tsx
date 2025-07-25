import { createBrowserRouter, redirect } from "react-router";
import App from "@/App.tsx";
import LoginPage from "@/pages/login/page.tsx";
import OverviewPage from "@/pages/overview/page.tsx";
import PostPage from "@/pages/post/page.tsx";
import useUserStore from "@/hooks/stores/use-user-store.ts";

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
        element: <LoginPage />,
        loader: loginLoader,
      },
      {
        path: "overview",
        element: <OverviewPage />,
        loader: authLoader,
      },
      {
        path: "post",
        element: <PostPage />,
        loader: authLoader,
      },
    ],
  },
]);
