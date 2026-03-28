import { motion } from "framer-motion";

export default function BillingToggle({
  billingCycle,
  setBillingCycle,
  isDark,
}) {
  const isMonthly = billingCycle === "monthly";
  const isQuarterly = billingCycle === "quarterly";
  const isAnnual = billingCycle === "annual";

  return (
    <div className="flex justify-center items-center mb-2">
      <div className="relative">
        <div
          className={`relative p-1.5 rounded-full  transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-r from-mediumBlack to-darkBlack border border-slate-600 shadow-slate-900/30"
              : "bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-gray-900/10"
          } `}
        >
          <div className="relative flex rounded-xl ">
            <button
              className={`relative px-3 py-1.5 lg:px-6 cursor-pointer lg:py-3 text-xs lg:text-sm  font-semibold z-10 transition-all duration-300 rounded-xl ${
                isMonthly
                  ? "text-white transform"
                  : isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              } `}
              onClick={() => setBillingCycle("monthly")}
            >
              <span className="relative z-10">Monthly</span>
              {isMonthly && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0  rounded-full bg-gradient-to-r from-mediumBlue to-darkBlue shadow-lg"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </button>

            <button
              className={`relative px-3 cursor-pointer py-1.5 lg:px-6 lg:py-3 text-xs font-semibold z-10 transition-all duration-300 rounded-xl ${
                isQuarterly
                  ? "text-white transform"
                  : isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              } `}
              onClick={() => setBillingCycle("quarterly")}
            >
              <span className="relative z-10">Quarterly</span>
              <span
                className={`relative z-10 text-[10px] lg:text-xs px-2 py-0.5 rounded-full font-bold ml-1 ${
                  isQuarterly
                    ? "bg-white/20 text-white"
                    : isDark
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-100 text-emerald-600"
                }`}
              >
                -15%
              </span>

              {isQuarterly && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </button>

            <button
              className={`relative px-3 py-1.5 cursor-pointer lg:px-6 lg:py-3 text-xs lg:text-sm font-semibold z-10 transition-all duration-300 rounded-xl ${
                isAnnual
                  ? "text-white transform "
                  : isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Annual</span>
                <span
                  className={`text-[10px] lg:text-xs px-2 py-0.5 rounded-full font-bold ${
                    isAnnual
                      ? "bg-white/20 text-white"
                      : isDark
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  -25%
                </span>
              </span>
              {isAnnual && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </button>
          </div>

          <div
            className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
              isDark
                ? "bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100"
                : "bg-gradient-to-r from-blue-500/3 to-emerald-500/3 opacity-0 group-hover:opacity-100"
            }`}
          ></div>
        </div>

        <div className="text-center mb-2 mt-2">
          <motion.p
            key={billingCycle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {isAnnual
              ? "You're saving money with annual billing!"
              : isQuarterly
                ? "Save more with quarterly billing!"
                : "Switch to quarterly and save 15%"}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
