import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaRegClock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { GoGraph } from "react-icons/go";

import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import errorToast from "@/hooks/custom/errorToast";

const getBetTypeColor = (type) => {
  switch (type) {
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
    case "win":
      return "#059669";
    case "loss":
      return "#e11d48";
    default:
      return "#60a5fa";
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

const ChartIcon = ({ isDark }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <polyline
      points="2,18 8,12 13,16 22,6"
      stroke={isDark ? "white" : "#0a1f1e"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Row background helpers (always inline style, never className bg) ────────
const rowBg = (isDark) => (isDark ? "#032422" : "#f9fafb");
const rowBgHover = (isDark) =>
  isDark ? "rgba(10,144,135,0.08)" : "rgba(10,144,135,0.06)";
const rowBorder = (isDark) =>
  isDark ? "1px solid #0a3330" : "1px solid #e5e7eb";

// ── Locked placeholder row ──────────────────────────────────────────────────
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
    {/* Blurred fake logo */}
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 blur-sm bg-gray-400/40" />

    {/* Blurred fake text */}
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

    {/* Lock badge */}
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

// ── Accessible prediction row ───────────────────────────────────────────────
const PredictionRow = ({ p, isDark }) => (
  <div
    className="flex items-start sm:items-center mb-3 rounded-xl gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-pointer transition-colors"
    style={{ background: rowBg(isDark), border: rowBorder(isDark) }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background = rowBgHover(isDark))
    }
    onMouseLeave={(e) => (e.currentTarget.style.background = rowBg(isDark))}
  >
    {/* Logo */}
    <div className="flex-shrink-0">
      {p.image ? (
        <img
          src={p.image}
          alt={p.game}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
        />
      ) : (
        <NBALogo />
      )}
    </div>

    {/* Main Info */}
    <div className="flex-1 min-w-0">
      <p
        className="text-[14px] sm:text-[16px] font-logo font-bold leading-tight mb-1"
        style={{ color: isDark ? "#ffffff" : "#0a1f1e" }}
      >
        {p.prediction_desc || p.title || "N/A"}
      </p>
      <div className="flex flex-col xs:flex-row sm:flex-row items-start xs:items-center sm:items-center gap-1 sm:gap-3">
        <div className="flex items-center gap-1 min-w-0">
          <BsLightningChargeFill className="text-[10px] text-yellow-500 flex-shrink-0" />
          <span
            className="text-[12px] font-logo font-normal sm:text-[14px] truncate"
            style={{
              color: isDark ? "rgba(255,255,255,0.5)" : "rgba(10,31,30,0.6)",
            }}
          >
            {p.prediction_desc === "Upgrade to unlock" ? (
              <span className="blur-sm select-none">{p.game || "N/A"}</span>
            ) : (
              p.game || "N/A"
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <FaRegClock
            className="text-[10px] flex-shrink-0"
            style={{
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,31,30,0.5)",
            }}
          />

          <span
            className="text-[12px] sm:text-[14px] font-logo font-normal whitespace-nowrap"
            style={{
              color: isDark ? "rgba(255,255,255,0.5)" : "rgba(10,31,30,0.6)",
            }}
          >
            {p.prediction_desc === "Upgrade to unlock" ? (
              <span className="blur-sm select-none">
                {" "}
                {p.date_time ? formatDate(p.date_time) : "N/A"}
              </span>
            ) : (
              p.game || "N/A"
            )}
          </span>
        </div>
      </div>
    </div>

    {/* Bet Type + Bet Size */}
    <div className="flex flex-col xs:flex-row sm:flex-row items-end xs:items-center sm:items-center gap-2 sm:gap-4 flex-shrink-0">
      <div className="text-center">
        <p
          className="text-[12px] font-logo font-normal sm:text-[14px] mb-1"
          style={{
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,31,30,0.5)",
          }}
        >
          Bet Type
        </p>
        <p
          className="font-bold text-[13px] font-logo sm:text-[16px]"
          style={{ color: getBetTypeColor(p.prediction_type || p.bet_type) }}
        >
          {p.prediction_desc === "Upgrade to unlock" ? (
            <span className="blur-sm select-none">
              {p.prediction_type || p.bet_type || "N/A"}
            </span>
          ) : (
            p.prediction_type || p.bet_type || "N/A"
          )}
        </p>
      </div>

      <div className="text-center">
        <p
          className="text-[12px] sm:text-[14px] font-normal font-logo mb-1"
          style={{
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(10,31,30,0.5)",
          }}
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
          {p.prediction_desc === "Upgrade to unlock" ? (
            <span className="blur-sm select-none">
              {p.unit_size || p.bet_size || "N/A"}
            </span>
          ) : (
            p.unit_size || p.bet_size || "N/A"
          )}
        </span>
      </div>
    </div>
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
export default function AllPredictions() {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedPackages, setExpandedPackages] = useState({});
  const [currentPages, setCurrentPages] = useState({});

  const PREDICTIONS_PER_PAGE = 10;
  const isDark = theme === "dark";
  const textColor = isDark ? "#ffffff" : "#111827";

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
  const packageSections = innerData?.package_sections
    ? innerData.package_sections
    : rawResults.length > 0
      ? [
          {
            package_name: "Predictions",
            has_access: true,
            active_count: rawResults.length,
            predictions: rawResults,
          },
        ]
      : [];

  const accessiblePackages = packageSections.filter((pkg) => pkg.has_access);
  const lockedPackages = packageSections.filter((pkg) => !pkg.has_access);
  const allPackages = [...accessiblePackages, ...lockedPackages];

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

  const handleLockedPredictionClick = () => {
    errorToast("Subscribe first to access this prediction!");
    setTimeout(() => navigate("/dashboard/subscription-tiers"), 1500);
  };

  const getPaginatedPredictions = (predictions, packageName) => {
    const currentPage = currentPages[packageName] || 1;
    const startIndex = (currentPage - 1) * PREDICTIONS_PER_PAGE;
    return predictions.slice(startIndex, startIndex + PREDICTIONS_PER_PAGE);
  };

  const getTotalPages = (predictions) =>
    Math.ceil(predictions.length / PREDICTIONS_PER_PAGE);

  return (
    <div
      className="w-full rounded-xl font-primary overflow-hidden"
      style={{ background: isDark ? "#071412" : "#f8fafc" }}
    >
      {/* ── Accordion Sections ── */}
      {allPackages.map((pkg) => {
        const isOpen = !!expandedPackages[pkg.package_name];
        const isLocked = !pkg.has_access;
        const predictions = pkg.predictions || [];
        const paginated = getPaginatedPredictions(
          predictions,
          pkg.package_name,
        );
        const totalPages = getTotalPages(predictions);
        const currentPage = currentPages[pkg.package_name] || 1;
        const lockedRowCount = pkg.active_count || pkg.locked_count || 3;

        return (
          <div
            key={pkg.package_name}
            className="my-3 sm:my-4 mx-2 sm:mx-4 rounded-lg"
            style={{
              background: isDark ? "#021716" : "#ffffff",
              border: isDark ? "none" : "1px solid #e5e7eb",
              boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            {/* Section Header */}
            <div
              className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 cursor-pointer"
              onClick={() => togglePackage(pkg.package_name)}
            >
              <div>
                <p
                  className="text-[16px] font-logo font-bold sm:text-[20px]"
                  style={{ color: isDark ? "#ffffff" : "#0a1f1e" }}
                >
                  {pkg.package_name}
                </p>
                <p
                  className="text-[12px] font-logo font-normal sm:text-[14px] mt-0.5 flex items-center gap-2"
                  style={{ color: isDark ? "#92A8C1" : "rgba(10,31,30,0.6)" }}
                >
                  {pkg.active_count ?? predictions.length} Active Prediction
                  {(pkg.active_count ?? predictions.length) !== 1 ? "s" : ""}
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
                </p>
              </div>
              {isOpen ? (
                <FaChevronUp
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.6)"
                      : "rgba(10,31,30,0.6)",
                    fontSize: 11,
                  }}
                />
              ) : (
                <FaChevronDown
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.6)"
                      : "rgba(10,31,30,0.6)",
                    fontSize: 11,
                  }}
                />
              )}
            </div>

            {/* Rows */}
            {isOpen && (
              <div className="px-2 sm:px-4 pb-2">
                {/* ── LOCKED ── */}
                {isLocked ? (
                  <>
                    {Array.from({ length: lockedRowCount }).map((_, idx) => (
                      <LockedRow
                        key={idx}
                        isDark={isDark}
                        onClick={handleLockedPredictionClick}
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
                        onClick={handleLockedPredictionClick}
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
                    className="text-center py-4 text-sm font-logo"
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

                {/* ── Pagination ── */}
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
