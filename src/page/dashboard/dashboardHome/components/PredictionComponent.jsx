import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/custom/useTheme";
import { useNavigate } from "react-router-dom";

// Tab config: label → prediction_type filter (null = show all)
const tabs = [
  { label: "All Predictions", type: null },
  { label: "Standard", type: "S" },
  { label: "Play of the Day", type: "POTD" },
  { label: "Player Props", type: "PP" },
  { label: "Live", type: "L" },
  { label: "Futures", type: "F" },
];

const NBAIcon = () => (
  <div
    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
    style={{ background: "#C8102E" }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

const BoltIcon = ({ color }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L4.09 12.5H11L10 22L20.91 11.5H14L13 2Z" />
  </svg>
);

const ClockIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <path
      d="M12 7v5l3 3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const ChartIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline
      points="2,18 8,12 13,16 22,6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getBetTypeColor = (type, t) => {
  switch (type) {
    case "S":
      return t.betTypeS;
    case "F":
      return "#eb464c";
    case "L":
      return "#FFDB5B";
    case "PP":
      return "#4ade80";
    case "POTD":
      return "#c084fc";
    case "P":
      return "#facc15";
    default:
      return "#60a5fa";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

const tokens = {
  dark: {
    wrapper: "#071412",
    rowBg: "#032422",
    rowHover: "rgba(10,144,135,0.06)",
    title: "#ffffff",
    sub: "rgba(255,255,255,0.45)",
    label: "rgba(255,255,255,0.40)",
    tabActiveBg: "#0A9087",
    tabActiveColor: "#ffffff",
    tabActiveBorder: "#0A9087",
    tabInactiveBg: "transparent",
    tabInactiveColor: "rgba(255,255,255,0.5)",
    tabInactiveBorder: "rgba(255,255,255,0.12)",
    betSizeBg: "rgba(10,144,135,0.15)",
    betSizeColor: "#41C551",
    betSizeBorder: "#41C551",
    header: "#ffffff",
    icon: "white",
    viewAll: "#ffffff",
    bolt: "#F5C518",
    clock: "#6B7B7A",
    betTypeS: "#ffffff",
    emptyText: "rgba(255,255,255,0.4)",
    tabScrollFade: "rgba(7,20,18,0.9)",
  },
  light: {
    wrapper: "#edf7f6",
    rowBg: "#ffffff",
    rowHover: "rgba(10,144,135,0.05)",
    title: "#0a1f1e",
    sub: "rgba(10,31,30,0.5)",
    label: "rgba(10,31,30,0.4)",
    tabActiveBg: "#0A9087",
    tabActiveColor: "#ffffff",
    tabActiveBorder: "#0A9087",
    tabInactiveBg: "transparent",
    tabInactiveColor: "rgba(10,31,30,0.5)",
    tabInactiveBorder: "rgba(10,31,30,0.15)",
    betSizeBg: "rgba(10,144,135,0.1)",
    betSizeColor: "#41C551",
    betSizeBorder: "#41C551",
    header: "#0a1f1e",
    icon: "#0a1f1e",
    viewAll: "#0a1f1e",
    bolt: "#e6a800",
    clock: "#8aaba8",
    betTypeS: "#0A9087",
    emptyText: "rgba(10,31,30,0.4)",
    tabScrollFade: "rgba(237,247,246,0.9)",
  },
};

function PredictionRow({ p, i, t }) {
  const [hovered, setHovered] = useState(false);
  const betType = p.prediction_type || p.betType || "N/A";
  const betTypeColor = getBetTypeColor(betType, t);
  const isLocked = p.prediction_desc === "Upgrade to unlock";

  return (
    <motion.div
      className="flex items-center gap-3 py-4 px-4 rounded-lg mb-3 cursor-pointer"
      style={{
        background: hovered ? t.rowHover : t.rowBg,
        transition: "background 0.2s ease",
        boxShadow: hovered ? "0 2px 12px rgba(10,144,135,0.07)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay: i * 0.08, duration: 0.35 }}
    >
      {p.image ? (
        <img
          src={p.image}
          alt={p.game}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <NBAIcon />
      )}

      <div className="flex-1 min-w-0">
        <p
          className="font-semibold font-logo text-[13px] sm:text-[14px] leading-tight mb-1"
          style={{ color: t.title }}
        >
          {p.prediction_desc || p.title || "N/A"}
        </p>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <BoltIcon color={t.bolt} />
            <span
              className="text-[11px] font-logo sm:text-[12px]"
              style={{ color: t.sub }}
            >
              {isLocked ? (
                <span className="blur-sm select-none">
                  {p.game || p.matchup || "N/A"}
                </span>
              ) : (
                p.game || p.matchup || "N/A"
              )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon color={t.clock} />
            <span
              className="text-[11px] font-logo sm:text-[12px]"
              style={{ color: t.sub }}
            >
              {isLocked ? (
                <span className="blur-sm select-none">
                  {p.date_time ? formatDate(p.date_time) : p.date || "N/A"}
                </span>
              ) : p.date_time ? (
                formatDate(p.date_time)
              ) : (
                p.date || "N/A"
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 text-right mr-2 sm:mr-6">
        <p
          className="text-[10px] font-logo sm:text-[11px] mb-1"
          style={{ color: t.label }}
        >
          Bet Type
        </p>
        <p
          className="font-bold text-[13px] font-logo text-center sm:text-[14px]"
          style={{ color: betTypeColor }}
        >
          {isLocked ? (
            <span className="blur-sm select-none">{betType}</span>
          ) : (
            betType
          )}
        </p>
      </div>

      <div className="flex-shrink-0 text-right">
        <p
          className="text-[10px] text-center font-logo sm:text-[11px] mb-2"
          style={{ color: t.label }}
        >
          Bet Size
        </p>
        <span
          className="text-[12px] sm:text-[13px] font-bold px-2 sm:px-3 py-1 rounded-md whitespace-nowrap"
          style={{
            background: t.betSizeBg,
            color: t.betSizeColor,
            border: `1px solid ${t.betSizeBorder}`,
          }}
        >
          {isLocked ? (
            <span className="blur-sm select-none">
              {p.unit_size || p.bet_size || p.betSize || "N/A"}
            </span>
          ) : (
            p.unit_size || p.bet_size || p.betSize || "N/A"
          )}
        </span>
      </div>
    </motion.div>
  );
}

export default function PredictionComponent({ data }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { theme } = useTheme();
  const t = tokens[theme] ?? tokens.dark;
  const navigate = useNavigate();

  const innerData = data?.data || data || {};
  const rawResults = innerData?.results || [];
  const predictionData = innerData?.package_sections
    ? innerData.package_sections.flatMap((pkg) => pkg.predictions || [])
    : rawResults;

  // Filter by prediction_type when a specific tab is selected
  const filtered = activeTab.type
    ? predictionData.filter(
        (p) => (p.prediction_type || p.betType) === activeTab.type,
      )
    : predictionData;

  // Count per tab for badge
  const countFor = (type) =>
    type
      ? predictionData.filter((p) => (p.prediction_type || p.betType) === type)
          .length
      : predictionData.length;

  return (
    <div
      className="w-full mx-auto rounded-2xl p-4 sm:p-5"
      style={{ background: t.wrapper }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ChartIcon color={t.icon} />
        <span
          className="font-bold font-logo text-[14px] sm:text-[15px]"
          style={{ color: t.header }}
        >
          Predictions
        </span>
      </div>

      {/* Tabs — horizontally scrollable on mobile */}
      <div className="relative mb-4">
        <div
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab.label === tab.label;
            const count = countFor(tab.type);
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[13px] font-medium cursor-pointer whitespace-nowrap flex-shrink-0"
                style={{
                  background: isActive ? t.tabActiveBg : t.tabInactiveBg,
                  color: isActive ? t.tabActiveColor : t.tabInactiveColor,
                  border: `1px solid ${isActive ? t.tabActiveBorder : t.tabInactiveBorder}`,
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
                {/* Count badge — only show when not "All" or when has items */}
                {tab.type && count > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                    style={{
                      background: isActive
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(10,144,135,0.15)",
                      color: isActive ? "#fff" : t.betSizeColor,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* Right fade hint for scroll */}
        <div
          className="absolute right-0 top-0 bottom-1 w-6 pointer-events-none"
          style={{
            background: `linear-gradient(to right, transparent, ${t.tabScrollFade})`,
          }}
        />
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              className="text-center py-6 text-sm font-logo"
              style={{ color: t.emptyText }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No {activeTab.label} available
            </motion.p>
          ) : (
            <motion.div
              key={activeTab.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.slice(0, 3).map((p, i) => (
                <PredictionRow key={p.id ?? i} p={p} i={i} t={t} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View All */}
      {filtered.length > 0 && (
        <div className="text-center mt-2">
          <button
            onClick={() => navigate("/dashboard/predictions")}
            className="font-semibold text-[13px] font-logo sm:text-[14px] cursor-pointer tracking-wide"
            style={{ color: t.viewAll, transition: "opacity 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            VIEW ALL
          </button>
        </div>
      )}
    </div>
  );
}
