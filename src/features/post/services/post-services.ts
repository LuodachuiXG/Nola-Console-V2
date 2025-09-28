import service from "@/axios";
import type ServerResponse from "@/models/response/ServerResponse.ts";
import type { Post } from "@/features/post/models/Post.ts";
import type { PostRequest } from "@/features/post/models/PostRequest.ts";
import type { PostSort } from "@/features/post/models/PostSort.ts";
import type { PostStatus } from "@/features/post/models/PostStatus.ts";
import type { PostVisible } from "@/features/post/models/PostVisible.ts";
import type { PostContentResponse } from "@/features/post/models/PostContentResponse.ts";
import type { PostContent } from "@/features/post/models/PostContent.ts";

/**
 * 添加文章
 * @param post 文章请求接口
 */
export function addPost(post: PostRequest): Promise<ServerResponse<Post>> {
  return service({
    url: "/admin/post",
    method: "POST",
    data: post,
  });
}

/**
 * 删除文章
 * 只能删除已经在回收站（文章状态为已删除）的文章，
 * 此接口为彻底删除文章。
 * @param ids 文章 ID 数组
 */
export function deletePost(
  ids: Array<number>,
): Promise<ServerResponse<boolean>> {
  return service({
    url: "/admin/post",
    method: "DELETE",
    data: ids,
  });
}

/**
 * 回收文章
 * 将文章移入回收站（文章状态改为已删除），并非彻底删除文章，
 * @param ids 文章 ID 数组
 */
export function recyclePost(
  ids: Array<number>,
): Promise<ServerResponse<boolean>> {
  return service({
    url: "/admin/post/recycle",
    method: "PUT",
    data: ids,
  });
}

/**
 * 恢复文章
 * 将文章从回收站恢复（文章状态改为发布或草稿）
 * @param ids 文章 ID 数组
 * @param status 恢复后的文章状态（不能设为 DELETE，否则接口会报错）
 */
export function restorePost(
  ids: Array<number>,
  status: PostStatus,
): Promise<ServerResponse<boolean>> {
  return service({
    url: `/admin/post/restore/${status}`,
    method: "PUT",
    data: ids,
  });
}

/**
 * 修改文章
 * 用于修改文章基本信息，此接口无法修改文章内容
 * @param post 文章请求接口（无需传 content 值）
 */
export function updatePost(
  post: PostRequest,
): Promise<ServerResponse<boolean>> {
  return service({
    url: "/admin/post",
    method: "PUT",
    data: post,
  });
}

/**
 * 修改文章状态
 * @param postId 文章 ID
 * @param status 文章状态（为 null 保持不变）
 * @param visible 文章可见性（为 null 保持不变）
 * @param pinned 是否置顶（为 null 保持不变）
 */
export function updatePostStatus(
  postId: number,
  status: PostStatus | null,
  visible: PostVisible | null,
  pinned: boolean | null,
): Promise<ServerResponse<boolean>> {
  return service({
    url: "/admin/post/status",
    method: "PUT",
    data: {
      postId: postId,
      status: status,
      visible: visible,
      pinned: pinned,
    },
  });
}

/**
 * 通过文章 ID 获取文章
 * @param postId 文章 ID
 */
export function getPostById(postId: number): Promise<ServerResponse<Post>> {
  return service({
    url: `/admin/post/${postId}`,
    method: "GET",
  });
}

/**
 * 通过文章别名获取文章
 * @param slug 文章别名
 */
export function getPostBySlug(slug: string): Promise<ServerResponse<Post>> {
  return service({
    url: `/admin/post/slug/${slug}`,
    method: "GET",
  });
}

/**
 * 获取文章
 * @param page 页数（传 0 获取全部）
 * @param size 每页条数
 * @param status 文章状态
 * @param visible 文章可见性
 * @param key 关键词（标题、别名、摘要、内容）
 * @param tag 标签 ID
 * @param category 分类 ID
 * @param sort 文章排序
 */
export function getPosts(
  page: number = 0,
  size: number = 0,
  status: PostStatus | null,
  visible: PostVisible | null,
  key: string | null,
  tag: number | null,
  category: number | null,
  sort: PostSort | null,
): Promise<ServerResponse<Post>> {
  let url = `/admin/post?page=${page}&size=${size}`;
  if (status) {
    url += `&status=${status}`;
  }
  if (visible) {
    url += `&visible=${visible}`;
  }
  if (key) {
    url += `&key=${key}`;
  }
  if (tag) {
    url += `&tag=${tag}`;
  }
  if (category) {
    url += `&category=${category}`;
  }
  if (sort) {
    url += `&sort=${sort}`;
  }

  return service({
    url: url,
    method: "GET",
  });
}

/**
 * 获取文章正文和草稿列表（非内容）
 * @param postId 文章 ID
 */
export function getPostContentAndDraftsList(
  postId: number,
): Promise<ServerResponse<PostContentResponse>> {
  return service({
    url: `/admin/post/content/${postId}`,
    method: "GET",
  });
}

/**
 * 修改文章正文
 * 此接口用于修改某个文章的正文内容，如果要修改草稿，请使用“修改文章草稿”接口。
 * @param postId 文章 ID
 * @param content 文章内容 (Markdown / PlainText)
 */
export function updatePostContent(
  postId: number,
  content: string,
): Promise<ServerResponse<boolean>> {
  return service({
    url: `/admin/post/publish`,
    method: "PUT",
    data: {
      postId: postId,
      content: content,
    },
  });
}

/**
 * 获取文章正文
 * 此接口用于获取文章已经发布的正文，如果要获取草稿内容，请使用“获取文章草稿”接口。
 * @param postId 文章 ID
 */
export function getPostContent(
  postId: number,
): Promise<ServerResponse<PostContent>> {
  return service({
    url: `/admin/post/publish/${postId}`,
    method: "GET",
  });
}

/**
 * 添加文章草稿
 * @param postId 文章 ID
 * @param content 草稿内容 (Markdown / PlainText)
 * @param draftName 草稿名
 */
export function addPostDraft(
  postId: number,
  content: string,
  draftName: string,
): Promise<ServerResponse<PostContent>> {
  return service({
    url: `/admin/post/draft`,
    method: "POST",
    data: {
      postId: postId,
      content: content,
      draftName: draftName,
    },
  });
}

/**
 * 删除文章草稿
 * @param postId 文章 ID
 * @param draftNames 草稿名数组
 */
export function deletePostDraft(
  postId: number,
  draftNames: Array<string>,
): Promise<ServerResponse<boolean>> {
  return service({
    url: `/admin/post/draft/${postId}`,
    method: "DELETE",
    data: draftNames,
  });
}

/**
 * 修改文章草稿
 * 此接口用于修改文章草稿，修改文章正文内容，请使用“修改文章正文”接口。
 * @param postId 文章 ID
 * @param content 文章内容 (Markdown / PlainText)
 * @param draftName 草稿名
 */
export function updatePostDraft(
  postId: number,
  content: string,
  draftName: string,
): Promise<ServerResponse<boolean>> {
  return service({
    url: `/admin/post/draft`,
    method: "PUT",
    data: {
      postId: postId,
      content: content,
      draftName: draftName,
    },
  });
}

/**
 * 修改文章草稿名
 * @param postId 文章 ID
 * @param oldName 旧草稿名
 * @param newName 新草稿名
 */
export function updatePostDraftName(
  postId: number,
  oldName: string,
  newName: string,
): Promise<ServerResponse<boolean>> {
  return service({
    url: `/admin/post/draft/name`,
    method: "PUT",
    data: {
      postId: postId,
      oldName: oldName,
      newName: newName,
    },
  });
}

/**
 * 将草稿转为正文
 * 将一篇文章的草稿，转换为文章的正文
 * @param postId 文章 ID
 * @param draftName 草稿名
 * @param deleteContent 是否删除原来的正文（默认 false）
 * @param contentName 正文草稿名
 *                    如果不删除正文（deleteContent = false），原先的正文将转为草稿，
 *                    如果此项设 null，将默认使用被转换为正文的旧草稿名。
 */
export function switchPostDraftToContent(
  postId: number,
  draftName: string,
  deleteContent: boolean,
  contentName: string | null,
): Promise<ServerResponse<boolean>> {
  return service({
    url: `/admin/post/draft/publish`,
    method: "PUT",
    data: {
      postId: postId,
      draftName: draftName,
      deleteContent: deleteContent,
      contentName: contentName,
    },
  });
}

/**
 * 获取文章草稿
 * 包含草稿的内容
 * @param postId 文章 ID
 * @param draftName 草稿名
 */
export function getPostDraft(
  postId: number,
  draftName: string,
): Promise<ServerResponse<PostContent>> {
  return service({
    url: `/admin/post/${postId}/draft/${draftName}`,
    method: "GET",
  });
}
