import { generatePromos } from "@/api/giveWay/giveWay.api";
import React, { useState, useRef, useEffect } from "react";
import SlotReel from "./SlotReel";
import ResultModal from "./ResultModal";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSlotLayout } from "@/hooks/api/useSlotScale";

import toast from "react-hot-toast";

const ITEM_H = 90;
const COOLDOWN_SECONDS = 24 * 60 * 60;

export default function NeonSlotMachine({ fetchPromoCodes, loading }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(1);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [leverPull, setLeverPull] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const [isWinResult, setIsWinResult] = useState(false);
  const [resultPrize, setResultPrize] = useState("");
  const [resultPromoCode, setResultPromoCode] = useState("");

  const reel1Ref = useRef(null);
  const reel2Ref = useRef(null);
  const reel3Ref = useRef(null);

  const symbols = [
    {
      display: 5,
      value: "CHERRY",
      color: "text-gray-300",
      bgGlow: "rgba(156, 163, 175, 0.15)",
      font: "font-slot5",
    },
    {
      display: 10,
      value: "LEMON",
      color: "text-rose-600",
      bgGlow: "rgba(56, 189, 248, 0.25)",
    },
    {
      display: 20,
      value: "ORANGE",
      color: "text-lightBlue",
      bgGlow: "rgba(52, 211, 153, 0.3)",
    },
    {
      display: 25,
      value: "BELL",
      color: "text-purple-400",
      bgGlow: "rgba(129, 140, 248, 0.35)",
    },
    {
      display: 50,
      value: "GOLD",
      color: "text-green-400",
      bgGlow: "rgba(250, 204, 21, 0.45)",
      font: "font-slot50",
    },
    {
      display: 100,
      value: "GIFT",
      color: "text-yellow-400",
      bgGlow: "rgba(244, 63, 94, 0.6)",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getSymbolFromDiscount = (discount) => {
    const discountNum = parseInt(discount);
    if (discountNum === 5) return "CHERRY";
    if (discountNum === 10) return "LEMON";
    if (discountNum === 20) return "ORANGE";
    if (discountNum === 25) return "BELL";
    if (discountNum === 50) return "GOLD";
    if (discountNum === 100) return "GIFT";
    return "GIFT";
  };

  useEffect(() => {
    const lastSpinTime = localStorage.getItem("lastSlotSpinTime");
    if (lastSpinTime) {
      const elapsed = Math.floor(Date.now() / 1000) - parseInt(lastSpinTime);
      const timeLeft = Math.max(0, COOLDOWN_SECONDS - elapsed);
      setRemainingSeconds(timeLeft);
      setSpinsRemaining(timeLeft === 0 ? 1 : 0);
    } else {
      setSpinsRemaining(1);
      setRemainingSeconds(0);
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setSpinsRemaining(1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    if (seconds === 0) return "Spin";
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const { itemH, height } = useSlotLayout();

  const handleSpin = async () => {
    if (isSpinning || spinsRemaining === 0) return;

    // ✅ Check if user already spun today
    const lastSpinTime = localStorage.getItem("lastSlotSpinTime");
    if (lastSpinTime) {
      const now = Math.floor(Date.now() / 1000);
      const timeSinceLastSpin = now - parseInt(lastSpinTime);

      if (timeSinceLastSpin < COOLDOWN_SECONDS) {
        const remainingTime = COOLDOWN_SECONDS - timeSinceLastSpin;
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);

        toast.error(
          `You can spin again in ${hours}h ${minutes}m. Come back later!`,
        );
        return;
      }
    }

    setIsSpinning(true);
    setLeverPull(true);
    setShowResultModal(false);
    setTimeout(() => setLeverPull(false), 750);

    const reels = [reel1Ref.current, reel2Ref.current, reel3Ref.current];
    if (reels.some((r) => !r)) return;

    let hasWon = false;
    let finalIndices = [0, 0, 0];
    let prizeString = "Try Again! 🍀";
    let promoCodeString = "";

    try {
      const res = await generatePromos();
      const discountWon = res.discount_won;
      hasWon = discountWon && discountWon > 0;

      if (hasWon) {
        prizeString =
          res.reward_display ||
          res.discount_display ||
          `${discountWon}% discount!` ||
          "YOU WON!";

        // ✅ FIXED: Extract the actual code from the object
        promoCodeString =
          res.promo_code ||
          res.promo_code_details?.code ||
          res.promo_code_details?.promo_code ||
          (typeof res.promo_code_details === "string"
            ? res.promo_code_details
            : "") ||
          "CLAIM NOW";

        let winningSymbol = getSymbolFromDiscount(discountWon);
        const winIndex = symbols.findIndex((s) => s.value === winningSymbol);
        finalIndices = [winIndex, winIndex, winIndex];
      } else {
        prizeString = res.message || "Try Again! 🍀";
        const idx1 = Math.floor(Math.random() * symbols.length);
        let idx3 = idx1;
        while (idx3 === idx1) idx3 = Math.floor(Math.random() * symbols.length);
        finalIndices = [idx1, idx1, idx3];
      }
    } catch (err) {
      console.error(err);
      prizeString = "Try Again! 🍀";
      const idx1 = Math.floor(Math.random() * symbols.length);
      let idx3 = idx1;
      while (idx3 === idx1) idx3 = Math.floor(Math.random() * symbols.length);
      finalIndices = [idx1, idx1, idx3];
    }

    const CENTER_OFFSET = (height - itemH) / 2;

    reels.forEach((reel) => {
      reel.style.transition = "none";
      reel.style.transform = `translateY(0px)`;
    });
    reels.forEach((reel) => reel.offsetHeight);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const baseCycles = 8;
    const extraCycles = Math.floor(Math.random() * 4);

    reels.forEach((reel, i) => {
      const totalCycles = baseCycles + extraCycles;
      const symbolPosition =
        (totalCycles * symbols.length + finalIndices[i]) * itemH;
      const finalDistance = symbolPosition - CENTER_OFFSET;
      const duration = 3800 + i * 700;

      reel.style.transition = `transform ${duration}ms cubic-bezier(0.08, 0.82, 0.17, 1)`;
      reel.style.transform = `translateY(-${finalDistance}px)`;
    });

    await new Promise((resolve) => setTimeout(resolve, 3800 + 700 * 2 + 1000));

    localStorage.setItem(
      "lastSlotSpinTime",
      Math.floor(Date.now() / 1000).toString(),
    );

    setIsSpinning(false);
    setSpinsRemaining(0);
    setRemainingSeconds(COOLDOWN_SECONDS);
    setIsWinResult(hasWon);
    setResultPrize(prizeString);
    setResultPromoCode(promoCodeString);
    setShowResultModal(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Space+Grotesk:wght@400;600;700;800&display=swap');
        
        @keyframes leverPull { 0% { transform: translateX(-50%) rotate(0deg); } 50% { transform: translateX(-50%) rotate(45deg); } 100% { transform: translateX(-50%) rotate(0deg); } }
        @keyframes leverPullRotate { 0% { transform: rotate(0deg); } 50% { transform: rotate(-90deg); } 100% { transform: rotate(0deg); } }
        @keyframes mobileGlow { 0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); } }
        @keyframes mobilePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        
        .lever-stick.pull { animation: leverPull 0.75s ease; }
        .lever-container.pull { animation: leverPullRotate 0.75s ease; }
        
        @media (max-width: 767px) {
          .mobile-glow-effect { animation: mobileGlow 2s ease-in-out infinite; }
          .mobile-pulse-effect { animation: mobilePulse 2s ease-in-out infinite; }
        }
      `}</style>

      <div className="w-full flex items-center justify-center p-0 md:p-2 lg:p-4 relative overflow-hidden">
        <div
          className="fixed inset-0 pointer-events-none mix-blend-overlay"
          style={{
            opacity: isDark ? 0.2 : 0.06,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E")`,
            backgroundSize: "300px 300px",
          }}
        />

        <div className="w-full max-w-6xl relative overflow-hidden mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 px-3 md:px-7 pb-4 md:pb-10 relative z-10 items-center justify-center">
            <div className="relative w-full lg:flex-1 flex items-center justify-center">
              {/* Desktop/Tablet Design */}
              {!isMobile && (
                <div
                  className="grid place-items-center p-4 md:p-5 rounded-[26px] relative overflow-hidden w-full max-w-[640px]"
                  style={{
                    background: "#2d80ff",
                    boxShadow:
                      "inset 0 0 55px rgba(81,163,255,0.12), inset 0 0 55px rgba(45,128,255,0.10)",
                    border: "1px solid rgba(81,163,255,0.3)",
                  }}
                >
                  <div
                    className="w-full max-w-[640px] p-4 md:p-5 rounded-3xl relative overflow-hidden"
                    style={{
                      background: "#51a3ff",
                      boxShadow:
                        "0 12px 32px rgba(0,0,0,0.48), inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 28px rgba(81,163,255,0.26)",
                      border: "1px solid rgba(45,128,255,0.4)",
                    }}
                  >
                    <div
                      className="flex items-center justify-center gap-4 md:gap-5 p-4 md:p-5 rounded-[22px] relative overflow-hidden"
                      style={{
                        background: "#0853c2",
                        boxShadow: "inset 0 0 36px rgba(81,163,255,0.22)",
                        border: "1px solid rgba(45,128,255,0.3)",
                      }}
                    >
                      {[reel1Ref, reel2Ref, reel3Ref].map((ref, idx) => (
                        <SlotReel key={idx} reelRef={ref} symbols={symbols} />
                      ))}
                    </div>

                    <div className="mt-6">
                      <div
                        className={`p-4 rounded-xl border text-center cursor-pointer select-none ${
                          spinsRemaining > 0
                            ? "hover:scale-105 transition-transform"
                            : ""
                        }`}
                        style={{
                          background: "#252428",
                          boxShadow:
                            "inset 0 0 14px rgba(0,0,0,0.5), 0 0 18px rgba(81,163,255,0.20)",
                          border: "1px solid rgba(81,163,255,0.3)",
                        }}
                        onClick={spinsRemaining > 0 ? handleSpin : undefined}
                      >
                        <div
                          className={`text-2xl md:text-4xl font-black tracking-[2px] text-cyan-300 ${
                            spinsRemaining > 0 ? "hover:text-cyan-200" : ""
                          }`}
                          style={{
                            fontFamily: "'Orbitron', monospace",
                            textShadow: "0 0 18px rgba(81,163,255,0.45)",
                          }}
                        >
                          {formatTime(remainingSeconds)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Design */}
              {isMobile && (
                <div className="w-full px-2 mb-4 relative">
                  {/* Main Container - Compact Mobile Design */}
                  <div
                    className="w-full rounded-3xl overflow-hidden relative"
                    style={{
                      background: "#2d80ff",
                      // boxShadow:
                      //   "0 20px 60px rgba(0,0,0,0.7), 0 0 80px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                      // border: "2px solid rgba(59, 130, 246, 0.4)",
                    }}
                  >
                    {/* Reels Container */}
                    <div
                      className="p-3"
                      style={{
                        background: "#51a3ff",
                      }}
                    >
                      <div
                        className="flex items-center justify-center gap-2 p-3 rounded-2xl "
                        style={{
                          background: "#0853c2",
                          border: "2px solid rgba(59, 130, 246, 0.4)",
                        }}
                      >
                        {[reel1Ref, reel2Ref, reel3Ref].map((ref, idx) => (
                          <SlotReel key={idx} reelRef={ref} symbols={symbols} />
                        ))}
                      </div>
                    </div>

                    {/* Timer Display - Mobile */}
                    <div className="p-3 pb-4">
                      <div
                        className="w-full py-2 rounded-xl text-center"
                        style={{
                          background: "#252428",
                          border: "2px solid rgba(59, 130, 246, 0.4)",
                          // boxShadow:
                          //   "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                      >
                        <div
                          className="text-2xl font-black tracking-wider"
                          style={{
                            fontFamily: "'Orbitron', monospace",
                            color: "#60a5fa",
                            textShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
                          }}
                        >
                          {formatTime(remainingSeconds)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Lever Handle */}
                  <div
                    className="absolute -right-6 top-1/2 -translate-y-1/2 z-30"
                    style={{
                      width: "50px",
                      height: "160px",
                    }}
                  >
                    <button
                      onClick={handleSpin}
                      disabled={isSpinning || spinsRemaining === 0}
                      className="relative w-full h-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "transparent", border: "none" }}
                    >
                      <div
                        className={`lever-container ${
                          leverPull ? "pull" : ""
                        } absolute`}
                        style={{
                          left: "50%",
                          top: 0,
                          height: "100%",
                          transform: "translateX(-50%)",
                          transformOrigin: "center bottom",
                        }}
                      >
                        {/* Lever Ball */}
                        <div
                          className="absolute left-1/2 rounded-full"
                          style={{
                            top: 0,
                            width: "36px",
                            height: "36px",
                            transform: "translateX(-50%)",
                            background:
                              "radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a)",
                            border: "2px solid rgba(0,0,0,0.4)",
                            boxShadow:
                              "0 4px 12px rgba(0,0,0,0.4), inset 0 -2px 8px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.4)",
                          }}
                        />

                        {/* Lever Stick */}
                        <div
                          className="absolute left-1/2 rounded-full"
                          style={{
                            top: "25px",
                            height: "calc(100% - 45px)",
                            width: "4px",
                            transform: "translateX(-50%)",
                            background:
                              "linear-gradient(90deg, #666, #ccc, #fff, #ccc, #666)",
                            border: "1px solid rgba(0,0,0,0.3)",
                            boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
                          }}
                        />
                      </div>

                      {/* Lever Base */}
                      <div
                        className="absolute left-1/2 bottom-1 rounded-lg"
                        style={{
                          width: "42px",
                          height: "16px",
                          transform: "translateX(-50%)",
                          background:
                            "linear-gradient(180deg, #2a2a2a, #0a0a0a)",
                          border: "2px solid rgba(0,0,0,0.4)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                        }}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Desktop Lever (hidden on mobile) */}
              {!isMobile && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-20"
                  style={{
                    width: "clamp(44px, 8vw, 70px)",
                    height: "clamp(180px, 35vh, 300px)",
                  }}
                >
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning || spinsRemaining === 0}
                    className="relative w-full h-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "transparent", border: "none" }}
                  >
                    <div
                      className={`lever-container ${
                        leverPull ? "pull" : ""
                      } absolute`}
                      style={{
                        left: "50%",
                        top: 0,
                        height: "100%",
                        transform: "translateX(-50%)",
                        transformOrigin: "center bottom",
                      }}
                    >
                      <div
                        className="absolute left-1/2 rounded-full"
                        style={{
                          top: 0,
                          width: "clamp(32px, 6vw, 56px)",
                          height: "clamp(32px, 6vw, 56px)",
                          transform: "translateX(-50%)",
                          background:
                            "radial-gradient(circle at 35% 35%, #ff4d4d, #b30000)",
                          border: "2px solid rgba(0,0,0,0.35)",
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.35), inset 0 0 10px rgba(255,255,255,0.35)",
                        }}
                      />

                      <div
                        className="absolute left-1/2 rounded-full"
                        style={{
                          top: "calc(100% / 6)",
                          height: "calc(100% - 60px)",
                          width: "clamp(3px, 0.6vw, 5px)",
                          transform: "translateX(-50%)",
                          background:
                            "linear-gradient(90deg,#777,#ddd,#fff,#ddd,#777)",
                          border: "1px solid rgba(0,0,0,0.35)",
                          boxShadow: "2px 0 10px rgba(0,0,0,0.25)",
                        }}
                      />
                    </div>

                    <div
                      className="absolute left-1/2 bottom-2 rounded-lg"
                      style={{
                        width: "clamp(36px, 8vw, 70px)",
                        height: "clamp(14px, 2vh, 20px)",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(180deg,#2a2a2a,#111)",
                        border: "2px solid rgba(0,0,0,0.35)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
                      }}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <ResultModal
          loading={loading}
          fetchPromoCodes={fetchPromoCodes}
          show={showResultModal}
          isWin={isWinResult}
          prize={resultPrize}
          promoCode={resultPromoCode}
          onClose={() => setShowResultModal(false)}
          isDark={isDark}
        />
      </div>
    </>
  );
}
