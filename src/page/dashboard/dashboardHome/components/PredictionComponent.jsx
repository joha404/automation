import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/custom/useTheme";
import { useNavigate } from "react-router-dom";

const tabs = ["All Predictions", "Play of the Day", "Futures", "Live"];

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
    emptyText: "rgba(255,255,255,0.4)",
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
  },
};

function PredictionRow({ p, i, t }) {
  const [hovered, setHovered] = useState(false);
  const betType = p.prediction_type || p.betType || "N/A";
  const betTypeColor = getBetTypeColor(betType, t);

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
      {/* Logo */}
      {p.image ? (
        <img
          src={p.image}
          alt={p.game}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <NBAIcon />
      )}

      {/* Main Info */}
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
              {p.game || p.matchup || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon color={t.clock} />
            <span
              className="text-[11px] font-logo sm:text-[12px]"
              style={{ color: t.sub }}
            >
              {p.date_time ? formatDate(p.date_time) : p.date || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Bet Type */}
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
          {betType}
        </p>
      </div>

      {/* Bet Size */}
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
          {p.unit_size || p.bet_size || p.betSize || "N/A"}
        </span>
      </div>
    </motion.div>
  );
}

export default function PredictionComponent({ data }) {
  const [activeTab, setActiveTab] = useState("All Predictions");
  const { theme } = useTheme();
  const t = tokens[theme] ?? tokens.dark;
  const navigate = useNavigate();

  // ✅ Handle both flat results[] and package_sections[] API shapes
  const innerData = data?.data || data || {};
  const rawResults = innerData?.results || [];
  const predictionData = innerData?.package_sections
    ? innerData.package_sections.flatMap((pkg) => pkg.predictions || [])
    : rawResults;

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
          <p
            className="text-center py-4 text-sm font-logo"
            style={{ color: t.emptyText }}
          >
            No predictions available
          </p>
        ) : (
          predictionData
            ?.slice(0, 5)
            ?.map((p, i) => <PredictionRow key={p.id} p={p} i={i} t={t} />)
        )}
      </div>

      {/* View All */}
      {predictionData.length > 0 && (
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
