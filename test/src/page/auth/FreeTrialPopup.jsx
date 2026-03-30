import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GiCheckMark } from "react-icons/gi";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTheme } from "@/hooks/custom/useTheme";
import { useGet } from "@/hooks/api/common/useGet";
import { usePost } from "@/hooks/api/common/usePost";
import CloseButton from "../../components/auth/CloseButton";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import "swiper/css";
import "swiper/css/pagination";

const tokens = {
  dark: {
    modalBg: "bg-[#040e0d] border border-[#0A9087]/20",
    heading: "text-white",
    subHeading: "text-white/55",
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
    currentBtnBg: "rgba(255,255,255,0.05)",
    currentBtnBorder: "border-white/20",
    currentBtnText: "text-white/80",
    saveBadgeBg: "#00C08026",
    saveBadgeText: "#00C080",
    divider: "border-white/10",
    noteBg: "bg-[#0A9087]/10 border border-[#0A9087]/20",
    noteText: "text-white/70",
    dotColor: "rgba(255,255,255,0.3)",
    dotActive: "#0A9087",
    currentCardBorder: "1px solid #0A9087",
    currentLabelColor: "#0A9087",
    emptyText: "text-white/45",
  },
  light: {
    modalBg: "bg-white border border-[#0A9087]/15",
    heading: "text-[#0a1f1e]",
    subHeading: "text-[#0a1f1e]/55",
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
    currentBtnBg: "rgba(10,31,30,0.04)",
    currentBtnBorder: "border-[#0a1f1e]/15",
    currentBtnText: "text-[#0a1f1e]/75",
    saveBadgeBg: "#00C08026",
    saveBadgeText: "#00C080",
    divider: "border-[#0a1f1e]/10",
    noteBg: "bg-[#0A9087]/6 border border-[#0A9087]/15",
    noteText: "text-[#0a1f1e]/70",
    dotColor: "rgba(10,31,30,0.2)",
    dotActive: "#0A9087",
    currentCardBorder: "1px solid #0A9087",
    currentLabelColor: "#0A9087",
    emptyText: "text-[#0a1f1e]/45",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

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
  const amount = Number(String(price).replace(/[^0-9.]/g, ""));
  if (!amount) return null;
  if (period === "quarterly") return `($${(amount / 3).toFixed(2)}/mo)`;
  if (period === "annual" || period === "annually") {
    return `($${(amount / 12).toFixed(2)}/mo)`;
  }
  return null;
};

const hasSave = (plan) => {
  const save = Number(String(plan.save_amount ?? "0").replace(/[^0-9.]/g, ""));
  return save > 0;
};

const CheckIcon = ({ tk }) => (
  <span
    className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full"
    style={{ background: tk.checkBg }}
  >
    <GiCheckMark className={tk.checkColor} style={{ fontSize: "9px" }} />
  </span>
);

const SaveBadge = ({ plan, tk }) => {
  if (!hasSave(plan)) return null;

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] sm:px-3 sm:text-[10px]"
      style={{ background: tk.saveBadgeBg, color: tk.saveBadgeText }}
    >
      SAVE ${plan.save_amount}
    </span>
  );
};

const PlanCard = ({
  plan,
  idx,
  tk,
  loadingPlanId,
  onSelect,
  isFeatured = false,
}) => {
  const isCurrentPlan = plan.current_plan === true;
  const isThisLoading = loadingPlanId === plan.id;

  return (
    <motion.div
      className="relative flex h-full min-h-[250px] w-full flex-col overflow-hidden rounded-xl sm:min-h-[270px] sm:rounded-2xl xl:min-h-[225px] 2xl:min-h-[240px]"
      style={{
        background: tk.cardBg,
        border: isCurrentPlan
          ? tk.currentCardBorder
          : isFeatured
            ? tk.cardBorderFeat
            : tk.cardBorderSmall,
      }}
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      custom={idx}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: isFeatured ? tk.glowFeat : tk.glowSmall }}
      />

      <div className="relative flex flex-1 flex-col px-3.5 pb-4 pt-4 sm:px-4 sm:pb-5 sm:pt-5 xl:px-3.5 xl:pb-3.5 xl:pt-3.5 2xl:px-3.5 2xl:pb-4 2xl:pt-4">
        <div className="mb-2 flex min-h-[20px] justify-center sm:mb-3 sm:min-h-[24px]">
          {isCurrentPlan && (
            <span
              className="rounded-md px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white sm:px-3 sm:text-[10px]"
              style={{ background: tk.currentLabelColor }}
            >
              CURRENT PLAN
            </span>
          )}
        </div>

        <div className="mb-1.5 flex items-center justify-center gap-1.5 text-center sm:mb-2 xl:mb-1.5">
          <span
            className={`font-logo text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px] xl:text-[9px] ${tk.planName}`}
          >
            {plan.name}
          </span>
          <SaveBadge plan={plan} tk={tk} />
        </div>

        <div className="mb-1 flex items-baseline justify-center gap-1">
          <span
            className={`font-logo text-[28px] font-normal leading-none sm:text-[32px] lg:text-[36px] xl:text-[29px] ${tk.price}`}
          >
            ${plan.price}
          </span>
          <span className={`text-[11px] font-normal sm:text-[12px] xl:text-[10px] ${tk.pricePeriod}`}>
            {getPeriodLabel(plan.package_type)}
          </span>
        </div>

        {getMonthlyBreakdown(plan.price, plan.package_type) && (
          <p className={`mb-0.5 text-center text-[10px] sm:text-[11px] xl:text-[9px] ${tk.subHeading}`}>
            {getMonthlyBreakdown(plan.price, plan.package_type)}
          </p>
        )}

        {plan.per_month_price && (
          <p className={`mb-0.5 text-center text-[10px] sm:text-[11px] xl:text-[9px] ${tk.subHeading}`}>
            (${plan.per_month_price}/mo)
          </p>
        )}

        <div className="mt-3 flex flex-1 flex-col gap-2 sm:mt-4 sm:gap-2.5 xl:mt-3 xl:gap-1.5 2xl:mt-3 2xl:gap-2">
          {(plan.features || [])
            .slice(0, 4)
            .map((feature, featureIndex) => (
            <motion.div
              key={`${plan.id}-${featureIndex}`}
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + featureIndex * 0.06,
                duration: 0.32,
              }}
            >
              <CheckIcon tk={tk} />
              <span
                className={`text-[11px] font-medium leading-[1.2] sm:text-[12px] xl:text-[10px] 2xl:text-[11px] ${isFeatured ? tk.featureFeatText : tk.featureText}`}
              >
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        {isCurrentPlan ? (
          <button
            type="button"
            disabled
            className={`mt-4 flex h-[38px] w-full cursor-not-allowed items-center justify-center rounded-full border px-3 text-[11px] font-bold sm:mt-5 sm:h-[40px] sm:text-[12px] xl:mt-3.5 xl:h-[34px] xl:px-3 xl:text-[10px] 2xl:mt-4 2xl:h-[38px] 2xl:text-[11px] ${tk.currentBtnBorder} ${tk.currentBtnText}`}
            style={{ background: tk.currentBtnBg }}
          >
            Start Free Trial
          </button>
        ) : (
          <motion.button
            type="button"
            onClick={() => onSelect(plan)}
            disabled={!!loadingPlanId}
            className={`mt-4 flex h-[38px] w-full cursor-pointer items-center justify-center rounded-full border px-3 text-[11px] font-bold disabled:opacity-60 sm:mt-5 sm:h-[40px] sm:text-[12px] xl:mt-3.5 xl:h-[34px] xl:px-3 xl:text-[10px] 2xl:mt-4 2xl:h-[38px] 2xl:text-[11px] ${tk.btnBorder} ${tk.btnText}`}
            style={{ background: tk.btnBg }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 22px rgba(10,144,135,0.35)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            {isThisLoading ? "Loading..." : "Start Free Trial"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const FeaturedPlanRow = ({ plan, tk, loadingPlanId, onSelect }) => {
  const isCurrentPlan = plan.current_plan === true;
  const isThisLoading = loadingPlanId === plan.id;

  return (
    <motion.div
      className="relative mb-5 overflow-hidden rounded-xl sm:mb-6 sm:rounded-2xl"
      style={{
        background: tk.cardBg,
        border: isCurrentPlan ? tk.currentCardBorder : tk.cardBorderFeat,
      }}
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      custom={0}
      whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: tk.glowFeat }}
      />

      <div className="relative flex h-full flex-col gap-4 px-3.5 py-4 sm:gap-5 sm:px-5 sm:py-5 xl:flex-row xl:items-center xl:gap-5 xl:px-6 xl:py-5 2xl:flex-row 2xl:items-center 2xl:gap-6 2xl:px-7 2xl:py-6">
        <div className="flex w-full flex-col gap-1.5 xl:min-w-[190px] xl:max-w-[210px] xl:flex-shrink-0 2xl:min-w-[190px] 2xl:max-w-[210px] 2xl:flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-logo text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px] ${tk.planName}`}
            >
              {plan.name}
            </span>
            <SaveBadge plan={plan} tk={tk} />
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className={`text-[28px] font-extrabold leading-none sm:text-[32px] 2xl:text-[36px] ${tk.price}`}
            >
              ${plan.price}
            </span>
            <span className={`text-[11px] font-medium sm:text-[12px] ${tk.pricePeriod}`}>
              {getPeriodLabel(plan.package_type)}
            </span>
          </div>

          {getMonthlyBreakdown(plan.price, plan.package_type) && (
            <p className={`text-[10px] sm:text-[11px] ${tk.subHeading}`}>
              {getMonthlyBreakdown(plan.price, plan.package_type)}
            </p>
          )}

          {plan.per_month_price && (
            <p className={`text-[10px] sm:text-[11px] ${tk.subHeading}`}>
              (${plan.per_month_price}/mo)
            </p>
          )}
        </div>

        <div
          className={`flex flex-1 flex-col gap-2 border-t pt-4 sm:gap-2.5 sm:pt-5 xl:gap-2.5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0 2xl:border-l 2xl:border-t-0 2xl:pl-6 2xl:pt-0 ${tk.divider}`}
        >
          {(plan.features || []).map((feature, featureIndex) => (
            <motion.div
              key={`${plan.id}-featured-${featureIndex}`}
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + featureIndex * 0.06, duration: 0.32 }}
            >
              <CheckIcon tk={tk} />
              <span
                className={`text-[11px] font-medium leading-[1.2] sm:text-[12px] xl:text-[13px] 2xl:text-[13px] ${tk.featureFeatText}`}
              >
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex w-full items-center xl:w-auto xl:flex-shrink-0 xl:pl-5 2xl:w-auto 2xl:flex-shrink-0 2xl:pl-6">
          {isCurrentPlan ? (
            <button
              type="button"
              disabled
              className={`flex h-[38px] w-full cursor-not-allowed items-center justify-center rounded-full border px-3 text-[11px] font-bold sm:h-[40px] sm:text-[12px] xl:h-[40px] xl:w-[150px] xl:text-[12px] 2xl:h-[42px] 2xl:w-[160px] ${tk.currentBtnBorder} ${tk.currentBtnText}`}
              style={{ background: tk.currentBtnBg }}
            >
              Start Free Trial
            </button>
          ) : (
            <motion.button
              type="button"
              onClick={() => onSelect(plan)}
              disabled={!!loadingPlanId}
              className={`flex h-[38px] w-full cursor-pointer items-center justify-center rounded-full border px-3 text-[11px] font-bold disabled:opacity-60 sm:h-[40px] sm:text-[12px] xl:h-[40px] xl:w-[150px] xl:text-[12px] 2xl:h-[42px] 2xl:w-[160px] ${tk.btnBorder} ${tk.btnText}`}
              style={{ background: tk.btnBg }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 22px rgba(10,144,135,0.35)",
              }}
              whileTap={{ scale: 0.96 }}
            >
              {isThisLoading ? "Loading..." : "Start Free Trial"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function FreeTrialPopup({ isOpen, onClose }) {
  const { theme } = useTheme();
  const tk = tokens[theme] ?? tokens.dark;
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const { data: plansResponse, isLoading: plansLoading } = useGet(
    "/subscriptions-tiers/",
    {
      queryKey: ["popup-subscriptions-tiers"],
    },
  );

  const { mutate: checkout } = usePost(null, {
    secure: true,
    onSuccess: (data) => {
      const url = data?.data?.url;
      if (url) {
        window.location.href = url;
      }
      setLoadingPlanId(null);
    },
    onError: () => {
      setLoadingPlanId(null);
    },
  });

  if (!isOpen) return null;

  const rawPlans = plansResponse?.data || plansResponse?.subscription_plans || [];
  const featuredPlan =
    rawPlans.find((plan) => plan.package_type === "quarterly") ||
    rawPlans[0] ||
    null;
  const smallPlans = rawPlans.filter((plan) => plan.id !== featuredPlan?.id);
  const sliderPlans = featuredPlan ? [featuredPlan, ...smallPlans] : smallPlans;

  const handleSelectPlan = (plan) => {
    setLoadingPlanId(plan.id);
    checkout({
      url: `/subscription/${plan.id}/checkout/`,
      data: { plan_id: plan.id },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 z-[3000] ${
              theme === "dark"
                ? "bg-black/75 backdrop-blur-md"
                : "bg-slate-900/40 backdrop-blur-sm"
            }`}
          />

          <div className="popup-scroll-hidden fixed inset-0 z-[3001] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-2 sm:p-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 24 }}
                transition={{ type: "spring", duration: 0.45 }}
                className={`relative flex max-h-[88vh] w-[92vw] max-w-4xl flex-col overflow-hidden rounded-[18px] shadow-2xl sm:w-full sm:max-w-[58rem] sm:rounded-[22px] lg:max-h-[68vh] xl:max-h-[76vh] xl:max-w-[56rem] xl:rounded-[18px] 2xl:max-h-[80vh] 2xl:max-w-4xl 2xl:rounded-[22px] ${tk.modalBg}`}
              >
                <style>{`
                  .popup-scroll-hidden {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                  }
                  .popup-scroll-hidden::-webkit-scrollbar {
                    display: none;
                  }
                  .popup-plans-swiper .swiper-pagination-bullet {
                    background: ${tk.dotColor};
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    transition: all 0.3s ease;
                  }
                  .popup-plans-swiper .swiper-pagination-bullet-active {
                    background: ${tk.dotActive};
                    width: 22px;
                    border-radius: 9999px;
                  }
                  .popup-plans-swiper .swiper-slide {
                    height: auto;
                  }
                `}</style>

                <CloseButton onClick={onClose} isDark={theme === "dark"} />

                <div className="popup-scroll-hidden overflow-y-auto p-3 pt-4 sm:p-4 sm:pt-5 lg:p-4 xl:p-3.5 xl:pt-3.5 2xl:p-5">
                  <motion.div
                    className="mb-3 text-center sm:mb-4 xl:mb-3 2xl:mb-4"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    <p className="mb-1.5 inline-flex rounded-full bg-[#0A9087]/12 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[#0A9087] sm:mb-2 sm:px-3 sm:text-[9px]">
                      Subscription Tiers
                    </p>
                    <h2
                      className={`mb-1 text-[18px] font-extrabold uppercase tracking-[0.08em] sm:text-[22px] lg:text-[24px] xl:text-[20px] 2xl:text-[26px] ${tk.heading}`}
                    >
                      Choose Your Plan
                    </h2>
                    <p className={`mx-auto max-w-xl text-[11px] leading-relaxed sm:text-[12px] xl:text-[12px] 2xl:text-[12px] ${tk.subHeading}`}>
                      Choose a plan and start your free trial.
                    </p>
                  </motion.div>

                  {plansLoading ? (
                    <ScreenLoader
                      fullScreen={false}
                      containerClassName="min-h-[220px] sm:min-h-[240px] px-4 py-8"
                    />
                  ) : (
                    <>
                      <div
                        className={`mb-3 rounded-xl px-3 py-2 text-center text-[10px] sm:mb-4 sm:px-3.5 sm:py-2.5 sm:text-[11px] xl:mb-3 xl:px-3.5 xl:py-2 xl:text-[10px] 2xl:mb-4 2xl:px-3.5 2xl:py-2.5 2xl:text-[11px] ${tk.noteBg} ${tk.noteText}`}
                      >
                        Pick your plan and continue.
                      </div>

                      <div className="mt-2 sm:mt-3 xl:hidden">
                        <Swiper
                          modules={[Pagination]}
                          pagination={{ clickable: true }}
                          grabCursor
                          centeredSlides
                          breakpoints={{
                            0: { slidesPerView: 1.14, spaceBetween: 10 },
                            480: { slidesPerView: 1.24, spaceBetween: 12 },
                            640: { slidesPerView: 1.38, spaceBetween: 12 },
                            768: { slidesPerView: 1.58, spaceBetween: 14 },
                            1024: { slidesPerView: 2, spaceBetween: 18 },
                          }}
                          className="popup-plans-swiper !pb-8 sm:!pb-10"
                        >
                          {sliderPlans.map((plan, idx) => (
                            <SwiperSlide key={plan.id}>
                              <PlanCard
                                plan={plan}
                                idx={idx}
                                tk={tk}
                                loadingPlanId={loadingPlanId}
                                onSelect={handleSelectPlan}
                                isFeatured={plan.id === featuredPlan?.id}
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>

                      <div className="mt-3 hidden xl:block">
                        {featuredPlan && (
                          <FeaturedPlanRow
                            plan={featuredPlan}
                            tk={tk}
                            loadingPlanId={loadingPlanId}
                            onSelect={handleSelectPlan}
                          />
                        )}

                        {smallPlans.length > 0 && (
                          <div
                            className="grid gap-2.5 xl:gap-2.5 2xl:gap-4"
                            style={{
                              gridTemplateColumns: `repeat(${Math.min(smallPlans.length, 4)}, minmax(0, 1fr))`,
                            }}
                          >
                            {smallPlans.map((plan, idx) => (
                              <PlanCard
                                key={plan.id}
                                plan={plan}
                                idx={idx}
                                tk={tk}
                                loadingPlanId={loadingPlanId}
                                onSelect={handleSelectPlan}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {rawPlans.length === 0 && (
                        <p className={`py-10 text-center text-sm sm:py-14 ${tk.emptyText}`}>
                          No subscription plans available right now.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
