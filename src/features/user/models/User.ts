/**
 * 用户接口
 */
export interface User {
  /** 用户名 **/
  username: string,
  /** 邮箱 **/
  email: string,
  /** 显示名称 **/
  displayName: string,
  /** 描述 **/
  description: string | null,
  /** 创建日期 **/
  createDate: number,
  /** 最后登录时间 **/
  lastLoginDate: number | null,
  /** 头像 **/
  avatar: string | null,
  /** Token 令牌 **/
  token: string
}
