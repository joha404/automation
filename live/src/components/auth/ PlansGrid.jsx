import { motion } from "framer-motion";
import PlanCard from "./PlanCard";

export default function PlansGrid({
  plans,
  calculatePrice,
  calculateSavings,
  isMonthly,
  isQuarterly,
  isAnnual,
  isDark,
}) {
  return (
    <div className="hidden xl:block mb-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div
          className={`grid gap-4 md:gap-5 lg:gap-6 ${
            plans.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : plans.length === 2
                ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
                : plans.length === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {plans.map((plan, index) => {
            if (plan.isEnterprise) {
              return (
                <motion.div
                  key={`enterprise-api-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className={`group relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                    isDark
                      ? "border border-[#1e2130] hover:border-[#2a2d3e] bg-[#111318]"
                      : "border border-slate-200 hover:border-blue-200 shadow-md hover:shadow-xl shadow-slate-100 bg-white"
                  }`}
                >
                  {/* Header Section */}
                  <div
                    className={`px-6 pt-8 pb-4 ${isDark ? "" : "bg-slate-50/60"}`}
                  >
                    <p
                      className={`font-bold mb-3 uppercase tracking-widest text-xs text-center ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {plan.region}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  {isDark && (
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-blue-600/4 to-purple-600/3" />
                  )}
                </motion.div>
              );
            }
            const finalPrice = calculatePrice(plan);
            const priceValue = finalPrice
              ? parseFloat(finalPrice.replace(/[^0-9.]/g, ""))
              : 0;
            const monthlyEquivalent = (
              priceValue / (isAnnual ? 12 : isQuarterly ? 3 : 1)
            ).toFixed(2);

            const packageId = isMonthly
              ? plan.monthlyPackageId
              : isQuarterly
                ? plan.quarterlyPackageId
                : plan.annualPackageId;

            const monthlyPriceValue = plan.monthlyPrice
              ? parseFloat(plan.monthlyPrice.replace(/[^0-9.]/g, ""))
              : 0;
            const quarterlyPriceValue = plan.quarterlyPrice
              ? parseFloat(plan.quarterlyPrice.replace(/[^0-9.]/g, ""))
              : 0;
            const annualPriceValue = plan.annualPrice
              ? parseFloat(plan.annualPrice.replace(/[^0-9.]/g, ""))
              : 0;
            let calculatedSavings = 0;
            if (isAnnual && plan.monthlyPrice && plan.annualPrice) {
              calculatedSavings = monthlyPriceValue * 12 - annualPriceValue;
              if (calculatedSavings < 0) {
                calculatedSavings = 0;
              }
            } else if (
              isQuarterly &&
              plan.monthlyPrice &&
              plan.quarterlyPrice
            ) {
              calculatedSavings = monthlyPriceValue * 3 - quarterlyPriceValue;
              if (calculatedSavings < 0) {
                calculatedSavings = 0;
              }
            }
            const planCardData = {
              id: packageId,
              name: plan.region,
              features: plan.features || [],
              isPopular: plan.isPopular || false,
            };

            return (
              <PlanCard
                key={`${plan.region}-${index}-${packageId}`}
                plan={planCardData}
                index={index}
                finalPrice={priceValue.toFixed(2)}
                savings={Math.round(calculatedSavings)}
                monthlyEquivalent={monthlyEquivalent}
                isMonthly={isMonthly}
                isAnnual={isAnnual}
                isDark={isDark}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
