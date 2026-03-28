import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import CommonParagraph from "@/components/texts/CommonParagraph";
import AutomationSummaryRow from "./AutomationSummaryRow";
import { getAutomationCalender } from "@/api/automation/automation";

const SUMMARY_ROWS = [
  { label: "Today", key: "today" },
  { label: "Yesterday", key: "yesterday" },
  { label: "Last 7 Days", key: "last_7_days" },
  { label: "Last 30 Days", key: "last_30_days" },
  { label: "All Time", key: "all_time" },
];

const AutomationSummary = ({ calendarSummary, loading }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`h-full rounded-lg p-3 sm:p-6 border ${
        theme === "dark"
          ? "bg-darkBlack border-lightBlack"
          : "bg-white border-lighterGrey"
      }`}
    >
      {/* HEADER */}
      <div
        className={`grid grid-cols-2 text-xs mb-3 pb-2 border-b ${
          theme === "dark"
            ? "text-mediumGrey border-lightBlack"
            : "text-gray-600 border-lighterGrey"
        }`}
      >
        <CommonParagraph variant="smaller">Timeline</CommonParagraph>
        <CommonParagraph variant="smaller" className="text-center">
          Amount
        </CommonParagraph>
      </div>

      {/* BODY */}
      <div className="space-y-1">
        {SUMMARY_ROWS.map(({ label, key }) => (
          <AutomationSummaryRow
            loading={loading}
            key={key}
            title={label}
            data={calendarSummary[key]}
          />
        ))}
      </div>
    </div>
  );
};

export default AutomationSummary;
