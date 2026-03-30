import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import ratting from "../../../assets/home/rating.png";
import correct from "../../../assets/home/icon/correct.png";
import { useNavigate } from "react-router-dom";

// ── Variants ──
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const dividerVariant = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
  },
};

// ✅ Format "2026-03-04" → "MAR 4, 2026"
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
};

function InView({ children, variants, delay, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

function ReviewCard({ review, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative bg-[#032422] rounded-2xl p-6 sm:p-8 flex flex-col overflow-hidden h-full"
      variants={cardVariant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 30px rgba(10,144,135,0.15)",
        transition: { duration: 0.25 },
      }}
    >
      {/* Rating */}
      <motion.div
        className="flex justify-start mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15 + index * 0.1 }}
      >
        <img src={ratting} alt="rating" className="h-5 w-auto object-contain" />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="font-logo text-white font-bold text-[16px] lg:text-[18px] leading-tight mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.2 + index * 0.1 }}
      >
        {review.title}
      </motion.h3>

      {/* Teal divider */}
      <motion.div
        className="h-[2px] w-8 bg-[#0A9087] rounded-full mb-2 lg:mb-4 origin-left"
        variants={dividerVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />

      {/* Review text */}
      <motion.p
        className="text-white/70 font-logo font-normal text-[12px] lg:text-[14px] leading-[18px] lg:leading-[24px] flex-grow"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      >
        {review.content}
      </motion.p>

      {/* Footer */}
      <motion.div
        className="mt-2 pt-2 lg:mt-6 lg:pt-4"
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
      >
        <h4 className="font-logo text-white font-bold text-[14px] mb-2">
          {review.user_name}
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img
              src={correct}
              alt="verified"
              className="w-4 h-4 flex-shrink-0"
            />
            <p className="font-logo font-medium text-[11px] sm:text-[12px] leading-none text-[#0A9087]">
              Verified Customer
            </p>
          </div>
          <p className="font-logo font-medium text-[10px] sm:text-[11px] leading-none text-white/40">
            {formatDate(review.date_posted)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SportsFan({ data }) {
  const nagigate = useNavigate();
  const reviews = data ?? [];

  // Mobile: < 768px | Tablet: 768px–1279px | Desktop: >= 1280px
  const getScreenType = () => {
    const w = window.innerWidth;
    if (w >= 1280) return "desktop";
    if (w >= 768) return "tablet";
    return "mobile";
  };

  const [screenType, setScreenType] = useState(getScreenType());

  useEffect(() => {
    const handleResize = () => setScreenType(getScreenType());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = screenType === "desktop";

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const intervalRef = useRef(null);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(intervalRef.current);
    startAutoSlide();
  };

  useEffect(() => {
    if (reviews.length > 0) startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [reviews.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && activeIndex < reviews.length - 1) {
      setActiveIndex(activeIndex + 1);
      resetAutoSlide();
    }
    if (diff < -50 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      resetAutoSlide();
    }
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
    resetAutoSlide();
  };

  if (reviews.length === 0) return null;

  return (
    <div className="bg-[#021716] relative overflow-hidden py-16 sm:py-24">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0A9087]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <InView
          variants={fadeUp}
          delay={0}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-white font-logo uppercase font-extrabold text-[18px] sm:text-3xl lg:text-[36px] leading-tight">
            TRUSTED BY SPORTS FANS
          </h2>
        </InView>

        {/* ── Mobile & Tablet Slider (< 1280px) ── */}
        {!isDesktop && (
          <div>
            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="px-1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ReviewCard review={reviews[activeIndex]} index={0} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {reviews.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="rounded-full cursor-pointer"
                  style={{
                    width: index === activeIndex ? "24px" : "10px",
                    height: "10px",
                    background:
                      index === activeIndex
                        ? "#0A9087"
                        : "rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease",
                  }}
                  whileTap={{ scale: 0.85 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Desktop Grid (>= 1280px) ── */}
        {isDesktop && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        )}

        {/* CTA Button */}
        <InView
          variants={fadeUp}
          delay={0.2}
          className="mt-12 flex justify-center"
        >
          <motion.button
            onClick={() => nagigate("/sign-up")}
            className="w-[215px] h-[44px] rounded-full border border-[#0A9087] font-logo text-white font-extrabold text-[16px] leading-none text-center flex justify-center items-center cursor-pointer"
            whileHover={{
              scale: 1.06,
              backgroundColor: "#087a72",
              boxShadow: "0 0 25px rgba(10,144,135,0.4)",
              transition: { duration: 0.22 },
            }}
            whileTap={{ scale: 0.96 }}
          >
            JOIN NOW
          </motion.button>
        </InView>
      </div>
    </div>
  );
}
