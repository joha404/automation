import { GiCheckMark } from "react-icons/gi";
import { CgClose } from "react-icons/cg";
import { useState } from "react";
import { getFreeTrials } from "@/api/subscription/freeTrial";

export default function MobilePlanCard({
  plan,
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

        // Stripe checkout page e redirect korun
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

  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex -mt-4 flex-col ${
        plan.isPopular
          ? isDark
            ? "border border-blue-500/40 shadow-xl shadow-blue-900/20"
            : "border-2 border-blue-500 shadow-xl shadow-blue-200"
          : isDark
            ? "border border-[#1e2130]"
            : "border border-slate-200 shadow-md shadow-slate-100"
      } ${isDark ? "bg-[#111318]" : "bg-white"}`}
    >
      {plan.isPopular && isDark && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-purple-500" />
      )}
      {plan.isPopular && !isDark && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
      )}

      <div
        className={`px-5 pt-7 pb-4 ${
          isDark
            ? plan.isPopular
              ? "bg-gradient-to-b from-blue-950/40 to-transparent"
              : ""
            : plan.isPopular
              ? "bg-gradient-to-b from-blue-50/80 to-white"
              : "bg-slate-50/50"
        }`}
      >
        <p
          className={`font-bold mb-2 uppercase tracking-widest text-xs text-center ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {plan.name}
        </p>
        <div className="flex items-baseline justify-center mb-1">
          <span
            className={`font-extrabold text-2xl tracking-tight ${
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
          style={{ height: "20px" }}
          className="flex items-center justify-center"
        >
          {!isMonthly && savings > 0 && (
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isAnnual
                    ? isDark
                      ? "text-emerald-400 bg-emerald-500/15"
                      : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                    : isDark
                      ? "text-purple-400 bg-purple-500/15"
                      : "text-purple-700 bg-purple-50 border border-purple-200"
                }`}
              >
                Save ${Math.round(savings)}
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

      <div className="relative px-5">
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
          />
        </div>
      </div>

      <div className="flex-grow px-5 py-4 space-y-3">
        {plan.features.map((feature, fi) => (
          <div key={fi} className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
                feature.included
                  ? isDark
                    ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/20"
                    : "text-emerald-600 bg-emerald-50 border border-emerald-200"
                  : isDark
                    ? "text-slate-600 bg-[#1a1d25]"
                    : "text-slate-300 bg-slate-50"
              }`}
            >
              {feature.included ? (
                <GiCheckMark className="w-2.5 h-2.5" />
              ) : (
                <CgClose className="w-2.5 h-2.5" />
              )}
            </div>
            <p
              className={`text-sm ${
                feature.included
                  ? isDark
                    ? "text-slate-300"
                    : "text-slate-700"
                  : isDark
                    ? "text-slate-600 line-through"
                    : "text-slate-300 line-through"
              }`}
            >
              {feature.text}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 pb-5 pt-3">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`w-full px-6 py-1.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 text-xs ${
            plan.isPopular
              ? isDark
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/30"
                : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200"
              : isDark
                ? "bg-[#161820] border border-[#252836] text-slate-300"
                : "bg-white border border-slate-200 text-slate-700 shadow-sm"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
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
          className={`text-center mt-2 text-[10px] ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          7-day free trial · No credit card required
        </p>
      </div>
    </div>
  );
}
