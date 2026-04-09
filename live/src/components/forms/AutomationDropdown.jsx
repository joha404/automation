import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useClickOutside from "@/hooks/custom/useClickOutside";
import CommonParagraph from "../texts/CommonParagraph";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/custom/useTheme";

const AutomationDropdown = ({
  label = "",
  options = [],
  placeholder = "Select",
  errors = {},
  className = "",
  value,
  onChange,
  formInput,
  atTop,
  atLeft,
  size = "small",
  variant = "bg_black",
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (val) => {
    setIsOpen(false);
    onChange?.(val);
  };

  /* ---------------- SIZE ---------------- */
  const sizeClasses = {
    small: "py-2 text-xs px-3 rounded-md",
    medium: "py-2.5 text-sm px-5 rounded-lg",
    large: "py-3 text-base px-6 rounded-lg",
  };

  /* ---------------- VARIANTS ---------------- */
  const variants = {
    bg_black: `
      bg-darkerBlack text-lighterGrey border
      ${theme === "dark" ? "border-lightBlack" : "border-lighterGrey"}
    `,
    bg_white: `
      ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200 border-gray-600"
          : "bg-white text-darkGrey border-gray-300"
      }
      border
    `,
    bg_none: `
      bg-transparent border
      ${theme === "dark" ? "border-darkerGrey" : "border-lightBlue"}
    `,
  };

  const baseClass = `
    w-full cursor-pointer flex justify-between items-center
    transition-colors duration-200 border-2 focus:outline-none
  `;

  return (
    <div
      ref={dropdownRef}
      className={`flex flex-col ${
        formInput ? "w-full" : "min-w-[120px]"
      } relative`}
    >
      {label && (
        <CommonParagraph className="mb-1 font-medium">{label}</CommonParagraph>
      )}

      {/* BUTTON */}
      <div
        className={cn(
          baseClass,
          sizeClasses[size],
          variants[variant],
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span
          className={`truncate ${
            selectedOption
              ? "font-medium"
              : `${
                  theme === "dark" ? "text-gray-400" : "text-mediumGrey"
                } font-normal`
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown />
        </motion.div>
      </div>

      {/* OPTIONS - Dynamic bg based on theme */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          style={{ pointerEvents: "none" }}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute w-full max-h-[200px]
              overflow-y-auto rounded-lg shadow-2xl border
              ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-300"
              }
              ${atTop ? "bottom-full mb-2" : "top-full mt-2"}
              left-0
            `}
            style={{
              zIndex: 9999,
              position: "absolute",
            }}
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  px-4 py-3 text-sm cursor-pointer
                  transition-all
                  ${
                    value === option.value
                      ? "bg-lightBlue text-white font-medium"
                      : theme === "dark"
                      ? "hover:bg-lightBlue hover:text-white text-gray-200"
                      : "hover:bg-lightBlue hover:text-white text-gray-700"
                  }
                `}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {errors?.message && (
        <p className="text-rose-600 text-sm mt-1">{errors.message}</p>
      )}
    </div>
  );
};

export default AutomationDropdown;
