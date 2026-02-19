import React, { useState, useMemo } from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import Dropdown from "@/components/forms/Dropdown";
import CommonParagraph from "@/components/texts/CommonParagraph";

const Calendar = ({ calendarData }) => {
  const { theme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate all possible years from 2000 to current year + 5
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = 2000; year <= currentYear + 5; year++) {
      yearsArray.push({ value: year, label: year.toString() });
    }
    return yearsArray;
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getDateKey = (day) => {
    const month = String(selectedMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${selectedYear}-${month}-${dayStr}`;
  };

  const getDayData = (day) => {
    if (!day) return null;
    return calendarData[getDateKey(day)];
  };

  // Calculate current month P/L
  const calculateCurrentMonthPL = () => {
    let totalPL = 0;
    const monthStr = String(selectedMonth + 1).padStart(2, "0");
    const yearMonthPrefix = `${selectedYear}-${monthStr}`;

    // Loop through all calendar days and sum up values for the current month
    Object.entries(calendarData).forEach(([date, data]) => {
      if (date.startsWith(yearMonthPrefix)) {
        totalPL += parseFloat(data.value);
      }
    });

    return totalPL.toFixed(2);
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(Number(value));
  };

  const handleYearChange = (value) => {
    setSelectedYear(Number(value));
  };

  const calendarDays = generateCalendarDays();
  const currentMonthPL = calculateCurrentMonthPL();

  const selectedMonthName = months.find(
    (month) => month.value === selectedMonth,
  )?.label;

  return (
    <div
      className={`h-full rounded-lg p-3 sm:p-4 lg:p-6 shadow-xl border ${
        theme === "dark"
          ? "bg-darkBlack border-lightBlack text-lighterGrey"
          : "bg-white border-lighterGrey text-darkGrey"
      }`}
    >
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-2 sm:gap-3">
            <Dropdown
              options={months}
              defaultValue={selectedMonth}
              onChange={handleMonthChange}
              size="small"
              variant={theme === "dark" ? "bg_black" : "bg_white"}
              className="min-w-[100px] sm:min-w-[120px]"
            />

            <Dropdown
              options={years}
              defaultValue={selectedYear}
              onChange={handleYearChange}
              size="small"
              variant={theme === "dark" ? "bg_black" : "bg_white"}
              className="min-w-[80px] sm:min-w-[90px]"
            />
          </div>
        </div>

        <div className="flex justify-between items-center xl:w-1/3 md:w-1/2 w-full">
          <button
            onClick={() => navigateMonth("prev")}
            className={`p-1 sm:p-2 transition-colors cursor-pointer ${
              theme === "dark"
                ? "text-mediumGrey hover:text-white "
                : "text-lightGrey hover:text-darkBlack"
            }`}
            aria-label="Previous month"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <CommonParagraph
            className={`text-base sm:text-lg font-semibold text-center`}
          >
            {selectedMonthName} {selectedYear}
          </CommonParagraph>
          <button
            onClick={() => navigateMonth("next")}
            className={`p-1 sm:p-2 transition-colors cursor-pointer ${
              theme === "dark"
                ? "text-mediumGrey hover:text-white "
                : "text-lightGrey hover:text-darkBlack"
            }`}
            aria-label="Next month"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2 sm:mb-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className={`text-center text-sm font-normal py-1 sm:py-2 ${
              theme === "dark" ? "text-lightGrey" : "text-darkGrey"
            }`}
          >
            {day.substring(0, 3)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {calendarDays.map((day, idx) => {
          const dayData = getDayData(day);
          const isEmpty = !day;
          const isZeroValue = dayData && parseFloat(dayData.value) === 0;

          return (
            <div
              key={idx}
              className={`
          rounded flex flex-col items-center justify-center p-5
          transition-all duration-200 cursor-pointer border border-transparent
          ${
            isEmpty
              ? "bg-transparent"
              : dayData
                ? isZeroValue || dayData.color === "green"
                  ? "bg-green-600/90 hover:bg-green-400 border-green-400"
                  : "bg-rose-600/90 hover:bg-rose-700 border-red-400"
                : theme === "dark"
                  ? "bg-lightBlack hover:bg-lightBlack/60 border-darkerGrey"
                  : "bg-lighterGrey hover:bg-lightBlue border-lightBlue"
          }
          ${!isEmpty && "hover:scale-105"}
          h-6 sm:h-8 md:h-10 lg:h-8 xl:h-10 2xl:h-14
        `}
            >
              {day && (
                <>
                  <div
                    className={`text-xs sm:text-sm font-medium leading-none ${
                      dayData
                        ? "text-white"
                        : theme === "dark"
                          ? "text-lighterGrey"
                          : "text-darkGrey"
                    }`}
                  >
                    {day}
                  </div>
                  {dayData && (
                    <div
                      className={`font-medium p-1 rounded mt-0.5 leading-none whitespace-nowrap ${
                        parseFloat(dayData.value).toFixed(2).length > 6
                          ? "text-[7px] xs:text-[8px] sm:text-[9px]"
                          : parseFloat(dayData.value).toFixed(2).length > 4
                            ? "text-[8px] xs:text-[9px] sm:text-[10px]"
                            : "text-[8px] xs:text-[9px] sm:text-xs"
                      } ${
                        theme === "dark"
                          ? "bg-black/20 text-white"
                          : "bg-white/20 text-darkGrey"
                      }`}
                    >
                      {parseFloat(dayData.value).toFixed(2)} %
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Month Summary - UNCOMMENTED AND WORKING */}
      <div
        className={`mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 pt-3 sm:pt-4 border-t ${
          theme === "dark" ? "border-lightBlack" : "border-lighterGrey"
        }`}
      >
        <div
          className={`text-sm sm:text-base font-semibold text-center sm:text-left ${
            theme === "dark" ? "text-mediumGrey" : "text-gray-600"
          }`}
        >
          CURRENT MONTH P/L
        </div>
        <div
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-lg min-w-[100px] sm:min-w-[120px] text-center ${
            parseFloat(currentMonthPL) < 0
              ? "bg-rose-600 text-white"
              : parseFloat(currentMonthPL) === 0
                ? "bg-gray-500 text-white"
                : "bg-green-600 text-white"
          }`}
        >
          {currentMonthPL}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 sm:mt-4 flex justify-center gap-2 sm:gap-4 text-[10px] xs:text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded"></div>
          <span
            className={theme === "dark" ? "text-mediumGrey" : "text-gray-600"}
          >
            Profit
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded"></div>
          <span
            className={theme === "dark" ? "text-mediumGrey" : "text-gray-600"}
          >
            Loss
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded ${
              theme === "dark" ? "bg-lightBlack" : "bg-lighterGrey"
            }`}
          ></div>
          <span
            className={theme === "dark" ? "text-mediumGrey" : "text-gray-600"}
          >
            No Data
          </span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
