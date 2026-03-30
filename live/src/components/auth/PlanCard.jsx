import { motion } from "framer-motion";
import { useState } from "react";
import FeatureItem from "./FeatureItem";
import { getFreeTrials } from "@/api/subscription/freeTrial";

export default function PlanCard({
  plan,
  index,
  finalPrice,
  savings,
  monthlyEquivalent,
  isMonthly,
  isAnnual,
  isDark,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      const data = {
        package_id: plan.id,
      };

      const response = await getFreeTrials(data);

      if (response.success) {
        console.log("Subscription response:", response);

        if (response.data?.url) {
          window.location.href = response.data.url;
        }
      }
    } catch (error) {
      console.error("Failed to start trial:", error);

      const errorMessage =
        error?.response?.data?.message ||
        "Failed to start trial. Please try again.";

      if (error?.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Parse savings to number for comparison
  const savingsValue = parseFloat(savings) || 0;
  const showSavings = !isMonthly && savingsValue > 0;

  return (
    <motion.div
      key={`${plan.name}-${index}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`group relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        plan.isPopular
          ? isDark
            ? "border border-blue-500/40 shadow-xl shadow-blue-900/20"
            : "border-2 border-blue-500 shadow-2xl shadow-blue-200/60"
          : isDark
            ? "border border-[#1e2130] hover:border-[#2a2d3e]"
            : "border border-slate-200 hover:border-blue-200 shadow-md hover:shadow-xl shadow-slate-100"
      } ${isDark ? "bg-[#111318]" : "bg-white"}`}
    >
      {plan.isPopular && isDark && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-purple-500" />
      )}
      {plan.isPopular && !isDark && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl" />
      )}

      <div
        className={`px-6 pt-8 pb-4 ${
          isDark
            ? plan.isPopular
              ? "bg-gradient-to-b from-blue-950/40 to-transparent"
              : ""
            : plan.isPopular
              ? "bg-gradient-to-b from-blue-50/80 to-white"
              : "bg-slate-50/60"
        }`}
      >
        <p
          className={`font-bold mb-3 uppercase tracking-widest text-xs text-center ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {plan.name}
        </p>

        <div
          className="flex flex-col items-center justify-center"
          style={{ minHeight: "72px" }}
        >
          <div className="flex items-baseline justify-center mb-1">
            <span
              className={`font-extrabold text-2xl lg:text-3xl tracking-tight ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              ${finalPrice}
            </span>
            <span
              className={`text-sm ml-2 font-medium ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {isAnnual ? "/year" : !isMonthly ? "/3 months" : "/month"}
            </span>
          </div>

          <div
            style={{ minHeight: "24px" }}
            className="flex items-center justify-center"
          >
            {showSavings && (
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    isAnnual
                      ? isDark
                        ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/20"
                        : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : isDark
                        ? "text-purple-400 bg-purple-500/15 border border-purple-500/20"
                        : "text-purple-700 bg-purple-50 border border-purple-200"
                  }`}
                >
                  Save ${savingsValue.toFixed(0)}
                </span>
                <span
                  className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  (${monthlyEquivalent}/mo)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative px-6">
        <div
          className={`h-px w-full ${isDark ? "bg-[#1e2130]" : "bg-slate-100"}`}
        />
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <div
            className={`w-20 h-px ${
              isDark
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "bg-gradient-to-r from-blue-400 to-purple-400"
            }`}
            mb-8
          />
        </div>
      </div>

      <div className="flex-grow px-6 py-4 space-y-3">
        {plan.features.map((feature, fi) => (
          <FeatureItem key={fi} feature={feature} isDark={isDark} />
        ))}
      </div>

      <div className="px-6 pb-5 pt-3 mt-auto">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`w-full px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 hover:scale-[1.02] text-sm ${
            plan.isPopular
              ? isDark
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50"
                : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300"
              : isDark
                ? "bg-[#161820] border border-[#252836] text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-[#1a1e2c]"
                : "bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm"
          } ${isLoading ? "opacity-70 cursor-not-allowed hover:scale-100" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                mb-8
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Start Free Trial"
          )}
        </button>
        <p
          className={`text-center mt-2 text-xs ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          7-day free trial · No credit card required
        </p>
      </div>

      {isDark && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-blue-600/4 to-purple-600/3" />
      )}
    </motion.div>
  );
}
