import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";

/**
 * 退出登录弹窗
 * @param show 是否显示弹窗
 * @param onConfirm 确定回调
 * @param onChange 弹窗显示状态改变回调
 */
export default function LogOutDialog({
  show,
  onConfirm,
  onChange,
}: {
  show: boolean;
  onConfirm: () => void;
  onChange: (show: boolean) => void;
}) {
  return (
    <>
      <AlertDialog open={show} onOpenChange={onChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>温馨提示</AlertDialogTitle>
            <AlertDialogDescription>确定要退出登录吗？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
