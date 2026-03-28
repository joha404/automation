import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import team from "@/assets/dashboard/team.jpg";
import { FaCircle, FaRegClock, FaRegFileAlt } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { useSidebar } from "@/hooks/custom/useSidebar";

const AutomationPrediction = ({ predictionList }) => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

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
        return "text-emerald-600 border border-emerald-600";
      case "loss":
        return "text-rose-600 border border-rose-600";
      default:
        return "text-lightBlue";
    }
  };

  const formatDateTime = (dateString) => {
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

  return (
    <CommonWrapper variant="">
      <div
        className={`rounded-xl font-primary sm:p-5 p-3 shadow-sm border transition-colors duration-300 w-full ${
          theme === "dark"
            ? "bg-darkBlack border-mediumBlack"
            : "bg-white border-lightestGrey"
        } `}
      >
        <CommonTitle variant="small" className="font-semibold pb-6">
          Active Predictions
        </CommonTitle>

        {predictionList && predictionList.length > 0 ? (
          <div className="space-y-3">
            {predictionList.map((prediction) => (
              <div
                key={prediction.id}
                className={`flex flex-row xl:p-5 p-2 rounded-xl transition-all duration-200 gap-5 w-full ${
                  theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
                }`}
              >
                {/* Left section */}
                <div className="flex justify-start items-start gap-3 w-full">
                  {/* Professional team logo with border and subtle shadow */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-1 mt-1.5 ${
                      theme === "dark"
                        ? "border-lightBlack"
                        : "border-lighterGrey"
                    }`}
                  >
                    <img
                      src={prediction?.image ? prediction.image : team}
                      alt="Team"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Game info */}
                  <div className="flex-1">
                    {/* Main content row */}
                    <div className="flex flex-row items-center justify-between gap-1 w-full">
                      {/* Left: Bet info */}
                      <div className="w-full">
                        <CommonParagraph
                          variant="smaller"
                          className={`font-semibold text-left capitalize ${
                            theme === "dark"
                              ? "text-lightGrey"
                              : "text-mediumBlack"
                          }`}
                        >
                          {prediction.prediction_desc}
                        </CommonParagraph>
                      </div>

                      {/* Center: Type */}
                      <div className="w-full flex justify-center">
                        <span
                          className={`xl:text-sm md:text-xs text-[10px] font-medium text-center ${getTypeColor(
                            prediction?.prediction_type,
                          )}`}
                          style={{
                            color:
                              prediction?.prediction_type === "F"
                                ? "#eb464c"
                                : undefined,
                          }}
                        >
                          {prediction?.prediction_type || "N/A"}
                        </span>
                      </div>

                      {/* Right: Unit and status */}
                      <div className="flex items-center gap-3 w-full justify-end">
                        <CommonParagraph
                          variant="smaller"
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-darkBlack"
                          }`}
                        >
                          ${prediction.unit_amount || "0.00"}
                        </CommonParagraph>
                        <div className="">
                          <CommonParagraph
                            variant="smaller"
                            className={`font-medium border ${
                              theme === "dark"
                                ? "text-green-500 border-green-800"
                                : "text-green-600 border-green-500"
                            }   px-2 py-1 rounded text-xs font-medium`}
                          >
                            {prediction.unit_size}%
                          </CommonParagraph>
                        </div>
                      </div>
                    </div>

                    {/* Game details */}
                    <div
                      className={`flex flex-row items-center gap-5 mt-2 ${
                        theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
                      }`}
                    >
                      {/* Icon for game */}
                      <div className="flex items-center">
                        <BsLightningChargeFill className="text-xs text-yellow-500" />
                        <CommonParagraph variant="smaller" className="ms-1">
                          {prediction.game}
                        </CommonParagraph>
                      </div>

                      {/* Icon for time */}
                      <div className="flex items-center">
                        <FaRegClock className="text-xs" />
                        <CommonParagraph variant="smaller" className="ms-1">
                          {formatDateTime(prediction.date_time)}
                        </CommonParagraph>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No active predictions message
          <div className="text-center py-8">
            <CommonParagraph
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            >
              No active predictions
            </CommonParagraph>
          </div>
        )}
      </div>
    </CommonWrapper>
  );
};

export default AutomationPrediction;

