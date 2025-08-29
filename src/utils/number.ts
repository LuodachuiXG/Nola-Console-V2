/**
 * 判断一段字符串是否是数字
 * @param str 待判断的字符串
 */
export function isNumber(str: string): boolean {
  return !isNaN(Number(str));
}