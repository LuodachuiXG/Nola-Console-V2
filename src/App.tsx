import { ThemeProvider } from "@/components/layout/theme-provider.tsx";
import AppSidebar from "@/components/layout/app-sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { Outlet, useLocation } from "react-router";
import Header from "@/components/layout/header.tsx";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import Routers from "@/routers/Routers.tsx";

function App() {
  const location = useLocation();

  // 路由改变时修改网页标题
  useEffect(() => {
    const pathName = Routers.getDisplayName(location.pathname);
    document.title = pathName ? `${pathName} - Nola` : "Nola";
  }, [location]);

  return (
    <ThemeProvider defaultTheme="dark">
      <Toaster position="top-center" />
      <div className="h-dvh w-screen antialiased overflow-y-auto">
        <SidebarProvider defaultOpen={false}>
          <AppSidebar className="z-30" />
          <main className="z-10 relative w-screen h-dvh">
            <Header />
            {/*内容容器*/}
            <div className="min-h-[calc(100dvh-3.75rem)] mt-15 p-4 pt-0">
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
