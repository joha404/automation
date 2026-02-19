import { Copy, Check, X } from "lucide-react";
import React from "react";

export default function PromoCodePopUp({
  modalOverlayClass,
  modalBgClass,
  buttonBgClass,
  borderClass,
  mutedTextClass,
  textClass,
  cardBgClass,
  weeklyBgColor,
  weeklyTextColor,
  monthlyBgColor,
  monthlyTextColor,
  yearlyBgColor,
  yearlyTextColor,
  selectedWinner,
  closeClaimModal,
  handleCopy,
  copiedCode,
}) {
  // Helper function to get clean display text
  const getDisplayType = () => {
    if (
      selectedWinner.giveaway_type_display === "Exclusive - Ultimate Users Only"
    ) {
      return "Exclusive";
    }
    return selectedWinner.giveaway_type_display;
  };

  // Check if type is Exclusive
  const isExclusive =
    selectedWinner.giveaway_type_display === "Exclusive - Ultimate Users Only";
  const isWeekly = selectedWinner.giveaway_type_display === "Weekly";
  const isMonthly = selectedWinner.giveaway_type_display === "Monthly";

  const handleGotItClick = () => {
    const displayType = getDisplayType();

    // Open Gmail in new tab with pre-filled email
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=customersupport@techtakes.ai&su=Claim Winner Prize - ${selectedWinner.giveaway_title}&body=Hi,%0D%0A%0D%0AI won the ${displayType} Giveaway.%0D%0A%0D%0AMy Winner Code: ${selectedWinner.winner_code}%0D%0AGiveaway: ${selectedWinner.giveaway_title}%0D%0APrize Amount: $${selectedWinner.prize_amount}%0D%0A%0D%0APlease help me claim my prize.%0D%0A%0D%0AThank you!`;

    window.open(mailtoLink, "_blank");
    closeClaimModal();
  };

  return (
    <div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${modalOverlayClass} backdrop-blur-sm`}
        onClick={closeClaimModal}
      >
        <div
          className={`relative w-11/12 max-w-md p-6 rounded-2xl ${modalBgClass} border-2 shadow-2xl
              ${
                isWeekly
                  ? "border-green-400"
                  : isMonthly
                    ? "border-purple-400"
                    : "border-yellow-400"
              }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeClaimModal}
            className={`absolute top-4 right-4 p-2 rounded-lg ${buttonBgClass} ${borderClass} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
          >
            <X size={20} className={mutedTextClass} />
          </button>

          {/* Type Badge */}
          <div className="flex justify-center mb-4">
            <span
              className={`text-sm font-semibold px-4 py-1.5 rounded-full
                  ${
                    isWeekly
                      ? `${weeklyBgColor} ${weeklyTextColor}`
                      : isMonthly
                        ? `${monthlyBgColor} ${monthlyTextColor}`
                        : `${yearlyBgColor} ${yearlyTextColor}`
                  }`}
            >
              {getDisplayType()} Giveaway
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-xl lg:text-2xl font-bold text-center mb-2 ${textClass}`}
          >
            Congratulations! 🎉
          </h3>

          {/* Prize Amount */}
          <div
            className={`text-center text-3xl lg:text-4xl font-bold mb-4
                ${
                  isWeekly
                    ? "text-green-600"
                    : isMonthly
                      ? "text-purple-600"
                      : "text-yellow-600"
                }`}
          >
            ${selectedWinner.prize_amount}
          </div>

          {/* Message */}
          <p className={`text-center text-sm mb-6 ${mutedTextClass}`}>
            You've won {selectedWinner.giveaway_title}! Use the code below to
            claim your prize.
          </p>

          {/* Winner Code */}
          {selectedWinner.winner_code && (
            <div className="mb-6">
              <label
                className={`block text-xs font-semibold mb-2 ${mutedTextClass}`}
              >
                Your Winner Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={selectedWinner.winner_code}
                  readOnly
                  className={`flex-1 font-mono text-sm px-4 py-3 rounded-lg border ${borderClass} ${cardBgClass} ${textClass} focus:outline-none`}
                />
                <button
                  onClick={() => handleCopy(selectedWinner.winner_code)}
                  className={`p-3 rounded-lg ${buttonBgClass} ${borderClass} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                >
                  {copiedCode === selectedWinner.winner_code ? (
                    <Check
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                  ) : (
                    <Copy size={20} className={mutedTextClass} />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div
            className={`p-4 rounded-lg ${cardBgClass} border ${borderClass} mb-6`}
          >
            <p className={`text-xs ${mutedTextClass}`}>
              <strong className={textClass}>How to claim:</strong>
              <br />
              1. Copy the winner code above
              <br />
              2. Click "Got it!" to send email to our support team
              <br />
              3. Provide your winner code to receive your prize
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleGotItClick}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all
                ${
                  isWeekly
                    ? "bg-green-500 hover:bg-green-600"
                    : isMonthly
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                }`}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
