// components/GiveawayCard.jsx
import { useTheme } from "@/hooks/custom/useTheme";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { enterGiveaway } from "@/api/giveWay/giveWay.api";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import InfoModal from "./InfoModal";
import successToast from "@/hooks/custom/successToast";

const GiveawayCard = ({
  giveaway = {},
  loading = false,
  fetchGiveawayData,
}) => {
  const { theme } = useTheme();
  const [timerText, setTimerText] = useState("Loading...");
  const [entering, setEntering] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const navigate = useNavigate();
  const {
    id = 0,
    title = "Untitled",
    description = "No description.",
    giveaway_type = "WEEKLY",
    prize_amount = "0.00",
    rules = "No rules.",
    total_entries = 0,
    start_date = null,
    end_date = null,
    image = null,
    requires_ultimate_subscription = false,
    can_enter = { allowed: false, message: "Cannot enter" },
  } = giveaway;

  const badgeColors = {
    WEEKLY: {
      badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      amount: "text-emerald-400",
      info: "text-emerald-400",
      button:
        "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600",
    },
    MONTHLY: {
      badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      amount: "text-purple-400",
      info: "text-purple-400",
      button:
        "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600",
    },
    EXCLUSIVE: {
      badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      amount: "text-amber-400",
      info: "text-amber-400",
      button:
        "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600",
    },
  };

  const colors = badgeColors[giveaway_type] || badgeColors.WEEKLY;

  const textClass = theme === "dark" ? "text-white" : "text-gray-900";
  const mutedTextClass = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const skeletonClass =
    theme === "dark"
      ? "animate-pulse bg-gray-700/70 rounded"
      : "animate-pulse bg-gray-200/70 rounded";

  const cardClass = `relative rounded-2xl overflow-hidden border transition-all duration-300 p-4 lg:p-6 xl:min-h-[230px] 2xl:min-h-0 ${
    theme === "dark"
      ? "bg-darkBlack border-mediumBlack"
      : "bg-white border-lightestGrey"
  }`;

  useEffect(() => {
    if (loading || !start_date || !end_date) {
      setTimerText("Loading...");
      return;
    }

    const startTime = new Date(start_date).getTime();
    const endTime = new Date(end_date).getTime();

    if (isNaN(startTime) || isNaN(endTime)) {
      setTimerText("Invalid date");
      return;
    }

    const updateTimer = () => {
      const now = Date.now();

      if (now < startTime) {
        const daysToStart = Math.ceil(
          (startTime - now) / (1000 * 60 * 60 * 24),
        );
        setTimerText(
          `Starts in ${daysToStart} day${daysToStart > 1 ? "s" : ""}`,
        );
      } else if (now >= endTime) {
        setTimerText("Ended");
      } else {
        const distance = endTime - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const format = (n) => (n < 10 ? `0${n}` : n);

        setTimerText(
          `${days}d ${hours}h ${format(minutes)}m ${format(seconds)}s`,
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [loading, start_date, end_date]);

  const handleEnter = async () => {
    if (needsSubscription) {
      navigate("/dashboard/subscription-tiers");
      return;
    }

    if (!can_enter.allowed) {
      toast.error(can_enter.message || "You cannot enter this giveaway.");
      return;
    }

    setEntering(true);
    try {
      const res = await enterGiveaway(id);
      await fetchGiveawayData();

      if (res?.success) {
        successToast(
          res.message || `Successfully entered "${title}" giveaway! 🎉`,
        );
      } else {
        toast.error(res?.message || "Failed to enter the giveaway.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setEntering(false);
    }
  };

  const enterMessageMap = {
    "You have already entered this giveaway": "Already Entered",
    "Giveaway is not active": "Not Active",
  };

  const needsSubscription =
    !can_enter.allowed &&
    (can_enter?.message?.toLowerCase().includes("subscription") ||
      can_enter?.message?.toLowerCase().includes("ultimate"));

  const getButtonText = () => {
    if (entering) return "Entering...";

    if (needsSubscription) return "Need Subscription";

    if (!can_enter.allowed) {
      return enterMessageMap[can_enter?.message] || "Unavailable";
    }

    return "Enter Now";
  };

  const isEnterDisabled =
    entering || (!can_enter.allowed && !needsSubscription);

  // Handle info button click - CRITICAL FIX
  const handleInfoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfoModal(true);
  };

  // SKELETON LOADING STATE
  if (loading) {
    return (
      <div className={cardClass}>
        {/* Giveaway Type Badge - Absolute Top Center */}
        <div className="absolute -mt-3 lg:-mt-4 left-1/2 transform -translate-x-1/2 z-20">
          <div
            className={`h-7 w-32 lg:h-9 lg:w-44 ${skeletonClass} rounded-full`}
          />
        </div>

        <div className="relative z-10 top-[6px] space-y-4">
          {/* Prize Amount and Entries Row */}
          <div className="flex -mt-4 lg:-mt-6 items-center justify-between">
            {/* Prize Amount - Left */}
            <div className={`h-6 w-16 lg:h-8 lg:w-24 ${skeletonClass}`} />

            {/* Entries Badge - Right */}
            <div className="shrink-0">
              <div
                className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg
                py-1 px-2 lg:py-1.5 lg:px-4 border border-white/20 shadow-md
                flex items-center gap-2"
              >
                <div className={`h-3 w-10 lg:h-4 lg:w-12 ${skeletonClass}`} />
                <div className={`h-4 w-12 lg:h-5 lg:w-16 ${skeletonClass}`} />
              </div>
            </div>
          </div>

          {/* Status + Info Icon */}
          <div className="flex items-center gap-3 w-full mt-6">
            <div className="flex-1 min-w-0">
              <div
                className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg
                py-1 px-4 border border-white/20 shadow-md flex items-center justify-between gap-2"
              >
                <div className={`h-4 w-24 lg:h-5 lg:w-32 ${skeletonClass}`} />
                <div
                  className={`h-6 w-6 lg:h-8 lg:w-8 ${skeletonClass} rounded-full shrink-0`}
                />
              </div>
            </div>
          </div>

          {/* Enter Button */}
          <div
            className={`h-10 lg:h-14 w-full ${skeletonClass} rounded-xl mt-3 lg:mt-6`}
          />
        </div>
      </div>
    );
  }

  // ACTUAL CONTENT
  return (
    <>
      <div className={cardClass}>
        {/* Background Image with Overlay */}
        {image && (
          <>
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/75 to-black/50" />
          </>
        )}

        {/* Giveaway Type Badge - Absolute Top Center */}
        <div className="absolute -mt-3 lg:-mt-4 left-1/2 transform -translate-x-1/2 z-20">
          <span
            className={`inline-block ${colors.badge} border px-3 py-1.5 rounded-full text-sm lg:text-sm font-bold backdrop-blur-md whitespace-nowrap shadow-lg`}
          >
            {giveaway_type === "EXCLUSIVE"
              ? "Exclusive"
              : giveaway_type.charAt(0) + giveaway_type.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="relative z-10 top-[6px] xl:top-[45px] 2xl:top-[6px] space-y-4">
          <div className="flex -mt-4 lg:-mt-6 items-center justify-between gap-2 sm:gap-3">
            {/* Prize Amount - Left */}
            <h3
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black ${colors.amount} drop-shadow-lg whitespace-nowrap`}
            >
              ${Math.floor(prize_amount)}
            </h3>

            <div className="shrink-0">
              <div
                className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg
      py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 lg:py-2 lg:px-5 text-center 
      border border-white/20 shadow-md flex items-center gap-1.5 sm:gap-2"
              >
                <p
                  className={`text-[10px] sm:text-xs md:text-sm lg:text-base tracking-wider whitespace-nowrap ${
                    image ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Entries:
                </p>

                <p
                  className={`text-xs sm:text-sm md:text-base lg:text-lg font-bold whitespace-nowrap ${
                    image ? "text-white" : textClass
                  }`}
                >
                  {(total_entries ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Status + Entries */}
          <div className="flex items-center gap-3 w-full mt-6">
            {/* STATUS */}
            <div className="flex-1 min-w-0">
              <div
                className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg
                py-1 px-4 text-center border border-white/20 flex items-center justify-between gap-2"
              >
                <p
                  className={`font-mono font-bold text-base lg:text-lg whitespace-nowrap ${
                    image ? "text-white" : textClass
                  }`}
                >
                  {timerText}
                </p>

                <button
                  type="button"
                  onClick={handleInfoClick}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="shrink-0 hover:scale-110 transition-transform duration-200 cursor-pointer touch-manipulation"
                >
                  <FaInfoCircle
                    className={`text-xl lg:text-2xl ${colors.info} drop-shadow-lg pointer-events-none`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Enter Button */}
          <button
            onClick={handleEnter}
            disabled={isEnterDisabled}
            className={`relative w-full py-1.5 mt-3 lg:mt-6 lg:py-2 px-6 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm shadow-lg ${
              isEnterDisabled
                ? "bg-gray-600/50 text-gray-300 cursor-not-allowed"
                : `${colors.button} text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer`
            }`}
          >
            {entering ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Entering...
              </>
            ) : (
              <>
                {getButtonText()}
                {!isEnterDisabled && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <InfoModal
          description={description}
          rules={rules}
          mutedTextClass={mutedTextClass}
          colors={colors}
          textClass={textClass}
          theme={theme}
          title={title}
          setShowInfoModal={setShowInfoModal}
          prize_amount={prize_amount}
        />
      )}
    </>
  );
};

export default GiveawayCard;
