import { LoaderCircle as LoadingIcon } from "lucide-react";

/**
 * 弹窗加载标题
 * @param title 标题
 * @param loading 是否加载中
 */
export default function DialogLoadingTitle({
  title,
  loading,
}: {
  title: string;
  loading: boolean;
}) {
  return (
    <div className="fade-in-container flex gap-2 items-center">
      {title}
      {loading && <LoadingIcon size={18} className="animate-spin" />}
    </div>
  );
}
