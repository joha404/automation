import React, { useState, useRef } from "react";
import "./slot.css";
import Reel from "./Reel";
import { generatePromos } from "@/api/giveWay/giveWay.api";
import WinModal from "./WinModal";

const SlotMachine = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(5);
  const [lastResult, setLastResult] = useState(null);
  const [reels, setReels] = useState([0, 0, 0]);

  // Result Modal states
  const [showResultModal, setShowResultModal] = useState(false);
  const [isWinResult, setIsWinResult] = useState(false);
  const [resultPrize, setResultPrize] = useState("");
  const [resultPromoCode, setResultPromoCode] = useState("");

  const reel1Ref = useRef(null);
  const reel2Ref = useRef(null);
  const reel3Ref = useRef(null);

  const symbols = [
    { display: "CHERRY", value: "CHERRY", color: "text-red-600" },
    { display: "LEMON", value: "LEMON", color: "text-yellow-400" },
    { display: "ORANGE", value: "ORANGE", color: "text-orange-500" },
    { display: "BELL", value: "BELL", color: "text-amber-500" },
    { display: "GOLD", value: "GOLD", color: "text-cyan-400" },
    { display: "GIFT", value: "GIFT", color: "text-pink-500" },
    { display: "STAR", value: "STAR", color: "text-purple-500" },
    { display: "SEVEN", value: "SEVEN", color: "text-red-700" },
  ];

  const handleSpin = async () => {
    if (isSpinning || spinsRemaining <= 0) return;

    setIsSpinning(true);
    setButtonClicked(true);
    setLastResult(null);
    setShowResultModal(false);
    setTimeout(() => setButtonClicked(false), 400);

    const symbolHeight = 90;
    const symbolsCount = symbols.length;
    const strips = [
      reel1Ref.current,
      reel2Ref.current,
      reel3Ref.current,
    ].filter(Boolean);
    if (strips.length !== 3) return;

    let rewardType = "NO_WIN";
    let message = "Try Again! 🍀";
    let hasWon = false;
    let finalIndices = [0, 0, 0];
    let prizeString = "";
    let promoCodeString = "";

    try {
      const res = await generatePromos();

      rewardType = res.reward_type || "NO_WIN";
      message = res.message || "Try Again! 🍀";
      hasWon = rewardType !== "NO_WIN";

      if (hasWon) {
        if (typeof res.discount_won === "string" && res.discount_won.trim()) {
          prizeString = res.discount_won;
        } else if (
          typeof res.reward_display === "string" &&
          res.reward_display.trim()
        ) {
          prizeString = res.reward_display;
        } else if (
          res.promo_code_details &&
          typeof res.promo_code_details.discount_display === "string"
        ) {
          prizeString = res.promo_code_details.discount_display;
        } else {
          prizeString = rewardType;
        }

        if (typeof res.promo_code === "string" && res.promo_code.trim()) {
          promoCodeString = res.promo_code;
        } else if (
          res.promo_code_details &&
          typeof res.promo_code_details.code === "string"
        ) {
          promoCodeString = res.promo_code_details.code;
        } else {
          promoCodeString = "CLAIM_SOON";
        }
      } else {
        prizeString = message;
        promoCodeString = "";
      }

      const getIndexByValue = (value) => {
        const idx = symbols.findIndex((s) => s.value === value);
        return idx !== -1 ? idx : Math.floor(Math.random() * symbols.length);
      };

      if (hasWon) {
        let winningSymbolValue = rewardType;
        if (!symbols.some((s) => s.value === rewardType)) {
          winningSymbolValue = "SEVEN";
        }
        const winIndex = getIndexByValue(winningSymbolValue);
        finalIndices = [winIndex, winIndex, winIndex];
        message = res.message || "JACKPOT! 🎉🎁";
      } else {
        const idx1 = Math.floor(Math.random() * symbolsCount);
        const idx2 = idx1;
        let idx3;
        do {
          idx3 = Math.floor(Math.random() * symbolsCount);
        } while (idx3 === idx1);

        const pattern = Math.random();
        if (pattern < 0.4) finalIndices = [idx1, idx2, idx3];
        else if (pattern < 0.8) finalIndices = [idx1, idx3, idx2];
        else finalIndices = [idx3, idx1, idx2];

        message = res.message || "So close! Try Again! 🍀";
      }
    } catch (err) {
      console.error("API Error:", err);
      hasWon = false;
      message = "Connection error! Try again 🍀";
      prizeString = message;
      promoCodeString = "";

      const idx1 = Math.floor(Math.random() * symbolsCount);
      let idx3 = idx1;
      while (idx3 === idx1) idx3 = Math.floor(Math.random() * symbolsCount);
      finalIndices = [idx1, idx1, idx3];
    }

    const finalSymbols = finalIndices.map((i) => symbols[i].display);

    strips.forEach((strip, i) => {
      setTimeout(() => {
        strip.style.transition = "none";
        strip.style.transform = "translateY(0px)";
        strip.style.filter = "blur(5px)";
        void strip.offsetHeight;

        const distance = 40 * symbolsCount * symbolHeight;
        strip.style.transition = "transform 6000ms linear";
        strip.style.transform = `translateY(-${distance}px)`;
      }, i * 200);
    });

    await new Promise((resolve) => setTimeout(resolve, 4500));

    const stopReel = (strip, finalIdx, delay) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          strip.style.transition = "none";
          void strip.offsetHeight;

          const extraSpins = 4 + Math.random() * 2;
          const totalDistance =
            Math.floor(extraSpins) * symbolsCount * symbolHeight +
            finalIdx * symbolHeight;

          strip.style.transition =
            "transform 1300ms cubic-bezier(0.15, 0.70, 0.30, 1), filter 700ms ease-out";
          strip.style.transform = `translateY(-${totalDistance}px)`;
          strip.style.filter = "blur(0px)";

          const cleanup = () => {
            strip.removeEventListener("transitionend", cleanup);
            strip.style.transition = "none";
            resolve();
          };
          strip.addEventListener("transitionend", cleanup);
          setTimeout(cleanup, 1500);
        }, delay);
      });
    };

    await Promise.all([
      stopReel(strips[0], finalIndices[0], 0),
      stopReel(strips[1], finalIndices[1], 400),
      stopReel(strips[2], finalIndices[2], 800),
    ]);

    setReels(finalIndices);
    setLastResult({
      won: hasWon,
      symbols: finalSymbols,
      message,
    });

    setIsSpinning(false);
    setSpinsRemaining((prev) => prev - 1);

    setIsWinResult(hasWon);
    setResultPrize(prizeString);
    setResultPromoCode(promoCodeString);
    setShowResultModal(true);
  };

  return (
    <>
      <style>{`
        @keyframes leverPull {
          0% { transform: rotate(10deg); }
          45% { transform: rotate(-75deg); }
          100% { transform: rotate(10deg); }
        }

        @keyframes leverIdle {
          0%, 100% { transform: rotate(12deg); }
          50% { transform: rotate(6deg); }
        }

        @keyframes knobGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(255,220,0,0.9); }
          50% { box-shadow: 0 0 50px rgba(255,255,0,1); }
        }

        .lever-container {
          animation: leverIdle 4s ease-in-out infinite;
          transform-origin: center 50px;
        }

        .lever-container.pulling {
          animation: leverPull 0.8s cubic-bezier(0.2, 0.85, 0.4, 1);
        }

        .knob-glow {
          animation: knobGlow 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="flex justify-center items-center p-0 lg:p-0">
        <div className="slot-machine-wrapper">
          <div className="top-display">
            <div className="top-display-inner">
              <div className="lights-container">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="light-bar"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
            <div className="top-display-shadow" />
          </div>

          <div className="machine-body">
            <div className="machine-body-front p-2 lg:p-8">
              <div className="side-panel left-panel">
                <div className="panel-shine" />
                <div className="panel-rivet top-left" />
                <div className="panel-rivet bottom-left" />
              </div>

              <div className="screen-frame p-2 lg:p-6">
                <div className="screen-frame-outer">
                  <div className="screen-frame-inner">
                    <div className="screen-glass">
                      <div className="screen-reflection" />
                    </div>
                    <div className="flex gap-2 lg:gap-2 justify-center relative z-10">
                      {reels.map((position, index) => (
                        <Reel
                          key={index}
                          position={position}
                          index={index}
                          symbols={symbols}
                          ref={
                            index === 0
                              ? reel1Ref
                              : index === 1
                              ? reel2Ref
                              : reel3Ref
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="side-panel right-panel">
                <div className="panel-shine" />
                <div className="panel-rivet top-right" />
                <div className="panel-rivet bottom-right" />
              </div>
            </div>
          </div>

          {/* NEW REALISTIC LEVER HANDLE (replaces old button) */}
          <button
            type="button"
            onClick={handleSpin}
            disabled={isSpinning || spinsRemaining <= 0}
            className={`absolute right-0 bottom-32 lg:bottom-40 w-32 h-96 cursor-pointer focus:outline-none ${
              isSpinning || spinsRemaining <= 0
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
          >
            <div
              className={`lever-container ${buttonClicked ? "pulling" : ""}`}
            >
              {/* Chrome Silver Shaft */}
              <div
                className="absolute w-6 h-80 bg-gradient-to-b from-gray-300 via-white to-gray-400 rounded-full"
                style={{
                  boxShadow:
                    "inset 0 4px 12px rgba(255,255,255,0.8), inset 0 -4px 12px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.6)",
                }}
              />

              {/* Orange-Yellow Inner Glow */}
              <div
                className="absolute w-3 h-72 bg-gradient-to-b from-orange-400 via-yellow-400 to-orange-500 rounded-full opacity-90"
                style={{
                  top: "60px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  filter: "blur(6px)",
                }}
              />

              {/* Black Glossy Ball Knob */}
              <div
                className="knob-glow absolute w-20 h-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-full"
                style={{
                  top: "calc(100% - 40px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  border: "4px solid #111",
                  boxShadow:
                    "inset 0 10px 20px rgba(255,255,255,0.2), inset 0 -10px 20px rgba(0,0,0,0.7)",
                }}
              />

              {/* Strong Yellow Halo Glow Around Knob */}
              <div
                className="absolute w-32 h-32 bg-radial-gradient from-yellow-400 via-yellow-300 to-transparent rounded-full opacity-70"
                style={{
                  top: "calc(100% - 50px)",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  filter: "blur(30px)",
                }}
              />
            </div>
          </button>

          <div className="result-display">
            <div className="result-animation">
              <div className="result-box flex justify-center items-center">
                <h1 className="text-white text-xl">
                  Try : 23 H 22 M 43 Sec Later
                </h1>
              </div>
            </div>
          </div>
        </div>

        <WinModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          prize={resultPrize}
          promoCode={resultPromoCode}
          isWin={isWinResult}
        />
      </div>
    </>
  );
};

export default SlotMachine;
