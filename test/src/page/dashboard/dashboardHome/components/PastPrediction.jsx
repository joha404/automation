import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { FaRegClock } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { LuHistory } from "react-icons/lu";

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

const PastPrediction = ({ data }) => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  const items = data?.data?.results;

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

  // ─── Shared Card Content (used in both Desktop & Mobile) ───
  const PredictionCard = ({ item }) => (
    <div
      className={`flex flex-row xl:p-1 p-2 my-1.5 rounded-xl transition-all duration-200 gap-3 w-full ${
        theme === "dark" ? "bg-[#020C0B]" : "bg-lightestGrey"
      }`}
    >
      <div className="flex justify-center items-center gap-2 w-full px-1.5">
        {/* Logo */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 ${
            theme === "dark" ? "border-lightBlack" : "border-lighterGrey"
          }`}
        >
          {item?.image ? (
            <img
              src={item.image}
              alt={item.game}
              className="w-full h-full rounded-full object-contain"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xs">
              {item?.game?.[0]?.toUpperCase() || ""}
            </div>
          )}
        </div>

        {/* Game info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-row items-center justify-between gap-1 w-full">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <CommonParagraph
                variant="smaller"
                className={`mb-1 font-semibold text-left capitalize truncate ${
                  theme === "dark" ? "text-lightGrey" : "text-mediumBlack"
                }`}
              >
                {item.prediction_desc
                  ? item?.prediction_desc.length > 35
                    ? item?.prediction_desc?.slice(0, 35) + "..."
                    : item.prediction_desc
                  : "N/A"}
              </CommonParagraph>

              <div
                className={`flex flex-row items-center gap-2 mt-0.5 ${
                  theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <BsLightningChargeFill className="text-xs text-yellow-500" />
                  <CommonParagraph
                    variant="extraSmall"
                    className="ms-1 uppercase"
                  >
                    {item.game || "N/A"}
                  </CommonParagraph>
                </div>
                <div className="flex items-center gap-0.5">
                  <FaRegClock className="text-xs" />
                  <CommonParagraph variant="extraSmall" className="ms-1">
                    {formatDate(item.date_time)}
                  </CommonParagraph>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span
                className={`font-medium text-xs text-center -mb-0.5 ${
                  theme === "dark" ? "text-white" : "text-darkBlack"
                }`}
              >
                {item.unit_size || "N/A"}%
              </span>
              <div className="text-center mb-0.5">
                <span
                  className={`capitalize px-1.5 py-0.5 rounded font-medium text-xs border shadow-sm ${getTypeColor(
                    item.game_status || "N/A",
                  )}`}
                >
                  {item.game_status || "N/A"}
                </span>
              </div>
              <span
                className={`text-xs text-center font-medium ${getTypeColor(
                  item.prediction_type || "N/A",
                )}`}
              >
                {item?.prediction_type || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
          {/* Header */}
          <div className="flex items-center gap-2 p-2">
            <LuHistory
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            />
            <CommonParagraph variant="small" className="font-semibold py-1">
              Past Predictions
            </CommonParagraph>
          </div>

          {/* ── Desktop ── */}
          <div className="lg:block hidden">
            <div className="space-y-1">
              {items?.slice(0, 5).map((item) => (
                <PredictionCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* ── Mobile ── */}
          <div className="lg:hidden block">
            <div className="space-y-1">
              {items?.slice(0, 5).map((item) => (
                <PredictionCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </CommonWrapper>
  );
};

export default PastPrediction;
