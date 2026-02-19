import React, { useState } from "react";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import team from "@/assets/dashboard/team.jpg";
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
import toast from "react-hot-toast";
import errorToast from "@/hooks/custom/errorToast";

const AllPredictions = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedPackages, setExpandedPackages] = useState({});
  const navigate = useNavigate();

  // Pagination states for each package
  const [currentPages, setCurrentPages] = useState({});

  // Fetch predictions data
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

  // SIMPLE LOGIC: If user has user_tier_name, they have a package
  const hasAnyPackages = !!userTierName;
  const mainPackageName = userTierName;

  // Check if user has Ultimate package specifically
  const hasUltimatePackage = userTierName.toLowerCase().includes("ultimate");

  // Constants for pagination
  const PREDICTIONS_PER_PAGE = 10;

  // For Ultimate users: show all packages with has_access=true
  // For non-Ultimate users: show only packages with has_access=true
  const accessiblePackages = hasUltimatePackage
    ? packageSections.filter((pkg) => pkg.has_access)
    : packageSections.filter((pkg) => pkg.has_access);

  // Locked packages are those where has_access=false
  const lockedPackages = packageSections.filter((pkg) => !pkg.has_access);

  // All packages combined for display
  const allPackages = [...accessiblePackages, ...lockedPackages];

  // Toggle package expansion for ALL packages
  const togglePackage = (packageName) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [packageName]: !prev[packageName],
    }));

    if (!currentPages[packageName]) {
      setCurrentPages((prev) => ({
        ...prev,
        [packageName]: 1,
      }));
    }
  };

  // Handle page change for specific package
  const handlePageChange = (packageName, page) => {
    setCurrentPages((prev) => ({
      ...prev,
      [packageName]: page,
    }));
  };

  // Handle click on locked prediction
  const handleLockedPredictionClick = () => {
    errorToast("Subscribe first to access this prediction!");
    setTimeout(() => {
      navigate("/dashboard/subscription-tiers");
    }, 1500);
  };

  // Get paginated predictions for a package
  const getPaginatedPredictions = (predictions, packageName) => {
    const currentPage = currentPages[packageName] || 1;
    const startIndex = (currentPage - 1) * PREDICTIONS_PER_PAGE;
    const endIndex = startIndex + PREDICTIONS_PER_PAGE;
    return predictions.slice(startIndex, endIndex);
  };

  // Get total pages for a package
  const getTotalPages = (predictions) => {
    return Math.ceil(predictions.length / PREDICTIONS_PER_PAGE);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "L":
        return "text-[#FFDB5B] ";
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
        return "text-emerald-600 border border-emearald-600";
      case "loss":
        return "text-rose-600 border border-rose-600";
      default:
        return "text-lightBlue";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  // Render prediction item (reusable component)
  const renderPredictionItem = (prediction, isLocked = false) => (
    <div
      key={prediction?.id}
      className={`flex flex-row lg:p-5 p-2 rounded-xl transition-all duration-200 gap-5 w-full ${
        theme === "dark" ? "bg-darkerBlack" : "bg-white"
      } ${isLocked ? "cursor-pointer" : ""}`}
      onClick={isLocked ? handleLockedPredictionClick : undefined}
    >
      {/* Left section */}
      <div className="flex justify-start items-center gap-3 w-full">
        {/* Professional team logo with border and subtle shadow */}
        <div
          className={`xl:min-w-12 xl:w-12 xl:h-12 md:min-w-10 md:w-10 md:h-10 min-w-8 w-8 h-8 rounded-full flex items-center justify-center border-1 mt-1.5 ${
            theme === "dark" ? "border-lightBlack" : "border-lighterGrey"
          }`}
        >
          {prediction?.image ? (
            <img
              src={prediction?.image}
              alt={prediction.game}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-base">
              <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xl">
                {prediction?.game?.[0]?.toUpperCase() || ""}
              </div>
            </div>
          )}
        </div>

        {/* Main content row */}
        <div className="flex flex-row items-center justify-between gap-1 w-full">
          {/* Left: Bet info */}
          <div className="w-full">
            <CommonParagraph
              variant=""
              className={`${
                isLocked ? "blur-xs" : ""
              } mb-1 font-semibold text-left capitalize md:text-base text-xs ${
                theme === "dark" ? "text-lightGrey" : "text-mediumBlack"
              }`}
            >
              {isLocked
                ? "Upgrade to unlock"
                : prediction?.prediction_desc || "N/A"}
            </CommonParagraph>
            {/* Game details */}
            <div
              className={`flex items-start gap-2 ${
                theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
              }`}
            >
              {/* Icon for type */}
              <div className="flex items-center">
                <BsLightningChargeFill className="text-xs text-yellow-500" />
                <CommonParagraph variant="smaller" className="ms-1 uppercase">
                  {prediction?.game || "N/A"}
                </CommonParagraph>
              </div>

              {/* Icon for time */}
              <div className="flex items-center">
                <FaRegClock className="text-xs" />
                <CommonParagraph variant="smaller" className="ms-1">
                  {formatDate(prediction.date_time)}
                </CommonParagraph>
              </div>
            </div>
          </div>

          {/* Right: Unit and status */}
          <div className="flex lg:flex-row flex-col-reverse lg:items-center items-end lg:gap-10 gap-1 justify-end py-2">
            <div className="2xl:min-w-[600px] lg:min-w-[200px] min-w-[40px] flex justify-center items-center">
              <span
                className={`xl:text-sm md:text-xs text-[10px] font-medium text-center ${getTypeColor(
                  prediction?.prediction_type,
                )}`}
                style={{
                  color:
                    prediction?.prediction_type === "F" ? "#eb464c" : undefined,
                }}
              >
                {prediction?.prediction_type || "N/A"}
              </span>
            </div>
            <CommonParagraph
              variant="smaller"
              className={`font-medium border ${
                theme === "dark"
                  ? "text-green-500 border-green-800"
                  : "text-green-600 border-green-500"
              } px-2 py-1 rounded text-xs font-medium`}
            >
              {prediction.unit_size}%
            </CommonParagraph>
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
      <div className={`rounded-xl font-primary`}>
        <div
          className={`rounded-lg lg:p-6 sm:p-5 p-3 ${
            theme === "dark" ? "bg-darkBlack" : "bg-lightestGrey"
          }`}
        >
          {/* Header Section - SIMPLE FIXED LOGIC */}
          {/* Header Section */}
          <CommonTitle variant="h3" className="font-semibold text-center ">
            {hasFree ? "No Package" : userTierName || "Guest"}
          </CommonTitle>

          <CommonParagraph
            variant="small"
            className={`${
              theme === "dark" ? "text-lightBlue" : "text-darkBlue"
            }  flex justify-center items-center gap-2 mb-2`}
          >
            <FaCircle size={8} className="text-green-600" />
            {active?.data?.total_active_predictions || 0} Active Predictions
          </CommonParagraph>
          {/* Package Sections */}
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

              return (
                <div key={pkg.package_name} className="mb-6">
                  {/* Package Header - Clickable with Arrow for ALL packages */}
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-darkerBlack hover:bg-darkBlack"
                        : "bg-white hover:bg-gray-50"
                    } border ${
                      theme === "dark" ? "border-lightBlack" : "border-gray-200"
                    }`}
                    onClick={() => togglePackage(pkg.package_name)}
                  >
                    <div className="flex flex-col">
                      <CommonParagraph
                        variant="medium"
                        className={`font-semibold ${
                          theme === "dark"
                            ? "text-lightGrey"
                            : "text-mediumBlack"
                        }`}
                      >
                        {pkg.package_name}
                      </CommonParagraph>
                      <CommonParagraph
                        variant="small"
                        className={`${
                          theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
                        } mt-1`}
                      >
                        {predictionCount} {predictionText}
                      </CommonParagraph>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedPackages[pkg.package_name] ? (
                        <FaChevronUp className="text-lightBlue" />
                      ) : (
                        <FaChevronDown className="text-lightBlue" />
                      )}
                    </div>
                  </div>

                  {/* Package Content - Expandable for ALL packages */}
                  {expandedPackages[pkg.package_name] && (
                    <div className="mt-3 space-y-3">
                      {predictions.length > 0 ? (
                        <>
                          {/* Render paginated predictions for this package */}
                          {getPaginatedPredictions(
                            predictions,
                            pkg.package_name,
                          ).map((prediction) =>
                            renderPredictionItem(prediction, !isAccessible),
                          )}

                          {/* Pagination for this package */}
                          {getTotalPages(predictions) > 1 && (
                            <div className="mt-6 flex justify-center">
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
                        <div className="text-center py-4">
                          <CommonParagraph variant="medium">
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
            /* Empty State - User has packages but no package sections */
            <div className="text-center py-10">
              <CommonParagraph variant="medium" className="mb-4">
                {userTierName
                  ? `You have the ${userTierName} package but no predictions are currently available.`
                  : "No predictions found. Subscribe to get started!"}
              </CommonParagraph>
              <CommonParagraph variant="small" className="mt-2">
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
