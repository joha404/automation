import React, { useState } from "react";
import m from "../../../../assets/dashboard/m.png";
import { useTheme } from "@/hooks/custom/useTheme";
import { FaCalendar } from "react-icons/fa";
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

const events = [
  {
    id: 1,
    league: "NBA",
    logo: m,
    title: "Warriors +1.5 (-110)",
    matchup: "GSW @ DEN",
    time: "9:00 PM ET",
    model: "55%",
    edge: "+3.9%",
  },
  {
    id: 2,
    league: "NBA",
    logo: m,
    title: "76ers -2.5 (-107)",
    matchup: "PHI @ TOR",
    time: "7:30 PM ET",
    model: "60%",
    edge: "+6.1%",
  },
  {
    id: 3,
    league: "NBA",
    logo: m,
    title: "Clippers +4.5 (-109)",
    matchup: "LAC @ MIN",
    time: "8:00 PM ET",
    model: "54%",
    edge: "+3.3%",
  },
  {
    id: 4,
    league: "NFL",
    logo: m,
    title: "Chiefs -3.5 (-115)",
    matchup: "KC @ LAR",
    time: "8:00 PM ET",
    model: "62%",
    edge: "+4.3%",
  },
  {
    id: 5,
    league: "NHL",
    logo: m,
    title: "Bruins ML (-130)",
    matchup: "BOS @ TOR",
    time: "7:00 PM ET",
    model: "55%",
    edge: "+3.8%",
  },
];

export default function UpcomingEvents() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("NBA");

  const isDark = theme === "dark";

  const filteredEvents =
    activeTab === "All" ? events : events.filter((e) => e.league === activeTab);

  return (
    <div
      className={`rounded-2xl border mt-4 p-5 transition-colors duration-300 ${isDark ? "bg-[#021716] border-[#0A9087]/20" : "bg-white border-gray-200 shadow-sm"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`font-logo text-[18px] font-extrabold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-[#0a1628]"}`}
        >
          {/* calendar icon */}
          <FaCalendar
            className={` ${theme === "dark" ? "text-white " : "text-black"}`}
          />
          Upcoming Events
        </h2>
        {/* VIEW MORE — hidden on mobile, shown on desktop */}
        <button
          className={`hidden sm:flex font-logo text-sm font-bold tracking-widest uppercase items-center gap-1 transition-colors duration-200 hover:text-[#0A9087] ${isDark ? "text-white" : "text-[#0a1628]"}`}
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

      {/* Sport Filter Tabs — mobile: horizontal scroll single line */}
      <div className="flex sm:flex-wrap gap-2 mb-5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => setActiveTab(sport)}
            className={`font-logo px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer flex-shrink-0
              ${
                activeTab === sport
                  ? "bg-[#0A9087] border-[#0A9087] text-white"
                  : isDark
                    ? "bg-transparent border-[#021716] text-gray-400 hover:border-[#0A9087]/50 hover:text-[#0A9087]"
                    : "bg-transparent border-gray-200 text-gray-500 hover:border-[#0A9087]/50 hover:text-[#0A9087]"
              }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="flex flex-col gap-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200
                ${
                  isDark
                    ? "bg-[#032422] border-[#0A9087]/15 hover:border-[#0A9087]/40 hover:shadow-[0_0_12px_rgba(10,144,135,0.1)]"
                    : "bg-[#f7fffe] border-[#0A9087]/15 hover:border-[#0A9087]/35 hover:shadow-sm"
                }`}
            >
              {/* Left: Logo + Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Logo */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark
                      ? "bg-[#0a1f1e]"
                      : "bg-white border border-[#0A9087]/15"
                  }`}
                >
                  <img
                    src={m}
                    alt=""
                    className="w-full h-full rounded-full object-contain"
                  />
                </div>

                {/* Text info */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  {/* Title — bold, full width */}
                  <span
                    className={`font-logo font-bold text-[15px] leading-tight ${
                      isDark ? "text-white" : "text-[#0a1628]"
                    }`}
                  >
                    {event.title}
                  </span>

                  {/* Matchup | Time */}
                  <span
                    className={`font-logo text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {event.matchup}{" "}
                    <span
                      className={isDark ? "text-white/30" : "text-gray-300"}
                    >
                      |
                    </span>{" "}
                    {event.time}
                  </span>

                  {/* Model + Edge — inline on mobile, matches screenshot */}
                  <div className="flex items-center gap-4 mt-0.5 sm:hidden">
                    <span
                      className={`font-logo text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Model{" "}
                      <span
                        className={`font-bold text-[13px] ${
                          isDark ? "text-white" : "text-[#0a1628]"
                        }`}
                      >
                        {event.model}
                      </span>
                    </span>
                    <span
                      className={`font-logo text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Edge{" "}
                      <span className="font-bold text-[13px] text-[#0A9087]">
                        {event.edge}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Model + Edge — desktop only */}
              <div className="hidden sm:flex items-center gap-10 flex-shrink-0 ml-2">
                <div className="flex flex-col items-start">
                  <span
                    className={`font-logo text-xs mb-0.5 ${
                      isDark ? "text-gray-400" : "text-gray-400"
                    }`}
                  >
                    Model
                  </span>
                  <span
                    className={`font-logo font-bold text-[15px] ${
                      isDark ? "text-white" : "text-[#0a1628]"
                    }`}
                  >
                    {event.model}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span
                    className={`font-logo text-xs mb-0.5 ${
                      isDark ? "text-gray-400" : "text-gray-400"
                    }`}
                  >
                    Edge
                  </span>
                  <span className="font-logo font-bold text-[15px] text-[#0A9087]">
                    {event.edge}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className={`text-center font-logo py-10 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            No upcoming events for {activeTab}
          </div>
        )}
      </div>

      {/* VIEW MORE — mobile only, bottom center */}
      <div className="flex sm:hidden justify-center mt-5">
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
    </div>
  );
}
