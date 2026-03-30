import { cn } from "@/lib/utils";
import ButtonLoader from "../loaders/ButtonLoader";

const SubmitButton = ({
  children,
  className,
  variant = "bg_black",
  size = "regular",
  isLoading = true,
  loadingText = "Processing",
  LoaderComponent = <ButtonLoader />,
  type = "button",
  disabled = false,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const variants = {
    bg_blue: "bg-mediumBlue text-white hover:bg-darkBlue",
    bg_none:
      "bg-transparent border-2 border-mediumGrey text-mediumBlack hover:bg-darkGrey hover:text-white",
    bg_black:
      "bg-transparent border-2 border-[#0A9087] bg-[#0A9087] text-white hover:bg-[#0A9087] hover:text-white",
    bg_red: "bg-rose-600  hover:border-mediumBlue text-white hover:text-white",
    bg_blank: "bg-[#0A9087] border-mediumGrey text-white font-semibold",
  };

  const ButtonSizes = {
    regular: "xl:px-8 px-5 py-3 lg:text-[16px] text-sm ",
  };

  const baseClass = `
    relative
    transition-all duration-300 ease-in-out
    font-medium rounded-lg w-full cursor-pointer
    overflow-hidden font-logo
    z-[1]
    hover:before:left-0 hover:before:right-0 hover:before:opacity-100
    disabled:opacity-90 disabled:cursor-not-allowed
  `;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(
        baseClass,
        variants[variant],
        ButtonSizes[size],
        className,
        "before:content-[''] before:absolute before:top-0 before:left-1/2 before:right-1/2 before:bottom-0 before:opacity-0 before:transition-all before:duration-500 before:ease-[ease] before:-z-[1]",
        variant === "bg_blue" ? "before:bg-[#03635d]" : "before:bg-[#03635d]",
      )}
      onClick={isDisabled ? (e) => e.preventDefault() : props.onClick}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <span>{loadingText}</span>
          <span>{LoaderComponent}</span>
        </div>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </button>
  );
};

export default SubmitButton;
