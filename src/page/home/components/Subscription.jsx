import React, { useState, useRef } from "react";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#069087" />
    <path
      d="M7 12.5l3.5 3.5 6.5-7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#1e3332" />
    <path
      d="M8.5 8.5l7 7M15.5 8.5l-7 7"
      stroke="#4a6b65"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const plans = [
  {
    id: "live",
    name: "LIVE",
    price: { monthly: 34.99, annually: 26.24 },
    perDay: { monthly: 1.15, annually: 0.86 },
    features: [
      { label: "Live betting", included: true },
      { label: "Full automation", included: false },
      { label: "All standard predictions", included: false },
      { label: "Play of the day", included: false },
      { label: "Player props", included: false },
    ],
  },
  {
    id: "potd",
    name: "PLAY OF THE DAY",
    price: { monthly: 24.99, annually: 18.74 },
    perDay: { monthly: 0.83, annually: 0.62 },
    features: [
      { label: "Play of the day", included: true },
      { label: "Full automation", included: false },
      { label: "All standard predictions", included: false },
      { label: "Live betting", included: false },
      { label: "Player props", included: false },
    ],
  },
  {
    id: "props",
    name: "PLAYER PROPS",
    price: { monthly: 24.99, annually: 18.74 },
    perDay: { monthly: 0.83, annually: 0.62 },
    features: [
      { label: "Player props", included: true },
      { label: "Full automation", included: false },
      { label: "All standard predictions", included: false },
      { label: "Live betting", included: false },
      { label: "Play of the day", included: false },
    ],
  },
];

export default function Subscription() {
  const [billing, setBilling] = useState("monthly");
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(null);

  const ultimatePrice = billing === "monthly" ? 49.99 : 37.49;
  const ultimatePerDay = billing === "monthly" ? 1.64 : 1.23;

  const allMobileCards = [
    {
      id: "ultimate",
      name: "ULTIMATE PREDICTIONS",
      subtitle: "OUR BEST PLAN",
      price: ultimatePrice,
      perDay: ultimatePerDay,
      features: [
        { label: "All standard predictions", included: true },
        { label: "Live betting", included: true },
        { label: "Play of the day", included: true },
        { label: "Player props", included: true },
      ],
    },
    ...plans.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: null,
      price: billing === "monthly" ? p.price.monthly : p.price.annually,
      perDay: billing === "monthly" ? p.perDay.monthly : p.perDay.annually,
      features: p.features,
    })),
  ];

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50)
      setActiveSlide((p) => Math.min(p + 1, allMobileCards.length - 1));
    if (diff < -50) setActiveSlide((p) => Math.max(p - 1, 0));
  };

  return (
    <div className="bg-[#020C0B] relative overflow-hidden py-16 sm:py-24 min-h-screen">
      {/* BG glow */}

      {/* Vertical dashed line desktop */}
      <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-[#0A9087]/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="font-logo font-extrabold uppercase text-white text-[18px] lg:text-[36px] tracking-wide mb-2">
            PRECISION PLANS
          </h2>
          <p className="font-logo font-normal text-white/50 text-[14px] sm:text-[15px]">
            Quick, simple, and straight to the point
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-3">
          <div className="flex rounded-full border border-[#0A9087]/40 overflow-hidden">
            <button
              onClick={() => setBilling("monthly")}
              className={`font-logo font-extrabold text-[16px]  tracking-widest uppercase px-8 py-3 transition-all duration-300 cursor-pointer ${
                billing === "monthly"
                  ? "bg-[#0A9087] text-white"
                  : "bg-transparent text-white/60 hover:text-white"
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setBilling("annually")}
              className={`font-logo font-extrabold text-[16px]  tracking-widest uppercase px-8 py-3 transition-all duration-300 cursor-pointer ${
                billing === "annually"
                  ? "bg-[#0A9087] text-white"
                  : "bg-transparent text-white/60 hover:text-white"
              }`}
            >
              ANNUALLY
            </button>
          </div>
        </div>

        <p className="text-center font-logo font-normal text-white/40 text-[12px] mb-10">
          Switch to annual and save 25%
        </p>

        {/* ══ DESKTOP ══ */}
        <div className="hidden sm:block">
          {/* Ultimate Featured Card */}
          <div
            className=" border-[#0A9087] h-[248px] p-7 mb-5 flex items-center  *:
           rotate-0 opacity-100 pt-[50px] pr-[108px] pb-[50px] pl-[108px] gap-[128px] rounded-[16px] border-[1px] bg-[linear-gradient(198.19deg,rgba(133,143,149,0.39)-28.51%,rgba(133,143,149,0)67.29%)]
"
          >
            {/* Left: name + price */}
            <div className="w-52 flex-shrink-0">
              <p className="font-logo font-extrabold text-[14px] tracking-widest uppercase text-white mb-0.5">
                ULTIMATE PREDICTIONS
              </p>
              <p className="font-logo font-normal text-[14px] tracking-widest uppercase text-white/35 mb-4 letter-spacing-[1px]">
                OUR BEST PLAN
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-logo font-semibold text-white text-[39px] leading-none letter-spacing-[3px]">
                  ${ultimatePrice.toFixed(2)}
                </span>
                <span className="font-logo font-medium text-white/50 text-[19px] letter-spacing-[3px]">
                  /month
                </span>
              </div>
              <div className="mt-2">
                <span className="font-logo font-bold bg-[#032422] text-[10px] text-[#0A9087] px-2.5 py-1 rounded-full">
                  ${ultimatePerDay.toFixed(2)} /day
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="flex-1 flex flex-col gap-3">
              {[
                "All standard predictions",
                "Live betting",
                "Play of the day",
                "Player props",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="font-logo font-normal text-[#ECF6F4] text-[18px]">
                    {f}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <button className="w-[155px] h-[46px] rounded-full bg-[#0A9087] hover:bg-[#087a72] font-logo font-extrabold text-white text-[13px] tracking-widest uppercase transition-all duration-300 cursor-pointer">
                SELECT PLAN
              </button>
            </div>
          </div>

          {/* 3 smaller cards */}
          <div className="grid grid-cols-3 gap-5">
            {plans.map((plan) => {
              const price =
                billing === "monthly"
                  ? plan.price.monthly
                  : plan.price.annually;
              const perDay =
                billing === "monthly"
                  ? plan.perDay.monthly
                  : plan.perDay.annually;
              return (
                <div
                  key={plan.id}
                  className=" rotate-0 h-[446px] opacity-100 pt-[25px] pr-[58px] pb-[25px] pl-[58px] gap-[10px] rounded-[16px]  border-[1px] bg-[linear-gradient(201.03deg,rgba(133,143,149,0.39)-21.17%,rgba(133,143,149,0)62.19%)] p-6 flex flex-col border-[#0A9087]"
                >
                  <p className="font-logo font-bold letter-spacing-[1px] text-[14px] tracking-widest uppercase text-[#ECF6F4] mb-4 text-center">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-logo font-semibold text-white text-[39px] leading-none letter-spacing-[2px]">
                      ${price.toFixed(2)}
                    </span>
                    <span className="font-logo font-normal text-[#ECF6F4] text-[18px]">
                      /month
                    </span>
                  </div>
                  <div className="mb-5 text-center">
                    <span className="font-logo font-bold text-[#0A9087] text-[12px] bg-[#032422] px-2 py-0.5 rounded-full">
                      ${perDay.toFixed(2)} /day
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <div key={f.label} className="flex items-center gap-2.5">
                        {f.included ? <CheckIcon /> : <CrossIcon />}
                        <span
                          className={`font-logo font-normal text-[16px] ${f.included ? "text-white/80" : "text-white/35"}`}
                        >
                          {f.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full h-[54px] rounded-full bg-[#0A9087] hover:bg-[#087a72] hover:shadow-[0_0_20px_rgba(10,144,135,0.4)] font-logo font-bold text-white text-[16px]  tracking-widest uppercase transition-all duration-300 cursor-pointer">
                    SELECT PLAN
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ MOBILE SLIDER ══ */}
        <div className="block sm:hidden">
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {allMobileCards.map((card) => (
                <div key={card.id} className="min-w-full px-1">
                  <div className="rounded-2xl border border-[#0A9087]/30 bg-[#032422] p-6 flex flex-col">
                    <div className="text-center mb-6">
                      <p className="font-logo font-extrabold text-[14px] tracking-widest uppercase text-white mb-1">
                        {card.name}
                      </p>
                      {card.subtitle && (
                        <p className="font-logo font-medium text-[14px] tracking-widest uppercase text-white/35">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-logo font-extrabold text-white text-[39px] leading-none">
                        ${card.price.toFixed(2)}
                      </span>
                      <span className="font-logo font-medium text-white/50 text-[18px]">
                        /month
                      </span>
                    </div>
                    <div className="mb-6">
                      <span className="font-logo font-semibold text-[#0A9087] text-[12px] bg-[#0A9087]/10 px-2.5 py-1 rounded-full">
                        ${card.perDay.toFixed(2)} /day
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 flex-1 mb-7">
                      {card.features.map((f) => (
                        <div
                          key={f.label}
                          className="flex items-center gap-2.5"
                        >
                          {f.included ? <CheckIcon /> : <CrossIcon />}
                          <span
                            className={`font-logo font-medium text-[16px] ${f.included ? "text-white/80" : "text-white/35"}`}
                          >
                            {f.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full h-[48px] rounded-full bg-[#0A9087] hover:bg-[#087a72] hover:shadow-[0_0_25px_rgba(10,144,135,0.5)] font-logo font-extrabold text-white text-[14px] tracking-widest uppercase transition-all duration-300 cursor-pointer">
                      SELECT PLAN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {allMobileCards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeSlide
                    ? "w-6 h-2.5 bg-[#0A9087]"
                    : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
