import { useTheme } from "@/hooks/custom/useTheme";

const GiveawayCardComponent = ({
  win,
  handleClaimClick,
  formatGiveawayType,
}) => {
  const { theme } = useTheme();

  const textClass = theme === "dark" ? "text-white" : "text-gray-900";
  const mutedTextClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBgClass = theme === "dark" ? "bg-mediumBlack/50" : "bg-gray-50";

  const weeklyBgColor = "bg-green-200";
  const monthlyBgColor = "bg-purple-200";
  const yearlyBgColor = "bg-yellow-200";
  const weeklyTextColor = "text-green-700";
  const monthlyTextColor = "text-purple-700";
  const yearlyTextColor = "text-yellow-700";

  const displayType = formatGiveawayType(
    win.giveaway_type_display || win.giveaway_type,
  );

  return (
    <div
      className={`relative w-full py-2 lg:py-4 px-3 lg:px-4 rounded-xl ${cardBgClass} transition-all
        ${
          displayType === "Weekly"
            ? "border-2 border-green-400"
            : displayType === "Monthly"
              ? "border-2 border-purple-400"
              : "border-2 border-yellow-400"
        }`}
    >
      <span
        className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[12px] lg:text-[14px] font-semibold px-3 py-1 rounded-full
          ${
            displayType === "Weekly"
              ? `${weeklyBgColor} ${weeklyTextColor}`
              : displayType === "Monthly"
                ? `${monthlyBgColor} ${monthlyTextColor}`
                : `${yearlyBgColor} ${yearlyTextColor}`
          }`}
      >
        {displayType}
      </span>

      <div className="flex justify-between items-start gap-2 lg:gap-4">
        <div className="flex-1 space-y-1">
          <p className={`text-[10px] lg:text-xs ${mutedTextClass}`}>
            {new Date(win.winner_announced_at).toLocaleDateString()}
          </p>

          <p className={`font-bold text-[13px] lg:text-lg ${textClass}`}>
            {win.giveaway_title}
          </p>

          <p className={`text-[10px] lg:text-sm ${mutedTextClass}`}>
            {win.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 lg:gap-4">
          <div
            className={`font-bold text-base lg:text-2xl
              ${
                displayType === "Weekly"
                  ? "text-green-600"
                  : displayType === "Monthly"
                    ? "text-purple-600"
                    : "text-yellow-600"
              }`}
          >
            ${Math.floor(win.prize_amount)}
          </div>

          <button
            onClick={() => handleClaimClick(win)}
            className={`cursor-pointer font-semibold text-[12px] lg:text-sm px-3 py-1 rounded-xl
              ${
                displayType === "Weekly"
                  ? "text-green-600 hover:text-green-600 bg-green-200 hover:bg-green-300"
                  : displayType === "Monthly"
                    ? "text-purple-600 hover:text-purple-600 bg-purple-200 hover:bg-purple-300"
                    : "text-yellow-600 hover:text-yellow-600 bg-yellow-200 hover:bg-yellow-300"
              }`}
          >
            Claim Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiveawayCardComponent;
