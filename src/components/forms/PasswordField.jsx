import { useState } from "react";
import { cn } from "@/lib/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CommonParagraph from "../texts/CommonParagraph";


const PasswordField = ({
  label = "",
  name = "",
  placeholder = "",
  errors = {},
  register_as = "",
  register,
  className = "",
  variant = "bg_black",
  autoComplete = "on",
  readOnly = false,
  validationRules = {},
    size = "large",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const sizeClasses = {
    small: "py-2 xl:text-sm text-xs  xl:placeholder:text-sm placeholder:text-xs xl:px-5 px-3 rounded-md ",
    medium: "py-2.5 xl:text-sm text-xs  xl:placeholder:text-sm placeholder:text-xs xl:px-8 px-5 rounded-lg",
    large: "py-3 xl:text-[16px] text-sm  xl:placeholder:text-[16px] placeholder:text-sm xl:px-8 px-5 rounded-lg",
  };


  const variants = {
    bg_none: `bg-transparent xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-gray-400 text-mediumBlack border-2 border-lightGrey`,
    bg_white: `bg-white xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-gray-400 text-mediumBlack light-theme border-2 border-lightGrey`,
    bg_black: `bg-darkerBlack xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-mediumGrey text-lighterGrey dark-theme border-2 border-lightBlack`,
  };

  const baseClass =
    "focus:outline-none focus:border-mediumBlue placeholder:font-normal w-full thin-scrollbar transition-colors duration-200 tracking-wide";

  const inputProps = register ? register(name, validationRules) : {};
  const errorMessage = errors[register_as]?.message;


  return (
    <div className="flex flex-col lg:space-y-2 space-y-1 w-full">
      {label && (
        <label htmlFor={register_as}>
          <CommonParagraph className={`font-medium ${variant === "bg_black" ? "text-lighterGrey" : "text-darkBlack" }`}>
            {label}
          </CommonParagraph>
        </label>
      )}

      <div className="relative">
        <input
          {...inputProps}
          {...props}
          id={register_as}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          readOnly={readOnly}
          autoComplete={autoComplete}
          className={cn(
            baseClass,
            className,
            variants[variant],
            errorMessage && "border-mediumBlue focus:border-mediumBlue",
          )}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-darkGrey hover:text-mediumBlue focus:outline-none transition-color duration-200"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1} // Prevent button from being focusable
        >
          {showPassword ? <FaEye className="xl:text-lg text-base" /> : <FaEyeSlash className="xl:text-lg text-base" />}
        </button>
      </div>

      {errorMessage && (
        <p className={` ${variant === "bg_black" ? "text-rose-500" : "text-rose-700" } font-normal xl:text-base text-sm tracking-wide xl:px-8 px-5`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PasswordField;