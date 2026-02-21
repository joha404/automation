import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { FaRegClock } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

// ─── Dummy Data ───────────────────────────────────────────────
const DUMMY_ITEMS = [
  {
    id: 1,
    image: null,
    game: "NBA",
    prediction_desc: "Celtics -5.5 (-110) vs Miami Heat",
    date_time: "2025-02-10T19:30:00Z",
    unit_size: "3",
    game_status: "win",
    prediction_type: "PP",
  },
  {
    id: 2,
    image: null,
    game: "NFL",
    prediction_desc: "Chiefs -3.5 (-115) vs LA Rams",
    date_time: "2025-02-09T20:00:00Z",
    unit_size: "2",
    game_status: "win",
    prediction_type: "POTD",
  },
  {
    id: 3,
    image: null,
    game: "NHL",
    prediction_desc: "Bruins ML (-130) vs Toronto Maple Leafs",
    date_time: "2025-02-08T19:00:00Z",
    unit_size: "1",
    game_status: "loss",
    prediction_type: "S",
  },
  {
    id: 4,
    image: null,
    game: "NBA",
    prediction_desc: "Lakers +3.0 (-105) vs Golden State",
    date_time: "2025-02-07T21:00:00Z",
    unit_size: "2",
    game_status: "win",
    prediction_type: "L",
  },
  {
    id: 5,
    image: null,
    game: "MBL",
    prediction_desc: "Yankees -1.5 (+105) vs Boston Red Sox",
    date_time: "2025-02-06T18:05:00Z",
    unit_size: "1",
    game_status: "loss",
    prediction_type: "P",
  },
];
// ─────────────────────────────────────────────────────────────

const PastPrediction = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  const items = DUMMY_ITEMS;

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      ", " +
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <CommonWrapper variant="bottomSmall" className="mt-1">
      <Link to={`/dashboard/past-predictions`}>
        <div
          className={`rounded-xl font-primary px-1.5 shadow-sm border transition-colors duration-300 ${
            theme === "dark"
              ? "bg-[#021716] border-mediumBlack"
              : "bg-white border-lightestGrey"
          }`}
        >
          <CommonParagraph
            variant="small"
            className="font-semibold 2xl:mb-2 p-4"
          >
            Past Predictions
          </CommonParagraph>

          {/* ── Desktop ── */}
          <div className="lg:block hidden">
            <div className="space-y-1">
              {items.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-row xl:p-1.5 xlg:p-0.5 lg:p-1.5 p-1 rounded-xl transition-all duration-200 gap-5 w-full ${
                    theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
                  }`}
                >
                  <div className="flex justify-center items-center gap-1 w-full px-1.5">
                    {/* Logo */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-1 ${
                        theme === "dark"
                          ? "border-lightBlack"
                          : "border-lighterGrey"
                      }`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.game}
                          className="w-full h-full rounded-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xs">
                          {item.game?.[0]?.toUpperCase() || ""}
                        </div>
                      )}
                    </div>

                    {/* Game info */}
                    <div className="flex-1">
                      <div className="flex flex-row items-center justify-between gap-1 w-full">
                        {/* Left */}
                        <div className="w-full">
                          <CommonParagraph
                            variant="smaller"
                            className={`mb-1 font-semibold text-left capitalize ${
                              theme === "dark"
                                ? "text-lightGrey"
                                : "text-mediumBlack"
                            }`}
                          >
                            {item.prediction_desc
                              ? item.prediction_desc.length > 40
                                ? item.prediction_desc.slice(0, 40) + "..."
                                : item.prediction_desc
                              : "N/A"}
                          </CommonParagraph>

                          <div
                            className={`flex flex-row items-center gap-1 mt-1 ${theme === "dark" ? "text-mediumGrey" : "text-darkGrey"}`}
                          >
                            <div className="flex items-center">
                              <BsLightningChargeFill className="text-xs text-yellow-500" />
                              <CommonParagraph
                                variant="extraSmall"
                                className="ms-1 uppercase"
                              >
                                {item.game || "N/A"}
                              </CommonParagraph>
                            </div>
                            <div className="flex items-center">
                              <FaRegClock className="text-xs" />
                              <CommonParagraph
                                variant="extraSmall"
                                className="ms-1"
                              >
                                {formatDate(item.date_time)}
                              </CommonParagraph>
                            </div>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col">
                          <div className="flex flex-col items-end justify-end">
                            <span
                              className={`font-medium 2xl:text-xs text-[10px] -mb-0.5 ${theme === "dark" ? "text-white" : "text-darkBlack"}`}
                            >
                              {item.unit_size || "N/A"}%
                            </span>
                            <div className="text-right justify-end items-end mb-0.5">
                              <span
                                className={`capitalize px-1 py-0.5 rounded font-medium 2xl:text-xs text-[10px] border shadow-sm ${getTypeColor(item.game_status || "N/A")}`}
                              >
                                {item.game_status || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="text-center flex justify-center items-end">
                            <span
                              className={`2xl:text-xs text-[10px] -mt-0.5 font-medium ${getTypeColor(item.prediction_type || "N/A")}`}
                            >
                              {item.prediction_type || "N/A"}
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

          {/* ── Mobile ── */}
          <div className="lg:hidden block">
            <div className="md:space-y-1">
              {items.slice(0, 1).map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-row md:p-2 p-0.5 rounded-xl transition-all duration-200 gap-5 w-full ${
                    theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
                  }`}
                >
                  <div className="flex justify-start items-start gap-1 w-full">
                    {/* Logo */}
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border-1 mt-1.5 ${
                        theme === "dark"
                          ? "border-lightBlack"
                          : "border-lighterGrey"
                      }`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.game}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xs">
                          {item.game?.[0]?.toUpperCase() || ""}
                        </div>
                      )}
                    </div>

                    {/* Game info */}
                    <div className="flex-1">
                      <div className="flex flex-row items-center justify-between gap-1 w-full">
                        {/* Left */}
                        <div className="xlg:min-w-[80px] min-w-[100px]">
                          <span
                            className={`font-semibold text-[8px] text-left capitalize ${theme === "dark" ? "text-lightGrey" : "text-mediumBlack"}`}
                          >
                            {item.prediction_desc
                              ? item.prediction_desc.length > 10
                                ? item.prediction_desc.slice(0, 10) + "..."
                                : item.prediction_desc
                              : "N/A"}
                          </span>
                        </div>

                        {/* Center: Type */}
                        <div className="w-full flex justify-center">
                          <span
                            className={`text-[8px] font-medium ${getTypeColor(item.prediction_type)}`}
                          >
                            {item.prediction_type || "N/A"}
                          </span>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-1 w-full justify-end">
                          <span
                            className={`font-medium -mb-1.5 text-[8px] ${theme === "dark" ? "text-white" : "text-darkBlack"}`}
                          >
                            {item.unit_size || "N/A"}
                          </span>
                          <div className="text-right">
                            <span
                              className={`capitalize px-1 py-0.5 rounded font-medium text-[8px] border shadow-sm ${getTypeColor(item.game_status || "N/A")}`}
                            >
                              {item.game_status || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Game details */}
                      <div
                        className={`flex flex-row items-center gap-5 ${sidebarOpen ? "xl:mt-3.5" : "xl:mt-2"} xlg:mt-2 lg:mt-1.5 ${theme === "dark" ? "text-lightGrey" : "text-darkGrey"}`}
                      >
                        <div className="flex items-center">
                          <BsLightningChargeFill className="xlg:text-[10px] text-xs text-yellow-500" />
                          <span
                            className={`font-medium text-[8px] uppercase ${theme === "dark" ? "text-lightGrey" : "text-darkBlack"}`}
                          >
                            {item.game || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaRegClock className="text-[8px]" />
                          <span
                            className={`font-medium text-[8px] ${theme === "dark" ? "text-lightGrey" : "text-darkBlack"}`}
                          >
                            {formatDate(item.date_time)}
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
