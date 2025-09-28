import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar.tsx";
import ThemeController from "@/components/shared/theme-controller.tsx";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import useUserStore from "@/hooks/stores/use-user-store.ts";
import { useOnlineCount } from "@/hooks/use-online-count.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { timestampToDate } from "@/utils/date-utils.ts";
import {
  Link,
  LogOut as LogOutIcon,
  RotateCcwKey as PasswordIcon,
  UserRound as UserIcon,
} from "lucide-react";
import type { User } from "@/features/user/models/User.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import LogOutDialog from "@/features/user/components/LogOutDialog.tsx";
import Routers from "@/routers/router.tsx";
import { useNavigate } from "react-router";
import UpdateUserInfoDialog from "@/features/user/components/UpdateUserInfoDialog.tsx";
import UpdatePasswordDialog from "@/features/user/components/UpdatePasswordDialog.tsx";

export default function Header() {
  // 当前是否已登录
  const isLogin = useUserStore((state) => state.isLogin);
  // 当前登录的用户
  const user = useUserStore((state) => state.user);
  // 设置用户
  const setUser = useUserStore((state) => state.setUser);

  const navigate = useNavigate();

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

  // 退出登录
  function logOut() {
    setUser(null);
    navigate(Routers.Login.path, { replace: true });
  }

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
        transition: "padding-left 0.3s ease-in-out",
      }}
    >
      {/* 已登录才显示 SidebarTrigger */}
      {isLogin && (
        <animated.div style={{ ...springs }}>
          <SidebarTrigger />
        </animated.div>
      )}
      <div className="grow flex gap-2 items-center justify-end">
        {isLogin && user && (
          <>
            {/*博客在线人数显示*/}
            <BlogOnlineCounter />
            {/*登录的博主*/}
            <Blogger user={user} onLogOut={logOut} />
          </>
        )}
        {/*主题切换按钮*/}
        <ThemeController />
      </div>
    </div>
  );
}

/**
 * 博主按钮组件
 * @param user 当前登录用户
 * @param onLogOut 退出登录回调
 */
function Blogger({ user, onLogOut }: { user: User; onLogOut: () => void }) {
  // 是否显示退出登录弹窗
  const [showLogOutDialog, setShowLogOutDialog] = useState(false);
  // 是否显示个人信息弹窗
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);
  // 是否显示修改密码弹窗
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center p-2 py-1.5 gap-2 rounded-md transition-colors hover:bg-accent dark:hover:bg-accent/50">
            <Avatar className="size-5">
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback className="text-xs">
                {user.displayName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm line-clamp-1">{user.displayName}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowUserInfoDialog(true)}>
            <UserIcon />
            <p>个人信息</p>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
            <PasswordIcon />
            <p>修改密码</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowLogOutDialog(true)}>
            <LogOutIcon />
            <p>退出登录</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*个人信息弹窗*/}
      <UpdateUserInfoDialog
        show={showUserInfoDialog}
        onChange={setShowUserInfoDialog}
      />

      {/*修改密码弹窗*/}
      <UpdatePasswordDialog
        show={showPasswordDialog}
        onChange={setShowPasswordDialog}
      />

      {/*退出登录弹窗*/}
      <LogOutDialog
        show={showLogOutDialog}
        onChange={setShowLogOutDialog}
        onConfirm={onLogOut}
      />
    </>
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
              <p className="text-sm text-foreground line-clamp-1">
                在线人数：{onlineCount < 0 ? "未知" : onlineCount}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <span>通过 SSE</span>
                <Link className="size-3" />
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
        "min-w-2 min-h-2 size-2 rounded-full relative before:content-[''] before:absolute before:size-2 before:left-0 before:top-0 before:animate-ping before:rounded-full",
        {
          "bg-green-500 before:bg-green-500": status === "success",
          "bg-red-500 before:bg-red-500": status === "error",
        },
      )}
    ></div>
  );
}
