import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../../assets/festival/1.png";
import img2 from "../../assets/festival/2.png";
import img3 from "../../assets/festival/3.png";
import img4 from "../../assets/festival/4.png";
import img5 from "../../assets/festival/5.png";
import img6 from "../../assets/festival/6.png";
import img7 from "../../assets/festival/7.png";
import img8 from "../../assets/festival/8.png";
import img9 from "../../assets/festival/9.png";
import img10 from "../../assets/festival/10.png";

export default function Festival() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const autoPlayTimeoutRef = useRef(null);
  const lastScrollTimeRef = useRef(0);

  // Demo images array (replace with your actual images)

  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

  const animations = [
    {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.2 },
      transition: { duration: 0.5, ease: "easeOut" },
    },
    {
      initial: { opacity: 0, rotate: -10, scale: 0.9 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      exit: { opacity: 0, rotate: 10, scale: 0.9 },
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    {
      initial: { opacity: 0, x: -200, rotateY: -45 },
      animate: { opacity: 1, x: 0, rotateY: 0 },
      exit: { opacity: 0, x: 200, rotateY: 45 },
      transition: { duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] },
    },
    {
      initial: { opacity: 0, y: 100, scale: 0.5 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -100, scale: 0.5 },
      transition: { duration: 0.4, type: "spring", bounce: 0.3 },
    },
    {
      initial: { opacity: 0, rotateX: 90, scale: 0.8 },
      animate: { opacity: 1, rotateX: 0, scale: 1 },
      exit: { opacity: 0, rotateX: -90, scale: 0.8 },
      transition: { duration: 0.5, ease: "easeOut" },
    },
    {
      initial: { opacity: 0, scale: 1.5, filter: "blur(20px)" },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, scale: 0.5, filter: "blur(20px)" },
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    {
      initial: { opacity: 0, y: 300, skewY: 5 },
      animate: { opacity: 1, y: 0, skewY: 0 },
      exit: { opacity: 0, y: -300, skewY: -5 },
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    {
      initial: { opacity: 0, scale: 0 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    {
      initial: { opacity: 0, rotateY: 180, scale: 0.7 },
      animate: { opacity: 1, rotateY: 0, scale: 1 },
      exit: { opacity: 0, rotateY: -180, scale: 0.7 },
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    {
      initial: { opacity: 0, x: -100, y: -100, rotate: -20 },
      animate: { opacity: 1, x: 0, y: 0, rotate: 0 },
      exit: { opacity: 0, x: 100, y: 100, rotate: 20 },
      transition: { duration: 0.5, ease: "easeOut" },
    },
  ];

  const changeSlide = useCallback(
    (newIndex, dir) => {
      const now = Date.now();

      // Minimum 300ms between transitions for smoothness
      if (now - lastScrollTimeRef.current < 300) return;

      if (
        newIndex >= 0 &&
        newIndex < images.length &&
        newIndex !== currentSlide
      ) {
        lastScrollTimeRef.current = now;
        setDirection(dir);
        setCurrentSlide(newIndex);
        setIsAnimating(true);

        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }
    },
    [currentSlide, images.length]
  );

  // Auto play effect
  useEffect(() => {
    if (!autoPlay) return;

    const autoScrollInterval = setInterval(() => {
      if (!isAnimating) {
        const nextSlide =
          currentSlide < images.length - 1 ? currentSlide + 1 : 0;
        changeSlide(nextSlide, 1);
      }
    }, 8000);

    return () => clearInterval(autoScrollInterval);
  }, [currentSlide, isAnimating, autoPlay, images.length, changeSlide]);

  // Scroll handler with throttling
  useEffect(() => {
    let scrollAccumulator = 0;
    let scrollTimeout = null;

    const handleScroll = (e) => {
      e.preventDefault();

      setAutoPlay(false);
      clearTimeout(autoPlayTimeoutRef.current);

      scrollAccumulator += e.deltaY;

      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Immediate response for strong scroll
      if (Math.abs(scrollAccumulator) > 80) {
        if (scrollAccumulator > 0 && currentSlide < images.length - 1) {
          changeSlide(currentSlide + 1, 1);
        } else if (scrollAccumulator < 0 && currentSlide > 0) {
          changeSlide(currentSlide - 1, -1);
        }
        scrollAccumulator = 0;
      } else {
        // Debounce for small scrolls
        scrollTimeout = setTimeout(() => {
          if (Math.abs(scrollAccumulator) > 30) {
            if (scrollAccumulator > 0 && currentSlide < images.length - 1) {
              changeSlide(currentSlide + 1, 1);
            } else if (scrollAccumulator < 0 && currentSlide > 0) {
              changeSlide(currentSlide - 1, -1);
            }
          }
          scrollAccumulator = 0;
        }, 100);
      }

      autoPlayTimeoutRef.current = setTimeout(() => setAutoPlay(true), 4000);
    };

    const handleKeyDown = (e) => {
      setAutoPlay(false);
      clearTimeout(autoPlayTimeoutRef.current);

      if (
        (e.key === "ArrowDown" || e.key === " ") &&
        currentSlide < images.length - 1
      ) {
        e.preventDefault();
        changeSlide(currentSlide + 1, 1);
      } else if (e.key === "ArrowUp" && currentSlide > 0) {
        e.preventDefault();
        changeSlide(currentSlide - 1, -1);
      } else if (e.key === "Home") {
        e.preventDefault();
        changeSlide(0, -1);
      } else if (e.key === "End") {
        e.preventDefault();
        changeSlide(images.length - 1, 1);
      }

      autoPlayTimeoutRef.current = setTimeout(() => setAutoPlay(true), 4000);
    };

    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchMove = (e) => {
      // Prevent bounce effect on iOS
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      setAutoPlay(false);
      clearTimeout(autoPlayTimeoutRef.current);

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const diff = touchStartY - touchEndY;
      const timeDiff = touchEndTime - touchStartTime;
      const velocity = Math.abs(diff) / timeDiff;

      // Swipe detection: minimum 30px movement or high velocity
      if ((Math.abs(diff) > 30 || velocity > 0.5) && timeDiff < 300) {
        if (diff > 0 && currentSlide < images.length - 1) {
          changeSlide(currentSlide + 1, 1);
        } else if (diff < 0 && currentSlide > 0) {
          changeSlide(currentSlide - 1, -1);
        }
      }

      autoPlayTimeoutRef.current = setTimeout(() => setAutoPlay(true), 4000);
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      clearTimeout(autoPlayTimeoutRef.current);
    };
  }, [currentSlide, images.length, changeSlide]);

  // Safe animation getter
  const getCurrentAnimation = () => {
    const index = currentSlide % animations.length;
    return animations[index];
  };

  const currentAnimation = getCurrentAnimation();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      <div>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="fixed top-6 left-6 z-50 p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          title={autoPlay ? "Pause auto play" : "Resume auto play"}
        >
          {autoPlay ? (
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => window.history.back()}
          className="fixed top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          title="Close"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Navigation buttons */}
      <div className="fixed top-1/2 left-6 -translate-y-1/2 z-50 flex flex-col gap-3">
        <button
          onClick={() => changeSlide(Math.max(0, currentSlide - 1), -1)}
          disabled={currentSlide === 0}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
          title="Previous"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <button
          onClick={() =>
            changeSlide(Math.min(images.length - 1, currentSlide + 1), 1)
          }
          disabled={currentSlide === images.length - 1}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
          title="Next"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Slide counter */}
      <div className="fixed bottom-6 left-6 z-50 text-white/70 font-mono text-sm backdrop-blur-sm bg-black/20 px-3 py-2 rounded-full border border-white/10">
        <span className="text-xl font-bold text-white">
          {String(currentSlide + 1).padStart(2, "0")}
        </span>
        <span className="mx-1.5">/</span>
        <span>{String(images.length).padStart(2, "0")}</span>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white/50"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentSlide + 1) / images.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={currentAnimation.initial}
            animate={currentAnimation.animate}
            exit={currentAnimation.exit}
            transition={currentAnimation.transition}
            className="absolute w-full h-full flex items-center justify-center p-4"
            style={{ perspective: 1000 }}
          >
            <img
              src={images[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="max-w-full max-h-full object-contain"
              draggable={false}
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {currentSlide === 0 && !isAnimating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
            Scroll • Arrow keys • Swipe
          </span>
          <motion.svg
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </motion.div>
      )}
    </div>
  );
}
