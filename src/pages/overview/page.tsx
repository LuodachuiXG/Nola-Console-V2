import React, { useEffect, useMemo, useState } from "react";
import { getOverview } from "@/features/blog/services/blog-services.ts";
import type {
  BlogOverview,
  BlogOverviewCount,
} from "@/features/blog/models/BlogOverview.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  getDaysSinceTimestamp,
  getTimeSinceTimestamp,
  timestampToDate,
} from "@/utils/date-utils.ts";
import useUserStore from "@/hooks/stores/use-user-store.ts";
import useItemCountStore from "@/hooks/stores/use-item-count-store.ts";
import clsx from "clsx";
import {
  BookOpen as PostIcon,
  ChartColumnStacked as CategoryIcon,
  Link as LinkIcon,
  Menu as MenuIcon,
  MessageSquare as CommentIcon,
  Notebook as DiaryIcon,
  Paperclip as FileIcon,
  Tags as TagIcon,
} from "lucide-react";
import type { Post } from "@/features/post/models/Post.ts";

/**
 * 概述页面
 * @constructor
 */
export default function OverviewPage() {
  // 博客概述数据
  const [blogOverview, setBlogOverview] = useState<BlogOverview | null>(null);
  // 是否正在加载
  const [loading, setLoading] = useState(true);
  // 当前登录的用户
  const user = useUserStore((state) => state.user);

  // 博客创建时间
  const blogCreateDate = blogOverview?.createDate ?? Date.now();
  // 最后登录时间
  const lastLoginDate = user?.lastLoginDate ?? Date.now();

  // 设置当前博客内容的项目数量
  const setItemCount = useItemCountStore((state) => state.setItemCount);

  useEffect(() => {
    // 获取概述信息
    getOverview()
      .then((res) => {
        setBlogOverview(res.data);
        setLoading(false);
        if (res.data?.count) {
          setItemCount(res.data?.count);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [setItemCount]);

  if (loading) {
    return OverviewSkeleton();
  }

  return (
    <>
      <div className="w-full flex flex-col gap-2 md:gap-4">
        {/*浏览量最多的文章*/}
        {blogOverview?.mostViewedPost && (
          <>
            <p className="text-md font-semibold md:text-xl">浏览量最多的文章</p>
            <MostViewedPost post={blogOverview.mostViewedPost} />
          </>
        )}

        {/* 项目数量 */}
        {blogOverview?.count && (
          <>
            <p className="text-md font-semibold md:text-xl">项目</p>
            <ItemCountContainer count={blogOverview?.count} />
          </>
        )}

        {/*文章最多的 6 个分类*/}
        {blogOverview?.categories && blogOverview.categories.length > 0 && (
          <>
            <p className="text-md font-semibold md:text-xl">
              文章最多的 6 个分类
            </p>
            <div className="w-full gap-2 md:gap-4 grid grid-cols-2 md:grid-cols-3">
              {blogOverview.categories
                .sort((a, b) => b.postCount - a.postCount)
                .slice(0, 6)
                .map((category) => (
                  <OverviewCard
                    key={category.categoryId}
                    title={category.displayName}
                    value={category.postCount}
                    icon={<CategoryIcon />}
                    background={category.cover}
                    clickable
                  />
                ))}
            </div>
          </>
        )}

        {/*文章最多的 6 个标签*/}
        {blogOverview?.tags && blogOverview.tags.length > 0 && (
          <>
            <p className="text-md font-semibold md:text-xl">
              文章最多的 6 个标签
            </p>
            <div className="w-full gap-2 md:gap-4 grid grid-cols-2 md:grid-cols-3">
              {blogOverview.tags
                .sort((a, b) => b.postCount - a.postCount)
                .slice(0, 6)
                .map((tag) => (
                  <OverviewCard
                    key={tag.tagId}
                    title={tag.displayName}
                    value={tag.postCount}
                    icon={
                      <TagIcon
                        color={
                          // 去除透明色
                          tag.color ? tag.color.substring(0, 7) : undefined
                        }
                      />
                    }
                    clickable
                  />
                ))}
            </div>
          </>
        )}

        {/*历史*/}
        <p className="text-md font-semibold md:text-xl">历史</p>
        <div className="w-full gap-2 md:gap-4 grid grid-cols-1 md:grid-cols-2">
          {/*博客已创建时间*/}
          <OverviewCard
            title="博客已创建"
            value={getDaysSinceTimestamp(blogCreateDate) + " 天"}
            tips={timestampToDate(blogCreateDate)}
          />

          {/*上次登录时间*/}
          <OverviewCard
            title="上次登录"
            value={getTimeSinceTimestamp(lastLoginDate)}
            tips={timestampToDate(lastLoginDate)}
          />
        </div>

        {/* 最后一条操作记录 */}
        {blogOverview?.lastOperation && (
          <OverviewCard
            title="最后一条操作"
            value={blogOverview.lastOperation}
          />
        )}
      </div>
    </>
  );
}

/**
 * 项目数量容器
 * @param count 数量接口
 */
function ItemCountContainer({ count }: { count: BlogOverviewCount }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
      <OverviewCard
        title="文章"
        value={count.post}
        icon={<PostIcon />}
        clickable
      />
      <OverviewCard
        title="标签"
        value={count.tag}
        icon={<TagIcon />}
        clickable
      />
      <OverviewCard
        title="分类"
        value={count.category}
        icon={<CategoryIcon />}
        clickable
      />
      <OverviewCard
        title="评论"
        value={count.comment}
        icon={<CommentIcon />}
        clickable
      />
      <OverviewCard
        title="日记"
        value={count.diary}
        icon={<DiaryIcon />}
        clickable
      />
      <OverviewCard
        title="文件"
        value={count.file}
        icon={<FileIcon />}
        clickable
      />
      <OverviewCard
        title="链接"
        value={count.link}
        icon={<LinkIcon />}
        clickable
      />
      <OverviewCard
        title="菜单"
        value={count.menu}
        icon={<MenuIcon />}
        clickable
      />
    </div>
  );
}

/**
 * 浏览量最多的文章
 * @param post 文章
 */
function MostViewedPost({ post }: { post: Post }) {
  // 文章封面
  const cover = post?.cover ?? post?.category?.cover;

  // 标记封面是否加载错误
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[auto_1fr] bg-secondary rounded-md border overflow-clip">
      {cover && !imageError && (
        <img
          className=" object-cover max-w-full md:max-w-90"
          src={cover}
          alt={post.title}
          onError={() => setImageError(true)}
        />
      )}
      <div className="p-4 flex flex-col gap-2 justify-between">
        <div className="flex flex-col gap-2">
          {/*文章标题*/}
          <p className="line-clamp-1 text-md md:text-xl">{post.title}</p>
          {/*文章摘要*/}
          <p className="line-clamp-2 md:line-clamp-3 xl:line-clamp-4 text-sm md:text-md text-primary/70">
            {post.excerpt}
          </p>
        </div>
        {/*其他信息*/}
        <div className="flex gap-2 md:gap-3 text-sm md:text-md">
          {/*文章分类*/}
          {post.category && (
            <div className="flex gap-1 items-center [&>svg]:size-3.5 md:[&>svg]:size-4">
              <CategoryIcon />
              <p>{post.category.displayName}</p>
            </div>
          )}

          {/*文章分类*/}
          {post.tags.length > 0 && (
            <div className="flex gap-2 md:gap-3 line-clamp-1">
              {post.tags.map((tag) => (
                <div className="flex gap-1 items-center [&>svg]:size-3.5 md:[&>svg]:size-4">
                  <TagIcon />
                  <p>{tag.displayName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 概述卡片
 * @param title 标题
 * @param value 数据
 * @param tips 鼠标停留显示消息
 * @param icon 图表（显示在 title 前面）
 * @param background 背景图片地址
 * @param clickable 是否可点击
 * @param onClick 点击事件
 */
function OverviewCard({
  title,
  value,
  tips = String(value),
  icon,
  background,
  clickable,
  onClick,
}: {
  title: string;
  value: string | number;
  tips?: string;
  icon?: React.ReactNode;
  background?: string | null;
  clickable?: boolean;
  onClick?: () => void;
}) {
  // 标记图片加载失败
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={clsx(
        "group relative overflow-clip p-4 rounded-md bg-secondary flex flex-col gap-4 w-full fade-in-container select-none border-1 border-transparent",
        {
          "transition-all cursor-pointer active:scale-98 hover:border-primary  active:border-primary/80":
            clickable,
        },
      )}
      onClick={onClick}
    >
      {background && !imageError && (
        <>
          <div className="absolute z-0 left-0 top-0 size-full">
            <div className="transition-colors size-full absolute z-10 bg-gradient-to-b from-white/50 dark:from-black/60 to-transparent group-hover:from-transparent"></div>
            <img
              className="transition-transform size-full object-cover group-hover:scale-115"
              src={background}
              alt={title}
              onError={() => {
                setImageError(true);
              }}
            />
          </div>
        </>
      )}
      <div className="z-10 flex items-center gap-2 [&>svg]:size-4 md:[&>svg]:size-5">
        {icon}
        <p
          className={clsx(
            "text-md md:text-xl line-clamp-1 transition-[font-size]",
            {
              "text-shadow-lg": background && !imageError,
            },
          )}
        >
          {title}
        </p>
      </div>
      <p
        className="z-10 w-full text-right text-lg md:text-2xl font-semibold line-clamp-1 transition-[font-size]"
        title={tips}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * 概述骨架屏
 */
function OverviewSkeleton() {
  return (
    <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton className="fade-in-container w-full h-24" key={i} />
      ))}
    </div>
  );
}
