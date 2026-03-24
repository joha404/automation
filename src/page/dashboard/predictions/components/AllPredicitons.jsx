import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaRegClock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import errorToast from "@/hooks/custom/errorToast";

const getBetTypeColor = (type) => {
  switch (type?.toUpperCase()) {
    case "L":
      return "#FFDB5B";
    case "S":
      return "#9CA3AF";
    case "F":
      return "#eb464c";
    case "PP":
      return "#4ade80";
    case "POTD":
      return "#c084fc";
    case "P":
      return "#facc15";
    case "WIN":
      return "#059669";
    case "LOSS":
      return "#e11d48";
    default:
      return "#60a5fa";
  }
};

const getBetTypeLabel = (type) => {
  switch (type?.toUpperCase()) {
    case "L":
      return "Lock";
    case "S":
      return "Standard";
    case "F":
      return "Futures";
    case "PP":
      return "Player Props";
    case "POTD":
      return "Play of the Day";
    case "P":
      return "Premium";
    case "WIN":
      return "Win";
    case "LOSS":
      return "Loss";
    default:
      return type || "N/A";
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

const rowBg = (isDark) => (isDark ? "#032422" : "#f9fafb");
const rowBgHover = (isDark) =>
  isDark ? "rgba(10,144,135,0.08)" : "rgba(10,144,135,0.06)";
const rowBorder = (isDark) =>
  isDark ? "1px solid #0a3330" : "1px solid #e5e7eb";

const LockedRow = ({ isDark, onClick }) => (
  <div
    className="flex items-center mb-3 rounded-xl gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-pointer transition-colors"
    style={{ background: rowBg(isDark), border: rowBorder(isDark) }}
    onClick={onClick}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background = rowBgHover(isDark))
    }
    onMouseLeave={(e) => (e.currentTarget.style.background = rowBg(isDark))}
  >
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 blur-sm bg-gray-400/40" />
    <div className="flex-1 min-w-0 blur-sm select-none">
      <div
        className="h-3.5 w-48 rounded mb-2"
        style={{ background: isDark ? "rgba(255,255,255,0.2)" : "#d1d5db" }}
      />
      <div className="flex gap-3">
        <div
          className="h-3 w-24 rounded"
          style={{ background: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}
        />
        <div
          className="h-3 w-20 rounded"
          style={{ background: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}
        />
      </div>
    </div>
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-shrink-0"
      style={{
        background: "rgba(10,144,135,0.15)",
        border: "1px solid rgba(10,144,135,0.4)",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
          stroke="#41C551"
          strokeWidth="2"
        />
        <path
          d="M7 11V7a5 5 0 0 1 10 0v4"
          stroke="#41C551"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="text-[11px] sm:text-[12px] font-logo font-bold whitespace-nowrap"
        style={{ color: "#41C551" }}
      >
        Subscribe to Unlock
      </span>
    </div>
  </div>
);

const PredictionRow = ({ p, isDark }) => {
  const isLocked = p.prediction_desc === "Upgrade to unlock";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 10,
        marginBottom: 10,
        cursor: "pointer",
        background: hovered ? rowBgHover(isDark) : rowBg(isDark),
        border: rowBorder(isDark),
        transition: "background 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo */}
      <div style={{ flexShrink: 0 }}>
        {p.image ? (
          <img
            src={p.image}
            alt={p.game}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <NBALogo />
        )}
      </div>

      {/* Middle */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: isDark ? "#ffffff" : "#0a1f1e",
            fontWeight: 600,
            fontSize: 13,
            lineHeight: 1.4,
            margin: 0,
            marginBottom: 3,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {isLocked
            ? "Upgrade to unlock"
            : p.prediction_desc || p.title || "N/A"}
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
            <BsLightningChargeFill
              style={{ fontSize: 10, color: "#F5C518", flexShrink: 0 }}
            />
            <span
              style={{
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(10,31,30,0.6)",
                fontSize: 11,
                ...(isLocked
                  ? { filter: "blur(4px)", userSelect: "none" }
                  : {}),
              }}
            >
              {p.game || "N/A"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FaRegClock
              style={{
                fontSize: 10,
                color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,31,30,0.5)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(10,31,30,0.6)",
                fontSize: 11,
                whiteSpace: "nowrap",
                ...(isLocked
                  ? { filter: "blur(4px)", userSelect: "none" }
                  : {}),
              }}
            >
              {formatDate(p.date_time)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Bet Type + Bet Size — row layout */}
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
            style={{
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,31,30,0.5)",
              fontSize: 10,
              margin: 0,
              marginBottom: 2,
            }}
          >
            Bet Type
          </p>
          <p
            style={{
              color: getBetTypeColor(p.prediction_type || p.bet_type),
              fontWeight: 700,
              fontSize: 13,
              margin: 0,
              ...(isLocked ? { filter: "blur(4px)", userSelect: "none" } : {}),
            }}
          >
            {p.prediction_type || p.bet_type || "N/A"}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,31,30,0.5)",
              fontSize: 10,
              margin: 0,
              marginBottom: 4,
            }}
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
              background: "rgba(10,144,135,0.15)",
              color: "#41C551",
              border: "1px solid #41C551",
              ...(isLocked ? { filter: "blur(4px)", userSelect: "none" } : {}),
            }}
          >
            {p.unit_size || p.bet_size || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function AllPredictions() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [expandedPackages, setExpandedPackages] = useState({});
  const [currentPages, setCurrentPages] = useState({});

  const PREDICTIONS_PER_PAGE = 10;
  const isDark = theme === "dark";

  const { data: response, isLoading } = useGet("/predictions/", {
    queryKey: ["all-predictions"],
    secure: true,
  });

  const { data: active, isLoading: activeLoading } = useGet(
    "/predictions/active-count/",
    { queryKey: ["total-active-predictions"], secure: true },
  );

  if (isLoading || activeLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  const innerData = response?.data || response || {};
  const rawResults = innerData?.results || [];

  // ✅ Build package sections grouped by prediction_type if no package_sections
  const packageSections = innerData?.package_sections
    ? innerData.package_sections
    : rawResults.length > 0
      ? (() => {
          // Group by prediction_type
          const groups = {};
          rawResults.forEach((p) => {
            const key = p.prediction_type || p.bet_type || "Other";
            if (!groups[key]) groups[key] = [];
            groups[key].push(p);
          });
          return Object.entries(groups).map(([type, preds]) => ({
            package_name: getBetTypeLabel(type),
            has_access: true,
            active_count: preds.length,
            predictions: preds,
          }));
        })()
      : [];

  const accessiblePackages = packageSections.filter((pkg) => pkg.has_access);
  const lockedPackages = packageSections.filter((pkg) => !pkg.has_access);
  const typeOrder = [
    "Standard",
    "Live",
    "Play of the Day",
    "Player Props",
    "Futures",
  ];
  const allPackages = [...accessiblePackages, ...lockedPackages].sort(
    (a, b) => {
      const ai = typeOrder.indexOf(a.package_name);
      const bi = typeOrder.indexOf(b.package_name);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    },
  );

  // ✅ Total active predictions count
  const totalActive =
    active?.data?.active_count ??
    active?.active_count ??
    allPackages.reduce((sum, pkg) => sum + (pkg.active_count || 0), 0);

  // ✅ Package name from active data
  const packageTitle =
    active?.data?.package_name ??
    active?.package_name ??
    innerData?.package_name ??
    "Predictions";

  const togglePackage = (packageName) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [packageName]: !prev[packageName],
    }));
    if (!currentPages[packageName]) {
      setCurrentPages((prev) => ({ ...prev, [packageName]: 1 }));
    }
  };

  const handlePageChange = (packageName, page) => {
    setCurrentPages((prev) => ({ ...prev, [packageName]: page }));
  };

  const handleLockedClick = () => {
    errorToast("Subscribe first to access this prediction!");
    setTimeout(() => navigate("/dashboard/subscription-tiers"), 1500);
  };

  const getPaginated = (predictions, packageName) => {
    const currentPage = currentPages[packageName] || 1;
    const start = (currentPage - 1) * PREDICTIONS_PER_PAGE;
    return predictions.slice(start, start + PREDICTIONS_PER_PAGE);
  };

  const getTotalPages = (predictions) =>
    Math.ceil(predictions.length / PREDICTIONS_PER_PAGE);

  return (
    <div
      className="w-full rounded-xl font-primary overflow-hidden"
      style={{ background: isDark ? "#071412" : "#f8fafc" }}
    >
      {/* ── Top Header: Package title + total active ── */}
      {allPackages.length > 0 && (
        <div className="text-center pt-6 pb-2 px-4">
          <h2
            className="text-[18px] sm:text-[22px] font-logo font-bold mb-1"
            style={{ color: isDark ? "#ffffff" : "#0a1f1e" }}
          >
            {packageTitle}
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#41C551] inline-block" />
            <span
              className="text-[13px] sm:text-[14px] font-logo font-medium"
              style={{ color: "#41C551" }}
            >
              {totalActive} Active Predictions
            </span>
          </div>
        </div>
      )}

      {/* ── Accordion Sections ── */}
      <div className="py-3">
        {allPackages.map((pkg) => {
          const isOpen = !!expandedPackages[pkg.package_name];
          const isLocked = !pkg.has_access;
          const predictions = pkg.predictions || [];
          const paginated = getPaginated(predictions, pkg.package_name);
          const totalPages = getTotalPages(predictions);
          const currentPage = currentPages[pkg.package_name] || 1;
          const lockedRowCount = pkg.active_count || pkg.locked_count || 3;

          return (
            <div
              key={pkg.package_name}
              className="my-2 mx-3 sm:mx-5 rounded-xl overflow-hidden"
              style={{
                background: isDark ? "#0d1f1e" : "#ffffff",
                border: isDark ? "1px solid #0a2e2c" : "1px solid #e5e7eb",
                boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {/* Section Header */}
              <div
                className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
                onClick={() => togglePackage(pkg.package_name)}
                style={{
                  background: isOpen
                    ? isDark
                      ? "rgba(10,144,135,0.06)"
                      : "rgba(10,144,135,0.03)"
                    : "transparent",
                }}
              >
                <div>
                  <p
                    className="text-[15px] sm:text-[17px] font-logo font-bold"
                    style={{ color: isDark ? "#ffffff" : "#0a1f1e" }}
                  >
                    {pkg.package_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p
                      className="text-[12px] sm:text-[13px] font-logo font-normal"
                      style={{
                        color: isDark ? "#92A8C1" : "rgba(10,31,30,0.55)",
                      }}
                    >
                      {pkg.active_count ?? predictions.length} Active Prediction
                      {(pkg.active_count ?? predictions.length) !== 1
                        ? "s"
                        : ""}
                    </p>
                    {isLocked && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          background: "rgba(251,191,36,0.15)",
                          color: "#fbbf24",
                          border: "1px solid rgba(251,191,36,0.3)",
                        }}
                      >
                        🔒 LOCKED
                      </span>
                    )}
                  </div>
                </div>
                {isOpen ? (
                  <FaChevronUp style={{ color: "green", fontSize: 13 }} />
                ) : (
                  <FaChevronDown style={{ color: "green", fontSize: 13 }} />
                )}
              </div>

              {/* Rows */}
              {isOpen && (
                <div className="px-3 sm:px-5 pb-3 pt-1">
                  {isLocked ? (
                    <>
                      {Array.from({ length: lockedRowCount }).map((_, idx) => (
                        <LockedRow
                          key={idx}
                          isDark={isDark}
                          onClick={handleLockedClick}
                        />
                      ))}
                      <div
                        className="flex flex-col items-center justify-center py-4 px-4 mb-2 rounded-xl"
                        style={{
                          background: isDark
                            ? "rgba(10,144,135,0.08)"
                            : "rgba(10,144,135,0.04)",
                          border: "1px dashed rgba(10,144,135,0.35)",
                        }}
                      >
                        <p
                          className="text-[13px] font-logo font-semibold mb-2"
                          style={{
                            color: isDark
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(10,31,30,0.7)",
                          }}
                        >
                          Upgrade your plan to view these predictions
                        </p>
                        <button
                          onClick={handleLockedClick}
                          className="px-4 py-1.5 rounded-lg text-[13px] font-logo font-bold transition-opacity hover:opacity-80"
                          style={{
                            background: "rgba(10,144,135,0.9)",
                            color: "#fff",
                          }}
                        >
                          View Plans →
                        </button>
                      </div>
                    </>
                  ) : paginated.length === 0 ? (
                    <p
                      className="text-center py-6 text-sm font-logo"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,0.4)"
                          : "rgba(10,31,30,0.4)",
                      }}
                    >
                      No predictions available
                    </p>
                  ) : (
                    paginated.map((p) => (
                      <PredictionRow key={p.id} p={p} isDark={isDark} />
                    ))
                  )}

                  {/* Pagination */}
                  {!isLocked && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 py-3">
                      <button
                        disabled={currentPage === 1}
                        onClick={() =>
                          handlePageChange(pkg.package_name, currentPage - 1)
                        }
                        className="px-3 py-1 rounded text-sm font-logo"
                        style={{
                          opacity: currentPage === 1 ? 0.3 : 1,
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                          background: isDark ? "#032422" : "#f3f4f6",
                          color: isDark ? "#ffffff" : "#0a1f1e",
                          border: isDark ? "none" : "1px solid #e5e7eb",
                        }}
                      >
                        Prev
                      </button>
                      <span
                        className="text-sm font-logo"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(10,31,30,0.6)",
                        }}
                      >
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          handlePageChange(pkg.package_name, currentPage + 1)
                        }
                        className="px-3 py-1 rounded text-sm font-logo"
                        style={{
                          opacity: currentPage === totalPages ? 0.3 : 1,
                          cursor:
                            currentPage === totalPages
                              ? "not-allowed"
                              : "pointer",
                          background: isDark ? "#032422" : "#f3f4f6",
                          color: isDark ? "#ffffff" : "#0a1f1e",
                          border: isDark ? "none" : "1px solid #e5e7eb",
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {allPackages.length === 0 && (
        <div className="flex justify-center items-center py-16">
          <p
            className="text-sm font-logo"
            style={{
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,31,30,0.4)",
            }}
          >
            No predictions found
          </p>
        </div>
      )}
    </div>
  );
}
