/**
 * 博客信息接口
 */
export interface BlogInfo {
  /** 站点标题 **/
  title: string;
  /** 站点副标题 **/
  subtitle: string | null;
  /** 博主名 **/
  blogger: string | null;
  /** LOGO **/
  logo: string | null;
  /** Favicon **/
  favicon: string | null;
  /** 博客创建日期 **/
  createDate: number;
}
