import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar.tsx";
import ThemeController from "@/components/shared/theme-controller.tsx";
import { animated, useSpring } from "@react-spring/web";
import { useEffect } from "react";
import { clsx } from "clsx";
import useUserStore from "@/hooks/stores/use-user-store.ts";
import { useOnlineCount } from "@/hooks/use-online-count.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { timestampToDate } from "@/utils/date-utils.ts";
import { Link } from "lucide-react";

export default function Header() {
  // 当前是否已登录
  const isLogin = useUserStore((state) => state.isLogin);

  // 侧边栏
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
        "fixed top-0 left-0 w-full z-20 px-4 h-15 backdrop-blur-3xl bg-background/80 flex items-center",
        {
          "pl-2": isMobile || !open,
          "pl-66": !isMobile && open,
        },
      )}
      style={{
        transition: "padding-left 0.3s ease",
      }}
    >
      {/* 已登录才显示 SidebarTrigger */}
      {isLogin && (
        <animated.div style={{ ...springs }}>
          <SidebarTrigger />
        </animated.div>
      )}
      <div className="grow flex gap-2 items-center justify-end">
        {/*博客在线人数显示*/}
        <BlogOnlineCounter />
        {/*主题切换按钮*/}
        <ThemeController />
      </div>
    </div>
  );
}

/**
 * 博客在线人数展示组件
 * @constructor
 */
function BlogOnlineCounter() {
  // 博客在线人数
  const { onlineCount, supportSSE, updateTime } = useOnlineCount();

  return (
    <>
      {/*当前浏览器支持 SEE 才显示在线人数*/}
      {supportSSE ? (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex gap-2 items-center">
              {/*圆点指示器*/}
              <OnlineCounterIndicator
                status={onlineCount < 0 ? "error" : "success"}
              />
              <p className="text-sm text-foreground">
                在线人数：{onlineCount < 0 ? "未知" : onlineCount}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <span>通过 SSE</span>
                <Link className="size-3"/>
                <span>实时获取在线人数</span>
              </div>
              <div className="flex items-center">
                <span>连接状态：</span>
                <div className="flex items-center gap-1">
                  <OnlineCounterIndicator
                    status={onlineCount < 0 ? "error" : "success"}
                  />
                  <span>{onlineCount < 0 ? "未连接" : "已连接"}</span>
                </div>
              </div>
              <p>更新时间：{timestampToDate(updateTime)}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ) : null}
    </>
  );
}

/**
 * 博客现在人数连接圆点状态指示器
 * @param status 状态（success 绿，error 红）
 */
function OnlineCounterIndicator({ status }: { status: "success" | "error" }) {
  return (
    <div
      className={clsx(
        "size-2 rounded-full relative before:content-[''] before:absolute before:size-2 before:left-0 before:top-0 before:animate-ping before:rounded-full",
        {
          "bg-green-500 before:bg-green-500": status === "success",
          "bg-red-500 before:bg-red-500": status === "error",
        },
      )}
    ></div>
  );
}
