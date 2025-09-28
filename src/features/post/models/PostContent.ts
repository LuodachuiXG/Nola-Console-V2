import type { PostContentStatus } from "@/features/post/models/PostContentStatus.ts";

/**
 * 文章内容接口
 */
export interface PostContent {
  /** 文章内容 ID **/
  postContentId: number;
  /** 文章 ID **/
  postId: number;
  /** 文章内容 (Markdown / PlainText) **/
  content: string;
  /** 文章 HTML 内容 **/
  html: string;
  /** 文章内容状态 **/
  status: PostContentStatus;
  /** 草稿名（如果当前是文章正文，则此项始终为 null）**/
  draftName: string | null;
  /** 最后修改时间戳（毫秒）**/
  lastModifyTime: number | null;
}
