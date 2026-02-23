import { cn } from "@/lib/utils";
import CommonParagraph from "../texts/CommonParagraph";

const InputField = ({
  phone = false,
  label = "",
  type = "text",
  placeholder = "",
  name = "",
  errors = {},
  register_as = "",
  register,
  className = "",
  variant = "bg_black",
  readOnly = false,
  autoComplete = "on",
  rows = 5,
  validationRules = {},
  size = "large",
  ...props
}) => {
  const inputProps = register ? register(name, validationRules) : {};
  const errorMessage = errors[register_as]?.message;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }
  };

  const sizeClasses = {
    small:
      "py-1 xl:text-sm text-xs  xl:placeholder:text-sm placeholder:text-xs xl:px-5 px-3 rounded-md",
    medium:
      "py-2.5 xl:text-sm text-xs  xl:placeholder:text-sm placeholder:text-xs xl:px-8 px-5 rounded-lg",
    large:
      "py-3 xl:text-[16px] text-sm  xl:placeholder:text-[16px] placeholder:text-sm xl:px-8 px-5 rounded-lg",
  };

  const variants = {
    bg_none: `bg-transparent xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-gray-400 text-mediumBlack border-2 border-lightGrey`,
    bg_white: `bg-white xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-gray-400 text-mediumBlack light-theme border-2 border-lightGrey ${phone ? "xl:ps-16 ps-16" : ""}`,
    bg_black: `bg-[#032422] xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-mediumGrey text-lighterGrey dark-theme border-2 border-[#03635d] ${sizeClasses[size]} ${phone ? "xl:ps-16 ps-16" : ""}`,
  };

  const baseClass =
    "focus:outline-none focus:border-mediumBlue placeholder:font-normal w-full thin-scrollbar transition-colors duration-200 tracking-wide";

  return (
    <div className="flex flex-col lg:space-y-2 space-y-1 w-full">
      {label && (
        <label htmlFor={register_as}>
          <CommonParagraph
            className={`font-medium ${variant === "bg_black" ? "text-white" : "text-black"}`}
          >
            {label}
          </CommonParagraph>
        </label>
      )}

      <div className="relative">
        {type === "textarea" ? (
          <textarea
            id={register_as}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            rows={rows}
            onKeyDown={handleKeyDown}
            className={cn(
              className,
              baseClass,
              variants[variant],
              errorMessage && "border-mediumBlue focus:border-mediumBlue",
            )}
            {...inputProps}
            {...props}
          />
        ) : (
          <input
            id={register_as}
            name={name}
            type={type}
            placeholder={placeholder}
            readOnly={readOnly}
            onKeyDown={handleKeyDown}
            className={cn(
              className,
              baseClass,
              variants[variant],
              errorMessage && "border-mediumBlue focus:border-mediumBlue",
            )}
            autoComplete={autoComplete}
            {...inputProps}
            {...props}
          />
        )}
      </div>

      {errorMessage && (
        <p
          className={` ${variant === "bg_black" ? "text-rose-500" : "text-rose-700"} font-normal xl:text-base text-sm tracking-wide xl:px-8 px-5`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};
export default InputField;
