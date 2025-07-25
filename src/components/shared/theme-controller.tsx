import { useTheme } from "@/components/layout/theme-provider.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Sun, Moon, MonitorCog } from "lucide-react";
import { animated, useSpring } from "@react-spring/web";

/**
 * 主题切换按钮
 */
function ThemeController() {
  const { theme, setTheme } = useTheme();

  const [springs, api] = useSpring(() => ({
    from: { scale: 0, rotate: 0 },
    to: { scale: 1 },
  }));

  const toggleTheme = () => {
    api.stop();
    if (theme === "system") {
      api.start({
        from: {
          scale: 0,
          rotate: 0,
        },
        to: [{ rotate: 360, config: { tension: 120, friction: 14 } }],
      });
      setTheme("light");
    } else if (theme === "light") {
      api.start({
        from: {
          scale: 0,
          rotate: -120,
        },
        to: [{ rotate: 0, config: { tension: 120, friction: 14 } }],
      });
      setTheme("dark");
    } else {
      api.start({
        from: {
          scale: 0,
          rotate: 0,
        },
        to: [
          { rotate: -25, config: { duration: 200 } },
          { rotate: 25, config: { duration: 200 } },
          { rotate: 0, config: { tension: 120, friction: 14 } },
        ],
      });
      setTheme("system");
    }
  };

  return (
    <Button
      className="size-7"
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
    >
      <animated.div
        style={{
          ...springs,
        }}
      >
        {theme === "system" ? (
          <MonitorCog />
        ) : theme === "light" ? (
          <Sun />
        ) : (
          <Moon />
        )}
      </animated.div>
    </Button>
  );
}

export default ThemeController;
