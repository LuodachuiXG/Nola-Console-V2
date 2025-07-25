import { create } from "zustand";

interface AxiosStore {
  /** 当前是否在显示 401 错误信息 **/
  show401: boolean;
  /** 设置当前是否在显示 401 错误信息 **/
  setShow401: (show401: boolean) => void;
}

const useAxiosStore = create<AxiosStore>((set) => ({
  show401: false,
  setShow401: (show401: boolean) => {
    set({
      show401: show401,
    });

    // 3 秒后恢复标记
    if (show401) {
      setTimeout(() => {
        set({
          show401: false,
        });
      }, 3000);
    }
  },
}));

export default useAxiosStore;
