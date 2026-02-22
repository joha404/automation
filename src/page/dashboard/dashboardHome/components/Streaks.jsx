import React, { useState } from "react";
import m from "../../../../assets/dashboard/m.png";
import { useTheme } from "@/hooks/custom/useTheme";
import { FaFire } from "react-icons/fa6";
const sports = [
  "All",
  "NBA",
  "NFL",
  "MBL",
  "NHL",
  "Soccer",
  "Tennis",
  "Golf",
  "UFC/MMA",
];

const picks = [
  {
    id: 1,
    league: "NBA",
    logo: m,
    title: "Celtics -5.5 (-110)",
    matchup: "BOS @ MIA",
    time: "7:30 PM ET",
    model: "58%",
    edge: "+5.1%",
  },
  {
    id: 2,
    league: "NBA",
    logo: m,
    title: "Celtics -5.5 (-110)",
    matchup: "BOS @ MIA",
    time: "7:30 PM ET",
    model: "58%",
    edge: "+5.1%",
  },
  {
    id: 3,
    league: "NBA",
    logo: m,
    title: "Celtics -5.5 (-110)",
    matchup: "BOS @ MIA",
    time: "7:30 PM ET",
    model: "58%",
    edge: "+5.1%",
  },
  {
    id: 4,
    league: "NBA",
    logo: m,
    title: "Celtics -5.5 (-110)",
    matchup: "BOS @ MIA",
    time: "7:30 PM ET",
    model: "58%",
    edge: "+5.1%",
  },
  {
    id: 5,
    league: "NFL",
    logo: m,
    title: "Chiefs -3.5 (-115)",
    matchup: "KC @ LAR",
    time: "8:00 PM ET",
    model: "62%",
    edge: "+4.3%",
  },
  {
    id: 6,
    league: "NHL",
    logo: m,
    title: "Bruins ML (-130)",
    matchup: "BOS @ TOR",
    time: "7:00 PM ET",
    model: "55%",
    edge: "+3.8%",
  },
];

export default function Streaks() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("NBA");
  const [activeDot, setActiveDot] = useState(2);

  const filteredPicks =
    activeTab === "All" ? picks : picks.filter((p) => p.league === activeTab);
  const displayPicks = filteredPicks.slice(0, 4);

  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FaFire
              className={` ${theme === "dark" ? "text-white " : "text-black"}`}
            />

            <h2
              className={`font-logo text-xl font-extrabold tracking-tight transition-colors duration-300 ${isDark ? "text-white" : "text-[#0a1628]"}`}
            >
              Hot Streaks
            </h2>
          </div>
          <button
            className={`font-logo text-sm font-bold tracking-widest uppercase flex items-center gap-1 transition-colors duration-200 hover:text-[#0A9087] ${isDark ? "text-white" : "text-[#0a1628]"}`}
          >
            VIEW MORE
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Sport Filter Tabs — mobile: horizontal scroll, no wrap */}
        <div className="flex sm:flex-wrap gap-2 mb-6 overflow-x-auto sm:overflow-x-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveTab(sport)}
              className={`font-logo px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer flex-shrink-0
                ${
                  activeTab === sport
                    ? "bg-[#0A9087] border-[#0A9087] text-white"
                    : isDark
                      ? "bg-transparent border-[#032422] text-gray-400 hover:border-[#0A9087]/50 hover:text-[#0A9087]"
                      : "bg-transparent border-gray-200 text-gray-500 hover:border-[#0A9087]/50 hover:text-[#0A9087]"
                }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Cards — mobile: horizontal scroll (2 cards visible), desktop: grid */}
        <div className="sm:hidden overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
          <div className="flex gap-3" style={{ width: "max-content" }}>
            {displayPicks.length > 0 ? (
              displayPicks.map((pick) => (
                <div
                  key={pick.id}
                  className={`flex-shrink-0 w-[220px] px-4 py-3 rounded-[13px] border transition-all duration-300
                    ${
                      isDark
                        ? "border-[#0A9087] bg-[radial-gradient(65.75%_180%_at_-15.57%_-68.93%,#858F95_11.58%,rgba(133,143,149,0.5)_31.62%,rgba(133,143,149,0)_78.94%)]"
                        : "border-[#0A9087]/30 bg-[radial-gradient(65.75%_180%_at_-15.57%_-68.93%,rgba(10,144,135,0.15)_11.58%,rgba(10,144,135,0.05)_31.62%,rgba(255,255,255,0)_78.94%)] bg-white shadow-sm"
                    }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-[#141414]" : "bg-[#f0fbfa] border border-[#0A9087]/20"}`}
                    >
                      <img
                        src={m}
                        alt=""
                        className="w-full h-full rounded-full object-contain"
                      />
                    </div>
                    <span
                      className={`font-logo font-bold text-[14px] leading-tight ${isDark ? "text-white" : "text-[#0a1628]"}`}
                    >
                      {pick.title}
                    </span>
                  </div>

                  {/* Match Info */}
                  <div className="mb-3">
                    <p
                      className={`font-logo font-normal text-xs ${isDark ? "text-white" : "text-gray-500"}`}
                    >
                      {pick.matchup}{" "}
                      <span
                        className={isDark ? "text-white/60" : "text-gray-300"}
                      >
                        |
                      </span>{" "}
                      {pick.time}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 justify-between">
                    <span
                      className={`font-logo text-xs ${isDark ? "text-white" : "text-gray-500"}`}
                    >
                      Model{" "}
                      <span
                        className={`font-bold ${isDark ? "text-white" : "text-[#0a1628]"}`}
                      >
                        {pick.model}
                      </span>
                    </span>
                    <span
                      className={`font-logo text-xs ${isDark ? "text-white" : "text-gray-500"}`}
                    >
                      Edge{" "}
                      <span
                        className={`font-bold ${isDark ? "text-white" : "text-[#0A9087]"}`}
                      >
                        {pick.edge}
                      </span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`font-logo py-12 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                No picks available for {activeTab}
              </div>
            )}
          </div>
        </div>

        {/* Cards Grid — desktop only */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {displayPicks.length > 0 ? (
            displayPicks.map((pick) => (
              <div
                key={pick.id}
                className={`px-6 py-2 h-[140px] rounded-[13px] border transition-all duration-300
                  ${
                    isDark
                      ? "border-[#0A9087] bg-[radial-gradient(65.75%_180%_at_-15.57%_-68.93%,#858F95_11.58%,rgba(133,143,149,0.5)_31.62%,rgba(133,143,149,0)_78.94%)]"
                      : "border-[#0A9087]/30 bg-[radial-gradient(65.75%_180%_at_-15.57%_-68.93%,rgba(10,144,135,0.15)_11.58%,rgba(10,144,135,0.05)_31.62%,rgba(255,255,255,0)_78.94%)] bg-white shadow-sm"
                  }`}
              >
                {/* Card Header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-[#141414]" : "bg-[#f0fbfa] border border-[#0A9087]/20"}`}
                  >
                    <img
                      src={m}
                      alt=""
                      className="w-full h-full rounded-full object-contain"
                    />
                  </div>
                  <span
                    className={`font-logo font-bold text-[16px] leading-tight ${isDark ? "text-white" : "text-[#0a1628]"}`}
                  >
                    {pick.title}
                  </span>
                </div>

                {/* Match Info */}
                <div className="mb-3">
                  <p
                    className={`font-logo font-normal text-sm ${isDark ? "text-white" : "text-gray-500"}`}
                  >
                    {pick.matchup}{" "}
                    <span
                      className={isDark ? "text-white/60" : "text-gray-300"}
                    >
                      |
                    </span>{" "}
                    {pick.time}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 justify-between">
                  <span
                    className={`font-logo text-sm ${isDark ? "text-white" : "text-gray-500"}`}
                  >
                    Model{" "}
                    <span
                      className={`font-bold ${isDark ? "text-white" : "text-[#0a1628]"}`}
                    >
                      {pick.model}
                    </span>
                  </span>
                  <span
                    className={`font-logo text-sm ${isDark ? "text-white" : "text-gray-500"}`}
                  >
                    Edge{" "}
                    <span
                      className={`font-bold ${isDark ? "text-white" : "text-[#0A9087]"}`}
                    >
                      {pick.edge}
                    </span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`col-span-4 text-center font-logo py-12 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              No picks available for {activeTab}
            </div>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setActiveDot(i)}
              className={`h-2 rounded-full transition-all duration-200 cursor-pointer
                ${
                  activeDot === i
                    ? "w-5 bg-[#0A9087]"
                    : isDark
                      ? "w-2 bg-gray-600"
                      : "w-2 bg-gray-300"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
