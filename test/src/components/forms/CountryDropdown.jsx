import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import CommonParagraph from "../texts/CommonParagraph";

const CountryDropdown = ({
  label = "",
  options = [],
  placeholder = "Select an option",
  errors = {},
  className = "",
  defaultValue = "USA",
  onChange,
  formInput,
  atTop,
  atLeft,
  size = "large",
  variant = "bg_black",
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Filter options by search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (option.code &&
            option.code.toLowerCase().includes(searchTerm.toLowerCase())),
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  const handleDropDown = (value) => {
    setSelectedValue(value); // This should be the short form like "us", "bd"
    setIsOpen(false);
    setSearchTerm("");
    if (onChange) onChange(value); // Send the value (short form) to parent
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    if (!value) setSelectedValue("");
  };

  const handleInputClick = () => {
    setIsOpen(true);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    } else if (e.key === "ArrowDown" && filteredOptions.length > 0) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const sizeClasses = {
    small: "py-1 xl:text-sm text-xs xl:px-5 px-3 rounded-md",
    medium: "py-2.5 xl:text-sm text-xs xl:px-8 px-5 rounded-lg",
    large: "py-3 xl:text-[16px] text-sm xl:px-8 px-5 rounded-lg",
  };

  const variantsObj = {
    bg_none: `bg-transparent ${sizeClasses[size]} placeholder:text-gray-400 text-mediumBlack border-2 border-lightGrey`,
    bg_white: `bg-white ${sizeClasses[size]} placeholder:text-gray-400 text-mediumBlack light-theme border-2 border-lightGrey`,
    bg_black: `bg-[#032422] ${sizeClasses[size]} placeholder:text-mediumGrey text-lighterGrey dark-theme border-2 border-[#03635d]`,
  };

  const baseClass =
    "focus:outline-none focus:border-[#0A9087] placeholder:font-normal w-full thin-scrollbar transition-colors duration-200 tracking-wide resize-none cursor-pointer flex justify-between items-center xl:text-base text-sm";

  const cn = (...classes) => classes.filter(Boolean).join(" ");

  // Truncate text function
  const truncateText = (text, maxLength = 12) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Display value truncated if too long
  const getDisplayValue = () => {
    if (isOpen) return searchTerm;
    if (selectedOption) return truncateText(selectedOption.label, 12);
    return "";
  };

  const getPlaceholder = () => {
    if (isOpen && !searchTerm)
      return selectedOption ? truncateText(selectedOption.label, 12) : "";
    if (!selectedOption && !isOpen) return placeholder;
    return "";
  };

  return (
    <div
      ref={dropdownRef}
      className={`flex flex-col ${formInput ? "w-full" : "min-w-[20px]"} relative`}
    >
      {label && (
        <label>
          <CommonParagraph
            className={`font-medium ${variant === "bg_black" ? "text-white" : "text-back"}`}
          >
            {label}
          </CommonParagraph>
        </label>
      )}

      <div className={cn(baseClass, className, variantsObj[variant])}>
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className={`flex-1 bg-transparent outline-none cursor-pointer pr-2 truncate ${
            !selectedOption && !isOpen
              ? variant === "bg_black"
                ? "text-mediumGrey"
                : "text-black"
              : variant === "bg_black"
                ? "text-white"
                : "text-black"
          } font-normal`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls="dropdown-list"
          aria-labelledby={label ? "dropdown-label" : undefined}
        />

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
          onClick={handleInputClick}
          className="flex items-center justify-center z-[200] absolute right-3"
        >
          <FaChevronDown
            className={
              variant === "bg_black" ? "text-mediumGrey" : "text-lightBlack"
            }
            size={12}
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
            className={`absolute ${atTop ? "bottom-full" : "top-full"} w-full min-w-[250px] ${
              atLeft ? "left-0" : "right-0"
            } ${variant === "bg_black" ? "bg-[#03635d]  shadow-sm" : "bg-white border-lightGrey"} border-2 rounded-lg shadow-md z-[1000] mt-1 mb-1 p-1 overflow-y-auto max-h-[200px] thin-scrollbar`}
          >
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className={`px-5 py-2 cursor-pointer m-1 rounded-md font-medium text-sm transition-all duration-200 flex items-center ${
                  variant === "bg_black"
                    ? `hover:bg-[#0A9087] hover:text-lighterGrey ${
                        selectedValue === option.value
                          ? "bg-[#03635d] text-lighterGrey"
                          : "text-lighterGrey"
                      }`
                    : `hover:bg-darkBlue hover:text-white ${
                        selectedValue === option.value
                          ? "bg-darkBlue text-white"
                          : "text-mediumBlack"
                      }`
                }`}
                onClick={() => handleDropDown(option.value)} // Send value, not label
              >
                {option.flag && (
                  <span className="mr-2 text-base">{option.flag}</span>
                )}
                <span className="flex-1 truncate" title={option.label}>
                  {truncateText(option.label, 12)}
                </span>
                {option.code && (
                  <span className="ml-2 text-xs opacity-70">{option.code}</span>
                )}
              </li>
            ))}

            {filteredOptions.length === 0 && (
              <li
                className={`px-5 py-4 text-center text-sm ${
                  variant === "bg_black" ? "text-mediumGrey" : "text-gray-500"
                }`}
              >
                No countries found
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>

      {errors.message && (
        <p className="text-rose-700 font-medium text-sm mt-1">
          {errors.message}
        </p>
      )}
    </div>
  );
};

export default CountryDropdown;
