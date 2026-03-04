import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaRegClock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import CommonParagraph from "@/components/texts/CommonParagraph";
import errorToast from "@/hooks/custom/errorToast";

// ✅ getBetTypeColor — maps prediction_type to color
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
  const { sidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedPackages, setExpandedPackages] = useState({});
  const [currentPages, setCurrentPages] = useState({});

  const PREDICTIONS_PER_PAGE = 10;
  const isDark = theme === "dark";

  // ✅ Real API data
  const { data: response, isLoading } = useGet("/predictions/", {
    queryKey: ["all-predictions"],
    secure: true,
  });

  const { data: active, isLoading: activeLoading } = useGet(
    "/predictions/active-count/",
    {
      queryKey: ["total-active-predictions"],
      secure: true,
    },
  );

  if (isLoading || activeLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  // ✅ unwrap API response — same pattern confirmed from Result.jsx
  const innerData = response?.data || response || {};
  const packageSections = innerData?.package_sections || [];
  const userPackages = innerData?.user_packages || [];
  const userTierName = innerData?.user_tier_name || "";
  const totalAccessible = innerData?.total_accessible || 0;

  const hasUltimatePackage = userTierName.toLowerCase().includes("ultimate");

  const accessiblePackages = packageSections.filter((pkg) => pkg.has_access);
  const lockedPackages = packageSections.filter((pkg) => !pkg.has_access);
  const allPackages = [...accessiblePackages, ...lockedPackages];

  // Toggle accordion
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
      style={{ background: isDark ? "#071412" : "#f0faf9" }}
    >
      {/* ── Top Header ── */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-3">
        <ChartIcon />
        <span className="text-white font-bold text-[15px]">Predictions</span>
      </div>

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

        return (
          <div
            key={pkg.package_name}
            className="bg-[#021716] gap-4 my-3 sm:my-4 mx-2 sm:mx-4 rounded-lg"
          >
            {/* Section Header */}
            <div
              className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 cursor-pointer"
              onClick={() => togglePackage(pkg.package_name)}
            >
              <div>
                <p
                  className={`text-[16px] font-logo font-bold sm:text-[20px] ${isDark ? "text-white" : "text-[#0a1f1e]"}`}
                >
                  {pkg.package_name}
                </p>
                <p
                  className={`text-[12px] font-logo font-normal sm:text-[14px] mt-0.5 ${isDark ? "text-[#92A8C1]" : "text-[#0a1f1e]/40"}`}
                >
                  {pkg.active_count ?? predictions.length} Active Prediction
                  {(pkg.active_count ?? predictions.length) !== 1 ? "s" : ""}
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
                {paginated.length === 0 ? (
                  <p
                    className={`text-center py-4 text-sm font-logo ${isDark ? "text-white/40" : "text-[#0a1f1e]/40"}`}
                  >
                    No predictions available
                  </p>
                ) : (
                  paginated.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start sm:items-center bg-[#032422] mb-3 rounded-xl gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-pointer transition-colors"
                      onClick={
                        isLocked ? handleLockedPredictionClick : undefined
                      }
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = isDark
                          ? "rgba(10,144,135,0.08)"
                          : "rgba(10,144,135,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#032422")
                      }
                    >
                      {/* Logo */}
                      <div className="hidden xs:flex sm:flex">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.game}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <NBALogo />
                        )}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[14px] sm:text-[16px] font-logo font-bold leading-tight mb-1 ${
                            isLocked ? "blur-sm select-none" : ""
                          } ${isDark ? "text-white" : "text-[#0a1f1e]"}`}
                        >
                          {isLocked
                            ? "Upgrade to unlock"
                            : p.prediction_desc || p.title || "N/A"}
                        </p>
                        <div className="flex flex-col xs:flex-row sm:flex-row items-start xs:items-center sm:items-center gap-1 sm:gap-3">
                          <div className="flex items-center gap-1 min-w-0">
                            <BsLightningChargeFill className="text-[10px] text-yellow-500 flex-shrink-0" />
                            <span
                              className={`text-[12px] font-logo font-normal sm:text-[14px] truncate ${isDark ? "text-white/45" : "text-[#0a1f1e]/50"}`}
                            >
                              {p.game || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <FaRegClock
                              className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/40" : "text-[#0a1f1e]/40"}`}
                            />
                            <span
                              className={`text-[12px] sm:text-[14px] font-logo font-normal whitespace-nowrap ${isDark ? "text-white/45" : "text-[#0a1f1e]/50"}`}
                            >
                              {p.date_time ? formatDate(p.date_time) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bet Type + Bet Size */}
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
                            style={{
                              color: getBetTypeColor(
                                p.prediction_type || p.bet_type,
                              ),
                            }}
                          >
                            {p.prediction_type || p.bet_type || "N/A"}
                          </p>
                        </div>

                        {/* Bet Size */}
                        <div className="text-center">
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
                            {p.unit_size || p.bet_size || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* ✅ Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 py-3">
                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        handlePageChange(pkg.package_name, currentPage - 1)
                      }
                      className={`px-3 py-1 rounded text-sm font-logo ${
                        currentPage === 1
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${isDark ? "text-white bg-[#032422]" : "text-[#0a1f1e] bg-white border"}`}
                    >
                      Prev
                    </button>
                    <span
                      className={`text-sm font-logo ${isDark ? "text-white/60" : "text-[#0a1f1e]/60"}`}
                    >
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        handlePageChange(pkg.package_name, currentPage + 1)
                      }
                      className={`px-3 py-1 rounded text-sm font-logo ${
                        currentPage === totalPages
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${isDark ? "text-white bg-[#032422]" : "text-[#0a1f1e] bg-white border"}`}
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
            className={`text-sm font-logo ${isDark ? "text-white/40" : "text-[#0a1f1e]/40"}`}
          >
            No predictions found
          </p>
        </div>
      )}
    </div>
  );
}
