import { create } from "zustand";
import type { BlogOverviewCount } from "@/features/blog/models/BlogOverview.ts";

interface ItemCountStore {
  post: number;
  tag: number;
  category: number;
  comment: number;
  diary: number;
  file: number;
  link: number;
  menu: number;
  setItemCount: (itemCount: BlogOverviewCount) => void;
  getItemCount: () => BlogOverviewCount;
}

/**
 * 博客项目数量 Store
 */
const useItemCountStore = create<ItemCountStore>((set, get) => ({
  post: 0,
  tag: 0,
  category: 0,
  comment: 0,
  diary: 0,
  file: 0,
  link: 0,
  menu: 0,
  setItemCount: (count: BlogOverviewCount) => {
    set({
      ...count,
    });
  },
  getItemCount: () => {
    const state = get();
    return {
      ...state
    };
  },
}));

export default useItemCountStore;
