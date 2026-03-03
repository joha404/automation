import React, { useState } from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import { FaRegClock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";

// ── Dummy Data ────────────────────────────────────────────────
const dummyPackages = [
  {
    package_name: "All Predictions",
    active_count: 7,
    has_access: true,
    default_open: true,
    predictions: [
      {
        id: 1,
        title: "Titans +14.5 (-147)",
        game: "Detroit Lions vs Philadelphia Eagles",
        date_time: "2025-02-26T17:37:00",
        bet_type: "POTD",
        bet_size: "4.00%",
      },
      {
        id: 2,
        title: "Titans +14.5 (-147)",
        game: "Detroit Lions vs Philadelphia Eagles",
        date_time: "2025-02-26T17:37:00",
        bet_type: "F",
        bet_size: "4.00%",
      },
      {
        id: 3,
        title: "Titans +14.5 (-147)",
        game: "Detroit Lions vs Philadelphia Eagles",
        date_time: "2025-02-26T17:37:00",
        bet_type: "F",
        bet_size: "4.00%",
      },
      {
        id: 4,
        title: "Titans +14.5 (-147)",
        game: "Detroit Lions vs Philadelphia Eagles",
        date_time: "2025-02-26T17:37:00",
        bet_type: "F",
        bet_size: "4.00%",
      },
      {
        id: 5,
        title: "Titans +14.5 (-147)",
        game: "Detroit Lions vs Philadelphia Eagles",
        date_time: "2025-02-26T17:37:00",
        bet_type: "S",
        bet_size: "4.00%",
      },
      {
        id: 6,
        title: "Titans +14.5 (-147)",
        game: "Detroit Lions vs Philadelphia Eagles",
        date_time: "2025-02-26T17:37:00",
        bet_type: "S",
        bet_size: "4.00%",
      },
      {
        id: 7,
        title: "Titans +14.5 (-147)",
        game: "Detroit Lions vs Philadelphia Eagles",
        date_time: "2025-02-26T17:37:00",
        bet_type: "S",
        bet_size: "4.00%",
      },
    ],
  },
  {
    package_name: "Play of the Day",
    active_count: 1,
    has_access: true,
    default_open: false,
    predictions: [
      {
        id: 8,
        title: "Chiefs -6 (-115)",
        game: "Chiefs vs Ravens",
        date_time: "2025-02-27T18:30:00",
        bet_type: "POTD",
        bet_size: "5.00%",
      },
    ],
  },
  {
    package_name: "Futures",
    active_count: 3,
    has_access: true,
    default_open: false,
    predictions: [
      {
        id: 9,
        title: "Lakers ML (-130)",
        game: "Lakers vs Celtics",
        date_time: "2025-02-28T20:00:00",
        bet_type: "F",
        bet_size: "3.00%",
      },
      {
        id: 10,
        title: "Warriors +5 (-105)",
        game: "Warriors vs Nets",
        date_time: "2025-02-28T22:00:00",
        bet_type: "F",
        bet_size: "2.00%",
      },
      {
        id: 11,
        title: "Bucks -4.5 (-112)",
        game: "Bucks vs Heat",
        date_time: "2025-03-01T19:00:00",
        bet_type: "F",
        bet_size: "4.00%",
      },
    ],
  },
  {
    package_name: "Live",
    active_count: 3,
    has_access: true,
    default_open: false,
    predictions: [
      {
        id: 12,
        title: "Eagles -2 (-108)",
        game: "Eagles vs Cowboys",
        date_time: "2025-02-26T20:00:00",
        bet_type: "L",
        bet_size: "3.00%",
      },
      {
        id: 13,
        title: "Niners +1.5 (-115)",
        game: "49ers vs Seahawks",
        date_time: "2025-02-26T21:00:00",
        bet_type: "L",
        bet_size: "2.00%",
      },
      {
        id: 14,
        title: "Ravens ML (-140)",
        game: "Ravens vs Steelers",
        date_time: "2025-02-26T22:00:00",
        bet_type: "L",
        bet_size: "5.00%",
      },
    ],
  },
];

const getBetTypeColor = (type) => {
  switch (type) {
    case "POTD":
      return "#C27AFF";
    case "F":
      return "#FF4444";
    case "S":
      return "#ffffff";
    case "L":
      return "#FFDB5B";
    case "PP":
      return "#4ade80";
    default:
      return "#ffffff";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

const NBALogo = () => (
  <div
    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
    style={{ background: "#C8102E" }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 2 C12 2 8 7 8 12 C8 17 12 22 12 22"
        stroke="white"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M12 2 C12 2 16 7 16 12 C16 17 12 22 12 22"
        stroke="white"
        strokeWidth="1.2"
        fill="none"
      />
      <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.2" />
    </svg>
  </div>
);

const ChartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <polyline
      points="2,18 8,12 13,16 22,6"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AllPredictions() {
  const { theme } = useTheme();

  const initExpanded = {};
  dummyPackages.forEach((p) => {
    initExpanded[p.package_name] = p.default_open;
  });
  const [expanded, setExpanded] = useState(initExpanded);

  const toggle = (name) =>
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  const isDark = theme === "dark";

  return (
    <div
      className="w-full rounded-xl font-primary overflow-hidden"
      style={{ background: isDark ? "#071412" : "#f0faf9" }}
    >
      {/* ── Top Header ── */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-3">
        <ChartIcon />
        <span className="text-white font-bold text-[15px]">Predictions</span>
      </div>

      {/* ── Accordion Sections ── */}
      {dummyPackages.map((pkg) => {
        const isOpen = expanded[pkg.package_name];

        return (
          <div
            className="bg-[#021716] gap-4 my-3 sm:my-4 mx-2 sm:mx-4 rounded-lg"
            key={pkg.package_name}
          >
            {/* Section Header */}
            <div
              className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 cursor-pointer"
              onClick={() => toggle(pkg.package_name)}
            >
              <div>
                <p
                  className={` text-[16px] font-logo font-bold sm:text-[20px] ${isDark ? "text-white" : "text-[#0a1f1e]"}`}
                >
                  {pkg.package_name}
                </p>
                <p
                  className={`text-[12px] font-logo font-normal sm:text-[14px] mt-0.5 ${isDark ? "text-[#92A8C1]" : "text-[#0a1f1e]/40"}`}
                >
                  {pkg.active_count} Active Prediction
                  {pkg.active_count !== 1 ? "s" : ""}
                </p>
              </div>
              {isOpen ? (
                <FaChevronUp
                  className={`text-xs ${isDark ? "text-white/60" : "text-[#0a1f1e]/60"}`}
                />
              ) : (
                <FaChevronDown
                  className={`text-xs ${isDark ? "text-white/60" : "text-[#0a1f1e]/60"}`}
                />
              )}
            </div>

            {/* Prediction Rows */}
            {isOpen && (
              <div className="px-2 sm:px-4 pb-2">
                {pkg.predictions.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start sm:items-center bg-[#032422] mb-3 rounded-xl gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-pointer transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = isDark
                        ? "rgba(10,144,135,0.08)"
                        : "rgba(10,144,135,0.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#032422")
                    }
                  >
                    {/* Logo — hidden on very small screens to save space, shown sm+ */}
                    <div className="hidden xs:flex sm:flex">
                      <NBALogo />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={` text-[14px] sm:text-[16px] font-logo font-bold leading-tight mb-1 ${isDark ? "text-white" : "text-[#0a1f1e]"}`}
                      >
                        {p.title}
                      </p>
                      {/* Game + time — stacked on mobile, row on sm+ */}
                      <div className="flex flex-col xs:flex-row sm:flex-row items-start xs:items-center sm:items-center gap-1 sm:gap-3">
                        <div className="flex items-center gap-1 min-w-0">
                          <BsLightningChargeFill className="text-[10px] text-yellow-500 flex-shrink-0" />
                          <span
                            className={`text-[12px] font-logo font-normal sm:text-[14px] truncate ${isDark ? "text-white/45" : "text-[#0a1f1e]/50"}`}
                          >
                            {p.game}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <FaRegClock
                            className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/40" : "text-[#0a1f1e]/40"}`}
                          />
                          <span
                            className={`text-[12px] sm:text-[14px] font-logo font-normal whitespace-nowrap ${isDark ? "text-white/45" : "text-[#0a1f1e]/50"}`}
                          >
                            {formatDate(p.date_time)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bet Type + Bet Size — stacked on mobile */}
                    <div className="flex flex-col xs:flex-row sm:flex-row items-end xs:items-center sm:items-center gap-2 sm:gap-4 flex-shrink-0">
                      {/* Bet Type */}
                      <div className="text-center">
                        <p
                          className={`text-[12px] font-logo font-normal sm:text-[14px] mb-1 ${isDark ? "text-white/40" : "text-[#0a1f1e]/40"}`}
                        >
                          Bet Type
                        </p>
                        <p
                          className="font-bold text-[13px] font-logo sm:text-[16px]"
                          style={{ color: getBetTypeColor(p.bet_type) }}
                        >
                          {p.bet_type}
                        </p>
                      </div>

                      {/* Bet Size */}
                      <div className="text-center ">
                        <p
                          className={`text-[12px] sm:text-[14px] font-normal font-logo mb-1 ${isDark ? "text-white/40" : "text-[#0a1f1e]/40"}`}
                        >
                          Bet Size
                        </p>
                        <span
                          className="text-[14px] sm:text-[16px] font-logo font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md whitespace-nowrap"
                          style={{
                            background: "rgba(10,144,135,0.15)",
                            color: "#41C551",
                            border: "1px solid #41C551",
                          }}
                        >
                          {p.bet_size}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
