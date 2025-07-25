import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar.tsx";
import {
  BookOpen as PostIcon,
  ChartColumnStacked as CategoryIcon,
  ChartNoAxesGantt as OverviewIcon,
  DatabaseBackup as BackupIcon,
  Link as LinkIcon,
  Menu as MenuIcon,
  MessageSquare as CommentIcon,
  Notebook as DiaryIcon,
  Paperclip as FileIcon,
  Settings as SettingsIcon,
  Tags as TagIcon,
} from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import useUserStore from "@/hooks/stores/use-user-store.ts";
import NolaBlack from "@/assets/img/nola-black.png";
import { Link } from "react-router";

const items = [
  {
    title: "概述",
    children: [
      {
        title: "概述",
        url: "overview",
        icon: OverviewIcon,
      },
    ],
  },
  {
    title: "内容",
    children: [
      {
        title: "文章",
        url: "post",
        icon: PostIcon,
      },
      {
        title: "标签",
        url: "#",
        icon: TagIcon,
      },
      {
        title: "分类",
        url: "#",
        icon: CategoryIcon,
      },
      {
        title: "评论",
        url: "#",
        icon: CommentIcon,
      },
      {
        title: "日记",
        url: "#",
        icon: DiaryIcon,
      },
      {
        title: "附件",
        url: "#",
        icon: FileIcon,
      },
      {
        title: "链接",
        url: "#",
        icon: LinkIcon,
      },
      {
        title: "菜单",
        url: "#",
        icon: MenuIcon,
      },
    ],
  },
  {
    title: "系统",
    children: [
      {
        title: "设置",
        url: "#",
        icon: SettingsIcon,
      },
      {
        title: "备份",
        url: "#",
        icon: BackupIcon,
      },
    ],
  },
];

function AppSidebar({ className }: React.ComponentProps<"div">) {
  const isLogin = useUserStore((state) => state.isLogin);

  const { setOpen } = useSidebar();

  useEffect(() => {
    if (isLogin) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  return (
    <Sidebar className={className} variant="sidebar">
      <SidebarHeader>
        <div className="flex gap-4 items-center justify-center mt-2 group/logo min-h-16 ">
          <img
            className="opacity-80 size-16 select-none"
            src={NolaBlack}
            alt="nola"
            draggable={false}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {items.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.children.map((child) => (
                  <SidebarMenuItem key={child.title}>
                    <SidebarMenuButton asChild>
                      <Link to={child.url}>
                        <child.icon />
                        <span>{child.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
