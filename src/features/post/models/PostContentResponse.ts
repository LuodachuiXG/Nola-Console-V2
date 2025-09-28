import type { PostContentStatus } from "@/features/post/models/PostContentStatus.ts";

/**
 * 文章内容列表响应接口
 * 此接口仅用于列出某个文章的所有正文和草稿内容，不包含实际的文章内容
 */
export interface PostContentResponse {
  /** 文章内容 ID **/
  postContentId: number;
  /** 文章 ID **/
  postId: number;
  /** 文章内容状态 **/
  status: PostContentStatus;
  /** 草稿名 (如果是草稿) **/
  draftName: string;
  /** 最后修改时间戳 (毫秒) **/
  lastModifyTime: number | null;
}
