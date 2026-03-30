import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/custom/useTheme";
import { useNavigate } from "react-router-dom";

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
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "#C8102E",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 10,
        marginBottom: 10,
        // cursor: "pointer",
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
      {/* Logo */}
      {p.image ? (
        <img
          src={p.image}
          alt={p.game}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      ) : (
        <NBAIcon />
      )}

      {/* Middle: title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: t.title,
            fontWeight: 600,
            fontSize: 13,
            lineHeight: 1.4,
            margin: 0,
            marginBottom: 3,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {p.prediction_desc || p.title || "N/A"}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <BoltIcon color={t.bolt} />
            <span
              style={{
                color: t.sub,
                fontSize: 11,
                ...(isLocked
                  ? { filter: "blur(4px)", userSelect: "none" }
                  : {}),
              }}
            >
              {p.game || p.matchup || "N/A"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ClockIcon color={t.clock} />
            <span
              style={{
                color: t.sub,
                fontSize: 11,
                whiteSpace: "nowrap",
                ...(isLocked
                  ? { filter: "blur(4px)", userSelect: "none" }
                  : {}),
              }}
            >
              {p.date_time ? formatDate(p.date_time) : p.date || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Bet Type + Bet Size — row layout on desktop */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
          flexShrink: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{ color: t.label, fontSize: 10, margin: 0, marginBottom: 2 }}
          >
            Bet Type
          </p>
          <p
            style={{
              color: betTypeColor,
              fontWeight: 700,
              fontSize: 13,
              margin: 0,
              ...(isLocked ? { filter: "blur(4px)", userSelect: "none" } : {}),
            }}
          >
            {betType}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{ color: t.label, fontSize: 10, margin: 0, marginBottom: 4 }}
          >
            Bet Size
          </p>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              background: t.betSizeBg,
              color: t.betSizeColor,
              border: `1px solid ${t.betSizeBorder}`,
              ...(isLocked ? { filter: "blur(4px)", userSelect: "none" } : {}),
            }}
          >
            {p.unit_size || p.bet_size || p.betSize || "N/A"}
          </span>
        </div>
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

  const filtered = activeTab.type
    ? predictionData.filter(
        (p) => (p.prediction_type || p.betType) === activeTab.type,
      )
    : predictionData;

  const countFor = (type) =>
    type
      ? predictionData.filter((p) => (p.prediction_type || p.betType) === type)
          .length
      : predictionData.length;

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 16,
        padding: 16,
        background: t.wrapper,
        overflow: "visible",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <ChartIcon color={t.icon} />
        <span style={{ fontWeight: 700, fontSize: 15, color: t.header }}>
          Predictions
        </span>
      </div>

      {/* Tabs — scrollable, no Tailwind overflow classes */}
      <div
        style={{
          position: "relative",
          marginBottom: 14,
          marginLeft: -16,
          marginRight: -16,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflowX: "scroll",
            overflowY: "visible",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: 16,
            paddingRight: 40,
            paddingBottom: 4,
            gap: 6,
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab.label === tab.label;
            const count = countFor(tab.type);
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  paddingLeft: 13,
                  paddingRight: 13,
                  paddingTop: 6,
                  paddingBottom: 6,
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  background: isActive ? t.tabActiveBg : t.tabInactiveBg,
                  color: isActive ? t.tabActiveColor : t.tabInactiveColor,
                  border: `1px solid ${isActive ? t.tabActiveBorder : t.tabInactiveBorder}`,
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
              >
                {tab.label}
                {tab.type && count > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 999,
                      lineHeight: 1,
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

        {/* Right fade */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 4,
            width: 40,
            pointerEvents: "none",
            background: `linear-gradient(to right, transparent, ${t.tabScrollFade})`,
          }}
        />
      </div>

      {/* Prediction Rows */}
      <div>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              style={{
                textAlign: "center",
                padding: "24px 0",
                fontSize: 13,
                color: t.emptyText,
              }}
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
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <button
            onClick={() => navigate("/dashboard/predictions")}
            style={{
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              color: t.viewAll,
              background: "none",
              border: "none",
              letterSpacing: 1,
              transition: "opacity 0.15s ease",
            }}
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
