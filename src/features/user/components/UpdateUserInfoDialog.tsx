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
import {
  getUserInfo,
  updateUserInfo,
} from "@/features/user/services/user-services.ts";
import { type FormEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Image as ImageIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea.tsx";
import { toast } from "sonner";
import * as z from "zod";
import useUserStore from "@/hooks/stores/use-user-store.ts";
import type { User } from "@/features/user/models/User.ts";

// 表单验证 schema
const userInfoSchema = z.object({
  username: z
    .string()
    .min(4, "用户名长度不能小于 4")
    .max(64, "用户名长度不能大于 64"),
  email: z.email("请输入有效邮箱"),
  displayName: z
    .string()
    .min(1, "昵称不能为空")
    .max(128, "名称长度不能大于 128"),
  avatar: z.url().max(512, "URL 长度不能大于 512").nullable().or(z.literal("")),
  description: z
    .string()
    .max(1024, "描述长度不能大于 1024")
    .nullable()
    .or(z.literal("")),
});

type UserInfoFormData = z.infer<typeof userInfoSchema>;

/**
 * 修改用户信息弹窗
 * @param show 是否显示弹窗
 * @param onChange 弹窗显示状态改变回调
 */
export default function UpdateUserInfoDialog({
  show,
  onChange,
}: {
  show: boolean;
  onChange: (show: boolean) => void;
}) {
  // 加载中
  const [loading, setLoading] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // 表单数据
  const [formData, setFormData] = useState<Partial<UserInfoFormData>>({
    username: "",
    email: "",
    displayName: "",
    avatar: "",
    description: "",
  });

  useEffect(() => {
    if (show) {
      refreshUserInfo();
    }
  }, [show]);

  // 获取用户信息
  function refreshUserInfo() {
    setLoading(true);
    getUserInfo()
      .then((res) => {
        const user = res.data;
        if (user) {
          setFormData({
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            avatar: user.avatar ?? "",
            description: user.description ?? "",
          });
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  // 表单提交
  function onSubmit(e: FormEvent) {
    e.preventDefault();

    // 使用 Zod 验证表单
    const result = userInfoSchema.safeParse(formData);

    if (!result.success) {
      // 验证失败
      const message = JSON.parse(result.error.message)[0].message;
      toast.error(message);
      return;
    }

    const data = result.data;

    setLoading(true);
    updateUserInfo(
      data.username,
      data.email,
      data.displayName,
      data.description,
      data.avatar,
    )
      .then(() => {
        // 修改成功

        // 保存本地用户数据
        setUser({
          ...user,
          username: data.username,
          email: data.email,
          displayName: data.displayName,
          description: data.description,
          avatar: data.avatar,
        } as User);

        setLoading(false);
        onChange(false);
        toast.success("保存成功");
      })
      .catch(() => {
        setLoading(false);
      });
  }

  // 处理输入
  const handleInputChange = (field: keyof UserInfoFormData, value: string) => {
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
            <DialogTitle>个人信息</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="username">
                  用户名<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="用户名（用户登录）"
                  disabled={loading}
                  value={formData.username || ""}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">
                  邮箱<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="邮箱"
                  disabled={loading}
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="displayName">
                  昵称<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="昵称"
                  disabled={loading}
                  value={formData.displayName || ""}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="avatar">头像</Label>
                <div className="flex gap-2">
                  <Input
                    id="avatar"
                    name="avatar"
                    type="url"
                    placeholder="头像"
                    disabled={loading}
                    value={formData.avatar || ""}
                    onChange={(e) =>
                      handleInputChange("avatar", e.target.value)
                    }
                  />
                  <Button variant="outline" type="button" size="icon">
                    <ImageIcon />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2 w-full col-span-full">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="描述"
                  disabled={loading}
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
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
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
