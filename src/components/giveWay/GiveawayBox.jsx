// GiveawayBox.jsx - Exactly Matching GiveawayCard Height
import { useTheme } from "@/hooks/custom/useTheme";
import { FaInfoCircle } from "react-icons/fa";
import { useState } from "react";
import InfoModal from "./InfoModal";

const GiveawayBox = ({
  type = "WEEKLY",
  prize_amount = "100.00",
  title = "new give way",
  description = "his for the ultimate automation users give way",
  statusText = "4d 16h 10m 40s",
  entries = 0,
  buttonText = "Already Entered",
  note = "need active subscription",
  rules = "No rules available.",
  loading = false,
  disabled = false,
  isScheduled = false,
  image = null,
  requires_ultimate_subscription = false,
}) => {
  const { theme } = useTheme();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const isScheduledEnded = isScheduled && statusText === "Event Ended";

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

  const colors = badgeColors[type] || badgeColors.WEEKLY;
  const highlight = type === "EXCLUSIVE";

  const textClass = theme === "dark" ? "text-white" : "text-gray-900";
  const mutedTextClass = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const skeletonClass =
    theme === "dark"
      ? "animate-pulse bg-gray-700/70 rounded"
      : "animate-pulse bg-gray-200/70 rounded";

  // EXACTLY matching GiveawayCard's cardClass
  const cardClass = `relative rounded-2xl overflow-hidden border transition-all duration-300 p-4 lg:p-6 xl:min-h-[230px] 2xl:min-h-0 ${
    highlight
      ? "ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/20"
      : "shadow-lg"
  } ${
    theme === "dark"
      ? "bg-darkBlack border-mediumBlack"
      : "bg-white border-lightestGrey"
  }`;

  // Handle info button click
  const handleInfoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfoModal(true);
  };

  // SKELETON LOADING STATE
  if (loading) {
    return (
      <div className={cardClass}>
        {/* Giveaway Type Badge */}
        <div className="absolute -mt-3 lg:-mt-4 left-1/2 transform -translate-x-1/2 z-20">
          <div
            className={`h-7 w-32 lg:h-9 lg:w-44 ${skeletonClass} rounded-full`}
          />
        </div>

        <div className="relative z-10 top-[6px] space-y-4">
          {/* Prize Amount and Info */}
          <div className="flex -mt-4 lg:-mt-6 items-center justify-between">
            <div className={`h-6 w-16 lg:h-8 lg:w-24 ${skeletonClass}`} />
            <div
              className={`h-6 w-6 lg:h-8 lg:w-8 ${skeletonClass} rounded-full shrink-0`}
            />
          </div>

          {/* Status + Entries */}
          <div className="flex items-center gap-3 w-full mt-6">
            <div className="flex-1 min-w-0">
              <div className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg py-1 px-4 text-center border border-white/20 shadow-md">
                <div className={`h-4 w-24 lg:h-5 lg:w-32 ${skeletonClass}`} />
              </div>
            </div>
            <div className="shrink-0">
              <div className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg py-1.5 px-4 text-center border border-white/20 shadow-md flex items-center gap-2">
                <div className={`h-3 w-10 lg:h-4 lg:w-12 ${skeletonClass}`} />
                <div className={`h-4 w-12 lg:h-5 lg:w-16 ${skeletonClass}`} />
              </div>
            </div>
          </div>

          {/* Button */}
          <div
            className={`h-10 lg:h-14 w-full ${skeletonClass} rounded-xl mt-3 lg:mt-6`}
          />
        </div>
      </div>
    );
  }

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

        {/* Giveaway Type Badge - EXACTLY like GiveawayCard */}
        <div className="absolute -mt-3 lg:-mt-4 left-1/2 transform -translate-x-1/2 z-20">
          <span
            className={`inline-block ${colors.badge} border px-3 py-1.5 rounded-full text-sm lg:text-sm font-bold backdrop-blur-md whitespace-nowrap shadow-lg`}
          >
            {type === "EXCLUSIVE"
              ? "Exclusive"
              : type.charAt(0) + type.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Content - EXACTLY like GiveawayCard with xl:top-[45px] */}
        <div
          className={`relative z-10 top-[6px] xl:top-[45px] 2xl:top-[6px] space-y-4 ${
            disabled && !isScheduled ? "blur-sm pointer-events-none" : ""
          }`}
        >
          {/* Prize Amount + Info Icon Row */}
          <div className="flex -mt-4 lg:-mt-6 items-center justify-between gap-2 sm:gap-3">
            {/* Prize Amount */}
            <h3
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black ${colors.amount} drop-shadow-lg whitespace-nowrap`}
            >
              ${prize_amount}
            </h3>

            {/* Info Icon */}
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

          {/* Status + Entries */}
          <div className="flex items-center gap-2 sm:gap-3 w-full mt-6">
            {/* STATUS */}
            <div className="flex-1 min-w-0">
              <div
                className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg
                py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 text-center border border-white/20 shadow-md"
              >
                <p
                  className={`font-mono font-bold text-sm sm:text-base md:text-lg lg:text-xl whitespace-nowrap ${
                    image ? "text-white" : textClass
                  }`}
                >
                  {statusText}
                </p>
              </div>
            </div>

            {/* ENTRIES */}
            <div className="shrink-0">
              <div
                className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg
                py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 text-center border border-white/20 shadow-md
                flex items-center gap-2"
              >
                <p
                  className={`text-xs sm:text-sm md:text-base uppercase tracking-wider whitespace-nowrap font-semibold ${
                    image ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Entries:
                </p>

                <p
                  className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap ${
                    image ? "text-white" : textClass
                  }`}
                >
                  {(entries ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Ultimate Subscription Warning */}
          {requires_ultimate_subscription && (
            <p className="text-xs lg:text-sm text-amber-400 font-semibold text-center backdrop-blur-sm bg-amber-500/10 py-1 px-3 rounded-lg border border-amber-500/30">
              ⭐ Requires Ultimate Subscription
            </p>
          )}

          {/* Enter Button - matching GiveawayCard */}
          <button
            disabled
            className={`relative w-full py-1.5 mt-3 lg:mt-6 lg:py-2 px-6 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm shadow-lg bg-gray-600/50 text-gray-300 cursor-not-allowed`}
          >
            {buttonText}
          </button>
        </div>

        {/* Coming Soon Overlay */}
        {disabled && !isScheduled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-20 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white mb-3 opacity-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-2xl font-bold text-white tracking-wider">
              Coming Soon
            </p>
          </div>
        )}

        {/* Scheduled Countdown Overlay */}
        {isScheduled && !isScheduledEnded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-20 rounded-2xl px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-400 mb-3 opacity-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-2xl font-bold text-white tracking-wider mb-2">
              Coming Soon
            </p>
            <p className="text-base font-mono text-yellow-400 font-semibold">
              {statusText}
            </p>
          </div>
        )}

        {/* Event Ended Overlay */}
        {isScheduledEnded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-400 mb-3 opacity-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-2xl font-bold text-white tracking-wider mb-2">
              Event Ended
            </p>
            <p className="text-base text-red-400 font-semibold">
              Try Next Time
            </p>
          </div>
        )}
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

export default GiveawayBox;
