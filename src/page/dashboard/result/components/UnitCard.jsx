import React, { useState } from "react";
import CircularProgress from "./CircularProgress";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import CommonParagraph from "@/components/texts/CommonParagraph";

const UnitCard = ({ title, data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("overall");
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

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
      className={`rounded-2xl p-4 sm:p-5 w-full max-w-full shadow-md ${
        sidebarOpen
          ? "min-w-[260px] max-w-[280px]"
          : "min-w-[280px] max-w-[320px]"
      } ${
        theme === "dark"
          ? "bg-[#032422] text-white"
          : "bg-white border border-gray-100 text-gray-800 shadow-lg"
      }`}
    >
      {/* Title */}
      {data?.size && (
        <CommonParagraph
          variant="large"
          className={`font-semibold text-center mb-8 sm:mb-10 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {data?.size ?? "0"} Percent
        </CommonParagraph>
      )}
      {data?.sport && (
        <CommonParagraph
          variant="large"
          className={` text-center text-base font-bold font-logo mb-8 sm:mb-10 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {data?.sport ?? "0"}
        </CommonParagraph>
      )}

      {/* Tabs */}
      <div
        className={`flex gap-1 sm:gap-2 mb-6 justify-between rounded-xl p-1 ${
          theme === "dark" ? "" : "bg-gray-100"
        }`}
      >
        {[
          { id: "overall", label: "overall" },
          { id: "7d", label: "7D" },
          { id: "30d", label: "30D" },
          { id: "90d", label: "90D" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`capitalize rounded-full h-auto lg:h-[30px] px-2 sm:px-3 py-1 font-logo text-xs sm:text-sm font-normal transition-all flex-1 ${
              theme === "dark"
                ? selectedPeriod === tab.id
                  ? "bg-[#0A9087] text-white"
                  : "text-white/80 hover:bg-white/10"
                : selectedPeriod === tab.id
                  ? "bg-white text-[#0A9087] shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-700"
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
        <div
          className={`rounded-[10px] p-3 sm:p-5 text-center col-span-2 ${
            theme === "dark"
              ? "bg-[#054844]"
              : "bg-[#0A9087]/10 border border-[#0A9087]/20"
          }`}
        >
          <div
            className={`text-xs mb-1 font-logo font-normal  ${
              theme === "dark" ? "text-lightestGrey" : "text-[#0A9087]"
            }`}
          >
            Won
          </div>
          <div
            className={`text-sm sm:text-base font-bold ${
              theme === "dark" ? "text-white" : "text-[#0A9087]"
            }`}
          >
            {unitWon}%
          </div>
        </div>

        {/* ROI */}
        <div
          className={`flex justify-center items-center rounded-xl p-3 sm:p-5 text-center col-span-3 ${
            theme === "dark"
              ? "bg-[#033533]"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <div className="min-w-0">
            <div
              className={` text-xs font-logo font-normal mb-1 ${
                theme === "dark" ? "text-[#0A9087]" : "text-gray-500"
              }`}
            >
              ROI
            </div>
            <div
              className={`xl:text-base text-base font-logo font-bold truncate ${
                theme === "dark" ? "text-[#0A9087]" : "text-gray-800"
              }`}
            >
              {unitWon}%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center gap-3">
        {/* Left box — W/L/P + Total */}
        <div
          className={`rounded-xl px-2 sm:px-3 py-5 sm:py-10 text-xs sm:text-sm leading-relaxed w-full ${
            theme === "dark"
              ? "bg-[#021716] text-white"
              : "bg-gray-50 border border-gray-200 text-gray-700"
          }`}
        >
          <div className="grid grid-cols-1 gap-2 justify-center items-center text-center">
            {stats.map((stat, idx) => {
              const isWin = stat.startsWith("Win");
              const isLoss = stat.startsWith("Loss");

              // Split label and value (e.g. "Win Rate: 75%" → ["Win Rate", "75%"])
              const colonIndex = stat.lastIndexOf(":");
              const label =
                colonIndex !== -1 ? stat.slice(0, colonIndex).trim() : stat;
              const value =
                colonIndex !== -1 ? stat.slice(colonIndex + 1).trim() : null;

              return (
                <div
                  key={idx}
                  className={`truncate font-logo ${
                    theme === "dark"
                      ? "text-white"
                      : isWin
                        ? "text-emerald-600"
                        : isLoss
                          ? "text-rose-500"
                          : "text-gray-600"
                  }`}
                >
                  {value ? (
                    <>
                      <span className="font-normal opacity-70">{label}: </span>
                      <span className="font-bold">{value}</span>
                    </>
                  ) : (
                    <span className="font-medium">{stat}</span>
                  )}
                </div>
              );
            })}
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
