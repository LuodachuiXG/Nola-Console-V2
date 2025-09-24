import { useEffect, useRef, useState } from "react";
import { EventSource } from "eventsource";
import useUserStore from "@/hooks/stores/use-user-store.ts";
import { isNumber } from "@/utils/number.ts";

/**
 * 当前博客在线人数监听 Hook
 * 通过 SSE 接收服务器推送消息
 */
export const useOnlineCount = () => {
  const [onlineCount, setOnlineCount] = useState<number>(-1);
  // 更新时间戳（毫秒）
  const [updateTime, setUpdateTime] = useState<number>(-1);
  // 浏览器是否支持 SSE
  const [supportSSE, setSupportSSE] = useState<boolean>(false);

  // SSE 引用
  const sseRef = useRef<EventSource | null>(null);

  // 当前登录用户的 Token
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!isSSESupported()) {
      // 当前浏览器不支持 SSE
      setSupportSSE(false);
      console.warn(
        "当前浏览器不支持 SSE，无法显示博客实时在线人数，请升级浏览器。",
      );
    }
    setSupportSSE(true);

    if (!token) {
      // 未登录或登录已过期
      setOnlineCount(-1);
      setUpdateTime(-1);
      sseRef.current?.close();
      return;
    }

    const es = new EventSource(
      import.meta.env.VITE_BASE_URL + "/admin/overview/online",
      {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init.headers,
              Authorization: `Bearer ${token}`,
            },
          }),
      },
    );

    sseRef.current = es;
    es.onopen = () => {
    };
    es.onerror = (error) => {
      console.error("SSE 错误:" + error.message);
    };

    es.onmessage = (event) => {
      const res = event.data;
      if (res === "ping") {
        // 服务端心跳消息，无需处理
      } else {
        // 在线人数消息
        const json = JSON.parse(res);
        const count = String(json.count);
        const time = String(json.timestamp);
        if (count && time && isNumber(count) && isNumber(time)) {
          setOnlineCount(Number(count));
          setUpdateTime(Number(time));
        }
      }
    };

    const handleBeforeUnload = () => {
      es.close();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      es.close();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [token]);

  return {
    onlineCount: onlineCount,
    updateTime: updateTime,
    supportSSE: supportSSE,
  };
};

/**
 * 判断当前浏览器是否支持 SSE
 */
function isSSESupported(): boolean {
  return typeof EventSource !== "undefined";
}
