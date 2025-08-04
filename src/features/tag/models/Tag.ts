/**
 * 标签接口
 */
export interface Tag {
  /** 标签 ID **/
  tagId: number;
  /** 标签名 **/
  displayName: string;
  /** 标签别名 **/
  slug: string;
  /** 标签颜色 **/
  color: string | null;
  /** 文章数量 **/
  postCount: number
}