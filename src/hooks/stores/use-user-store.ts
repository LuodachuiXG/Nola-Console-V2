import { create } from "zustand";
import type { User } from "@/features/user/models/User.ts";
import { persist, createJSONStorage } from "zustand/middleware";
import { SecureLSStorage } from "@/utils/secure-ls.ts";

interface UserState {
  user: User | null;
  isLogin: boolean;
  setUser: (user: User | null) => void;
  token: string | null;
}

/**
 * 用户 Store
 */
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLogin: false,
      setUser: (user) => {
        set({
          user: user,
          isLogin: user !== null,
          token: user?.token,
        });
      },
      token: null,
    }),
    {
      name: "u1",
      storage: createJSONStorage(() => SecureLSStorage)
    }
  )
);

export default useUserStore;
