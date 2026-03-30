import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/custom/useTheme";
import { useGet } from "@/hooks/api/common/useGet";
import CloseButton from "../../components/auth/CloseButton";
import PopupHeader from "../../components/auth/ PopupHeader";
import PlanGroupToggle from "../../components/auth/PlanGroupToggle";
import BillingToggle from "../../components/auth/BillingToggle";
import PlansGrid from "../../components/auth/ PlansGrid";
import PlansSwiper from "../../components/auth/PlansSwiper";
import FooterNote from "../../components/auth/ FooterNote";
import ScreenLoader from "@/components/loaders/ScreenLoader";

export default function FreeTrialPopup({ isOpen, onClose }) {
  const [planGroup, setPlanGroup] = useState("Ultimate Access");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Fetch plans data from API
  const {
    data: apiPlansData,
    isLoading: planLoading,
    refetch,
  } = useGet("/plans/", {
    secure: true,
    queryKey: ["home-plans"],
  });

  if (!isOpen) return null;

  const normalizeRegionName = (region) => {
    return region
      .trim()
      .toLowerCase()
      .replace(/player\s+props/i, "player props")
      .replace(/\s+/g, " ");
  };

  // Transform API data to match component structure
  const transformPlansData = (apiData) => {
    if (!apiData?.data) return {};

    const transformedData = {};

    apiData.data.forEach((category) => {
      const plansByRegion = {};
      const featuresByRegion = {};

      // First pass: collect features from plans that have them
      category.plans.forEach((plan) => {
        const normalizedKey = normalizeRegionName(plan.region);

        if (plan.features && plan.features.length > 0) {
          featuresByRegion[normalizedKey] = plan.features;
        }
      });

      // Second pass: build plans
      category.plans.forEach((plan) => {
        const normalizedKey = normalizeRegionName(plan.region);
        const displayName = plan.region.trim().replace(/^PLayer/, "Player");

        if (!plansByRegion[normalizedKey]) {
          plansByRegion[normalizedKey] = {
            region: displayName,
            monthlyPrice: null,
            monthlyPackageId: null,
            quarterlyPrice: null,
            quarterlyPackageId: null,
            annualPrice: null,
            annualPackageId: null,
            features: featuresByRegion[normalizedKey] || [],
          };
        }

        // Check if monthly_price contains "3 months" for quarterly
        if (plan.monthly_price) {
          if (plan.monthly_price.includes("3 months")) {
            const cleanPrice = plan.monthly_price
              .replace(" / 3 months", "")
              .replace("/3 months", "")
              .trim();
            plansByRegion[normalizedKey].quarterlyPrice = cleanPrice;
            plansByRegion[normalizedKey].quarterlyPackageId = plan.package_id;
          } else {
            plansByRegion[normalizedKey].monthlyPrice = plan.monthly_price;
            plansByRegion[normalizedKey].monthlyPackageId = plan.package_id;
          }
        }

        if (plan.annual_price) {
          plansByRegion[normalizedKey].annualPrice = plan.annual_price;
          plansByRegion[normalizedKey].annualPackageId = plan.package_id;
        }
      });

      transformedData[category.title] = {
        title: category.title,
        subtitle: category.subtitle,
        plans: Object.values(plansByRegion),
      };
    });

    return transformedData;
  };

  // Create tabs from API data
  const createTabsFromData = (apiData) => {
    if (!apiData?.data) return [];

    return apiData.data.map((category) => ({
      id: category.title,
      title: category.title,
    }));
  };

  const plansData = transformPlansData(apiPlansData);
  const tabs = createTabsFromData(apiPlansData);
  const currentPlans = plansData[planGroup] || {
    title: "",
    subtitle: "",
    plans: [],
  };

  const isMonthly = billingCycle === "monthly";
  const isQuarterly = billingCycle === "quarterly";
  const isAnnual = billingCycle === "annual";

  const filteredPlans =
    currentPlans?.plans?.filter((plan) => {
      if (isMonthly) return plan.monthlyPrice;
      if (isQuarterly) return plan.quarterlyPrice;
      if (isAnnual) return plan.annualPrice;
      return false;
    }) || [];

  const isUltimateAccessTab = planGroup === "Ultimate Access";

  const allPlans = isUltimateAccessTab ? [...filteredPlans] : filteredPlans;
  const calculatePrice = (plan) => {
    if (!plan) return null;
    if (isMonthly) return plan.monthlyPrice || null;
    if (isQuarterly) return plan.quarterlyPrice || null;
    if (isAnnual) return plan.annualPrice || null;
    return null;
  };

  const calculateSavings = (plan) => {
    if (!plan) return 0;

    const monthlyPriceValue = plan.monthlyPrice
      ? parseFloat(plan.monthlyPrice.replace(/[^0-9.]/g, ""))
      : 0;
    const quarterlyPriceValue = plan.quarterlyPrice
      ? parseFloat(plan.quarterlyPrice.replace(/[^0-9.]/g, ""))
      : 0;
    const annualPriceValue = plan.annualPrice
      ? parseFloat(plan.annualPrice.replace(/[^0-9.]/g, ""))
      : 0;

    let savings = 0;
    if (isAnnual && monthlyPriceValue && annualPriceValue) {
      savings = monthlyPriceValue * 12 - annualPriceValue;
    } else if (isQuarterly && monthlyPriceValue && quarterlyPriceValue) {
      savings = monthlyPriceValue * 3 - quarterlyPriceValue;
    }

    // Don't return negative savings
    return savings > 0 ? savings : 0;
  };

  if (planLoading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className={`fixed inset-0 z-50 ${
                isDark
                  ? "bg-black/75 backdrop-blur-md"
                  : "bg-slate-900/40 backdrop-blur-sm"
              }`}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <ScreenLoader />
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 z-50 ${
              isDark
                ? "bg-black/75 backdrop-blur-md"
                : "bg-slate-900/40 backdrop-blur-sm"
            }`}
          />

          {/* Outer scroll wrapper */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ type: "spring", duration: 0.5 }}
                className={`relative w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden ${
                  isDark
                    ? "bg-[#0d0f14] border border-[#1e2130]"
                    : "bg-white border border-slate-200/80"
                }`}
              >
                <CloseButton onClick={onClose} isDark={isDark} />

                {/* Content */}
                <div className="relative p-5 sm:p-6">
                  <PopupHeader isDark={isDark} />

                  <PlanGroupToggle
                    planGroup={planGroup}
                    setPlanGroup={setPlanGroup}
                    isDark={isDark}
                    tabs={tabs}
                  />

                  <BillingToggle
                    billingCycle={billingCycle}
                    setBillingCycle={setBillingCycle}
                    isDark={isDark}
                  />

                  <PlansGrid
                    plans={allPlans}
                    calculatePrice={calculatePrice}
                    calculateSavings={calculateSavings}
                    isMonthly={isMonthly}
                    isQuarterly={isQuarterly}
                    isAnnual={isAnnual}
                    isDark={isDark}
                  />

                  <PlansSwiper
                    plans={allPlans}
                    calculatePrice={calculatePrice}
                    calculateSavings={calculateSavings}
                    isMonthly={isMonthly}
                    isQuarterly={isQuarterly}
                    isAnnual={isAnnual}
                    isDark={isDark}
                  />

                  <FooterNote isDark={isDark} />
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
