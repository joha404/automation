import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import CommonParagraph from "../texts/CommonParagraph";
import { BsSearch } from "react-icons/bs";
import { useTheme } from "@/hooks/custom/useTheme";

const SearchField = ({
  label = "",
  placeholder = "Search...",
  name = "",
  errors = {},
  register_as = "",
  register,
  className = "",
  variant = "bg_none",
  readOnly = false,
  autoComplete = "on",
  validationRules = {},
  size = "medium",
  showIcon = true,
  onSearch, // Search handler function
  defaultValue = "", // Default value for the input
  ...props
}) => {
  const { theme } = useTheme();
  const [searchValue, setSearchValue] = useState(defaultValue);

  // Update internal state when defaultValue changes
  useEffect(() => {
    setSearchValue(defaultValue);
  }, [defaultValue]);

  const inputProps = register ? register(name, validationRules) : {};
  const errorMessage = errors[register_as]?.message;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchValue);
      }
    }
  };

  const sizeClasses = {
    small:
      "py-2 xl:text-sm text-xs xl:placeholder:text-sm placeholder:text-xs xl:px-8 px-5 pl-8 rounded-md",
    medium:
      "py-2.5 xl:text-sm text-xs xl:placeholder:text-sm placeholder:text-xs xl:px-8 px-5  xl:pl-16 pl-10 rounded-lg",
    large:
      "py-3 xl:text-[16px] text-sm xl:placeholder:text-[16px] placeholder:text-sm xl:px-8 px-5 pl-12 rounded-lg",
  };

  const variants = {
    bg_none: `bg-transparent ${sizeClasses[size]}`,
  };

  const baseClass =
    "font-normal focus:outline-none focus:border-[#009c91] placeholder:text-gray-400 text-mediumGrey placeholder:font-normal border-2 border-transparent w-full thin-scrollbar transition-colors duration-200 font-semibold tracking-wide";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:space-y-2 space-y-1 w-full"
    >
      {label && (
        <label htmlFor={register_as}>
          <CommonParagraph className="font-medium text-darkBlack">
            {label}
          </CommonParagraph>
        </label>
      )}

      <div className="relative flex items-center">
        {showIcon && (
          <div
            className={`absolute inset-y-0 left-0 flex items-center ${
              size === "small" ? "pl-3" : size === "medium" ? "pl-4" : "pl-5"
            } pointer-events-none`}
          >
            <BsSearch
              className={`${
                size === "small"
                  ? "w-3 h-3"
                  : size === "medium"
                    ? "w-4 h-4"
                    : "w-5 h-5"
              } text-gray-400`}
            />
          </div>
        )}

        <input
          id={register_as}
          name={name}
          type="search"
          placeholder={placeholder}
          readOnly={readOnly}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            className,
            baseClass,
            variants[variant],
            errorMessage && "border-darkBlue focus:border-darkBlue",
            showIcon && "pl-10",
          )}
          autoComplete={autoComplete}
          {...inputProps}
          {...props}
        />

        {/* Search button */}
        <button
          type="submit"
          className={`ml-2 px-4 py-2 rounded-lg ${
            theme === "dark"
              ? "bg-[#0A9087] text-white"
              : "bg-[#0A9087] text-white"
          } hover:opacity-90 transition-opacity`}
        >
          Search
        </button>
      </div>

      {errorMessage && (
        <p
          className={` ${variant === "bg_black" ? "text-rose-500" : "text-rose-700"} font-normal xl:text-base text-sm tracking-wide xl:px-8 px-5`}
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
};

export default SearchField;
