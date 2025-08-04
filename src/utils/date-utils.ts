/**
 * 根据时间戳（毫秒）计算距离现在已经多少天
 * @param timestamp
 */
export function getDaysSinceTimestamp(timestamp: number): number {
  // 获取当前时间（毫秒）
  const now = Date.now();

  // 计算时间差（毫秒）
  const diffInMs = now - timestamp;

  // 转换为天数（1 天 = 24 * 60 * 60 * 1000 毫秒）
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * 根据时间戳（毫秒）计算距离现在已经多久（简述）
 * @param timestamp
 */
export function getTimeSinceTimestamp(timestamp: number): string {
  const now = Date.now();
  const diffInMs = now - timestamp;

  // 小于 1 分钟
  if (diffInMs < 60 * 1000) {
    return "刚刚";
  }

  // 小于 1 小时
  if (diffInMs < 60 * 60 * 1000) {
    return `${Math.floor(diffInMs / (60 * 1000))} 分前`;
  }

  // 小于 1 天
  if (diffInMs < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffInMs / (60 * 60 * 1000))} 时前`;
  }

  // 小于 1 月
  if (diffInMs < 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffInMs / (24 * 60 * 60 * 1000))} 天前`;
  }

  // 小于 1 年
  if (diffInMs < 365 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffInMs / (30 * 24 * 60 * 60 * 1000))} 月前`;
  }

  return `${Math.floor(diffInMs / (365 * 24 * 60 * 60 * 1000))} 年前`;
}

/**
 * 将时间戳（毫秒）转换为 2025-07-08 16:05:02 格式
 * @param timestamp 时间戳（毫秒）
 * @param locales Locales
 */
export function timestampToDate(
  timestamp: number,
  locales?: string
): string {
  const date = new Date(timestamp);
  return date.toLocaleString(locales, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).replaceAll(/\//g, "-");
}
