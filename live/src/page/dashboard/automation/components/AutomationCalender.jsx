import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import Dropdown from "@/components/forms/Dropdown";
import CommonParagraph from "@/components/texts/CommonParagraph";
import AutomationDropdown from "@/components/forms/AutomationDropdown";

const AutomationCalendar = ({ calendarDaily, loading, refetchData }) => {
  const { theme } = useTheme();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Refetch data when month or year changes
  useEffect(() => {
    if (refetchData) {
      refetchData();
    }
  }, [selectedMonth, selectedYear]);

  const years = useMemo(() => {
    const startYear = 2000;
    const endYear = currentYear + 6;
    const yearOptions = [];
    for (let y = startYear; y <= endYear; y++) {
      yearOptions.push({ value: y, label: y.toString() });
    }
    return yearOptions;
  }, [currentYear]);

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const getDateKey = (day) => {
    const m = String(selectedMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${selectedYear}-${m}-${d}`;
  };

  const getDayData = (day) => {
    if (!day || !calendarDaily) return null;
    const key = getDateKey(day);
    return calendarDaily[key] ?? null;
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);

    return days;
  }, [selectedMonth, selectedYear]);

  const currentMonthPL = useMemo(() => {
    if (!calendarDaily || Object.keys(calendarDaily).length === 0) {
      return "0.00";
    }

    const prefix = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}`;
    return Object.entries(calendarDaily)
      .filter(([date]) => date.startsWith(prefix))
      .reduce((sum, [, data]) => sum + Number(data?.amount || 0), 0)
      .toFixed(2);
  }, [calendarDaily, selectedMonth, selectedYear]);

  const selectedMonthName = months.find(
    (m) => m.value === selectedMonth
  )?.label;

  if (loading) {
    return (
      <div
        className={`rounded-lg p-4 border ${
          theme === "dark"
            ? "bg-darkBlack border-lightBlack"
            : "bg-white border-lighterGrey"
        }`}
      >
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <div
              className={`h-9 w-28 rounded animate-pulse ${
                theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-9 w-24 rounded animate-pulse ${
                theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
              }`}
            />
          </div>

          <div
            className={`h-6 w-40 mx-auto sm:mx-0 rounded animate-pulse ${
              theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
            }`}
          />
        </div>

        {/* Weekday Skeleton */}
        <div className="grid grid-cols-7 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 mx-auto w-8 rounded animate-pulse ${
                theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Calendar Grid Skeleton */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className={`h-14 sm:h-16 rounded-md animate-pulse ${
                theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Footer Skeleton */}
        <div
          className={`mt-6 flex justify-between items-center border-t pt-4 ${
            theme === "dark" ? "border-lightBlack" : "border-gray-200"
          }`}
        >
          <div
            className={`h-5 w-36 rounded animate-pulse ${
              theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-9 w-24 rounded animate-pulse ${
              theme === "dark" ? "bg-lightBlack" : "bg-gray-200"
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-4 border ${
        theme === "dark"
          ? "bg-darkBlack border-lightBlack text-lighterGrey"
          : "bg-white border-lighterGrey text-darkGrey"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-2 relative z-50">
          {/* Month Dropdown */}
          <AutomationDropdown
            options={months}
            value={selectedMonth}
            onChange={(v) => setSelectedMonth(Number(v))}
            size="small"
            className={`${
              theme === "dark"
                ? "bg-darkBlack text-lighterGrey border-lightBlack"
                : "bg-white text-darkGrey border-lighterGrey"
            }`}
            menuClassName={`${
              theme === "dark"
                ? "bg-darkBlack border-lightBlack text-lighterGrey"
                : "bg-white border-lighterGrey text-darkGrey"
            }`}
          />

          {/* Year Dropdown */}
          <AutomationDropdown
            options={years}
            value={selectedYear}
            onChange={(v) => setSelectedYear(Number(v))}
            size="small"
            className={`${
              theme === "dark"
                ? "bg-darkBlack text-lighterGrey border-lightBlack"
                : "bg-white text-darkGrey border-lighterGrey"
            }`}
            menuClassName={`${
              theme === "dark"
                ? "bg-darkBlack border-lightBlack text-lighterGrey"
                : "bg-white border-lighterGrey text-darkGrey"
            }`}
          />
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

      {/* Week Days */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((d) => (
          <div
            key={d}
            className={`text-center text-sm font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const data = getDayData(day);
          const value = Number(data?.amount || 0);

          let bg = "bg-transparent";
          let borderClass = "";

          if (day) {
            if (data) {
              bg = data.color === "green" ? "bg-green-600" : "bg-rose-600";
            } else {
              bg = theme === "dark" ? "bg-lightBlack" : "bg-gray-100";
              borderClass =
                theme === "dark"
                  ? "border border-gray-700"
                  : "border border-gray-200";
            }
          }

          const textColor = !day
            ? ""
            : data
            ? "text-white"
            : theme === "dark"
            ? "text-gray-300"
            : "text-gray-700";

          return (
            <div
              key={`day-${i}`}
              className={`h-14 sm:h-16 rounded-md flex flex-col items-center justify-center ${bg} ${borderClass} ${textColor} transition-all`}
              title={
                day
                  ? `${getDateKey(day)}: ${data ? value.toFixed(2) : "No data"}`
                  : ""
              }
            >
              {day && (
                <>
                  <span className="text-xs sm:text-sm font-medium">{day}</span>
                  {data && (
                    <span className="text-[10px] sm:text-xs font-bold mt-0.5">
                      {value.toFixed(2)} $
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Monthly P/L Summary */}
      <div
        className={`mt-6 flex justify-between items-center border-t pt-4 ${
          theme === "dark" ? "border-lightBlack" : "border-gray-200"
        }`}
      >
        <span className="font-semibold text-sm sm:text-base">
          CURRENT MONTH P/L
        </span>
        <span
          className={`px-4 py-2 rounded-lg text-white font-bold text-sm sm:text-base ${
            currentMonthPL > 0
              ? "bg-green-600"
              : currentMonthPL < 0
              ? "bg-rose-600"
              : "bg-gray-500"
          }`}
        >
          {currentMonthPL} $
        </span>
      </div>
    </div>
  );
};

export default AutomationCalendar;

