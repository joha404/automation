import { motion } from "framer-motion";

export default function PlanGroupToggle({
  planGroup,
  setPlanGroup,
  isDark,
  tabs,
}) {
  // If no tabs provided, return null
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center pb-1 -mt-3 lg:mt-0">
      <div className="relative flex p-1 rounded-lg">
        <motion.div
          className={`absolute bottom-1.5 h-0.5  ${
            isDark
              ? "border-b-2 border-lightBlue"
              : "border-b-2 border-mediumBlue"
          }`}
          style={{
            width: `calc(100% / ${tabs.length})`,
          }}
          animate={{
            x: `${tabs.findIndex((tab) => tab.id === planGroup) * 100}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
        {tabs.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setPlanGroup(tab.id)}
            className={`relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer ${
              planGroup === tab.id
                ? isDark
                  ? "text-lightBlue"
                  : "text-darkBlue"
                : isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-darkerGrey hover:text-gray-700"
            }`}
            style={{
              minWidth: "120px",
            }}
          >
            <span className="flex items-center justify-center xl:text-base text-sm">
              {tab?.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
