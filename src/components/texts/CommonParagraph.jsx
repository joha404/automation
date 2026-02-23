import { useTheme } from "@/hooks/custom/useTheme";
import { cn } from "@/lib/utils";

const CommonParagraph = ({ className = "", variant = "regular", children }) => {
  const { theme } = useTheme();
  const variants = {
    large: "lg:text-xl text-lg",
    medium: "lg:text-lg, text-[16px]",
    regular: "xl:text-[16px] md:text-[15px] sm:text-[14px] text-[12px]",
    small: "xl:text-sm text-[13px]",
    smaller: "xl:text-xs text-[10px]",
    extraSmall: "2xl:text-[10px] text-[8px]",
    special: "md:text-sm text-xs",
  };

  const baseClass = `tracking-wide font-logo ${
    theme === "dark" ? "text-white" : "text-black "
  }`;
  return (
    <p className={cn(baseClass, className, variants[variant])}>{children}</p>
  );
};

export default CommonParagraph;
