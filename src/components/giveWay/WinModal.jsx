// WinModal.jsx (আপডেটেড ভার্সন)
import { useTheme } from "@/hooks/custom/useTheme";
import toast from "react-hot-toast";

const WinModal = ({
  isOpen,
  onClose,
  prize = "",
  promoCode = "",
  isWin = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!isOpen) return null;

  const handleClaim = async () => {
    if (promoCode && promoCode !== "CLAIM_SOON") {
      try {
        await navigator.clipboard.writeText(promoCode);
        toast.success(`Copied: ${promoCode}`);
      } catch (err) {
        toast.error("Failed to copy. Please copy manually.");
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        className={`
          relative w-11/12 max-w-md rounded-3xl p-8 shadow-2xl
          border-4 border-transparent animate-in fade-in zoom-in duration-500
          ${isDark ? "bg-darkBlack" : "bg-white"}
          ${
            isWin
              ? "bg-gradient-to-br from-purple-900/20"
              : "bg-gradient-to-br from-red-900/20"
          }
        `}
      >
        <div className="absolute inset-0 rounded-3xl animate-pulse pointer-events-none" />

        <div className="relative z-10 text-center">
          <h2
            className={`text-4xl font-black mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {isWin ? "JACKPOT WIN! 🎉" : "Better Luck Next Time 😔"}
          </h2>

          {isWin ? (
            <>
              <p
                className={`text-xl mb-2 ${
                  isDark ? "text-purple-300" : "text-purple-600"
                } font-bold`}
              >
                You won:
              </p>

              <div className="text-5xl font-extrabold my-6 tracking-wider text-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,1)]">
                {prize || "Amazing Prize!"}
              </div>

              <p
                className={`text-lg mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Your promo code:
              </p>

              <div className="text-xl font-bold bg-blue-300 p-3 rounded-xl mb-6 break-all">
                {promoCode || "CLAIM_SOON"}
              </div>

              <button
                onClick={handleClaim}
                className="w-full py-5 px-8 rounded-2xl font-bold text-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 active:scale-95"
              >
                {promoCode ? "COPY & CLAIM" : "CLOSE"}
              </button>
            </>
          ) : (
            <>
              <p
                className={`text-2xl mb-8 mt-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } font-medium`}
              >
                {prize || "So close! Keep trying 🍀"}
              </p>

              <button
                onClick={onClose}
                className="w-full py-5 px-8 rounded-2xl font-bold text-lg bg-blue-500 cursor-pointer hover:bg-blue-400 text-white transition-all duration-300 active:scale-95"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinModal;
