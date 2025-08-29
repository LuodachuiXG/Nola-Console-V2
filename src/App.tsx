import { ThemeProvider } from "@/components/layout/theme-provider.tsx";
import AppSidebar from "@/components/layout/app-sidebar.tsx";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar.tsx";
import { Outlet, useLocation } from "react-router";
import Header from "@/components/layout/header.tsx";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import Routers from "@/routers/Routers.tsx";
import clsx from "clsx";

/**
 * App 入口
 */
export default function App() {
  const location = useLocation();
  // 路由改变时修改网页标题
  useEffect(() => {
    const pathName = Routers.getDisplayName(location.pathname);
    document.title = pathName ? `${pathName} - Nola` : "Nola";
  }, [location]);

  return (
    <ThemeProvider defaultTheme="dark">
      <Toaster position="top-center" />
      <div className="h-dvh w-screen antialiased overflow-y-auto scroll-smooth">
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <ContentContainer />
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}

/**
 * App 内容容器
 */
function ContentContainer() {
  const { open, isMobile } = useSidebar();

  return (
    <main
      className={clsx("z-10 relative w-full h-dvh", {
        "ml-64": open && !isMobile,
      })}
      style={{
        transition: "margin-left 0.3s ease",
      }}
    >
      <Header />
      {/*内容容器*/}
      <div className="mt-15 p-4 pt-0 z-10">
        <Outlet />
      </div>
    </main>
  );
}
