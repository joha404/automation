import React from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import CommonParagraph from "@/components/texts/CommonParagraph";
import SummaryRow from "./SummaryRow";

const Summary = ({ summaryData }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`h-full rounded-lg sm:p-6 p-3 shadow-xl border ${
        theme === "dark"
          ? "bg-darkBlack border-lightBlack"
          : "bg-white border-lighterGrey"
      }`}
    >
      <CommonParagraph
        variant="large"
        className={`uppercase font-semibold mb-10 ${
          theme === "dark" ? "text-lighterGrey" : "text-darkGrey"
        }`}
      >
        Past History
      </CommonParagraph>

      <div className="space-y-1">
        {/* Header */}
        <div
          className={`grid grid-cols-4 text-xs mb-2 pb-2 border-b ${
            theme === "dark"
              ? "text-mediumGrey border-lightBlack"
              : "text-gray-600 border-lighterGrey"
          }`}
        >
          <CommonParagraph variant="smaller" className="font-normal col-span-1">
            TIMELINE
          </CommonParagraph>
          <CommonParagraph
            variant="smaller"
            className="font-normal text-center"
          >
            Profit/Loss
            <br />
            Percent
          </CommonParagraph>
          <CommonParagraph
            variant="smaller"
            className="font-normal text-center"
          >
            Win
          </CommonParagraph>
          <CommonParagraph
            variant="smaller"
            className="font-normal text-center"
          >
            Loss
          </CommonParagraph>
        </div>
        <SummaryRow title="Today" data={summaryData?.today} theme={theme} />
        <SummaryRow
          title="Yesterday"
          data={summaryData?.yesterday}
          theme={theme}
        />
        <SummaryRow
          title="Last 7 Days"
          data={summaryData?.last_7_days}
          theme={theme}
        />
        <SummaryRow
          title="Last 30 Days"
          data={summaryData?.last_30_days}
          theme={theme}
        />
        <SummaryRow
          title="All Time"
          data={summaryData?.all_time}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default Summary;
