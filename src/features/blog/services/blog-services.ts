import service from "@/axios";
import type ServerResponse from "@/models/response/ServerResponse.ts";
import type { BlogInfo } from "@/features/blog/models/BlogInfo.ts";

/**
 * 获取博客信息
 */
export function getBlogInfo(): Promise<ServerResponse<BlogInfo>> {
  return service({
    url: "/api/config/blog",
    method: "GET",
  });
}

/**
 * 获取博客信息
 * @param title 站点标题
 * @param subtitle 站点副标题
 * @param logo 站点 logo
 * @param favicon 站点 favicon
 */
export function updateBlogInfo(
  title: string,
  subtitle?: string | null,
  logo?: string | null,
  favicon?: string | null,
) {
  return service({
    url: "/admin/config/blog",
    method: "PUT",
    data: {
      title: title,
      subtitle: subtitle,
      logo: logo,
      favicon: favicon,
    },
  });
}

/**
 * 初始化博客
 * @param title 站点标题
 * @param subtitle 站点副标题
 */
export function initBlogInfo(
  title: string,
  subtitle: string | null,
): Promise<ServerResponse<boolean>> {
  const st = subtitle?.trim().length === 0 || !subtitle ? null : subtitle;
  return service({
    url: "/admin/config/blog",
    method: "POST",
    data: {
      title: title,
      subtitle: st,
    },
  });
}

/**
 * 创建博客管理员
 * @param username 用户名
 * @param displayName 显示名称
 * @param email 邮箱
 * @param password 密码
 */
export function createBlogAdmin(
  username: string,
  displayName: string,
  email: string,
  password: string,
): Promise<ServerResponse<boolean>> {
  return service({
    url: "/admin/config/blog/admin",
    method: "POST",
    data: {
      username: username,
      displayName: displayName,
      email: email,
      password: password,
    },
  });
}
