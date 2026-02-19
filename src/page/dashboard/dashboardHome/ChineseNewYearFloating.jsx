import React, { useEffect, useState } from "react";

export default function ChineseNewYearFloating() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < 768;

  // All lanterns for large screens
  const allLanterns = [
    { left: "10%", top: "5%", size: 50, delay: 0, duration: 4 },
    { left: "25%", top: "15%", size: 60, delay: 0.5, duration: 5 },
    { left: "45%", top: "8%", size: 55, delay: 1, duration: 4.5 },
    { left: "65%", top: "12%", size: 65, delay: 1.5, duration: 5.5 },
    { left: "85%", top: "6%", size: 45, delay: 2, duration: 4 },
    { left: "15%", top: "40%", size: 55, delay: 0.8, duration: 5 },
    { left: "75%", top: "35%", size: 50, delay: 1.2, duration: 4.5 },
    { left: "40%", top: "50%", size: 60, delay: 0.3, duration: 5.5 },
    { left: "90%", top: "45%", size: 45, delay: 1.8, duration: 4 },
    { left: "20%", top: "70%", size: 55, delay: 1, duration: 5 },
    { left: "55%", top: "75%", size: 50, delay: 0.6, duration: 4.5 },
    { left: "80%", top: "80%", size: 60, delay: 1.4, duration: 5 },
  ];

  // Fewer lanterns for mobile screens
  const mobileLanterns = [
    { left: "15%", top: "18%", size: 40, delay: 0, duration: 4 },
    { left: "80%", top: "15%", size: 45, delay: 0.5, duration: 5 },
    { left: "85%", top: "50%", size: 35, delay: 1, duration: 4.5 },
    { left: "15%", top: "50%", size: 35, delay: 1, duration: 4.5 },
    { left: "25%", top: "90%", size: 40, delay: 0.8, duration: 5 },
    { left: "75%", top: "95%", size: 45, delay: 1.2, duration: 4.5 },
  ];

  const lanternPositions = isMobile ? mobileLanterns : allLanterns;

  return (
    <div className="chinese-lantern-overlay">
      {lanternPositions.map((pos, index) => (
        <img
          key={index}
          src="https://res.cloudinary.com/dmvfzjgtb/image/upload/v1770444589/Pngtree_fanush_sky_lanterns_18212988_iir2mp.png"
          alt="lantern"
          className="floating-lantern"
          style={{
            position: "absolute",
            left: pos.left,
            top: pos.top,
            width: `${pos.size}px`,
            height: "auto",
            opacity: 0.25,
            pointerEvents: "none",
            animation: `float ${pos.duration}s ease-in-out ${pos.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        .chinese-lantern-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9998;
          overflow: hidden;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(2deg);
          }
          50% {
            transform: translateY(-10px) rotate(-2deg);
          }
          75% {
            transform: translateY(-20px) rotate(1deg);
          }
        }

        .floating-lantern {
          filter: drop-shadow(0 0 10px rgba(255, 69, 0, 0.3));
        }
      `}</style>
    </div>
  );
}
