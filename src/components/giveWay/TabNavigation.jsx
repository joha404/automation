import { useTheme } from "@/hooks/custom/useTheme";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const { theme } = useTheme();

  const tabContainerBg = theme === "dark" ? "bg-gray-800/50" : "bg-slate-100";
  const activeTabBg = theme === "dark" ? "bg-gray-700" : "bg-white";
  const activeTabText = theme === "dark" ? "text-white" : "text-slate-900";
  const inactiveTabText = theme === "dark" ? "text-gray-400" : "text-slate-600";
  const inactiveTabHover =
    theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-slate-200";

  return (
    <div className="w-full mb-6">
      <div className="w-full flex justify-center items-center">
        <div
          className={`relative inline-flex p-1 rounded-xl ${tabContainerBg} backdrop-blur-sm`}
          role="tablist"
        >
          <div
            className={`absolute top-1 bottom-1 rounded-lg ${activeTabBg} shadow-md transition-all duration-300 ease-in-out`}
            style={{
              left: activeTab === "slot" ? "0.25rem" : "50%",
              right: activeTab === "slot" ? "50%" : "0.25rem",
            }}
          />

          <button
            onClick={() => setActiveTab("slot")}
            className={`relative z-10 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-colors duration-300 rounded-lg whitespace-nowrap ${
              activeTab === "slot"
                ? activeTabText
                : `${inactiveTabText} ${inactiveTabHover}`
            }`}
            role="tab"
            aria-selected={activeTab === "slot"}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Slot Machine
            </span>
          </button>

          <button
            onClick={() => setActiveTab("giveaway")}
            className={`relative z-10 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-colors duration-300 rounded-lg whitespace-nowrap ${
              activeTab === "giveaway"
                ? activeTabText
                : `${inactiveTabText} ${inactiveTabHover}`
            }`}
            role="tab"
            aria-selected={activeTab === "giveaway"}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              Giveaway
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
