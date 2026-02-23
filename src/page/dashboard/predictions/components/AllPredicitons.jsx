import React, { useState } from "react";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import {
  FaCircle,
  FaRegClock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import Pagination from "@/components/buttons/Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import errorToast from "@/hooks/custom/errorToast";

const AllPredictions = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedPackages, setExpandedPackages] = useState({});
  const navigate = useNavigate();

  const [currentPages, setCurrentPages] = useState({});

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

  const packageSections = response?.data?.package_sections || [];
  const userPackages = response?.data?.user_packages || [];
  const userTierName = response?.data?.user_tier_name || "";
  const totalAccessible = response?.data?.total_accessible || 0;
  const hasFree = userPackages.includes("Free");

  const hasAnyPackages = !!userTierName;
  const mainPackageName = userTierName;
  const hasUltimatePackage = userTierName.toLowerCase().includes("ultimate");

  const PREDICTIONS_PER_PAGE = 10;

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
    setTimeout(() => {
      navigate("/dashboard/subscription-tiers");
    }, 1500);
  };

  const getPaginatedPredictions = (predictions, packageName) => {
    const currentPage = currentPages[packageName] || 1;
    const startIndex = (currentPage - 1) * PREDICTIONS_PER_PAGE;
    return predictions.slice(startIndex, startIndex + PREDICTIONS_PER_PAGE);
  };

  const getTotalPages = (predictions) =>
    Math.ceil(predictions.length / PREDICTIONS_PER_PAGE);

  const getTypeColor = (type) => {
    switch (type) {
      case "L":
        return "text-[#FFDB5B]";
      case "S":
        return "text-lightGrey";
      case "F":
        return "text-[#eb464c]";
      case "PP":
        return "text-green-400";
      case "POTD":
        return "text-purple-400";
      case "P":
        return "text-yellow-400";
      case "win":
        return "text-emerald-600 border border-emerald-600";
      case "loss":
        return "text-rose-600 border border-rose-600";
      default:
        return "text-lightBlue";
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

  // ─── Prediction Card ──────────────────────────────────────────
  const renderPredictionItem = (prediction, isLocked = false) => (
    <div
      key={prediction?.id}
      className={`flex flex-row xl:p-1.5 p-2 my-2 rounded-xl transition-all duration-200 gap-3 w-full ${
        theme === "dark" ? "bg-[#054844]" : "bg-lightestGrey"
      } ${isLocked ? "cursor-pointer" : ""}`}
      onClick={isLocked ? handleLockedPredictionClick : undefined}
    >
      <div className="flex justify-center items-center gap-2 w-full px-1.5">
        {/* Logo */}
        <div
          className={`xl:w-10 xl:h-10 w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 ${
            theme === "dark" ? "border-lightBlack" : "border-lighterGrey"
          }`}
        >
          {prediction?.image ? (
            <img
              src={prediction?.image}
              alt={prediction?.game}
              className="w-full h-full rounded-full object-contain"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xs">
              {prediction?.game?.[0]?.toUpperCase() || ""}
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-row items-center justify-between gap-1 w-full">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <CommonParagraph
                variant="smaller"
                className={`mb-1 font-semibold text-left capitalize truncate ${
                  isLocked ? "blur-sm select-none" : ""
                } ${theme === "dark" ? "text-white" : "text-mediumBlack"}`}
              >
                {isLocked
                  ? "Upgrade to unlock this prediction"
                  : prediction?.prediction_desc || "N/A"}
              </CommonParagraph>

              <div
                className={`flex flex-row items-center gap-2 mt-1 ${
                  theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <BsLightningChargeFill className="text-xs text-yellow-500" />
                  <CommonParagraph variant="extraSmall" className="ms-1 ">
                    {prediction?.game || "N/A"}
                  </CommonParagraph>
                </div>
                <div className="flex items-center gap-0.5">
                  <FaRegClock className="text-xs" />
                  <CommonParagraph variant="extraSmall" className="ms-1">
                    {formatDate(prediction?.date_time)}
                  </CommonParagraph>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-center flex-shrink-0">
              <span
                className={`font-medium text-xs text-center -mb-0.5 ${
                  theme === "dark" ? "text-white" : "text-darkBlack"
                }`}
              >
                {prediction?.unit_size || "N/A"}%
              </span>
              <div className="text-center mb-0.5">
                <span
                  className={`capitalize px-1.5 py-0.5 rounded font-medium text-xs border shadow-sm ${getTypeColor(
                    prediction?.game_status || "N/A",
                  )}`}
                >
                  {prediction?.game_status || "N/A"}
                </span>
              </div>
              <span
                className={`text-xs text-center font-medium ${getTypeColor(
                  prediction?.prediction_type || "N/A",
                )}`}
              >
                {prediction?.prediction_type || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading || activeLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="">
      <div className="rounded-xl font-primary">
        <div
          className={`rounded-xl lg:p-6 sm:p-4 p-3 ${
            theme === "dark"
              ? "bg-[#021716] border border-mediumBlack"
              : "bg-white border border-lightestGrey"
          }`}
        >
          {/* ── Header ── */}
          <div className="flex flex-col items-center mb-4">
            <CommonTitle variant="h3" className="font-semibold text-center">
              {hasFree ? "No Package" : userTierName || "Guest"}
            </CommonTitle>

            <CommonParagraph
              variant="small"
              className={`flex justify-center items-center gap-2 mt-1 ${
                theme === "dark" ? "text-[#0A9087]" : "text-[#0A9087]"
              }`}
            >
              <FaCircle size={8} className="text-[#0A9087]" />
              {active?.data?.total_active_predictions || 0} Active Predictions
            </CommonParagraph>
          </div>

          {/* ── Package Sections ── */}
          {allPackages.length > 0 ? (
            allPackages.map((pkg) => {
              const isAccessible = pkg.has_access;
              const predictions = isAccessible
                ? pkg.predictions
                : pkg.locked_predictions;
              const predictionCount = isAccessible
                ? pkg.accessible_count
                : pkg.locked_count;
              const predictionText = isAccessible
                ? "Active Predictions"
                : "Locked Predictions";
              const isExpanded = expandedPackages[pkg.package_name];

              return (
                <div key={pkg.package_name} className="mb-4">
                  {/* Package Header */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                      theme === "dark"
                        ? "bg-[#054844] border-mediumBlack hover:border-lightBlack"
                        : "bg-lightestGrey border-lightestGrey hover:border-lighterGrey"
                    }`}
                    onClick={() => togglePackage(pkg.package_name)}
                  >
                    <div className="flex flex-col">
                      <CommonParagraph
                        variant="small"
                        className={`font-semibold ${
                          theme === "dark" ? "text-white" : "text-mediumBlack"
                        }`}
                      >
                        {pkg.package_name}
                      </CommonParagraph>
                      <CommonParagraph
                        variant="extraSmall"
                        className={`mt-0.5 ${
                          theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
                        }`}
                      >
                        {predictionCount} {predictionText}
                      </CommonParagraph>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isAccessible && (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                            theme === "dark"
                              ? "text-rose-400 border-rose-800"
                              : "text-rose-500 border-rose-300"
                          }`}
                        >
                          Locked
                        </span>
                      )}
                      {isExpanded ? (
                        <FaChevronUp className="text-[#0A9087] text-xs" />
                      ) : (
                        <FaChevronDown className="text-[#0A9087] text-xs" />
                      )}
                    </div>
                  </div>

                  {/* Package Content */}
                  {isExpanded && (
                    <div className="mt-2 space-y-1">
                      {predictions.length > 0 ? (
                        <>
                          {getPaginatedPredictions(
                            predictions,
                            pkg.package_name,
                          ).map((prediction) =>
                            renderPredictionItem(prediction, !isAccessible),
                          )}

                          {getTotalPages(predictions) > 1 && (
                            <div className="mt-4 flex justify-center">
                              <Pagination
                                currentPage={
                                  currentPages[pkg.package_name] || 1
                                }
                                totalPages={getTotalPages(predictions)}
                                onPageChange={(page) =>
                                  handlePageChange(pkg.package_name, page)
                                }
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className={`text-center py-6 rounded-xl ${
                            theme === "dark"
                              ? "bg-darkerBlack"
                              : "bg-lightestGrey"
                          }`}
                        >
                          <CommonParagraph
                            variant="small"
                            className={`${
                              theme === "dark"
                                ? "text-mediumGrey"
                                : "text-darkGrey"
                            }`}
                          >
                            No predictions available in this package
                          </CommonParagraph>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* ── Empty State ── */
            <div className="text-center py-10">
              <CommonParagraph
                variant="medium"
                className={`mb-2 ${
                  theme === "dark" ? "text-lightGrey" : "text-mediumBlack"
                }`}
              >
                {userTierName
                  ? `You have the ${userTierName} package but no predictions are currently available.`
                  : "No predictions found. Subscribe to get started!"}
              </CommonParagraph>
              <CommonParagraph
                variant="small"
                className={`${
                  theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
                }`}
              >
                {userTierName
                  ? "Check back later for new predictions!"
                  : "Upgrade your subscription to access premium predictions!"}
              </CommonParagraph>
            </div>
          )}
        </div>
      </div>
    </CommonWrapper>
  );
};

export default AllPredictions;
