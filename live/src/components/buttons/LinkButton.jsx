import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const LinkButton = ({
  to = "",
  type = "",
  disabled = "",
  className = "",
  variant = "bg_none",
  size = "regular",
  children,
}) => {
  const variants = {
    bg_blue: "bg-darkBlue text-white hover:bg-blue-600",
    bg_none:
      "bg-transparent border-2 border-mediumGrey text-mediumBlack hover:bg-darkGrey hover:text-white",
  };

  const ButtonSizes = {
    regular: "xl:px-8 px-5 py-2.5 lg:text-[16px] text-sm",
  };

  const baseClass =
    "text-center transition-all duration-300 ease-in-out font-medium rounded-lg w-full cursor-pointer";
  return (
    <Link
      to={to}
      type={type}
      disabled={disabled}
      className={cn(baseClass, className, variants[variant],  ButtonSizes[size])}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
