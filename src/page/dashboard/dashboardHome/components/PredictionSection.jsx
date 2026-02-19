import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import team from "@/assets/dashboard/team.jpg";
import { FaCircle, FaRegClock, FaRegFileAlt } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { Link } from "react-router-dom";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const PredictionSection = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();
  // Fetch predictions data using the same pattern as videos
  const { data: response, isLoading } = useGet("/predictions/optimized/", {
    queryKey: ["dashboard-predictions"],
    secure: true,
  });

  const { data: active, isLoading: activeLoading } = useGet(
    "/predictions/active-count/",
    {
      queryKey: ["active-predictions"],
      secure: true,
    },
  );

  const packageSections = response?.data?.package_sections || [];
  const userPackages = response?.data?.user_packages || [];
  const userTierName = response?.data?.user_tier_name || "";
  const totalAccessible = response?.data?.total_accessible || 0;
  const totalLocked = response?.data?.total_locked || 0;

  // Check if user has any Ultimate related package
  const hasUltimatePackage = userPackages.some((pkg) =>
    pkg.toLowerCase().includes("ultimate"),
  );

  // Check if user should see all packages (Ultimate user)
  const isUltimateUser =
    hasUltimatePackage || userTierName.toLowerCase().includes("ultimate");

  // Get accessible packages
  const accessiblePackages = packageSections.filter((pkg) => pkg.has_access);
  const lockedPackages = packageSections.filter((pkg) => !pkg.has_access);

  // User's main package (first accessible package or null if none)
  const userPackage = accessiblePackages[0] || null;

  // SIMPLE LOGIC: Use userTierName directly for display
  const displayPackageName = userTierName || "Subscribe To Unlock";

  // Get ALL predictions - both accessible and locked
  // For Ultimate users: show all predictions from all packages
  // For non-Ultimate users: show accessible predictions + locked predictions from other packages
  let allPredictions = [];

  if (isUltimateUser) {
    // Ultimate users see all predictions from all packages
    allPredictions = packageSections.flatMap((pkg) => [
      ...pkg.predictions.map((pred) => ({ ...pred, isAccessible: true })),
      ...pkg.locked_predictions.map((pred) => ({
        ...pred,
        isAccessible: true,
      })),
    ]);
  } else if (accessiblePackages.length > 0) {
    // Non-Ultimate users with some access: show their accessible predictions + locked predictions from other packages
    const accessiblePredictions = accessiblePackages.flatMap((pkg) =>
      pkg.predictions.map((pred) => ({ ...pred, isAccessible: true })),
    );

    const lockedPredictions = lockedPackages.flatMap((pkg) =>
      pkg.locked_predictions.map((pred) => ({ ...pred, isAccessible: false })),
    );

    allPredictions = [...accessiblePredictions, ...lockedPredictions];
  } else {
    // No access at all: show only locked predictions from Ultimate package
    const ultimatePackage = packageSections.find(
      (pkg) => pkg.package_name === "Ultimate",
    );
    allPredictions =
      ultimatePackage?.locked_predictions.map((pred) => ({
        ...pred,
        isAccessible: false,
      })) || [];
  }

  const hasAccess = accessiblePackages.length > 0;

  const getTypeColor = (type) => {
    switch (type) {
      case "L":
        return "text-[#FFDB5B]";
      case "S":
        return "text-lightGrey";
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

  if (isLoading || activeLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="bottomSmall">
      <Link to={`/dashboard/predictions`}>
        <div
          className={`rounded-xl font-primary min-h-auto mb-3 lg:min-h-[240px] md:p-3 p-1.5 shadow-sm border transition-colors duration-300 ${
            theme === "dark"
              ? "bg-darkBlack border-mediumBlack"
              : "bg-white border-lightestGrey"
          }`}
        >
          <CommonParagraph variant="small" className="font-semibold py-1">
            Predictions
          </CommonParagraph>

          <div
            className={`rounded-lg md:p-2 p-1 ${
              theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
            }`}
          >
            {/* Package Name */}
            <CommonParagraph
              variant="small"
              className="font-semibold text-center lg:block hidden"
            >
              {displayPackageName}
            </CommonParagraph>

            {/* Active Predictions */}
            <CommonParagraph
              variant="smaller"
              className={`${
                theme === "dark" ? "text-lightBlue" : "text-darkBlue"
              } 
          md:mb-2 mb-1 flex justify-center items-center gap-2 lg:flex hidden`}
            >
              <FaCircle size={8} className="text-green-600" />
              {active?.data?.total_active_predictions} Active Predictions
            </CommonParagraph>

            <CommonParagraph
              variant="large"
              className="font-semibold text-center lg:hidden"
            >
              {displayPackageName}
            </CommonParagraph>

            <CommonParagraph
              variant=""
              className={`${
                theme === "dark" ? "text-lightBlue" : "text-darkBlue"
              } 
          flex justify-center items-center gap-2 lg:hidden`}
            >
              <FaCircle size={8} className="text-green-600" />
              {active?.data?.total_active_predictions} Active Predictions
            </CommonParagraph>

            {/* ITEMS LIST - SHOWING ONLY TOP 3 */}
            <div className="space-y-1.5 mt-2">
              {allPredictions && allPredictions.length > 0 ? (
                allPredictions.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-row p-2 rounded-xl transition-all duration-200 gap-5 w-full ${
                      theme === "dark" ? "bg-darkBlack" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Logo */}
                      <div
                        className={`xl:w-10 xl:h-10 w-8 h-8 rounded-full flex items-center justify-center border-1 ${
                          theme === "dark"
                            ? "border-lightBlack"
                            : "border-lighterGrey"
                        }`}
                      >
                        {item?.image ? (
                          <img
                            src={item.image}
                            alt={item.game}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xl">
                            {item?.game?.[0]?.toUpperCase() || ""}
                          </div>
                        )}
                      </div>

                      {/* Game info */}
                      <div className="flex-1">
                        <div className="flex flex-row items-center justify-between mt-1 gap-1 w-full">
                          <div className="w-full">
                            <CommonParagraph
                              variant="smaller"
                              className={`font-semibold text-left capitalize ${
                                theme === "dark"
                                  ? "text-lightGrey"
                                  : "text-mediumBlack"
                              } ${!item.isAccessible ? "blur-xs" : ""}`}
                            >
                              {item.isAccessible
                                ? item?.prediction_desc
                                  ? item.prediction_desc.length > 50
                                    ? item.prediction_desc.slice(0, 50) + "..."
                                    : item.prediction_desc
                                  : "N/A"
                                : "Upgrade to unlock"}
                            </CommonParagraph>

                            {/* Game details */}
                            <div
                              className={`flex flex-row items-center gap-5 mt-1 ${
                                theme === "dark"
                                  ? "text-mediumGrey"
                                  : "text-darkGrey"
                              }`}
                            >
                              <div className="flex items-center">
                                <BsLightningChargeFill className="text-xs text-yellow-500" />
                                <CommonParagraph
                                  variant="smaller"
                                  className="ms-1 uppercase"
                                >
                                  {item?.game || "N/A"}
                                </CommonParagraph>
                              </div>

                              <div className="flex items-center">
                                <FaRegClock className="text-xs" />
                                <CommonParagraph
                                  variant="smaller"
                                  className="ms-1"
                                >
                                  {formatDate(item?.date_time)}
                                </CommonParagraph>
                              </div>
                            </div>
                          </div>

                          {/* Right: Unit + Type */}
                          <div className="flex items-center 2xl:gap-16 xl:gap-8 gap-5 justify-end">
                            <div className="w-[15px] text-center flex justify-center items-center">
                              <span
                                className={`xl:text-sm md:text-xs text-[10px] font-medium text-center ${getTypeColor(
                                  item?.prediction_type,
                                )}`}
                                style={{
                                  color:
                                    item?.prediction_type === "F"
                                      ? "#eb464c"
                                      : undefined,
                                }}
                              >
                                {item?.prediction_type || "N/A"}
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
                              {item?.unit_size
                                ? parseFloat(item.unit_size).toFixed(2)
                                : "0.00"}
                              %
                            </CommonParagraph>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // EMPTY STATE
                <div
                  className={`rounded-xl min-h-[19vh] flex justify-center items-center mb-0 p-6 text-center ${
                    theme === "dark"
                      ? "bg-darkBlack text-lightGrey"
                      : "bg-white text-darkGrey"
                  }`}
                >
                  <div>
                    <CommonParagraph variant="large" className="font-semibold">
                      <b>NO PREDICTIONS AVAILABLE</b>
                    </CommonParagraph>
                    <CommonParagraph
                      variant="smaller"
                      className="opacity-70 mt-1"
                    >
                      Predictions will appear here when available.
                    </CommonParagraph>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </CommonWrapper>
  );
};

export default PredictionSection;
