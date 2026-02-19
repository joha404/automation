import { useTheme } from "@/hooks/custom/useTheme";
import { useEffect, useState } from "react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Check if user has already responded to cookie consent
    const consent = sessionStorage.getItem("cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    sessionStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  const handleManage = () => {
    alert(
      "Cookie Preferences:\n\n✓ Essential cookies (required)\n○ Analytics cookies\n○ Marketing cookies",
    );
  };

  if (!visible) return null;

  const isDark = theme === "dark";

  return (
    <>
      <section
        className={`
          fixed bottom-0 left-0 right-0
          sm:bottom-4 sm:left-auto sm:right-4
          sm:max-w-sm
          mx-auto sm:mx-0
          p-4 sm:p-5
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl z-[9999]
          transition-all duration-300 ease-in-out
          ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800 border-t sm:border border-gray-700"
              : "bg-white border-t sm:border border-gray-200"
          }
        `}
        style={{
          animation: "slideUp 0.4s ease-out",
        }}
      >
        {/* Header */}
        <h2
          className={`font-semibold text-base sm:text-lg text-center mb-2 sm:mb-3 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Cookie Notice
        </h2>

        {/* Description */}
        <p
          className={`text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 text-center ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          We use cookies to improve your browsing experience and analyze
          traffic.
          <button
            onClick={() =>
              alert(
                "Cookie Policy\n\nWe use cookies for:\n• Essential site functionality\n• Analytics and performance\n• Personalization",
              )
            }
            className={`ml-1 underline transition font-medium ${
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-500"
            }`}
          >
            Learn more
          </button>
        </p>

        {/* Manage Preferences Link - Mobile */}
        <button
          onClick={handleManage}
          className={`text-xs underline transition mb-3 block sm:hidden mx-auto ${
            isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Manage Preferences
        </button>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Manage Preferences - Desktop */}
          <button
            onClick={handleManage}
            className={`text-xs underline transition hidden sm:block ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Manage Preferences
          </button>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className={`
                flex-1 sm:flex-none
                text-sm px-4 py-2 rounded-lg 
                transition-all duration-200
                font-medium
                ${
                  isDark
                    ? "border border-gray-600 text-gray-300 hover:bg-gray-700 active:bg-gray-600"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }
              `}
            >
              Reject All
            </button>

            <button
              onClick={handleAccept}
              className={`
                flex-1 sm:flex-none
                text-sm px-4 py-2 rounded-lg 
                transition-all duration-200
                font-medium
                ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-900 hover:bg-gray-800 active:bg-black text-white shadow-lg"
                }
              `}
            >
              Accept All
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default CookieConsent;
