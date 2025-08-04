import LoginPage from "@/pages/login/page.tsx";
import OverviewPage from "@/pages/overview/page.tsx";
import PostPage from "@/pages/post/page.tsx";

export default class Routers {
  static readonly Login = {
    path: "",
    element: <LoginPage />,
    displayName: "登录",
  };

  static readonly Overview = {
    path: "overview",
    element: <OverviewPage />,
    displayName: "概述",
  };

  static readonly Post = {
    path: "post",
    element: <PostPage />,
    displayName: "文章",
  };

  static readonly entries = [Routers.Login, Routers.Overview, Routers.Post];

  /**
   * 根据 path 获取对应的 displayName
   */
  static getDisplayName(path: string) {
    let pathName = path.endsWith("/") ? path.slice(0, -1) : path;
    pathName = pathName.split("/").pop() || "";
    if (pathName === "") {
      return "";
    }
    return (
      Routers.entries.find((entry) => entry.path === pathName)?.displayName ||
      ""
    );
  }
}