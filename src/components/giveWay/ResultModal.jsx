import React, { useState } from "react";
import { Copy, Check, X, Gift, TrendingDown, Loader2 } from "lucide-react";

const ResultModal = ({
  loading,
  show,
  isWin,
  prize,
  promoCode,
  onClose,
  fetchPromoCodes,
  isDark,
}) => {
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const safePrize =
    typeof prize === "number"
      ? `$${prize}`
      : typeof prize === "string"
        ? prize.trim()
        : isWin
          ? "Congratulations! You Won!"
          : "";

  // ✅ FIXED: Handle promoCode safely regardless of type
  const safePromoCode = (() => {
    if (typeof promoCode === "string") {
      return promoCode.trim().toUpperCase();
    }
    if (typeof promoCode === "object" && promoCode !== null) {
      // Try common property names for the actual code
      const code =
        promoCode.code ||
        promoCode.value ||
        promoCode.promoCode ||
        promoCode.name;
      return code ? String(code).trim().toUpperCase() : "";
    }
    return String(promoCode || "")
      .trim()
      .toUpperCase();
  })();

  const handleCopy = async () => {
    if (!safePromoCode) {
      onClose();
      return;
    }

    try {
      await navigator.clipboard.writeText(safePromoCode);
      setCopied(true);

      // ✅ Show copied message briefly
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleClaimOrClose = async () => {
    if (isWin && safePromoCode) {
      // ✅ Copy the code first
      await handleCopy();

      // ✅ Call fetchPromoCodes if it exists
      if (fetchPromoCodes) {
        try {
          await fetchPromoCodes();
        } catch (error) {
          console.error("Failed to fetch promo codes:", error);
        }
      }

      // ✅ Close after a delay to show the copied message
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${
          isDark ? "bg-black/70" : "bg-black/40"
        } backdrop-blur-md`}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border
          ${
            isDark
              ? "bg-slate-900 border-emerald-400/30"
              : "bg-white border-gray-200"
          }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition z-10
            ${
              isDark
                ? "text-gray-400 hover:bg-white/10"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`p-6 rounded-full ${
                isWin
                  ? isDark
                    ? "bg-emerald-500/20"
                    : "bg-emerald-100"
                  : isDark
                    ? "bg-gray-700/40"
                    : "bg-gray-100"
              }`}
            >
              {isWin ? (
                <Gift
                  size={42}
                  className={isDark ? "text-emerald-400" : "text-emerald-600"}
                />
              ) : (
                <TrendingDown
                  size={42}
                  className={isDark ? "text-gray-400" : "text-gray-500"}
                />
              )}
            </div>
          </div>

          {/* Title */}
          <h2
            className={`text-3xl font-extrabold mb-4 ${
              isWin
                ? isDark
                  ? "text-emerald-400"
                  : "text-emerald-600"
                : isDark
                  ? "text-gray-300"
                  : "text-gray-600"
            }`}
          >
            {isWin ? "🎉 Congratulations!" : "Try Again in 24 Hours"}
          </h2>

          {/* Prize */}
          <p
            className={`text-lg mb-3 font-semibold lg:mb-8 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {safePrize}
          </p>

          {/* Promo Code */}
          {isWin && safePromoCode && (
            <div className="space-y-2 lg:space-y-4">
              <p
                className={`text-sm uppercase tracking-widest font-semibold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                Your Promo Code
              </p>

              <div
                className={`flex items-center justify-between gap-3 p-4 rounded-xl border
                  ${
                    isDark
                      ? "bg-emerald-500/10 border-emerald-400/40"
                      : "bg-emerald-50 border-emerald-200"
                  }`}
              >
                <p
                  className={`text-xl lg:text-2xl font-black tracking-widest ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                  style={{ fontFamily: "monospace" }}
                >
                  {safePromoCode}
                </p>

                <button
                  onClick={handleCopy}
                  className="flex-shrink-0"
                  aria-label="Copy promo code"
                >
                  {copied ? (
                    <Check size={22} className="text-green-500" />
                  ) : (
                    <Copy
                      size={22}
                      className={
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }
                    />
                  )}
                </button>
              </div>

              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {copied ? "✓ Copied to clipboard" : "Click icon to copy"}
              </p>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleClaimOrClose}
            disabled={loading}
            className={`mt-8 w-full py-3 lg:py-4 rounded-xl font-bold uppercase tracking-wide transition flex items-center justify-center gap-2
              ${
                isWin
                  ? isDark
                    ? "bg-emerald-500 text-black hover:bg-emerald-400 disabled:bg-emerald-500/50"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-600/50"
                  : isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } ${loading ? "cursor-wait" : "cursor-pointer"}`}
          >
            {/* ✅ Show loading spinner when loading is true */}
            {loading && isWin && <Loader2 size={20} className="animate-spin" />}
            {isWin
              ? loading
                ? "Claiming..."
                : "Claim Reward"
              : "No Rewards Today"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
