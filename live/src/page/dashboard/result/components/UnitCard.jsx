import React, { useState } from "react";
import CircularProgress from "./CircularProgress";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import CommonParagraph from "@/components/texts/CommonParagraph";

const UnitCard = ({ title, data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("overall");
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  // ✅ API data shape: { overall: { unit_won, w, l, p, win_pct }, "7d": {...}, "30d": {...}, "90d": {...} }
  const periodDataRaw = data?.[selectedPeriod] || {};

  const w = periodDataRaw.w ?? 0;
  const l = periodDataRaw.l ?? 0;
  const p = periodDataRaw.p ?? 0;
  const total = w + l + p; // ✅ API has no total_picks field — calculate it

  const unitWon =
    periodDataRaw.unit_won !== undefined
      ? (periodDataRaw.unit_won >= 0 ? "+" : "") +
        periodDataRaw.unit_won.toFixed(2)
      : "+0.00";

  const winPct = periodDataRaw.win_pct ?? 0;
  const percentage = winPct;

  const stats = [
    { label: "Win", value: w },
    { label: "Loss", value: l },
    { label: "Push", value: p },
    { label: "Total", value: total },
  ];

  // ✅ title prop is passed from UnitSize — use it directly
  const displayTitle =
    title || data?.sport || (data?.size ? `${data.size} Units` : null);

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
      {/* ✅ Title — always render if displayTitle exists */}
      {displayTitle && (
        <CommonParagraph
          variant="large"
          className={`text-center text-base font-bold font-logo mb-8 sm:mb-10 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {displayTitle}
        </CommonParagraph>
      )}

      {/* Period Tabs */}
      <div
        className={`flex gap-1 sm:gap-2 mb-6 justify-between rounded-xl p-1 ${
          theme === "dark" ? "" : "bg-gray-100"
        }`}
      >
        {[
          { id: "overall", label: "Overall" },
          { id: "7d", label: "7D" },
          { id: "30d", label: "30D" },
          { id: "90d", label: "90D" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedPeriod(tab.id)}
            className={`capitalize rounded-full h-auto lg:h-[30px] px-2 sm:px-3 py-1 font-logo text-xs sm:text-sm font-normal transition-all flex-1 ${
              theme === "dark"
                ? selectedPeriod === tab.id
                  ? "bg-[#0A9087] text-white"
                  : "text-white/80 hover:bg-white/10"
                : selectedPeriod === tab.id
                  ? "bg-white text-[#0A9087] shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Grid — Won + ROI */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
        {/* Won */}
        <div
          className={`rounded-[10px] p-3 sm:p-5 text-center col-span-2 ${
            theme === "dark"
              ? "bg-[#054844]"
              : "bg-[#0A9087]/10 border border-[#0A9087]/20"
          }`}
        >
          <div
            className={`text-xs mb-1 font-logo font-normal ${
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
            {unitWon}
          </div>
        </div>

        {/* ROI — win_pct */}
        <div
          className={`flex justify-center items-center rounded-xl p-3 sm:p-5 text-center col-span-3 ${
            theme === "dark"
              ? "bg-[#033533]"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <div className="min-w-0">
            <div
              className={`text-xs font-logo font-normal mb-1 ${
                theme === "dark" ? "text-[#0A9087]" : "text-gray-500"
              }`}
            >
              Win %
            </div>
            <div
              className={`xl:text-base text-base font-logo font-bold truncate ${
                theme === "dark" ? "text-[#0A9087]" : "text-gray-800"
              }`}
            >
              {winPct.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom — W/L/P/Total + Circular */}
      <div className="flex justify-between items-center gap-3">
        <div
          className={`rounded-xl px-2 sm:px-3 py-5 sm:py-10 text-xs sm:text-sm leading-relaxed w-full ${
            theme === "dark"
              ? "bg-[#021716] text-white"
              : "bg-gray-50 border border-gray-200 text-gray-700"
          }`}
        >
          <div className="grid grid-cols-1 gap-2 justify-center items-center text-center">
            {stats.map((stat, idx) => {
              const isWin = stat.label === "Win";
              const isLoss = stat.label === "Loss";
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
                  <span className="font-normal opacity-70">{stat.label}: </span>
                  <span className="font-bold">{stat.value}</span>
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
