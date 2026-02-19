import React, { useState } from "react";
import CircularProgress from "./CircularProgress";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import CommonParagraph from "@/components/texts/CommonParagraph";

const UnitCard = ({ title, data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("overall");
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  // Handle missing data gracefully
  const periodDataRaw = data?.[selectedPeriod] || {};

  const periodData = {
    unitWon:
      periodDataRaw.unit_won !== undefined
        ? periodDataRaw.unit_won.toFixed(2)
        : "+0.00",
    roi:
      periodDataRaw.roi_pct !== undefined
        ? `${periodDataRaw.roi_pct.toFixed(2)}%`
        : "+0.00%",
    unitRisk: periodDataRaw.unit_risk ?? 0,
    stats: [
      `Win : ${periodDataRaw.w ?? 0}`,
      `Loss : ${periodDataRaw.l ?? 0}`,
      `Push : ${periodDataRaw.p ?? 0}`,
      `Total : ${periodDataRaw.total_picks ?? 0}`,
    ],
    percentage: periodDataRaw.win_pct ?? 0,
  };

  const { unitWon, roi, stats, percentage } = periodData;

  return (
    <div
      className={`${
        theme === "dark" ? "bg-[#012140]" : "bg-darkerBlue"
      } rounded-2xl p-4 sm:p-5 w-full max-w-full text-white shadow-md ${
        sidebarOpen
          ? "min-w-[260px] max-w-[280px]"
          : "min-w-[280px] max-w-[320px]"
      }`}
    >
      {/* Title */}
      {data?.size && (
        <CommonParagraph
          variant="large"
          className="font-semibold text-center mb-8 sm:mb-10 text-white"
        >
          {data?.size ?? "0"} Percent
        </CommonParagraph>
      )}
      {data?.sport && (
        <CommonParagraph
          variant="large"
          className="font-semibold text-center mb-8 sm:mb-10 text-white"
        >
          {data?.sport ?? "0"}
        </CommonParagraph>
      )}

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-6 justify-between">
        {[
          { id: "overall", label: "overall" },
          { id: "7d", label: "7D" },
          { id: "30d", label: "30D" },
          { id: "90d", label: "90D" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`capitalize rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors flex-1 ${
              selectedPeriod === tab.id
                ? "bg-[#2E89FF] text-white"
                : "text-white/80 hover:bg-white/10 "
            }`}
            onClick={() => setSelectedPeriod(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
        {/* Unit Won */}
        <div className="bg-mediumBlue rounded-lg p-3 sm:p-5 text-center col-span-2">
          <div className="text-xs mb-1 text-lightestGrey"> Won</div>
          <div className="text-sm sm:text-base font-bold">{unitWon}%</div>
        </div>

        {/* ROI */}
        <div className="flex justify-center items-center bg-white rounded-lg p-3 sm:p-5 text-center text-gray-800 col-span-3">
          <div className="min-w-0">
            <div className="xl:text-base text-sm mb-1 text-darkGrey">ROI</div>
            <div className="xl:text-base text-sm font-semibold text-[#2E89FF] truncate">
              {unitWon}%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center gap-3">
        {/* Left box (W/L/P + Total Picks) */}
        <div className="bg-[#114F8C] rounded-lg px-2 sm:px-3 py-5 sm:py-10 text-xs sm:text-sm leading-relaxed w-full">
          <div className="grid grid-cols-1 gap-2 justify-center items-center text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="truncate">
                {stat}
              </div>
            ))}
          </div>
        </div>

        {/* Circular Progress */}
        <div className="w-full flex justify-center items-center">
          <CircularProgress percentage={percentage} size={120} />
        </div>
      </div>
    </div>
  );
};

export default UnitCard;
