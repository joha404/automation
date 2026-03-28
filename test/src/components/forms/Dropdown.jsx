import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useClickOutside from "@/hooks/custom/useClickOutside";
import CommonParagraph from "../texts/CommonParagraph";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/custom/useTheme";

const Dropdown = ({
  label = "",
  options = [],
  placeholder = "Select an option",
  errors = {},
  className = "",
  defaultValue = "",
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
      "py-2 text-[10px] sm:text-xs xl:text-sm placeholder:text-[10px] sm:placeholder:text-xs xl:placeholder:text-sm px-2 sm:px-3 xl:px-5 rounded-md ",
    medium:
      "py-2.5 text-[10px] sm:text-xs xl:text-sm placeholder:text-[10px] sm:placeholder:text-xs xl:placeholder:text-sm px-3 sm:px-5 xl:px-8 rounded-lg",
    large:
      "py-3.5 text-xs sm:text-sm xl:text-[16px] placeholder:text-xs sm:placeholder:text-sm xl:placeholder:text-[16px] px-3 sm:px-5 xl:px-8 rounded-lg",
  };

  const variants = {
    bg_none: `bg-transparent xl:px-8 px-5 ${
      sizeClasses[size]
    } placeholder:text-gray-400  ${
      theme === "dark" ? "border-darkerGrey" : "border-lightBlue"
    } light-theme  ${theme === "dark" ? "text-lighterGrey" : "text-darkGrey"}`,
    bg_border_none: `bg-transparent xl:px-8 px-5 ${
      sizeClasses[size]
    } placeholder:text-gray-400 border ${
      theme === "dark" ? "border-darkerGrey" : "border-lighterGrey"
    } light-theme  ${theme === "dark" ? "text-lighterGrey" : "text-darkGrey"}`,
    bg_white: `bg-white xl:px-8 px-5 ${
      sizeClasses[size]
    } placeholder:text-gray-400 ${
      theme === "dark" ? "border-lightBlack" : "border-lighterGrey"
    } light-theme  ${
      theme === "dark" ? "text-lightBlack" : "text-darkgerGrey"
    }`,
    bg_black: `bg-[#054844] xl:px-8 px-5 border-none ${
      sizeClasses[size]
    } placeholder:text-mediumGrey text-lighterGrey ${
      theme === "dark" ? "border-lightBlack" : "border-lightBlue"
    } dark-theme  ${
      theme === "dark" ? "border-lightBlack" : "border-lighterGrey"
    }`,
  };

  const baseClass = `focus:outline-none focus:border-[#009c91] placeholder:font-normal border-2 w-full thin-scrollbar transition-colors duration-200 tracking-wide  resize-none w-full cursor-pointer flex justify-between items-center`;

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
            variant === "bg_black" ? "text-lighterGrey" : "text-darkBlack"
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
          className={`pr-2 text-[10px] sm:text-xs lg:text-sm ${
            theme === "dark"
              ? !selecetedOption
                ? "text-mediumGrey font-normal"
                : "text-white font-medium"
              : !selecetedOption
                ? "text-mediumGrey font-normal"
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
            className={`${theme === "dark" ? "text-white" : "text-black"}`}
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
            className={`absolute ${
              atTop ? "bottom-full" : "top-full"
            } lg:w-[350px] sm:w-[250px] w-full  ${
              atLeft ? "left-0" : "right-0"
            } border rounded-lg shadow-md z-[1000] mt-1 mb-1 p-1 overflow-y-scroll  max-h-[200px] thin-scrollbar ${
              theme === "dark"
                ? "bg-[#054844] border-gray-700"
                : "bg-white border-lighterGrey"
            }`}
          >
            {options.map((option, index) => (
              <li
                key={index}
                className={`px-5 py-2 cursor-pointer m-1 rounded-md font-medium text-[10px] sm:text-xs lg:text-sm transition-all duration-200 ${
                  selectedValue === option.value
                    ? "text-white bg-[#026a63]"
                    : theme === "dark"
                      ? "text-white hover:bg-[#001f1d] hover:text-white"
                      : "text-darkerGrey hover:bg-lightBlue hover:text-white"
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

export default Dropdown;
