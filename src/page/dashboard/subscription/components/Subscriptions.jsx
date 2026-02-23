import { useTheme } from "@/hooks/custom/useTheme";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { GiCheckMark } from "react-icons/gi";
import SubmitButton from "@/components/buttons/SubmitButton";
import { CgClose } from "react-icons/cg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { usePost } from "@/hooks/api/common/usePost";
import { useNavigate } from "react-router-dom";
import "swiper/css/bundle";

const Subscriptions = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [modalPayload, setModalPayload] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [agreements, setAgreements] = useState({
    accept: false,
    non_us_risk: false,
    us_risk: false,
  });

  const toggleAgreement = (key) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allChecked = Object.values(agreements).every(Boolean);

  // Track Facebook Pixel events to prevent duplicates
  const fbTrackedRef = useRef({
    addToCart: false,
    initiateCheckout: new Set(),
  });

  const [billingCycle, setBillingCycle] = useState("monthly");

  // Use the GET hook to fetch subscriptions
  const {
    data: plansData,
    isLoading: planLoading,
    refetch,
  } = useGet("/plans/", {
    secure: true,
    queryKey: ["home-plans"],
  });

  const { data: response, isLoading: isActiveLoading } = useGet(
    "/my-subscription/",
    {
      queryKey: ["active-subscription"],
      secure: true,
    },
  );

  const sub = response?.data || [];

  const [selectedCheckoutId, setSelectedCheckoutId] = useState(null);
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  //  FIXED: AddToCart fires ONLY on page load (once)
  useEffect(() => {
    if (
      !planLoading &&
      plansData?.data?.length &&
      typeof window !== "undefined" &&
      window.fbq &&
      !fbTrackedRef.current.addToCart
    ) {
      const firstCategory = plansData.data[0];
      const firstPlan = firstCategory?.plans?.[0];

      const price = Number(
        String(firstPlan?.monthly_price || "").replace(/[^0-9.]/g, ""),
      );

      if (price > 0) {
        window.fbq("track", "AddToCart", {
          value: price,
          currency: "USD",
          content_ids: [String(firstPlan.package_id)],
          content_type: "product",
          content_name: `${firstCategory.title} - ${firstPlan.region}`,
        });

        console.log("🟢 AddToCart fired on page load");
        fbTrackedRef.current.addToCart = true;
      }
    }
  }, [planLoading, plansData]);

  const { mutate: checkout, isPending: isCheckoutPending } = usePost(null, {
    secure: true,
    onSuccess: (data) => {
      const checkoutUrl = data?.data?.url;

      if (checkoutUrl) {
        console.log("✅ Redirecting to checkout:", checkoutUrl);
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 300);
      }
    },
    onError: (error) => {
      console.error("Checkout API error:", error);
    },
  });

  const { mutate: cancelSubscription, isPending: isCancelPending } = usePost(
    selectedCancelId ? `/cancel_subscription/${selectedCancelId}` : "",
    {
      secure: true,
      onSuccess: (data) => {
        navigate("/package/cancel");
        refetch && refetch();
      },
    },
  );

  const { mutateAsync: completeReferral, isPending: referalPending } = usePost(
    "/referrals/complete/",
    {
      secure: true,
    },
  );

  const [checkoutInitiated, setCheckoutInitiated] = useState(false);
  const { mutateAsync: submitAgreements } = usePost("/automation-policy/", {
    secure: true,
  });

  const handleModalConfirm = async () => {
    if (!modalPayload || !allChecked) return;

    setModalLoading(true);

    try {
      await submitAgreements({
        accept: true,
        non_us_risk: true,
        us_risk: true,
        for_automation_legal:
          "I hereby accept all TechTakes automation terms and conditions.",
      });

      if (modalPayload.action === "checkout") {
        await handleCheckout(modalPayload.packageId, modalPayload.price);
      }

      setOpenModal(false);
      setModalPayload(null);
      setAgreements({
        accept: false,
        non_us_risk: false,
        us_risk: false,
      });
    } catch (err) {
      console.error("Agreement submission failed", err);
    } finally {
      setModalLoading(false);
    }
  };

  const onClose = () => {
    setOpenModal(false);
    setModalLoading(false);
    setModalPayload(null);
  };

  const handleCheckout = async (planId, price) => {
    if (!planId) return;

    // Facebook Pixel tracking
    if (
      typeof window !== "undefined" &&
      window.fbq &&
      price > 0 &&
      !fbTrackedRef.current.initiateCheckout.has(planId)
    ) {
      window.fbq("track", "InitiateCheckout", {
        content_ids: [String(planId)],
        content_type: "product",
        content_name: "Subscription Checkout",
        value: price,
        currency: "USD",
      });
      fbTrackedRef.current.initiateCheckout.add(planId);
    }

    try {
      await processReferral();
      checkout({
        url: `/subscription/${planId}/checkout/`,
        data: { plan_id: planId },
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      fbTrackedRef.current.initiateCheckout.delete(planId);
    }
  };

  const processReferral = async () => {
    const referralCode = localStorage.getItem("referral_code");
    const referralProcessed = localStorage.getItem("referral_processed");

    if (referralCode && !referralProcessed) {
      await completeReferral({ referral_code: referralCode });

      localStorage.removeItem("referral_code");
      localStorage.setItem("referral_processed", "true");
    }
  };

  useEffect(() => {
    if (checkoutInitiated && !isCheckoutPending) {
      setCheckoutInitiated(false);
    }
  }, [isCheckoutPending, checkoutInitiated]);

  const handleCancel = (planId) => {
    if (!planId) return;
    setSelectedCancelId(planId);
    cancelSubscription();
  };

  const isUltimatePackage = (planRegion) => {
    return planRegion === "Ultimate Automation";
  };

  // Handle Contact Us for Enterprise API
  const handleContactUs = () => {
    window.location.href =
      "mailto:customersupport@techtakes.ai?subject=Hyper Picks Enterprise API Demo Request";
  };

  // Normalize region names to handle typos and inconsistencies
  const normalizeRegionName = (region) => {
    return region
      .trim()
      .toLowerCase()
      .replace(/player\s+props/i, "player props")
      .replace(/\s+/g, " ");
  };

  // Transform the API data to match your component structure
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

  const createTabsFromData = (apiData) => {
    if (!apiData?.data) return [];

    return apiData.data.map((category) => ({
      id: category.title,
      title: category.title,
    }));
  };

  const plans = transformPlansData(plansData);
  const tabs = createTabsFromData(plansData);

  const [activeTab, setActiveTab] = useState(
    tabs[0]?.title || "Ultimate Access",
  );
  const currentPlans = plans[activeTab] || {
    title: "",
    subtitle: "",
    plans: [],
  };

  const isMonthly = billingCycle === "monthly";
  const isQuarterly = billingCycle === "quarterly";
  const isAnnual = billingCycle === "annual";

  if (planLoading || isActiveLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  // Filter plans based on billing cycle
  const filteredPlans =
    currentPlans?.plans?.filter((plan) => {
      if (isMonthly) return plan.monthlyPrice;
      if (isQuarterly) return plan.quarterlyPrice;
      if (isAnnual) return plan.annualPrice;
      return false;
    }) || [];

  // Add Enterprise API card only for Ultimate Access tab
  const isUltimateAccessTab = activeTab === "Ultimate Access";
  const enterpriseCard = {
    region: "Hyper Picks Enterprise API",
    isEnterprise: true,
    features: [
      { text: "Real-time sports betting API.", included: true },
      { text: "High-accuracy prediction models.", included: true },
      { text: "Custom models, SLAs, white-label.", included: true },
    ],
  };

  // Combine regular plans with enterprise card
  const allPlans = isUltimateAccessTab
    ? [...filteredPlans, enterpriseCard]
    : filteredPlans;

  const planCount = allPlans.length;

  return (
    <>
      <CommonWrapper>
        <div
          className={`rounded-xl font-primary xl:p-5 lg:p-3 p-2 shadow-sm border h-full ${
            theme === "dark" ? "bg-[#021716] " : "bg-white border-lightestGrey"
          }`}
        >
          {/* Animated Tabs */}
          <div className="flex justify-center pb-5">
            {/* Desktop Tabs */}
            <div className="hidden sm:block">
              <div className="relative flex p-1 rounded-lg">
                <motion.div
                  className={`absolute bottom-0 h-0.5 ${
                    theme === "dark"
                      ? "border-b-2 border-[#0A9087]"
                      : "border-b-2 border-[#0A9087]"
                  }`}
                  style={{
                    width: `calc(100% / ${tabs.length})`,
                  }}
                  animate={{
                    x: `${
                      tabs.findIndex((tab) => tab.id === activeTab) * 100
                    }%`,
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
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative z-10 px-6 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? theme === "dark"
                          ? "text-[#0A9087]"
                          : "text-[#0A9087]"
                        : theme === "dark"
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

            {/* Mobile Swiper Tabs */}
            <div className="sm:hidden w-full px-4">
              <Swiper
                slidesPerView={"auto"}
                centeredSlides={false}
                spaceBetween={12}
                initialSlide={tabs.findIndex((tab) => tab.id === activeTab)}
                onSlideChange={(swiper) =>
                  setActiveTab(tabs[swiper.activeIndex]?.id || tabs[0]?.id)
                }
                className="mobile-tabs-swiper"
              >
                {tabs.map((tab) => (
                  <SwiperSlide key={tab.id} style={{ width: "auto" }}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer border-b-2 ${
                        activeTab === tab.id
                          ? theme === "dark"
                            ? "border-b-[#0A9087] text-[#0A9087] shadow-md"
                            : "border-b-[#0A9087] text-[#0A9087] shadow-md"
                          : theme === "dark"
                            ? "text-gray-400 border-b-mediumBlack hover:text-gray-200 "
                            : "text-darkerGrey border-b-gray-100 hover:text-gray-70"
                      }`}
                    >
                      {tab?.title}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="">
            {/* Plan Title and Subtitle */}
            <div className="text-center mb-2">
              <CommonTitle
                variant="small"
                className={`${
                  theme === "dark" ? "text-[#0A9087]" : "text-[#0A9087]"
                }`}
              >
                {currentPlans?.title}
              </CommonTitle>
              <CommonParagraph
                variant="small"
                className={`${
                  theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
                }`}
              >
                {currentPlans?.subtitle || "N/a"}
              </CommonParagraph>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <div
                  className={`relative p-1.5 rounded-full shadow-lg transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#054844] border border-slate-600 shadow-slate-900/30"
                      : "bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-gray-900/10"
                  } hover:shadow-xl`}
                >
                  <div className="relative flex rounded-xl">
                    <button
                      className={`relative px-3 py-1.5 lg:px-6 lg:py-3 text-sm font-semibold z-10 transition-all duration-300 rounded-xl ${
                        isMonthly
                          ? "text-white transform"
                          : theme === "dark"
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                      } `}
                      onClick={() => setBillingCycle("monthly")}
                    >
                      <span className="relative z-10">Monthly</span>
                      {isMonthly && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-full bg-[#0A9087] shadow-lg"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>

                    <button
                      className={`relative px-3 py-1.5 lg:px-6 lg:py-3 text-sm font-semibold z-10 transition-all duration-300 rounded-xl ${
                        isQuarterly
                          ? "text-white transform"
                          : theme === "dark"
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                      } `}
                      onClick={() => setBillingCycle("quarterly")}
                    >
                      <span className="relative z-10">Quarterly</span>
                      <span
                        className={`relative z-10 text-xs px-2 py-0.5 rounded-full font-bold ${
                          isQuarterly
                            ? "bg-white/20 text-white"
                            : theme === "dark"
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
                      className={`relative px-3 py-1.5 lg:px-6 lg:py-3 text-sm font-semibold z-10 transition-all duration-300 rounded-xl ${
                        isAnnual
                          ? "text-white transform "
                          : theme === "dark"
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setBillingCycle("annual")}
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <span>Annual</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            isAnnual
                              ? "bg-white/20 text-white"
                              : theme === "dark"
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
                      theme === "dark"
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
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
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

            {/* Plans Grid - Desktop & Tablet */}
            <div className="hidden sm:block">
              <div
                className="w-full max-w-6xl mx-auto"
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: `repeat(${Math.min(planCount, 4)}, minmax(0, 1fr))`,
                }}
              >
                {allPlans.map((plan, index) => {
                  // Check if this is the Enterprise API card
                  if (plan.isEnterprise) {
                    return (
                      <div
                        key={`enterprise-api-${index}`}
                        className={`group relative rounded-2xl p-8 border transition-all duration-400 ease-in flex flex-col h-full transform scale-95 hover:scale-100 ${
                          theme === "dark"
                            ? "bg-[#054844] hover:from-mediumBlack hover:to-darkerBlack border-lightBlack hover:border-darkerGrey shadow-xl "
                            : "bg-gradient-to-br from-white to-extraLightBlue hover:from-extraLightBlue hover:to-white border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-2xl shadow-gray-900/10"
                        }`}
                      >
                        {/* Plan Header */}
                        <div className="text-center mb-8 relative z-10">
                          <CommonParagraph
                            variant="small"
                            className={`font-bold mb-3 uppercase tracking-widest text-xs ${
                              theme === "dark"
                                ? "text-lightBlue"
                                : "text-darkerBlue"
                            }`}
                          >
                            {plan.region}
                          </CommonParagraph>

                          <div className="mb-4">
                            <CommonTitle
                              variant="regular"
                              className={`font-extrabold font-logo text-2xl ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              Contact Us for a Demo
                            </CommonTitle>
                          </div>
                        </div>

                        {/* Elegant Divider */}
                        <div className="relative mb-8">
                          <div
                            className={`h-px ${
                              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          ></div>
                          <div
                            className={`absolute inset-0 flex justify-center`}
                          >
                            <div
                              className={`w-24 h-px ${
                                theme === "dark"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                  : "bg-gradient-to-r from-blue-400 to-purple-400"
                              }`}
                            ></div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex-grow space-y-4 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-start group/feature"
                            >
                              <div
                                className={`flex-shrink-0 flex items-center justify-center mr-4 w-6 h-6 rounded-full transition-all duration-300 ${
                                  theme === "dark"
                                    ? "text-emerald-400 bg-emerald-500/20 group-hover/feature:bg-emerald-500/30"
                                    : "text-emerald-600 bg-emerald-50 group-hover/feature:bg-emerald-100"
                                }`}
                              >
                                <GiCheckMark className="w-3 h-3" />
                              </div>
                              <CommonParagraph
                                className={`leading-relaxed transition-all duration-300 ${
                                  theme === "dark"
                                    ? "text-lighterGrey group-hover/feature:text-white"
                                    : "text-lightBlack group-hover/feature:text-gray-900"
                                }`}
                              >
                                {feature.text}
                              </CommonParagraph>
                            </div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <div className="mt-auto pt-6">
                          <button
                            onClick={handleContactUs}
                            className={`w-full px-6 py-3 cursor-pointer rounded-xl font-semibold 
                              
                              transition-all duration-200 transform hover:scale-105 ${
                                theme === "dark"
                                  ? "bg-[#0A9087] text-white hover:from-darkBlue hover:to-mediumBlue shadow-lg hover:shadow-xl"
                                  : "bg-[#0A9087] text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                              }`}
                          >
                            Contact Us
                          </button>
                        </div>

                        {/* Subtle Glow Effect */}
                        <div
                          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                            theme === "dark"
                              ? "bg-gradient-to-br from-blue-500/5 to-purple-700/3"
                              : "bg-gradient-to-br from-blue-500/3 to-purple-500/3"
                          }`}
                        ></div>
                      </div>
                    );
                  }

                  // Regular plan cards
                  const packageId = isMonthly
                    ? plan.monthlyPackageId
                    : isQuarterly
                      ? plan.quarterlyPackageId
                      : plan.annualPackageId;
                  const price = isMonthly
                    ? plan.monthlyPrice
                    : isQuarterly
                      ? plan.quarterlyPrice
                      : plan.annualPrice;
                  const priceValue = Number(
                    String(price || "").replace(/[^0-9.]/g, ""),
                  );
                  const monthlyPriceValue = plan.monthlyPrice
                    ? parseFloat(plan.monthlyPrice.replace(/[^0-9.]/g, ""))
                    : 0;
                  const quarterlyPriceValue = plan.quarterlyPrice
                    ? parseFloat(plan.quarterlyPrice.replace(/[^0-9.]/g, ""))
                    : 0;
                  const annualPriceValue = plan.annualPrice
                    ? parseFloat(plan.annualPrice.replace(/[^0-9.]/g, ""))
                    : 0;

                  return (
                    <div
                      key={`${plan.region}-${index}-${packageId}`}
                      className={`group relative rounded-2xl p-8 border transition-all duration-400 ease-in flex flex-col h-full transform scale-95 hover:scale-100 ${
                        theme === "dark"
                          ? "bg-[#054844] hover:from-mediumBlack hover:to-darkerBlack border-lightBlack hover:border-darkerGrey shadow-xl "
                          : "bg-gradient-to-br from-white to-extraLightBlue hover:from-extraLightBlue hover:to-white border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-2xl shadow-gray-900/10"
                      }`}
                    >
                      {/* Plan Header */}
                      <div className="text-center mb-8 relative z-10">
                        <CommonParagraph
                          variant="small"
                          className={`font-bold mb-3 uppercase tracking-widest text-xs ${
                            theme === "dark"
                              ? "text-lightBlue"
                              : "text-darkerBlue"
                          }`}
                        >
                          {plan.region}
                        </CommonParagraph>

                        <div className="mb-4">
                          <div className="flex items-baseline justify-center mb-2">
                            <CommonTitle
                              variant="regular"
                              className={`font-extrabold text-4xl ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {price}
                            </CommonTitle>
                            <CommonParagraph
                              variant="small"
                              className={`text-lg ml-2 font-medium ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {isAnnual
                                ? "/year"
                                : isQuarterly
                                  ? "/3 months"
                                  : "/month"}
                            </CommonParagraph>
                          </div>

                          {isAnnual &&
                            plan.monthlyPrice &&
                            plan.annualPrice && (
                              <div className="flex items-center justify-center space-x-2">
                                <CommonParagraph
                                  variant="smaller"
                                  className={`text-sm px-3 py-1 rounded-full font-semibold ${
                                    theme === "dark"
                                      ? "text-emerald-400 bg-emerald-500/20"
                                      : "text-emerald-600 bg-emerald-50"
                                  }`}
                                >
                                  Save $
                                  {(
                                    monthlyPriceValue * 12 -
                                    annualPriceValue
                                  ).toFixed(0)}
                                </CommonParagraph>
                                <CommonParagraph
                                  variant="smaller"
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  (${(annualPriceValue / 12).toFixed(2)}
                                  /mo)
                                </CommonParagraph>
                              </div>
                            )}

                          {isQuarterly &&
                            plan.monthlyPrice &&
                            plan.quarterlyPrice && (
                              <div className="flex items-center justify-center space-x-2">
                                <CommonParagraph
                                  variant="smaller"
                                  className={`text-sm px-3 py-1 rounded-full font-semibold ${
                                    theme === "dark"
                                      ? "text-purple-400 bg-purple-500/20"
                                      : "text-purple-600 bg-purple-50"
                                  }`}
                                >
                                  Save $
                                  {(
                                    monthlyPriceValue * 3 -
                                    quarterlyPriceValue
                                  ).toFixed(0)}
                                </CommonParagraph>
                                <CommonParagraph
                                  variant="smaller"
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  (${(quarterlyPriceValue / 3).toFixed(2)}
                                  /mo)
                                </CommonParagraph>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Elegant Divider */}
                      <div className="relative mb-8">
                        <div
                          className={`h-px ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        ></div>
                        <div className={`absolute inset-0 flex justify-center`}>
                          <div
                            className={`w-24 h-px ${
                              theme === "dark"
                                ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                : "bg-gradient-to-r from-blue-400 to-purple-400"
                            }`}
                          ></div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex-grow space-y-4 mb-8">
                        {plan.features && plan.features.length > 0 ? (
                          plan.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-start group/feature"
                            >
                              <div
                                className={`flex-shrink-0 flex items-center justify-center mr-4 w-6 h-6 rounded-full transition-all duration-300 ${
                                  feature.included
                                    ? theme === "dark"
                                      ? "text-emerald-400 bg-emerald-500/20 group-hover/feature:bg-emerald-500/30"
                                      : "text-emerald-600 bg-emerald-50 group-hover/feature:bg-emerald-100"
                                    : theme === "dark"
                                      ? "text-lighterGrey bg-darkerGrey"
                                      : "text-lightBlack bg-lightestGrey"
                                }`}
                              >
                                {feature.included ? (
                                  <GiCheckMark className="w-3 h-3" />
                                ) : (
                                  <CgClose className="w-3 h-3 " />
                                )}
                              </div>
                              <CommonParagraph
                                className={`leading-relaxed transition-all duration-300 ${
                                  feature.included
                                    ? theme === "dark"
                                      ? "text-lighterGrey group-hover/feature:text-white"
                                      : "text-lightBlack group-hover/feature:text-gray-900"
                                    : "opacity-50"
                                }`}
                              >
                                {feature.text}
                              </CommonParagraph>
                            </div>
                          ))
                        ) : (
                          <CommonParagraph
                            className={`text-center ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            No features listed
                          </CommonParagraph>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div className="mt-auto pt-6">
                        <div className="mt-auto pt-6 z-100">
                          {plan?.region === "UT" ? (
                            <CommonParagraph
                              variant="medium"
                              className="font-semibold w-full mx-auto text-center"
                            >
                              Coming Soon
                            </CommonParagraph>
                          ) : sub?.is_active ? (
                            sub?.package_id === packageId ? (
                              <SubmitButton
                                variant="bg_red"
                                isLoading={
                                  isCancelPending &&
                                  selectedCancelId === sub?.id
                                }
                                onClick={() => handleCancel(sub?.id)}
                              >
                                Cancel
                              </SubmitButton>
                            ) : (
                              <SubmitButton
                                variant="bg_black"
                                isLoading={
                                  isCheckoutPending &&
                                  selectedCheckoutId === packageId
                                }
                                onClick={() => {
                                  setSelectedCheckoutId(packageId);
                                  if (isUltimatePackage(plan.region)) {
                                    setModalPayload({
                                      action: "checkout",
                                      packageId,
                                      price: priceValue,
                                    });
                                    setOpenModal(true);
                                  } else {
                                    handleCheckout(packageId, priceValue);
                                  }
                                }}
                              >
                                Update
                              </SubmitButton>
                            )
                          ) : (
                            <SubmitButton
                              variant="bg_black"
                              isLoading={
                                (referalPending ||
                                  checkoutInitiated ||
                                  isCheckoutPending) &&
                                selectedCheckoutId === packageId
                              }
                              onClick={() => {
                                setSelectedCheckoutId(packageId);
                                if (isUltimatePackage(plan.region)) {
                                  setModalPayload({
                                    action: "checkout",
                                    packageId,
                                    price: priceValue,
                                  });
                                  setOpenModal(true);
                                } else {
                                  handleCheckout(packageId, priceValue);
                                }
                              }}
                            >
                              Select Plan
                            </SubmitButton>
                          )}
                        </div>

                        {plan.isPopular && (
                          <CommonParagraph
                            variant="smaller"
                            className={`text-center mt-2 text-xs ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            14-day free trial included
                          </CommonParagraph>
                        )}
                      </div>

                      {/* Subtle Glow Effect */}
                      <div
                        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                          theme === "dark"
                            ? "bg-gradient-to-br from-blue-500/5 to-purple-700/3"
                            : "bg-gradient-to-br from-blue-500/3 to-purple-500/3"
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plans Swiper - Mobile Only */}
            <div className="sm:hidden w-full px-2">
              <Swiper
                slidesPerView={1.2}
                spaceBetween={12}
                centeredSlides={false}
                breakpoints={{
                  480: {
                    slidesPerView: 1.5,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                }}
                className="mobile-plans-swiper !overflow-visible"
              >
                {allPlans.map((plan, index) => {
                  // Check if this is the Enterprise API card
                  if (plan.isEnterprise) {
                    return (
                      <SwiperSlide key={`enterprise-api-mobile-${index}`}>
                        <div
                          className={`group relative rounded-2xl p-6 border transition-all duration-400 ease-in flex flex-col h-full ${
                            theme === "dark"
                              ? "bg-[#054844] border-lightBlack shadow-xl"
                              : "bg-gradient-to-br from-white to-extraLightBlue border-gray-200 shadow-lg shadow-gray-900/10"
                          }`}
                        >
                          {/* Plan Header */}
                          <div className="text-center mb-6 relative z-10">
                            <CommonParagraph
                              variant="small"
                              className={`font-bold mb-3 uppercase tracking-widest text-xs ${
                                theme === "dark"
                                  ? "text-lightBlue"
                                  : "text-darkerBlue"
                              }`}
                            >
                              {plan.region}
                            </CommonParagraph>

                            <div className="mb-4">
                              <CommonTitle
                                variant="regular"
                                className={`font-extrabold text-xl ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                Contact Us for a Demo
                              </CommonTitle>
                            </div>
                          </div>

                          {/* Elegant Divider */}
                          <div className="relative mb-6">
                            <div
                              className={`h-px ${
                                theme === "dark"
                                  ? "bg-[#0A9087]"
                                  : "bg-gray-200"
                              }`}
                            ></div>
                            <div
                              className={`absolute inset-0 flex justify-center`}
                            >
                              <div
                                className={`w-24 h-px ${
                                  theme === "dark"
                                    ? "bg-[#013e3a]"
                                    : "bg-[#013e3a]"
                                }`}
                              ></div>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex-grow space-y-3 mb-6">
                            {plan.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-start"
                              >
                                <div
                                  className={`flex-shrink-0 flex items-center justify-center mr-3 w-5 h-5 rounded-full transition-all duration-300 ${
                                    theme === "dark"
                                      ? "text-emerald-400 bg-emerald-500/20"
                                      : "text-emerald-600 bg-emerald-50"
                                  }`}
                                >
                                  <GiCheckMark className="w-3 h-3" />
                                </div>
                                <CommonParagraph
                                  variant="small"
                                  className={`leading-relaxed ${
                                    theme === "dark"
                                      ? "text-lighterGrey"
                                      : "text-lightBlack"
                                  }`}
                                >
                                  {feature.text}
                                </CommonParagraph>
                              </div>
                            ))}
                          </div>

                          {/* CTA Button */}
                          <div className="mt-auto pt-4">
                            <button
                              onClick={handleContactUs}
                              className={`w-full px-6 py-3 cursor-pointer rounded-xl font-semibold 
                              
                              transition-all duration-200 transform hover:scale-105 ${
                                theme === "dark"
                                  ? "bg-[#0A9087] text-white hover:from-darkBlue hover:to-mediumBlue shadow-lg hover:shadow-xl"
                                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                              }`}
                            >
                              Contact Us
                            </button>
                          </div>

                          {/* Subtle Glow Effect */}
                          <div
                            className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                              theme === "dark"
                                ? "bg-gradient-to-br from-blue-500/5 to-purple-700/3"
                                : "bg-gradient-to-br from-blue-500/3 to-purple-500/3"
                            }`}
                          ></div>
                        </div>
                      </SwiperSlide>
                    );
                  }

                  // Regular plan cards (mobile)
                  const packageId = isMonthly
                    ? plan.monthlyPackageId
                    : isQuarterly
                      ? plan.quarterlyPackageId
                      : plan.annualPackageId;
                  const price = isMonthly
                    ? plan.monthlyPrice
                    : isQuarterly
                      ? plan.quarterlyPrice
                      : plan.annualPrice;
                  const priceValue = Number(
                    String(price || "").replace(/[^0-9.]/g, ""),
                  );
                  const monthlyPriceValue = plan.monthlyPrice
                    ? parseFloat(plan.monthlyPrice.replace(/[^0-9.]/g, ""))
                    : 0;
                  const quarterlyPriceValue = plan.quarterlyPrice
                    ? parseFloat(plan.quarterlyPrice.replace(/[^0-9.]/g, ""))
                    : 0;
                  const annualPriceValue = plan.annualPrice
                    ? parseFloat(plan.annualPrice.replace(/[^0-9.]/g, ""))
                    : 0;

                  return (
                    <SwiperSlide key={`${plan.region}-${index}-${packageId}`}>
                      <div
                        className={`group relative rounded-2xl p-6 border transition-all duration-400 ease-in flex flex-col h-full ${
                          theme === "dark"
                            ? "bg-[#054844]  shadow-xl"
                            : "bg-gradient-to-br from-white to-extraLightBlue border-gray-200 shadow-lg shadow-gray-900/10"
                        }`}
                      >
                        {/* Plan Header */}
                        <div className="text-center mb-6 relative z-10">
                          <CommonParagraph
                            variant="small"
                            className={`font-bold mb-3 uppercase tracking-widest text-xs ${
                              theme === "dark"
                                ? "text-lightBlue"
                                : "text-darkerBlue"
                            }`}
                          >
                            {plan.region}
                          </CommonParagraph>

                          <div className="mb-4">
                            <div className="flex items-baseline justify-center mb-2">
                              <CommonTitle
                                variant="regular"
                                className={`font-extrabold text-3xl ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {price}
                              </CommonTitle>
                              <CommonParagraph
                                variant="small"
                                className={`text-base ml-2 font-medium ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {isAnnual
                                  ? "/year"
                                  : isQuarterly
                                    ? "/3 months"
                                    : "/month"}
                              </CommonParagraph>
                            </div>

                            {isAnnual &&
                              plan.monthlyPrice &&
                              plan.annualPrice && (
                                <div className="flex flex-col items-center space-y-1">
                                  <CommonParagraph
                                    variant="smaller"
                                    className={`text-sm px-3 py-1 rounded-full font-semibold ${
                                      theme === "dark"
                                        ? "text-emerald-400 bg-emerald-500/20"
                                        : "text-emerald-600 bg-emerald-50"
                                    }`}
                                  >
                                    Save $
                                    {(
                                      monthlyPriceValue * 12 -
                                      annualPriceValue
                                    ).toFixed(0)}
                                  </CommonParagraph>
                                  <CommonParagraph
                                    variant="smaller"
                                    className={`text-xs ${
                                      theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    (${(annualPriceValue / 12).toFixed(2)}
                                    /mo)
                                  </CommonParagraph>
                                </div>
                              )}

                            {isQuarterly &&
                              plan.monthlyPrice &&
                              plan.quarterlyPrice && (
                                <div className="flex flex-col items-center space-y-1">
                                  <CommonParagraph
                                    variant="smaller"
                                    className={`text-sm px-3 py-1 rounded-full font-semibold ${
                                      theme === "dark"
                                        ? "text-purple-400 bg-purple-500/20"
                                        : "text-purple-600 bg-purple-50"
                                    }`}
                                  >
                                    Save $
                                    {(
                                      monthlyPriceValue * 3 -
                                      quarterlyPriceValue
                                    ).toFixed(0)}
                                  </CommonParagraph>
                                  <CommonParagraph
                                    variant="smaller"
                                    className={`text-xs ${
                                      theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    (${(quarterlyPriceValue / 3).toFixed(2)}
                                    /mo)
                                  </CommonParagraph>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Elegant Divider */}
                        <div className="relative mb-6">
                          <div
                            className={`h-px ${
                              theme === "dark" ? "bg-[#0A9087]" : "bg-gray-200"
                            }`}
                          ></div>
                          <div
                            className={`absolute inset-0 flex justify-center`}
                          >
                            <div
                              className={`w-24 h-px ${
                                theme === "dark"
                                  ? "bg-[#013e3a]"
                                  : "bg-[#013e3a]"
                              }`}
                            ></div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex-grow space-y-3 mb-6">
                          {plan.features && plan.features.length > 0 ? (
                            plan.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-start"
                              >
                                <div
                                  className={`flex-shrink-0 flex items-center justify-center mr-3 w-5 h-5 rounded-full transition-all duration-300 ${
                                    feature.included
                                      ? theme === "dark"
                                        ? "text-emerald-400 bg-emerald-500/20"
                                        : "text-emerald-600 bg-emerald-50"
                                      : theme === "dark"
                                        ? "text-lighterGrey bg-darkerGrey"
                                        : "text-lightBlack bg-lightestGrey"
                                  }`}
                                >
                                  {feature.included ? (
                                    <GiCheckMark className="w-3 h-3" />
                                  ) : (
                                    <CgClose className="w-3 h-3" />
                                  )}
                                </div>
                                <CommonParagraph
                                  variant="small"
                                  className={`leading-relaxed ${
                                    feature.included
                                      ? theme === "dark"
                                        ? "text-lighterGrey"
                                        : "text-lightBlack"
                                      : "opacity-50"
                                  }`}
                                >
                                  {feature.text}
                                </CommonParagraph>
                              </div>
                            ))
                          ) : (
                            <CommonParagraph
                              className={`text-center ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              No features listed
                            </CommonParagraph>
                          )}
                        </div>

                        {/* CTA Button */}
                        <div className="mt-auto pt-4">
                          {plan?.region === "UT" ? (
                            <CommonParagraph
                              variant="medium"
                              className="font-semibold w-full mx-auto text-center"
                            >
                              Coming Soon
                            </CommonParagraph>
                          ) : sub?.is_active ? (
                            sub?.package_id === packageId ? (
                              <SubmitButton
                                variant="bg_red"
                                isLoading={
                                  isCancelPending &&
                                  selectedCancelId === sub?.id
                                }
                                onClick={() => handleCancel(sub?.id)}
                              >
                                Cancel
                              </SubmitButton>
                            ) : (
                              <SubmitButton
                                isLoading={
                                  isCheckoutPending &&
                                  selectedCheckoutId === packageId
                                }
                                onClick={() => {
                                  setSelectedCheckoutId(packageId);
                                  if (isUltimatePackage(plan.region)) {
                                    setModalPayload({
                                      action: "checkout",
                                      packageId,
                                      price: priceValue,
                                    });
                                    setOpenModal(true);
                                  } else {
                                    handleCheckout(packageId, priceValue);
                                  }
                                }}
                              >
                                Update
                              </SubmitButton>
                            )
                          ) : (
                            <SubmitButton
                              variant="bg_blue"
                              isLoading={
                                (referalPending ||
                                  checkoutInitiated ||
                                  isCheckoutPending) &&
                                selectedCheckoutId === packageId
                              }
                              onClick={() => {
                                setSelectedCheckoutId(packageId);
                                if (isUltimatePackage(plan.region)) {
                                  setModalPayload({
                                    action: "checkout",
                                    packageId,
                                    price: priceValue,
                                  });
                                  setOpenModal(true);
                                } else {
                                  handleCheckout(packageId, priceValue);
                                }
                              }}
                            >
                              Select Plan
                            </SubmitButton>
                          )}

                          {plan.isPopular && (
                            <CommonParagraph
                              variant="smaller"
                              className={`text-center mt-2 text-xs ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              14-day free trial included
                            </CommonParagraph>
                          )}
                        </div>

                        {/* Subtle Glow Effect */}
                        <div
                          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                            theme === "dark"
                              ? "bg-gradient-to-br from-blue-500/5 to-purple-700/3"
                              : "bg-gradient-to-br from-blue-500/3 to-purple-500/3"
                          }`}
                        ></div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </CommonWrapper>
      {openModal && (
        <AnimatePresence>
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-darkBlack to-mediumBlack border border-lightBlack"
                    : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
                }`}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className={`absolute top-4 cursor-pointer hover:font-bold right-4 p-2 rounded-full transition-all duration-200 ${
                    theme === "dark"
                      ? "hover:bg-mediumBlack text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <CgClose className="w-5 h-5" />
                </button>

                {/* Modal Content */}
                <div className="p-8">
                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                          : "bg-gradient-to-br from-blue-100 to-purple-100"
                      }`}
                    >
                      <GiCheckMark
                        className={`w-8 h-8 ${
                          theme === "dark" ? "text-lightBlue" : "text-darkBlue"
                        }`}
                      />
                    </div>
                  </div>
                  <CommonParagraph className="flex w-full justify-center items-center text-xl my-6">
                    You Need to Accept all conditions
                  </CommonParagraph>

                  <div className="space-y-4 mb-6">
                    {/* Accept */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAgreement("accept")}
                        className={`relative w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 border-2 rounded-sm flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
                          agreements.accept
                            ? "border-mediumBlue"
                            : "border-mediumGrey"
                        }`}
                      >
                        {agreements.accept && (
                          <GiCheckMark className="text-mediumBlue w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        )}
                      </button>

                      <CommonParagraph
                        variant="small"
                        className="leading-relaxed"
                      >
                        I confirm that use of this service is legal in my
                        jurisdiction.
                      </CommonParagraph>
                    </div>

                    {/* Non-US Risk */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAgreement("non_us_risk")}
                        className={`relative w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 border-2 rounded-sm flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
                          agreements.non_us_risk
                            ? "border-mediumBlue"
                            : "border-mediumGrey"
                        }`}
                      >
                        {agreements.non_us_risk && (
                          <GiCheckMark className="text-mediumBlue w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        )}
                      </button>

                      <CommonParagraph
                        variant="small"
                        className="leading-relaxed"
                      >
                        I acknowledge that Ultimate Automation is strictly
                        unavailable to customers in certain jurisdictions
                        (Please see Terms of Service & Risk Disclosure
                        Statement.)
                      </CommonParagraph>
                    </div>

                    {/* US Risk */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAgreement("us_risk")}
                        className={`relative w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 border-2 rounded-sm flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
                          agreements.us_risk
                            ? "border-mediumBlue"
                            : "border-mediumGrey"
                        }`}
                      >
                        {agreements.us_risk && (
                          <GiCheckMark className="text-mediumBlue w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        )}
                      </button>

                      <CommonParagraph
                        variant="small"
                        className="leading-relaxed"
                      >
                        I understand that misrepresentation may result in
                        immediate termination and loss of access.
                      </CommonParagraph>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className={`flex-1 px-6 py-3 rounded-xl cursor-pointer hover:font-bold font-semibold transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-mediumBlack text-gray-300 hover:bg-lightBlack hover:text-white border border-lightBlack"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200"
                      }`}
                    >
                      Cancel
                    </button>

                    <SubmitButton
                      variant="bg_blue"
                      className="flex-1"
                      isLoading={modalLoading}
                      disabled={!allChecked || modalLoading}
                      onClick={handleModalConfirm}
                    >
                      Confirm
                    </SubmitButton>
                  </div>
                </div>

                <div
                  className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-blue-500 to-purple-500"
                      : "bg-gradient-to-br from-blue-300 to-purple-300"
                  }`}
                />
              </motion.div>
            </div>
          </>
        </AnimatePresence>
      )}
    </>
  );
};

export default Subscriptions;
