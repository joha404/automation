import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import team from "@/assets/dashboard/team.jpg";
import { FaCircle, FaRegClock, FaRegFileAlt } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { PiClockDuotone } from "react-icons/pi";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { Link } from "react-router-dom";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { useGet } from "@/hooks/api/common/useGet";

const PastPrediction = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  // Use the custom hook to fetch data
  const { data, isLoading, error } = useGet("/past-predictions/");

  const items = data?.data?.results || [];
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

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="bottomSmall" className="mt-1">
      <Link to={`/dashboard/past-predictions`}>
        <div
          className={`rounded-xl font-primary  px-1.5  shadow-sm border transition-colors duration-300 ${
            theme === "dark"
              ? "bg-darkBlack border-mediumBlack"
              : "bg-white border-lightestGrey"
          } `}
        >
          <CommonParagraph
            variant="small"
            className="font-semibold 2xl:mb-2 p-1 "
          >
            Past Predictions
          </CommonParagraph>
          <div className="lg:block hidden">
            <div className="space-y-1">
              {items?.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-row xl:p-1.5 xlg:p-0.5 lg:p-1.5  p-1 rounded-xl transition-all duration-200 gap-5 w-full ${
                    theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
                  }`}
                >
                  {/* Left section */}
                  <div className="flex justify-center items-center gap-1 w-full px-1.5">
                    {/* Professional team logo with border and subtle shadow */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-1  ${
                        theme === "dark"
                          ? "border-lightBlack"
                          : "border-lighterGrey"
                      }`}
                    >
                      {item?.image ? (
                        <img
                          src={item?.image}
                          alt={item?.game}
                          className="w-full h-full rounded-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-base">
                          <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xs">
                            {item?.game?.[0]?.toUpperCase() || ""}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Game info */}
                    <div className="flex-1 ">
                      {/* Main content row */}
                      <div className="flex flex-row items-center justify-between gap-1 w-full">
                        {/* Left: Bet info */}
                        <div className="w-full">
                          <CommonParagraph
                            variant="smaller"
                            className={`mb-1 font-semibold text-left capitalize ${
                              theme === "dark"
                                ? "text-lightGrey"
                                : "text-mediumBlack"
                            }`}
                          >
                            {item?.prediction_desc
                              ? item.prediction_desc.length > 40
                                ? item.prediction_desc.slice(0, 40) + "..."
                                : item.prediction_desc
                              : "N/A"}
                          </CommonParagraph>

                          {/* Game details */}
                          <div
                            className={`flex flex-row items-center gap-1 mt-1 ${
                              theme === "dark"
                                ? "text-mediumGrey"
                                : "text-darkGrey"
                            }`}
                          >
                            {/* Icon for type */}
                            <div className="flex items-center">
                              <BsLightningChargeFill className="text-xs text-yellow-500" />
                              <CommonParagraph
                                variant="extraSmall"
                                className="ms-1 uppercase"
                              >
                                {item?.game || "N/A"}
                              </CommonParagraph>
                            </div>

                            {/* Icon for time */}
                            <div className="flex items-center">
                              <FaRegClock className="text-xs" />
                              <CommonParagraph
                                variant="extraSmall"
                                className="ms-1"
                              >
                                {formatDate(item?.date_time)}
                              </CommonParagraph>
                            </div>
                          </div>
                        </div>

                        {/* Right: Unit and status */}
                        <div className="flex flex-col ">
                          <div className=" flex flex-col items-end justify-end ">
                            <span
                              className={`font-medium 2xl:text-xs text-[10px] -mb-0.5 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-darkBlack"
                              }`}
                            >
                              {item?.unit_size || "N/A"}%
                            </span>
                            <div className=" text-right justify-end items-end mb-0.5">
                              <span
                                className={`capitalize px-1 py-0.5 rounded font-medium 2xl:text-xs text-[10px] border shadow-sm ${getTypeColor(
                                  item?.game_status || "N/A",
                                )}`}
                              >
                                {item?.game_status || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="text-center flex justify-center items-end">
                            <span
                              className={`2xl:text-xs text-[10px] -mt-0.5 font-medium  ${getTypeColor(
                                item?.prediction_type || "N/A",
                              )}`}
                            >
                              {item?.prediction_type || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden block">
            <div className="md:space-y-1">
              {items?.slice(0, 1).map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-row md:p-2 p-0.5 rounded-xl transition-all duration-200 gap-5 w-full ${
                    theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
                  }`}
                >
                  {/* Left section */}
                  <div className="flex justify-start items-start gap-1 w-full">
                    {/* Professional team logo with border and subtle shadow */}
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border-1 mt-1.5 ${
                        theme === "dark"
                          ? "border-lightBlack"
                          : "border-lighterGrey"
                      }`}
                    >
                      {item?.image ? (
                        <img
                          src={item?.image}
                          alt={item?.game}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-base">
                          <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xs">
                            {item?.game?.[0]?.toUpperCase() || ""}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Game info */}
                    <div className="flex-1">
                      {/* Main content row */}
                      <div className="flex flex-row items-center justify-between gap-1 w-full">
                        {/* Left: Bet info */}
                        <div className="xlg:min-w-[80px] min-w-[100px]">
                          <span
                            className={`font-semibold text-[8px] text-left capitalize  ${
                              theme === "dark"
                                ? "text-lightGrey"
                                : "text-mediumBlack"
                            }`}
                          >
                            {item?.prediction_desc
                              ? item.prediction_desc.length > 10
                                ? item.prediction_desc.slice(0, 10) + "..."
                                : item.prediction_desc
                              : "N/A"}
                          </span>
                        </div>

                        {/* Center: Type */}
                        <div className="w-full flex justify-center">
                          <span
                            className={`text-[8px]  font-medium ${getTypeColor(
                              item.prediction_type,
                            )}`}
                          >
                            {item?.prediction_type || "N/A"}
                          </span>
                        </div>

                        {/* Right: Unit and status */}
                        <div className="flex items-center gap-1 w-full justify-end ">
                          <span
                            className={`font-medium -mb-1.5  text-[8px]  ${
                              theme === "dark" ? "text-white" : "text-darkBlack"
                            }`}
                          >
                            {item?.unit_size || "N/A"}
                          </span>
                          <div className=" text-right">
                            <span
                              className={`capitalize px-1 py-0.5 rounded font-medium text-[8px]  border shadow-sm ${getTypeColor(
                                item?.game_status || "N/A",
                              )}`}
                            >
                              {item?.game_status || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Game details */}
                      <div
                        className={`flex flex-row items-center gap-5 ${
                          sidebarOpen ? "xl:mt-3.5" : "xl:mt-2"
                        } xlg:mt-2 lg:mt-1.5 ${
                          theme === "dark" ? "text-lightGrey" : "text-darkGrey"
                        }`}
                      >
                        {/* Icon for type */}
                        <div className="flex items-center">
                          <BsLightningChargeFill className="xlg:text-[10px] text-xs text-yellow-500" />
                          <span
                            className={`font-medium text-[8px]  uppercase ${
                              theme === "dark"
                                ? "text-lightGrey"
                                : "text-darkBlack"
                            }`}
                          >
                            {item?.game || "N/A"}
                          </span>
                        </div>

                        {/* Icon for time */}
                        <div className="flex items-center">
                          <FaRegClock className="text-[8px] " />
                          <span
                            className={`font-medium text-[8px]  ${
                              theme === "dark"
                                ? "text-lightGrey"
                                : "text-darkBlack"
                            }`}
                          >
                            {formatDate(item?.date_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </CommonWrapper>
  );
};

export default PastPrediction;
