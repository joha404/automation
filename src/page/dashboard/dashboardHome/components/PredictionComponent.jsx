import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/custom/useTheme";

const tabs = ["All Predictions", "Play of the Day", "Futures", "Live"];

const predictions = [
  {
    id: 1,
    title: "Titans +14.5 (-147)",
    league: "NBA",
    matchup: "Detroit Lions vs Philadelphia Eagles",
    date: "Feb 26, 05:37PM",
    betType: "F",
    betTypeColor: "#FF4444",
    betSize: "4.00%",
  },
  {
    id: 2,
    title: "Titans +14.5 (-147)",
    league: "NBA",
    matchup: "Detroit Lions vs Philadelphia Eagles",
    date: "Feb 26, 05:37PM",
    betType: "S",
    betTypeColor: "#FFFFFF",
    betSize: "4.00%",
  },
  {
    id: 3,
    title: "Titans +14.5 (-147)",
    league: "NBA",
    matchup: "Detroit Lions vs Philadelphia Eagles",
    date: "Feb 26, 05:37PM",
    betType: "POTD",
    betTypeColor: "#C27AFF",
    betSize: "4.00%",
  },
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

// ── Theme tokens ──────────────────────────────────────────────
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
  },
};

function PredictionRow({ p, i, t }) {
  const [hovered, setHovered] = useState(false);
  const betTypeColor = p.betType === "S" ? t.betTypeS : p.betTypeColor;

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
      transition={{ delay: i * 0.08, duration: 0.35 }}
    >
      <NBAIcon />

      <div className="flex-1 min-w-0">
        <p
          className="font-semibold font-logo text-[13px] sm:text-[14px] leading-tight mb-1"
          style={{ color: t.title }}
        >
          {p.title}
        </p>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <BoltIcon color={t.bolt} />
            <span
              className="text-[11px] font-logo sm:text-[12px]"
              style={{ color: t.sub }}
            >
              {p.matchup}
            </span>
          </div>
          <div className="flex items-center  gap-1">
            <ClockIcon color={t.clock} />
            <span
              className="text-[11px] font-logo sm:text-[12px]"
              style={{ color: t.sub }}
            >
              {p.date}
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
          {p.betType}
        </p>
      </div>

      <div className="flex-shrink-0 text-right">
        <p
          className="text-[10px] text-center font-logo  sm:text-[11px] mb-2"
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
          {p.betSize}
        </span>
      </div>
    </motion.div>
  );
}

export default function PredictionComponent({ data }) {
  const predictionData = data?.data?.package_sections || [];
  const [activeTab, setActiveTab] = useState("All Predictions");
  const { theme } = useTheme();
  const t = tokens[theme] ?? tokens.dark;

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

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 mb-4 flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[13px] font-medium cursor-pointer"
              style={{
                background: isActive ? t.tabActiveBg : t.tabInactiveBg,
                color: isActive ? t.tabActiveColor : t.tabInactiveColor,
                border: `1px solid ${isActive ? t.tabActiveBorder : t.tabInactiveBorder}`,
                transition: "all 0.2s ease",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {predictionData.length === 0 ? (
          <p className="text-center py-4 text-sm font-logo text-white/40">
            No predictions available
          </p>
        ) : (
          predictionData.map((p, i) => (
            <PredictionRow key={p.id} p={p} i={i} t={t} />
          ))
        )}
      </div>

      {/* View All */}
      {predictionData.length > 0 && (
        <div className="text-center mt-2">
          <button
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
