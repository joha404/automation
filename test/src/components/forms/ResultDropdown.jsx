import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useClickOutside from "@/hooks/custom/useClickOutside";
import CommonParagraph from "../texts/CommonParagraph";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/custom/useTheme";

const ResultDropdown = ({
  label = "",
  options = [],
  placeholder = "Select an option",
  errors = {},
  className = "",
  defaultValue = "ultimate",
  onChange,
  formInput,
  atTop,
  atLeft,
  size = "small",
  variant = "bg_black",
}) => {
  const { theme } = useTheme();

  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const handleDropDown = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  const selecetedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const sizeClasses = {
    small:
      "py-1.5 sm:py-1.5 md:py-2 lg:py-2 xl:py-2 text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[15px] placeholder:text-[10px] sm:placeholder:text-[10px] md:placeholder:text-[12px] lg:placeholder:text-[14px] xl:placeholder:text-[15px] px-2 sm:px-2.5 md:px-3 lg:px-4 xl:px-5 rounded-md ",
    medium:
      "py-2 sm:py-2 md:py-2.5 lg:py-2.5 xl:py-3 text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[15px] placeholder:text-[10px] sm:placeholder:text-[10px] md:placeholder:text-[12px] lg:placeholder:text-[14px] xl:placeholder:text-[15px] px-2.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 rounded-lg",
    large:
      "py-2.5 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[15px] placeholder:text-[10px] sm:placeholder:text-[10px] md:placeholder:text-[12px] lg:placeholder:text-[14px] xl:placeholder:text-[15px] px-3 sm:px-3.5 md:px-4 lg:px-6 xl:px-8 rounded-lg",
  };

  const variants = {
    bg_none: `bg-transparent px-3 sm:px-3 md:px-4 lg:px-6 xl:px-8 ${
      sizeClasses[size]
    } light-theme ${theme === "dark" ? "text-white placeholder:text-white" : "text-black placeholder:text-black"}`,
    bg_border_none: `bg-transparent px-3 sm:px-3 md:px-4 lg:px-6 xl:px-8 ${
      sizeClasses[size]
    } border ${
      theme === "dark" ? "border-darkerGrey" : "border-lighterGrey"
    } light-theme ${theme === "dark" ? "text-white placeholder:text-white" : "text-black placeholder:text-black"}`,
    bg_white: `bg-white px-3 sm:px-3 md:px-4 lg:px-6 xl:px-8 ${
      sizeClasses[size]
    } ${
      theme === "dark" ? "border-lightBlack" : "border-lighterGrey"
    } light-theme ${theme === "dark" ? "text-white placeholder:text-white" : "text-black placeholder:text-black"}`,
    bg_black: `bg-[#054844] px-3 sm:px-3 md:px-4 lg:px-6 xl:px-8 ${
      sizeClasses[size]
    } ${
      theme === "dark" ? "border-lightBlack" : "border-lightBlue"
    } dark-theme ${theme === "dark" ? "text-white placeholder:text-white" : "text-black placeholder:text-black"} ${
      theme === "dark" ? "border-lightBlack" : "border-lighterGrey"
    }`,
  };

  const baseClass = `focus:outline-none focus:border-mediumBlue placeholder:font-normal w-full thin-scrollbar transition-colors duration-200 tracking-wide  resize-none w-full cursor-pointer flex justify-between items-center`;

  return (
    <div
      ref={dropdownRef}
      className={`flex flex-col ${
        formInput ? "w-full" : "min-w-[20px]"
      } relative `}
    >
      <label>
        <CommonParagraph
          className={`font-medium ${
            variant === "bg_black" ? "text-gray-700" : "text-darkBlack"
          }`}
        >
          {label}
        </CommonParagraph>
      </label>
      <div
        className={cn(baseClass, className, variants[variant])}
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="dropdown-list"
        aria-labelledby={label ? "dropdown-label" : undefined}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span
          className={`pr-1 sm:pr-1.5 md:pr-1.5 lg:pr-2 xl:pr-2 text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[15px] whitespace-nowrap ${
            !selecetedOption
              ? theme === "dark"
                ? "text-white font-normal"
                : "text-black font-normal"
              : theme === "dark"
                ? "text-white font-medium"
                : "text-black font-medium"
          }`}
          title={selecetedOption?.label}
        >
          {selecetedOption ? selecetedOption.label : placeholder}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
        >
          <FaChevronDown
            className={`text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[15px] ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id="dropdown-list"
            role="listbox"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${atTop ? "bottom-full" : "top-full"} w-full ${
              atLeft ? "left-0" : "right-0"
            } border rounded-lg shadow-md z-[1000] mt-1 mb-1 p-1 overflow-y-scroll max-h-[200px] thin-scrollbar ${
              theme === "dark"
                ? "bg-[#054844] border-gray-700"
                : "bg-white border-lighterGrey"
            }`}
          >
            {options.map((option, index) => (
              <li
                key={index}
                className={`px-2 sm:px-2 md:px-2.5 lg:px-3 xl:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5 cursor-pointer m-1 rounded-md font-medium text-[10px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[15px] transition-all duration-200 ${
                  selectedValue === option.value
                    ? "text-gray-700 bg-[#021716]"
                    : theme === "dark"
                      ? "text-white hover:bg-[#021716] hover:text-white"
                      : "text-black hover:bg-lightBlue hover:text-gray-700"
                }`}
                onClick={() => handleDropDown(option.value)}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {errors.message && (
        <p className="text-rose-700 font-medium text-sm ">{errors.message}</p>
      )}
    </div>
  );
};

export default ResultDropdown;
