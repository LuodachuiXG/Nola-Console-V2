/**
 * 服务器响应接口
 */
export default interface ServerResponse<T> {
  code: number;
  errMsg: string | null;
  data: T | null;
}
