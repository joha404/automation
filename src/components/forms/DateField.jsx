import { cn } from "@/lib/utils";
import CommonParagraph from "../texts/CommonParagraph";
import { useState } from "react";

const DateField = ({
  label = "",
  type = "text",
  placeholder = "",
  name = "",
  errors = {},
  register_as = "",
  register,
  className = "",
  variant = "bg_none",
  readOnly = false,
  autoComplete = "on",
  rows = 5,
  validationRules = {},
  size = "medium",
  minDate = "1900-01-01", // Default min date
  maxDate = "2100-12-31", // Default max date
  ...props
}) => {
  const [localValue, setLocalValue] = useState("");
  const [isValidFormat, setIsValidFormat] = useState(true);

  // Enhanced validation function for dates
  const validateDate = (value) => {
    if (!value) return true; // Allow empty field if not required
    
    // Check format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return "Date must be in YYYY-MM-DD format";
    }

    // Parse the date
    const parts = value.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // Check if the date is valid
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return "Invalid date (e.g., February 31st doesn't exist)";
    }

    // Check min date
    if (minDate && value < minDate) {
      return `Date must be on or after ${minDate}`;
    }

    // Check max date
    if (maxDate && value > maxDate) {
      return `Date must be on or before ${maxDate}`;
    }

    return true;
  };

  // Combine with any additional validation rules
  const combinedValidationRules = {
    ...validationRules,
    validate: {
      ...validationRules.validate,
      dateValidation: validateDate,
    },
  };

  const inputProps = register ? register(name, combinedValidationRules) : {};
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

  // Handle date format during input
  const handleDateChange = (e) => {
    let value = e.target.value;
    
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format the date based on input length
    if (numericValue.length <= 4) {
      value = numericValue;
    } else if (numericValue.length <= 6) {
      value = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
    } else {
      value = `${numericValue.slice(0, 4)}-${numericValue.slice(4, 6)}-${numericValue.slice(6, 8)}`;
    }
    
    setLocalValue(value);
    if (inputProps.onChange) {
      inputProps.onChange({
        ...e,
        target: {
          ...e.target,
          value: value
        }
      });
    }
  };

 const sizeClasses = {
    small: "py-1 xl:text-sm text-xs  xl:placeholder:text-sm placeholder:text-xs xl:px-5 px-3 rounded-md",
    medium: "py-2.5 xl:text-sm text-xs  xl:placeholder:text-sm placeholder:text-xs xl:px-8 px-5 rounded-lg",
    large: "py-3 xl:text-[16px] text-sm  xl:placeholder:text-[16px] placeholder:text-sm xl:px-8 px-5 rounded-lg",
  };

  const variants = {
    bg_none: `bg-transparent xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-gray-400 text-mediumBlack`,
    bg_white: `bg-white xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-gray-400 text-mediumBlack light-theme`,
    bg_black: `bg-darkerBlack xl:px-8 px-5 ${sizeClasses[size]} placeholder:text-mediumGrey text-lighterGrey dark-theme`,
  };

  const baseClass =
    "focus:outline-none focus:border-mediumBlue placeholder:font-normal border-2 border-lightGrey w-full thin-scrollbar transition-colors duration-200 tracking-wide";

  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && (
        <label htmlFor={register_as}>
          <CommonParagraph className={`font-medium ${variant === "bg_black" ? "text-lighterGrey" : "text-darkBlack" }`}>
            {label}
          </CommonParagraph>
        </label>
      )}

      <div className="relative">
        {type === "date" ? (
          <input
            id={register_as}
            name={name}
            type="text" // Using text type to better control input format
            placeholder="YYYY-MM-DD"
            readOnly={readOnly}
            onKeyDown={handleKeyDown}
            onChange={handleDateChange}
            value={localValue}
            className={cn(
              className,
              baseClass,
              variants[variant],
              errorMessage && "border-mediumBlue focus:border-mediumBlue"
            )}
            autoComplete={autoComplete}
            maxLength={10}
            {...props}
            {...inputProps}
          />
        ) : type === "textarea" ? (
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
              errorMessage && "border-mediumBlue focus:border-mediumBlue"
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
              errorMessage && "border-darkBlue focus:border-darkBlue"
            )}
            autoComplete={autoComplete}
            {...inputProps}
            {...props}
          />
        )}
      </div>

      {errorMessage && (
        <p className={` ${variant === "bg_black" ? "text-rose-500" : "text-rose-700" } font-normal xl:text-base text-sm tracking-wide xl:px-8 px-5`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default DateField;