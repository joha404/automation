import { useTheme } from "@/hooks/custom/useTheme";
import CountdownTimer from "./CountdownTimer";

const SlotMachineCard = ({
  promo,
  claiming,
  handleClaimButtonClick,
  formatDate,
}) => {
  const { theme } = useTheme();

  const textClass = theme === "dark" ? "text-white" : "text-gray-900";
  const mutedTextClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBgClass = theme === "dark" ? "bg-mediumBlack/50" : "bg-gray-50";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div
      className={`relative p-3 sm:p-4 lg:p-5 rounded-xl ${cardBgClass} border ${borderClass} transition-all hover:border-purple-500/50 w-full`}
    >
      {/* Date Header */}
      <div className="absolute top-1.5 sm:top-2 left-3 sm:left-4">
        <p
          className={`text-[7px] sm:text-[8px] lg:text-[10px] ${mutedTextClass}`}
        >
          {formatDate(promo.valid_from)} - {formatDate(promo.valid_until)}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-2.5 pt-4 sm:pt-5">
        {/* Promo Code - Always Horizontal */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={`font-mono text-sm sm:text-base md:text-lg lg:text-xl font-bold ${textClass} ${
              promo?.claimed ? "blur-sm opacity-50" : ""
            } overflow-hidden text-ellipsis whitespace-nowrap`}
          >
            {promo.code}
          </p>

          {/* Discount Badge - Desktop Only */}
          <div className="hidden sm:block flex-shrink-0">
            <div className="bg-gradient-to-bl from-purple-600 to-pink-600 text-white font-bold text-xs md:text-base lg:text-lg rounded-lg px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 whitespace-nowrap">
              {Math.floor(promo.discount_value)}% Off
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2">
          {/* Action Button or Timer */}
          <div className="flex-1">
            {promo?.claimed ? (
              <button
                disabled
                className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg cursor-not-allowed ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-500"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                Claimed
              </button>
            ) : promo?.claimable === false ? (
              <div
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex flex-col items-center justify-center gap-1 ${
                  theme === "dark"
                    ? "bg-gray-700/50 border border-gray-600"
                    : "bg-gray-100 border border-gray-300"
                }`}
              >
                {promo?.claimable_after && (
                  <CountdownTimer
                    claimableAfter={promo.claimable_after}
                    theme={theme}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={() => handleClaimButtonClick(promo)}
                disabled={claiming === promo.id}
                className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  claiming === promo.id
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                    : "bg-blue-700 text-white cursor-pointer hover:bg-blue-600 hover:scale-105 active:scale-95"
                }`}
              >
                {claiming === promo.id ? (
                  <>
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span>Claiming...</span>
                  </>
                ) : (
                  "Claim"
                )}
              </button>
            )}
          </div>

          {/* Discount Badge - Mobile Only */}
          <div className="sm:hidden flex-shrink-0">
            <div className="bg-gradient-to-bl from-purple-600 to-pink-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
              {Math.floor(promo.discount_value)}% Off
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachineCard;
