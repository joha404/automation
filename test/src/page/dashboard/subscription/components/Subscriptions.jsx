import { useTheme } from "@/hooks/custom/useTheme";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGet } from "@/hooks/api/common/useGet";
import { usePost } from "@/hooks/api/common/usePost";
import { useNavigate } from "react-router-dom";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { GiCheckMark } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// ── Theme Tokens ──────────────────────────────────────────────
const t = {
  dark: {
    pageBg: "#040e0d",
    headingColor: "text-white",
    subColor: "text-white/55",
    cardBg: "linear-gradient(201.03deg, #4D5456 -21.17%, #020C0B 62.19%)",
    cardBorderFeat: "1px solid #0A9087",
    cardBorderSmall: "1px solid #858F95",
    glowFeat:
      "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(10,144,135,0.13) 0%, transparent 70%)",
    glowSmall:
      "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(10,144,135,0.09) 0%, transparent 70%)",
    planName: "text-white",
    price: "text-white",
    pricePeriod: "text-white/45",
    featureText: "text-white/80",
    featureFeatText: "text-[#e2f0ee]",
    checkBg: "rgba(10,144,135,0.18)",
    checkColor: "text-[#0A9087]",
    btnBg: "linear-gradient(3.11deg, #020C0B -44.12%, #055651 149.92%)",
    btnBorder: "border-[#0A9087]",
    btnText: "text-white",
    cancelBtnBg: "transparent",
    cancelBtnBorder: "border-white/30",
    cancelBtnText: "text-white",
    cancelBtnHoverBg: "rgba(255,255,255,0.06)",
    mostPopBg: "#0A9087",
    mostPopText: "text-white",
    saveBg: "#00C08026",
    saveText: "#00C080",
    saveBadgeBg: "#00C08026",
    saveBadgeText: "#00C080",
    divider: "border-white/10",
    subInfo: "text-white/35",
    emptyText: "text-white/40",
    dotColor: "rgba(255,255,255,0.3)",
    dotActive: "#0A9087",
    currentCardBorder: "1px solid #0A9087",
    currentLabelColor: "#0A9087",
  },
  light: {
    pageBg: "#f0faf9",
    headingColor: "text-[#0a1f1e]",
    subColor: "text-[#0a1f1e]/50",
    cardBg: "linear-gradient(160deg, #ffffff 0%, #e8f7f5 100%)",
    cardBorderFeat: "1px solid #0A9087",
    cardBorderSmall: "1px solid #c5e4e1",
    glowFeat:
      "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(10,144,135,0.10) 0%, transparent 70%)",
    glowSmall:
      "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(10,144,135,0.06) 0%, transparent 70%)",
    planName: "text-[#0a1f1e]",
    price: "text-[#0a1f1e]",
    pricePeriod: "text-[#0a1f1e]/45",
    featureText: "text-[#0a1f1e]/75",
    featureFeatText: "text-[#0a2e2c]",
    checkBg: "rgba(10,144,135,0.12)",
    checkColor: "text-[#0A9087]",
    btnBg: "linear-gradient(3.11deg, #0A9087 -44.12%, #0dc4b4 149.92%)",
    btnBorder: "border-[#0A9087]",
    btnText: "text-white",
    cancelBtnBg: "transparent",
    cancelBtnBorder: "border-[#0a1f1e]/25",
    cancelBtnText: "text-[#0a1f1e]",
    cancelBtnHoverBg: "rgba(10,31,30,0.06)",
    mostPopBg: "#0A9087",
    mostPopText: "text-white",
    saveBg: "#dcfce7",
    saveText: "#15803d",
    saveBadgeBg: "#00C08026",
    saveBadgeText: "#00C080",
    divider: "border-[#0a1f1e]/10",
    subInfo: "text-[#0a1f1e]/35",
    emptyText: "text-[#0a1f1e]/40",
    dotColor: "rgba(10,31,30,0.2)",
    dotActive: "#0A9087",
    currentCardBorder: "1px solid #0A9087",
    currentLabelColor: "#0A9087",
  },
};

// ── Animations ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" },
  }),
};
const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i, duration: 0.45, ease: "easeOut" },
  }),
};

// ── Helpers ───────────────────────────────────────────────────
const getPeriodLabel = (period) => {
  switch (period) {
    case "weekly":
      return "/wk";
    case "monthly":
      return "/mo";
    case "quarterly":
      return "/quarter";
    case "annual":
    case "annually":
      return "/yr";
    default:
      return period ? `/${period}` : "";
  }
};

const getMonthlyBreakdown = (price, period) => {
  const p = Number(String(price).replace(/[^0-9.]/g, ""));
  if (!p) return null;
  if (period === "quarterly") return `($${(p / 3).toFixed(2)}/mo)`;
  if (period === "annual" || period === "annually")
    return `($${(p / 12).toFixed(2)}/mo)`;
  return null;
};

const hasSave = (plan) => {
  const s = Number(String(plan.save_amount ?? "0").replace(/[^0-9.]/g, ""));
  return s > 0;
};

const CheckIcon = ({ tk }) => (
  <span
    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
    style={{ background: tk.checkBg }}
  >
    <GiCheckMark className={tk.checkColor} style={{ fontSize: "9px" }} />
  </span>
);

// ── Save Badge (inline next to plan name) ─────────────────────
const SaveBadge = ({ plan, tk }) => {
  if (!hasSave(plan)) return null;
  return (
    <span
      className="ml-2 font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full align-middle"
      style={{ background: tk.saveBadgeBg, color: tk.saveBadgeText }}
    >
      SAVE ${plan.save_amount}
    </span>
  );
};

// ── Plan Card (used everywhere) ───────────────────────────────
const PlanCard = ({
  plan,
  idx,
  onSelect,
  onCancel,
  loadingPlanId,
  isCancelPending,
  hasActiveSubscription = false,
  isFeatured = false,
  tk,
}) => {
  const isCurrentPlan = plan.current_plan === true;
  const isThisLoading = loadingPlanId === plan.id;
  const anyLoading = !!loadingPlanId || isCancelPending;

  return (
    <motion.div
      className="rounded-2xl w-full flex flex-col relative overflow-hidden h-full"
      style={{
        background: tk.cardBg,
        border: isCurrentPlan
          ? tk.currentCardBorder
          : isFeatured
            ? tk.cardBorderFeat
            : tk.cardBorderSmall,
        minHeight: "400px",
      }}
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      custom={0.1 + (idx ?? 0) * 0.1}
      whileHover={{ scale: 1.03, transition: { duration: 0.22 } }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: isFeatured ? tk.glowFeat : tk.glowSmall }}
      />
      <div className="relative flex flex-col flex-1 px-6 pt-8 pb-7">
        {/* Badges row */}
        <div className="flex justify-center gap-2 mb-4 min-h-[28px]">
          {isCurrentPlan && (
            <span
              className="font-extrabold text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-md"
              style={{ background: tk.currentLabelColor, color: "#fff" }}
            >
              CURRENT PLAN
            </span>
          )}
        </div>

        {/* Plan name + save badge */}
        <div className="flex items-center justify-center mb-3">
          {/* <p
            className={`font-bold font-logo text-[15px] tracking-widest uppercase text-center ${tk.planName}`}
          >
            {plan.name}
          </p> */}

          <span
            className={`font-logo font-bold text-[13px] tracking-widest uppercase ${tk.planName}`}
          >
            {plan.name?.split(" ").map((word, i) => (
              <span key={i} className={i === 1 ? "text-[0.65em]" : ""}>
                {word}
                {i === 0 ? " " : ""}
              </span>
            ))}
          </span>
          <SaveBadge plan={plan} tk={tk} />
        </div>

        {/* Price */}
        <div className="flex items-baseline justify-center gap-1 mb-1">
          <span
            className={`font-normal font-logo leading-none ${tk.price}`}
            style={{ fontSize: "44px" }}
          >
            ${plan.price}
          </span>
          <span
            className={`font-logo text-[15px] font-normal ${tk.pricePeriod}`}
          >
            {getPeriodLabel(plan.package_type)}
          </span>
        </div>

        {getMonthlyBreakdown(plan.price, plan.package_type) && (
          <p className={`text-center text-[12px] mb-1 ${tk.subInfo}`}>
            {getMonthlyBreakdown(plan.price, plan.package_type)}
          </p>
        )}

        {/* Features */}
        <div className="flex flex-col gap-2.5 flex-1 mt-6 mb-6">
          {(plan.features || []).map((f, i) => (
            <motion.div
              key={f.text}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3 + (idx ?? 0) * 0.1 + i * 0.06,
                duration: 0.35,
              }}
            >
              <CheckIcon tk={tk} />
              <span
                className={`text-[14px] font-medium ${isFeatured ? tk.featureFeatText : tk.featureText}`}
              >
                {f.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Button */}
        {isCurrentPlan ? (
          <motion.button
            onClick={onCancel}
            disabled={anyLoading}
            className={`cursor-pointer w-full h-[46px] px-6 rounded-full border font-logo font-bold text-[15px] flex justify-center items-center disabled:opacity-50 ${tk.cancelBtnBorder} ${tk.cancelBtnText}`}
            style={{ background: tk.cancelBtnBg }}
            whileHover={{ scale: 1.04, background: tk.cancelBtnHoverBg }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            {isCancelPending ? "Cancelling..." : "CANCEL"}
          </motion.button>
        ) : (
          <motion.button
            onClick={() => onSelect(plan)}
            disabled={anyLoading}
            className={`cursor-pointer w-full h-[46px] px-6 rounded-full border font-logo font-bold text-[15px] flex justify-center items-center disabled:opacity-50 ${tk.btnBorder} ${tk.btnText}`}
            style={{ background: tk.btnBg }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 22px rgba(10,144,135,0.45)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.18 }}
          >
            {isThisLoading
              ? "Loading..."
              : hasActiveSubscription
                ? "UPGRADE"
                : "SELECT PLAN"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// ── Featured Plan Row (desktop wide card — Quarterly on top) ──
const FeaturedPlanRow = ({
  plan,
  onSelect,
  onCancel,
  loadingPlanId,
  isCancelPending,
  hasActiveSubscription = false,
  tk,
}) => {
  const isCurrentPlan = plan.current_plan === true;
  const isThisLoading = loadingPlanId === plan.id;
  const anyLoading = !!loadingPlanId || isCancelPending;

  return (
    <motion.div
      className="rounded-2xl mb-6 relative overflow-hidden"
      style={{
        background: tk.cardBg,
        border: isCurrentPlan ? tk.currentCardBorder : tk.cardBorderFeat,
        minHeight: "220px",
      }}
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      custom={0.05}
      whileHover={{ scale: 1.008, transition: { duration: 0.25 } }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: tk.glowFeat }}
      />
      <div className="relative flex flex-row items-center h-full gap-8 px-10 py-8">
        {/* Left */}
        <div className="flex-shrink-0 min-w-[220px] flex flex-col justify-center gap-2">
          {/* Plan name + save badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-logo font-bold text-[13px] tracking-widest uppercase ${tk.planName}`}
            >
              {plan.name?.split(" ").map((word, i) => (
                <span key={i} className={i === 1 ? "text-[0.65em]" : ""}>
                  {word}
                  {i === 0 ? " " : ""}
                </span>
              ))}
            </span>
            <SaveBadge plan={plan} tk={tk} />
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className={`font-extrabold leading-none ${tk.price}`}
              style={{ fontSize: "44px" }}
            >
              ${plan.price}
            </span>
            <span className={`text-[16px] font-medium ${tk.pricePeriod}`}>
              {getPeriodLabel(plan.package_type)}
            </span>
          </div>
          {getMonthlyBreakdown(plan.price, plan.package_type) && (
            <p className={`text-[13px] text-center ${tk.subInfo}`}>
              {getMonthlyBreakdown(plan.price, plan.package_type)}
            </p>
          )}
          {plan.per_month_price && (
            <p className={`text-[13px]  ${tk.subInfo}`}>
              (${plan.per_month_price}/mo)
            </p>
          )}
        </div>

        {/* Features */}
        <div
          className={`flex-1 flex flex-col justify-center gap-3 pl-8 border-l ${tk.divider}`}
        >
          {(plan.features || []).map((f, i) => (
            <motion.div
              key={f.text}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.38 }}
            >
              <CheckIcon tk={tk} />
              <span className={`text-[15px] font-medium ${tk.featureFeatText}`}>
                {f.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 pl-8 flex items-center">
          {isCurrentPlan ? (
            <motion.button
              onClick={onCancel}
              disabled={anyLoading}
              className={`cursor-pointer w-[200px] h-[48px] px-6 rounded-full border font-bold text-[15px] flex justify-center items-center disabled:opacity-50 ${tk.cancelBtnBorder} ${tk.cancelBtnText}`}
              style={{ background: tk.cancelBtnBg }}
              whileHover={{ scale: 1.04, background: tk.cancelBtnHoverBg }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.18 }}
            >
              {isCancelPending ? "Cancelling..." : "CANCEL"}
            </motion.button>
          ) : (
            <motion.button
              onClick={() => onSelect(plan)}
              disabled={anyLoading}
              className={`cursor-pointer w-[200px] h-[48px] px-6 rounded-full border font-bold text-[15px] flex justify-center items-center disabled:opacity-50 ${tk.btnBorder} ${tk.btnText}`}
              style={{ background: tk.btnBg }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 22px rgba(10,144,135,0.45)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.18 }}
            >
              {isThisLoading
                ? "Loading..."
                : hasActiveSubscription
                  ? "UPGRADE"
                  : "SELECT PLAN"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────
const Subscriptions = () => {
  const { theme } = useTheme();
  const tk = t[theme] ?? t.dark;
  const navigate = useNavigate();
  const fbTrackedRef = useRef({
    addToCart: false,
    initiateCheckout: new Set(),
  });
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  // ── API ──────────────────────────────────────────────────────
  const { data: homeData, isLoading: homeLoading } = useGet(
    "/subscriptions-tiers/",
    {
      queryKey: ["home-page-data"],
    },
  );

  const {
    data: subResponse,
    isLoading: isActiveLoading,
    refetch: refetchSub,
  } = useGet("/my-subscription/", {
    queryKey: ["active-subscription"],
    secure: true,
  });

  // ── Parse plans ──────────────────────────────────────────────
  const rawPlans = homeData?.data || homeData?.subscription_plans || [];

  // Featured = quarterly plan (shown as wide row on desktop)
  const featuredPlan =
    rawPlans.find((p) => p.package_type === "quarterly") || rawPlans[0] || null;

  // Bottom row = weekly, monthly, annual (everything except quarterly)
  const smallPlans = rawPlans.filter((p) => p.id !== featuredPlan?.id);

  // Mobile slider = quarterly first, then rest
  const sliderPlans = featuredPlan ? [featuredPlan, ...smallPlans] : smallPlans;

  // Current plan (for cancel id)
  const currentPlan = rawPlans.find((p) => p.current_plan === true) || null;
  const subscriptionMeta = subResponse?.data ?? subResponse ?? {};
  const canPurchaseNew = subscriptionMeta?.can_purchase_new;
  const activeSubList = Array.isArray(subscriptionMeta)
    ? subscriptionMeta
    : Array.isArray(subscriptionMeta?.subscriptions)
      ? subscriptionMeta.subscriptions
      : Array.isArray(subscriptionMeta?.data)
        ? subscriptionMeta.data
        : [];
  const activeSub =
    activeSubList.find((sub) => sub?.is_active === true) ||
    subscriptionMeta?.subscription ||
    subscriptionMeta?.active_subscription ||
    null;
  const hasActiveSubscription =
    typeof canPurchaseNew === "boolean"
      ? !canPurchaseNew
      : Boolean(currentPlan || activeSub?.is_active === true);

  // ── Facebook Pixel ───────────────────────────────────────────
  useEffect(() => {
    if (
      !homeLoading &&
      featuredPlan &&
      window.fbq &&
      !fbTrackedRef.current.addToCart
    ) {
      const price = Number(String(featuredPlan.price).replace(/[^0-9.]/g, ""));
      if (price > 0) {
        window.fbq("track", "AddToCart", {
          value: price,
          currency: "USD",
          content_ids: [String(featuredPlan.id)],
          content_type: "product",
          content_name: featuredPlan.name,
        });
        fbTrackedRef.current.addToCart = true;
      }
    }
  }, [homeLoading, featuredPlan]);

  // ── Checkout ─────────────────────────────────────────────────
  const { mutate: checkout } = usePost(null, {
    secure: true,
    onSuccess: (data) => {
      const url = data?.data?.url;
      if (url)
        setTimeout(() => {
          window.location.href = url;
        }, 300);
      setLoadingPlanId(null);
    },
    onError: (err) => {
      console.error("Checkout error:", err);
      setLoadingPlanId(null);
    },
  });

  // ── Cancel ───────────────────────────────────────────────────
  const { mutate: cancelSubscription, isPending: isCancelPending } = usePost(
    null,
    {
      secure: true,
      onSuccess: () => {
        navigate("/package/cancel");
        refetchSub && refetchSub();
      },
    },
  );

  const { mutateAsync: completeReferral } = usePost("/referrals/complete/", {
    secure: true,
  });

  const processReferral = async () => {
    const code = localStorage.getItem("referral_code");
    const processed = localStorage.getItem("referral_processed");
    if (code && !processed) {
      await completeReferral({ referral_code: code });
      localStorage.removeItem("referral_code");
      localStorage.setItem("referral_processed", "true");
    }
  };

  // ── Select plan → direct checkout ────────────────────────────
  const handleSelectPlan = async (plan) => {
    const planId = plan.id;
    const price = Number(String(plan.price).replace(/[^0-9.]/g, ""));
    setLoadingPlanId(planId);

    if (
      window.fbq &&
      price > 0 &&
      !fbTrackedRef.current.initiateCheckout.has(planId)
    ) {
      window.fbq("track", "InitiateCheckout", {
        content_ids: [String(planId)],
        content_type: "product",
        content_name: plan.name,
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
    } catch (err) {
      fbTrackedRef.current.initiateCheckout.delete(planId);
      setLoadingPlanId(null);
      console.error("Checkout error:", err);
    }
  };

  // ── Cancel current plan ───────────────────────────────────────
  const handleCancel = () => {
    const cancelId =
      currentPlan?.subscription_id ||
      activeSub?.id ||
      activeSub?.subscription_id;
    if (!cancelId) return;
    cancelSubscription({ url: `/cancel_subscription/${cancelId}`, data: {} });
  };

  if (homeLoading || isActiveLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center py-20">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <>
      <style>{`
        .plans-swiper .swiper-pagination-bullet { background: ${tk.dotColor}; opacity:1; width:8px; height:8px; transition: all 0.3s ease; }
        .plans-swiper .swiper-pagination-bullet-active { background: ${tk.dotActive}; width:22px; border-radius:4px; }
      `}</style>

      <div
        className="min-h-screen py-16 px-4 transition-colors duration-300"
        style={{ background: tk.pageBg }}
      >
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <h1
            className={`font-extrabold uppercase tracking-widest mb-2 ${tk.headingColor}`}
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              letterSpacing: "0.18em",
            }}
          >
            SUBSCRIPTIONS
          </h1>
          <p className={`text-[15px] ${tk.subColor}`}>
            Quick, simple, and straight to the point
          </p>
        </motion.div>

        {/* ══ MOBILE & TABLET ( < 1280px ) ══ */}
        <div className="xl:hidden max-w-3xl mx-auto pb-4">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            grabCursor
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 1.25, spaceBetween: 20 },
              1024: { slidesPerView: 2, spaceBetween: 24 },
            }}
            className="plans-swiper !pb-12"
          >
            {sliderPlans.map((plan, idx) => (
              <SwiperSlide key={plan.id}>
                <PlanCard
                  plan={plan}
                  idx={idx}
                  onSelect={handleSelectPlan}
                  onCancel={handleCancel}
                  loadingPlanId={loadingPlanId}
                  isCancelPending={isCancelPending}
                  hasActiveSubscription={hasActiveSubscription}
                  isFeatured={plan.id === featuredPlan?.id}
                  tk={tk}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ══ DESKTOP ( >= 1280px ) ══ */}
        <div className="hidden xl:block max-w-7xl mx-auto">
          {/* Quarterly — wide featured row on top */}
          {featuredPlan && (
            <FeaturedPlanRow
              plan={featuredPlan}
              onSelect={handleSelectPlan}
              onCancel={handleCancel}
              loadingPlanId={loadingPlanId}
              isCancelPending={isCancelPending}
              hasActiveSubscription={hasActiveSubscription}
              tk={tk}
            />
          )}

          {/* Bottom row: weekly, monthly, annual */}
          {smallPlans.length > 0 && (
            <div
              className="grid gap-6 my-10"
              style={{
                gridTemplateColumns: `repeat(${Math.min(smallPlans.length, 4)}, minmax(0, 1fr))`,
              }}
            >
              {smallPlans.map((plan, idx) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  idx={idx}
                  onSelect={handleSelectPlan}
                  onCancel={handleCancel}
                  loadingPlanId={loadingPlanId}
                  isCancelPending={isCancelPending}
                  hasActiveSubscription={hasActiveSubscription}
                  isFeatured={false}
                  tk={tk}
                />
              ))}
            </div>
          )}

          {rawPlans.length === 0 && (
            <p className={`text-center py-16 text-sm ${tk.emptyText}`}>
              No subscription plans available.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
