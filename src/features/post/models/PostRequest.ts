import type { PostStatus } from "@/features/post/models/PostStatus.ts";
import type { PostVisible } from "@/features/post/models/PostVisible.ts";

/**
 * 文章请求接口
 */
export interface PostRequest {
  /** 文章 ID（添加时为 null，修改时必填） **/
  postId: number | null;
  /** 文章标题 (<=256) **/
  title: string;
  /** 是否自动生成摘要 (默认 false)**/
  autoGenerateExcerpt: boolean | null;
  /** 文章摘要 (<=1024) **/
  excerpt: string | null;
  /** 文章别名 (<=128) **/
  slug: string;
  /** 是否允许评论 **/
  allowComment: boolean;
  /** 文章状态 **/
  status: PostStatus;
  /** 文章可见性 **/
  visible: PostVisible;
  /** 文章正文内容 (Markdown/PlainText) (添加时必填，修改时为 null) **/
  content: string;
  /** 分类 ID **/
  categoryId: number | null;
  /** 标签 ID 数组 **/
  tagIds: Array<number> | null;
  /** 封面 (<=512) **/
  cover: string | null;
  /** 是否置顶 (默认 false) **/
  pinned: boolean | null;
  /** 文章是否有密码（为 true 时需提供 password，为 null 保持不变，为 false 删除密码） **/
  encrypted: boolean | null;
  /** 文章密码 (<=64) **/
  password: string | null;
}
