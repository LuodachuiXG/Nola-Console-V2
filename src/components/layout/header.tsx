import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar.tsx";
import ThemeController from "@/components/shared/theme-controller.tsx";
import { useSpring, animated } from "@react-spring/web";
import { useEffect } from "react";
import { clsx } from "clsx";
import useUserStore from "@/hooks/stores/use-user-store.ts";

export default function Header() {
  const isLogin = useUserStore((state) => state.isLogin);

  const { open, isMobile } = useSidebar();

  const [springs, api] = useSpring(() => ({
    from: { scale: 0, rotate: 0 },
    to: { scale: 1 },
  }));

  // 在 Sidebar 开关时，给操作按钮左或右摇摆的动画
  useEffect(() => {
    api.stop();
    if (open) {
      api.start({
        from: {
          scale: 1,
          rotate: 0,
        },
        to: [
          {
            scale: 1,
            rotate: -120,
            config: { tension: 180, friction: 12, duration: 160 },
          },
          { scale: 1, rotate: 0, config: { tension: 180, friction: 12 } },
        ],
      });
    } else {
      api.start({
        from: {
          scale: 1,
          rotate: 0,
        },
        to: [
          {
            scale: 1,
            rotate: 120,
            config: { tension: 180, friction: 12, duration: 160 },
          },
          { scale: 1, rotate: 0, config: { tension: 180, friction: 12 } },
        ],
      });
    }
  }, [open, api, isLogin]);

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 z-0 w-dvw px-4 h-15 backdrop-blur-xl bg-background/5 flex items-center",
        {
          "pl-68": open && !isMobile,
        },
      )}
      style={{
        transition: "padding-left 0.3s ease-out",
      }}
    >
      {/* 已登录才显示 SidebarTrigger */}
      {isLogin && (
        <animated.div style={{ ...springs }}>
          <SidebarTrigger />
        </animated.div>
      )}
      <div className="grow flex justify-end">
        <ThemeController />
      </div>
    </div>
  );
}
