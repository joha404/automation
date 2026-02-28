import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#069087" />
    <path
      d="M7 12.5l3.5 3.5 6.5-7"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

const features = [
  "Results Tracking",
  "All standard predictions",
  "Play of the day",
  "Player props",
];

const allPlans = [
  {
    id: "quarterly",
    name: "QUARTERLY",
    badge: "MOST POPULAR",
    saveBadge: "SAVE $20",
    price: "$129.99",
    period: "/quarter",
    sub: "($43.33/mo)",
    featured: true,
  },
  {
    id: "weekly",
    name: "WEEKLY",
    price: "$14.99",
    period: "/week",
    sub: null,
  },
  {
    id: "monthly",
    name: "MONTHLY",
    price: "$49.99",
    period: "/month",
    sub: null,
  },
  {
    id: "annually",
    name: "ANNUALLY",
    price: "$449.99",
    period: "/year",
    sub: "($37.50/mo)",
    saveBadge: "SAVE $150",
  },
];

const smallPlans = allPlans.filter((p) => !p.featured);

function MobileSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) setActiveSlide((p) => Math.min(p + 1, allPlans.length - 1));
    if (diff < -45) setActiveSlide((p) => Math.max(p - 1, 0));
  };

  return (
    <div className="block sm:hidden">
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${activeSlide * 100}%)`,
            transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {allPlans.map((plan) => (
            <div key={plan.id} className="min-w-full px-2">
              <div
                className="rounded-2xl relative overflow-hidden flex flex-col"
                style={{
                  background: plan.featured
                    ? "linear-gradient(201.03deg, #4D5456 -21.17%, #020C0B 62.19%)"
                    : "linear-gradient(175deg, rgba(28,52,47,0.8) 0%, rgba(8,22,20,0.96) 100%)",
                  border: plan.featured
                    ? "1px solid #0A9087"
                    : "1px solid rgba(255,255,255,0.1)",
                  minHeight: "420px",
                }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(10,144,135,0.12) 0%, transparent 70%)",
                  }}
                />

                <div className="relative flex flex-col flex-1 p-6">
                  {/* Badges */}
                  <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                    {plan.badge && (
                      <span
                        className="text-[11px] font-extrabold px-3 py-1 rounded-md tracking-widest uppercase"
                        style={{
                          background: "rgba(10,144,135,0.25)",
                          color: "#0ee8d8",
                        }}
                      >
                        {plan.badge}
                      </span>
                    )}
                    {plan.saveBadge && (
                      <span
                        className="text-[11px] font-extrabold px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(10,144,135,0.2)",
                          color: "#0ee8d8",
                        }}
                      >
                        {plan.saveBadge}
                      </span>
                    )}
                  </div>

                  {/* Plan name */}
                  <p className="text-white font-extrabold text-[15px] tracking-widest uppercase text-center mb-4">
                    {plan.name}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 justify-center mb-1">
                    <span
                      className="text-white font-extrabold leading-none"
                      style={{ fontSize: "44px" }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-white/45 text-[16px] font-medium">
                      {plan.period}
                    </span>
                  </div>
                  {plan.sub && (
                    <p className="text-white/35 text-[13px] text-center mb-2">
                      {plan.sub}
                    </p>
                  )}

                  {/* Features */}
                  <div className="flex flex-col gap-3 flex-1 mt-5 mb-6">
                    {features.map((f, i) => (
                      <motion.div
                        key={f}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35 }}
                      >
                        <CheckIcon />
                        <span className="text-white/80 text-[15px] font-medium">
                          {f}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Button */}
                  <motion.button
                    className="w-full h-[48px] rounded-full font-extrabold text-white text-[13px] tracking-widest uppercase cursor-pointer"
                    style={{ background: "#0A9087" }}
                    whileHover={{
                      scale: 1.04,
                      backgroundColor: "#087a72",
                      boxShadow: "0 0 22px rgba(10,144,135,0.5)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                  >
                    SELECT PLAN
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {allPlans.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setActiveSlide(i)}
            className="rounded-full cursor-pointer"
            style={{
              width: i === activeSlide ? "24px" : "10px",
              height: "10px",
              background:
                i === activeSlide ? "#0A9087" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
            }}
            whileTap={{ scale: 0.85 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Subscription() {
  return (
    <div className="bg-[#040e0d] min-h-screen py-16 px-4">
      {/* Heading */}
      <motion.div
        className="text-center mb-12"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <h1
          className="text-white font-extrabold uppercase tracking-widest mb-2"
          style={{
            fontSize: "clamp(26px, 4vw, 40px)",
            letterSpacing: "0.18em",
          }}
        >
          SUBSCRIPTIONS
        </h1>
        <p className="text-white/55 text-[15px]">
          Quick, simple, and straight to the point
        </p>
      </motion.div>

      {/* ── MOBILE SLIDER ── */}
      <MobileSlider />

      {/* ── DESKTOP ── */}
      <div className="hidden sm:block max-w-7xl mx-auto">
        {/* Featured Quarterly Card */}
        <motion.div
          className="rounded-2xl lg:h-[279px] mb-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(201.03deg, #4D5456 -21.17%, #020C0B 62.19%)",
            border: "1px solid #0A9087",
          }}
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          custom={0.05}
          whileHover={{ scale: 1.012, transition: { duration: 0.25 } }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 55% 60% at 15% 10%, rgba(10,144,135,0.13) 0%, transparent 70%)",
            }}
          />

          <div className="relative flex flex-row items-center h-full gap-6 px-10 py-8">
            {/* Left */}
            <div className="flex-shrink-0 min-w-[240px]">
              <div className="mb-4">
                <span
                  className="font-extrabold text-[12px] tracking-widest uppercase px-4 py-2 rounded-md text-white"
                  style={{ background: "#0A9087" }}
                >
                  MOST POPULAR
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-logo font-bold text-[12px] tracking-widest uppercase">
                  QUARTERLY
                </span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded"
                  style={{
                    background: "#00C08026",
                    color: "#00C080",
                  }}
                >
                  SAVE $20
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-white font-extrabold leading-none"
                  style={{ fontSize: "48px" }}
                >
                  $129.99
                </span>
                <span className="text-white/45 text-[17px] font-medium">
                  /quarter
                </span>
              </div>
              <p className="text-white/35 text-center text-[13px] mt-1">
                ($43.33/mo)
              </p>
            </div>

            {/* Middle */}
            <div className="flex-1 flex flex-col gap-3 pl-8">
              {features.map((f, i) => (
                <motion.div
                  key={f}
                  className="flex items-center gap-2.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.38 }}
                >
                  <CheckIcon />
                  <span className="text-[#e2f0ee] text-[15px] font-medium">
                    {f}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Right CTA */}
            <div className="flex-shrink-0 pl-8">
              <motion.button
                className="cursor-pointer w-[210px] h-[48px] px-[30px] rounded-full border border-[#0A9087] font-bold text-[15px] text-white flex justify-center items-center"
                style={{
                  background:
                    "linear-gradient(3.11deg, #020C0B -44.12%, #055651 149.92%)",
                }}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 22px rgba(10,144,135,0.55)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.18 }}
              >
                SELECT PLAN
              </motion.button>
            </div>
          </div>
        </motion.div>
        {/* 3 smaller cards */}
        <div className="flex flex-wrap justify-center gap-16 my-16">
          {smallPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              className="rounded-2xl h-full lg:h-[446px] w-full lg:w-[350px] flex flex-col relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(201.03deg, #4D5456 -21.17%, #020C0B 62.19%)",
                border: "1px solid #858F95",
              }}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              custom={0.15 + idx * 0.1}
              whileHover={{ scale: 1.03, transition: { duration: 0.22 } }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(10,144,135,0.09) 0%, transparent 70%)",
                }}
              />

              <div className="relative flex flex-col flex-1 px-10 pt-10 pb-8">
                {/* Name + Badge */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <p className="text-white font-bold font-logo text-[16px] tracking-widest uppercase">
                    {plan.name}
                  </p>
                  {plan.saveBadge && (
                    <span className="h-[25px] py-[5px] font-logo font-bold text-[12px] px-[10px] rounded-full bg-[#C27AFF33] text-[#C27AFF]">
                      {plan.saveBadge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span
                    className="text-white font-normal font-logo leading-none"
                    style={{ fontSize: "48px" }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-white/45 font-logo text-[16px] font-normal">
                    {plan.period}
                  </span>
                </div>
                {plan.sub && (
                  <p className="text-white/35 text-center text-[12px] mb-2">
                    {plan.sub}
                  </p>
                )}

                {/* Features */}
                <div className="flex flex-col gap-3 flex-1 mt-8 mb-8">
                  {features.map((f, i) => (
                    <motion.div
                      key={f}
                      className="flex items-center gap-2.5"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.3 + idx * 0.1 + i * 0.06,
                        duration: 0.35,
                      }}
                    >
                      <CheckIcon />
                      <span className="text-white/80 text-[15px] font-medium">
                        {f}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Button */}
                <motion.button
                  className="cursor-pointer w-full h-[48px] px-[30px] rounded-full border border-[#0A9087] font-logo font-bold text-[16px] text-white flex justify-center items-center"
                  style={{
                    background:
                      "linear-gradient(3.11deg, #020C0B -44.12%, #055651 149.92%)",
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 0 22px rgba(10,144,135,0.55)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                >
                  SELECT PLAN
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
