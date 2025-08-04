import type { Tag } from "@/features/tag/models/Tag.ts";
import type { Category } from "@/features/category/models/Category.ts";
import type { Post } from "@/features/post/models/Post.ts";

/**
 * 博客概览数据接口
 */
export interface BlogOverview {
  /** 项目数量 **/
  count: BlogOverviewCount;
  /** 文章最多的 6 个标签 **/
  tags: Array<Tag>;
  /** 文章最多的 6 个分类 **/
  categories: Array<Category>;
  /** 浏览量最多的文章 **/
  mostViewedPost: Post | null;
  /** 最后一次操作记录 **/
  lastOperation: string | null;
  /** 最后登录时间戳（毫秒）**/
  lastLoginDate: number | null;
  /** 博客创建时间戳（毫秒）**/
  createDate: number | null;
}

/**
 * 博客概览项目数量接口
 */
export interface BlogOverviewCount {
  post: number;
  tag: number;
  category: number;
  comment: number;
  diary: number;
  file: number;
  link: number;
  menu: number;
}