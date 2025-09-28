import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { updateUserPassword } from "@/features/user/services/user-services.ts";
import { type FormEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import * as z from "zod";
import DialogLoadingTitle from "@/components/shared/dialog-loading-title.tsx";

// 表单验证 schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "密码长度不能小于 8")
      .max(128, "密码长度不能大于 128"),
    passwordConfirm: z
      .string()
      .min(8, "密码长度不能小于 8")
      .max(128, "密码长度不能大于 128"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "两次输入的密码不一致"
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

/**
 * 修改密码弹窗
 * @param show 是否显示弹窗
 * @param onChange 弹窗显示状态改变回调
 */
export default function UpdatePasswordDialog({
  show,
  onChange,
}: {
  show: boolean;
  onChange: (show: boolean) => void;
}) {
  // 加载中
  const [loading, setLoading] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState<Partial<PasswordFormData>>({
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    // 显示时清空表单
    if (show) {
      setFormData({
        password: "",
        passwordConfirm: "",
      });
    }
  }, [show]);

  // 表单提交
  function onSubmit(e: FormEvent) {
    e.preventDefault();

    // 使用 Zod 验证表单
    const result = passwordSchema.safeParse(formData);

    if (!result.success) {
      // 验证失败
      const message = JSON.parse(result.error.message)[0].message;
      toast.error(message);
      return;
    }

    const data = result.data;

    setLoading(true);
    updateUserPassword(data.password)
      .then(() => {
        // 修改成功
        setLoading(false);
        onChange(false);
        toast.success("修改成功");
      })
      .catch(() => {
        setLoading(false);
      });
  }

  // 处理输入
  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Dialog open={show} onOpenChange={onChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <DialogLoadingTitle title="修改密码" loading={loading} />
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="fade-in-container">
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">
                  新密码<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="输入新密码"
                  disabled={loading}
                  value={formData.password || ""}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="passwordConfirm">
                  重复密码<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="重复密码"
                  disabled={loading}
                  value={formData.passwordConfirm || ""}
                  onChange={(e) =>
                    handleInputChange("passwordConfirm", e.target.value)
                  }
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button disabled={loading} onClick={onSubmit}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
