import { ThemeProvider } from "@/components/layout/theme-provider.tsx";
import AppSidebar from "@/components/layout/app-sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { Outlet } from "react-router";
import Header from "@/components/layout/header.tsx";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Toaster position="top-center" />
      <div className="h-dvh w-screen">
        <SidebarProvider defaultOpen={false}>
          <AppSidebar className="z-30" />
          <main className="z-10 relative w-screen h-dvh">
            <Header />
            {/*内容容器*/}
            <div className="h-[calc(100dvh-3.75rem)] mt-15">
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
