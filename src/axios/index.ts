import axios, { type AxiosRequestHeaders } from "axios";
import axiosStore from "@/hooks/stores/use-axios.ts";
import userStore from "@/hooks/stores/use-user-store.ts";
import { toast } from "sonner";
import { router } from "@/routers/routes.tsx";

// axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

// 请求拦截，在请求发送前加上 Token
service.interceptors.request.use(
  (config) => {
    // 确保 headers 已初始化
    config.headers = config.headers || ({} as AxiosRequestHeaders);
    // 检查用户是否已登录
    const isLogin = userStore.getState().isLogin;
    const token = userStore.getState().token;
    if (isLogin) {
      // 将用户 Token 添加到请求头
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截
service.interceptors.response.use(
  (res) => {
    // 请求成功
    return res.data;
  },
  (err) => {
    if (err.response) {
      // 请求成功发出，且服务器也响应了状态码，但是状态码有问题
      if (err.response.data.code === 401) {
        // Token 过期
        userStore.getState().setUser(null);

        // 目前在登录过期时直接跳转登录页
        // 后面可能要优化为在当前页重新登录，否则可能导致未保存内容丢失 TODO
        router.navigate("/console", { replace: true }).then(() => {});

        const show401 = axiosStore.getState().show401;

        if (!show401) {
          // 当前没有 401 弹窗显示时，才弹出新的 401 提示弹窗，防止重复触发
          axiosStore.getState().setShow401(true);
          toast.error("登录过期");
          console.log("登录过期");
        }
        return Promise.reject("登录过期");
      }

      // 预期错误
      toast.error(err.response.data.errMsg);
      return Promise.reject(err.response.data.errMsg);
    }

    // 非预期错误
    const msg = String(err.code ? err.code : err.response.data.errMsg);
    toast.error(msg);
    return Promise.reject(msg);
  },
);

export default service;
