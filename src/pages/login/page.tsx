import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  createBlogAdmin,
  getBlogInfo,
  initBlogInfo,
} from "@/features/blog/services/blog-services.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  animated,
  useChain,
  useSpring,
  useSpringRef,
  useTrail,
} from "@react-spring/web";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import type { BlogInfo } from "@/features/blog/models/BlogInfo.ts";
import { clsx } from "clsx";
import { login } from "@/features/user/services/user-services.ts";
import useUserStore from "@/hooks/stores/use-user-store.ts";
import { useNavigate } from "react-router";

/**
 * 当前显示的模式
 */
type DisplayMode = "LOGIN" | "CREATE_BLOG" | "CREATE_ADMIN";

/**
 * 登录页面
 * @constructor
 */
export default function LoginPage() {
  const [loading, setLoading] = useState(true);

  // 当前显示的模式
  const [mode, setMode] = useState<DisplayMode>("LOGIN");

  // 记录当前博客信息
  const blogInfo = useRef<BlogInfo | null>(null);

  // 获取博客信息
  useEffect(() => {
    getBlogInfo()
      .then((res) => {
        const info = res.data;
        blogInfo.current = info;
        if (info === null) {
          // 博客还未初始化，创建博客
          setMode("CREATE_BLOG");
        } else if (info.blogger === null) {
          // 管理员还未创建，创建管理员
          setMode("CREATE_ADMIN");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  /**
   * 创建博客完成
   */
  function onCreateBlogFinish() {
    if (blogInfo.current === null || blogInfo.current?.blogger === null) {
      // 管理员还未创建
      setMode("CREATE_ADMIN");
    } else {
      // 显示登录页面
      setMode("LOGIN");
    }
  }

  /**
   * 创建管理员完成
   */
  function onCreateAdminFinish() {
    // 显示登录页面
    setMode("LOGIN");
  }

  return (
    <>
      <div className="h-full flex justify-center items-center overflow-y-clip">
        <Card
          className={clsx(
            "w-full transition-bezier max-w-sm -mt-15 transition-[height] overflow-clip",
            {
              "h-79": mode !== "CREATE_ADMIN",
              "h-140.5": mode == "CREATE_ADMIN",
            },
          )}
          style={{
            transitionDuration: "0.6s",
          }}
        >
          {loading ? (
            <CardContent>
              <CardSkeleton />
            </CardContent>
          ) : (
            <>
              {mode === "LOGIN" && <LoginPanel />}
              {mode === "CREATE_BLOG" && (
                <CreateBlogPanel onFinish={onCreateBlogFinish} />
              )}
              {mode === "CREATE_ADMIN" && (
                <CreateAdminPanel onFinish={onCreateAdminFinish} />
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}

/**
 * 登录面板
 */
function LoginPanel() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const loginInputs = [
    <div className="grid gap-2">
      <Label htmlFor="username">用户名</Label>
      <Input
        id="username"
        name="username"
        type="text"
        placeholder="Nola 用户名"
        required
        disabled={loading}
      />
    </div>,
    <div className="grid gap-2">
      <Label htmlFor="password">密码</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="输入密码"
        required
        disabled={loading}
      />
    </div>,
  ];

  const trailRef = useSpringRef();
  const trails = useTrail(loginInputs.length, {
    ref: trailRef,
    from: { opacity: 0, translateY: -10 },
    to: { opacity: 1, translateY: 0 },
  });

  const btnSpringRef = useSpringRef();
  const btnSpring = useSpring({
    ref: btnSpringRef,
    from: { opacity: 0, translateY: -10 },
    to: { opacity: 1, translateY: 0 },
  });

  useChain([btnSpringRef, trailRef], [0, 0.1]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      if (username.trim().length === 0 || password.trim().length === 0) {
        toast.error("用户名或密码不能为空");
        return;
      }

      if (password.length < 8) {
        toast.error("非法用户名或密码");
        return;
      }

      setLoading(true);
      login(username, password)
        .then((res) => {
          const user = res.data;
          if (user) {
            // 登录成功
            toast.success(`欢迎回来，${user.displayName}`);
            setUser(user);
            navigate("/console/overview");
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Nola</CardTitle>
        <CardDescription>登录 Nola</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" ref={formRef} onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            {trails.map((trail, index) => (
              <animated.div key={index} style={trail}>
                {loginInputs[index]}
              </animated.div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <animated.div className="w-full" style={btnSpring}>
          <Button
            className="w-full"
            type="submit"
            form="login-form"
            disabled={loading}
          >
            {loading && <Loader2Icon className="animate-spin" />}
            登录
          </Button>
        </animated.div>
      </CardFooter>
    </>
  );
}

/**
 * 创建博客面板
 * @param onFinish 创建完成事件
 */
function CreateBlogPanel({ onFinish }: { onFinish?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const inputs = [
    <div className="grid gap-2">
      <Label htmlFor="title">站点标题</Label>
      <Input
        id="title"
        name="title"
        type="text"
        placeholder="输入站点标题"
        required
        disabled={loading}
      />
    </div>,
    <div className="grid gap-2">
      <Label htmlFor="password">站点副标题</Label>
      <Input
        id="subtitle"
        name="subtitle"
        type="subtitle"
        placeholder="站点副标题（可选）"
        disabled={loading}
      />
    </div>,
  ];

  const trailRef = useSpringRef();
  const trails = useTrail(inputs.length, {
    ref: trailRef,
    from: { opacity: 0, translateY: -10 },
    to: { opacity: 1, translateY: 0 },
  });

  const btnSpringRef = useSpringRef();
  const btnSpring = useSpring({
    ref: btnSpringRef,
    from: { opacity: 0, translateY: -10 },
    to: { opacity: 1, translateY: 0 },
  });

  useChain([btnSpringRef, trailRef], [0, 0.1]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const title = formData.get("title");
      const subtitle = formData.get("subtitle");
      if (!title || String(title).trim().length === 0) {
        toast.error("请将内容填写完整");
        return;
      }

      setLoading(true);
      initBlogInfo(String(title), String(subtitle))
        .then((res) => {
          if (res.data === true) {
            // 博客初始化完成
            onFinish?.();
          } else {
            // 初始化失败
            toast.error(res.errMsg);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>初始化 Nola</CardTitle>
        <CardDescription>
          欢迎使用 Nola 博客，正在进行博客初始化
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="create-blog-form" ref={formRef} onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            {trails.map((props, index) => (
              <animated.div style={props} key={index}>
                {inputs[index]}
              </animated.div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <animated.div className="w-full" style={btnSpring}>
          <Button
            className="w-full"
            type="submit"
            form="create-blog-form"
            disabled={loading}
          >
            {loading && <Loader2Icon className="animate-spin" />}
            初始化博客
          </Button>
        </animated.div>
      </CardFooter>
    </>
  );
}

/**
 * 创建管理员面板
 * @param onFinish 创建完成事件
 */
function CreateAdminPanel({ onFinish }: { onFinish?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const inputs = [
    <div className="grid gap-2">
      <Label htmlFor="username">用户名</Label>
      <Input
        id="username"
        name="username"
        type="text"
        placeholder="Nola 用户名（用于登录，英文或数字）"
        required
        disabled={loading}
      />
    </div>,
    <div className="grid gap-2">
      <Label htmlFor="displayName">名称</Label>
      <Input
        id="displayName"
        name="displayName"
        type="text"
        placeholder="显示名称"
        required
        disabled={loading}
      />
    </div>,
    <div className="grid gap-2">
      <Label htmlFor="email">邮箱</Label>
      <Input id="email" name="email" type="email" placeholder="邮箱" required />
    </div>,
    <div className="grid gap-2">
      <Label htmlFor="password">密码</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="密码"
        required
        disabled={loading}
      />
    </div>,
    <div className="grid gap-2">
      <Label htmlFor="password-confirm">重复密码</Label>
      <Input
        id="password-confirm"
        name="password-confirm"
        type="password"
        placeholder="再次输入密码"
        required
        disabled={loading}
      />
    </div>,
  ];

  // 控制连续动画
  const trailRef = useSpringRef();
  const trails = useTrail(inputs.length, {
    ref: trailRef,
    from: { opacity: 0, translateY: -10 },
    to: { opacity: 1, translateY: 0 },
  });

  // 控制按钮动画
  const btnSpringRef = useSpringRef();
  const btnSpring = useSpring({
    ref: btnSpringRef,
    from: { opacity: 0, translateY: -10 },
    to: { opacity: 1, translateY: 0 },
  });

  // 这里写 0.101 是为了防止 IDE 提示代码重复。这里提状态比较麻烦，这里偷个懒，也属于后面可优化处
  useChain([btnSpringRef, trailRef], [0, 0.101]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const username = formData.get("username")!;
      const displayName = formData.get("displayName")!;
      const email = formData.get("email")!;
      const password = formData.get("password")!;
      const passwordConfirm = formData.get("password-confirm")!;

      if (String(username).length < 4) {
        // 用户名小于 4 位
        toast.error("用户名长度不能小于 4");
        return;
      }

      if (String(password).length < 8) {
        toast.error("密码长度不能小于 8");
        return;
      }

      if (String(password) !== String(passwordConfirm)) {
        toast.error("两次密码不一致");
        return;
      }

      setLoading(true);

      createBlogAdmin(
        String(username),
        String(displayName),
        String(email),
        String(password),
      )
        .then((res) => {
          if (res.data === true) {
            // 管理员创建完成
            onFinish?.();
          } else {
            // 管理员创建失败
            toast.error(res.errMsg);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>初始化 Nola 管理员</CardTitle>
        <CardDescription>正在进行管理员初始化</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="create-admin-form" ref={formRef} onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            {trails.map((props, index) => (
              <animated.div style={props} key={index}>
                {inputs[index]}
              </animated.div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <animated.div className="w-full" style={btnSpring}>
          <Button className="w-full" type="submit" form="create-admin-form">
            {loading && <Loader2Icon className="animate-spin" />}
            登录
          </Button>
        </animated.div>
      </CardFooter>
    </>
  );
}

/**
 * 骨架屏
 * @constructor
 */
function CardSkeleton() {
  return (
    <div className="fade-in-container flex flex-col gap-2">
      <Skeleton className="w-14 h-4 rounded-xs" />
      <Skeleton className="w-20 h-4 rounded-xs" />

      <Skeleton className="mt-5 w-14 h-4 rounded-xs" />
      <Skeleton className="w-full h-8 rounded" />

      <Skeleton className="mt-5 w-14 h-4 rounded-xs" />
      <Skeleton className="w-full h-8 rounded" />

      <Skeleton className="mt-5 w-full h-8 rounded" />
    </div>
  );
}
