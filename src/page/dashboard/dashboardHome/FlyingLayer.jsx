import { useEffect, useState } from "react";

const FlyingLayer = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 100,
          size: 40 + Math.random() * 60,
          duration: 12 + Math.random() * 10,
          type: Math.random() > 0.5 ? "fanus" : "dragon",
        },
      ]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flying-layer">
      {items.map((item) => (
        <div
          key={item.id}
          className="flying-item"
          style={{
            left: `${item.left}vw`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDuration: `${item.duration}s`,
          }}
          onAnimationEnd={() =>
            setItems((prev) => prev.filter((i) => i.id !== item.id))
          }
        >
          {item.type === "fanus" ? (
            // Fanus (Sky Lantern)
            <svg viewBox="0 0 100 120" className="fanus-svg">
              <defs>
                <linearGradient
                  id={`glow-${item.id}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#ff6b35", stopOpacity: 0.9 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#f7931e", stopOpacity: 0.7 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#ffd700", stopOpacity: 0.5 }}
                  />
                </linearGradient>
              </defs>
              {/* Flame glow */}
              <ellipse
                cx="50"
                cy="45"
                rx="20"
                ry="25"
                fill={`url(#glow-${item.id})`}
                opacity="0.6"
              >
                <animate
                  attributeName="ry"
                  values="25;30;25"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.8;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </ellipse>
              {/* Lantern body */}
              <path
                d="M 30 40 Q 30 20 50 20 Q 70 20 70 40 L 70 80 Q 70 90 50 90 Q 30 90 30 80 Z"
                fill="#ff4444"
                opacity="0.7"
                stroke="#cc0000"
                strokeWidth="1"
              />
              {/* Grid pattern */}
              <line
                x1="50"
                y1="20"
                x2="50"
                y2="90"
                stroke="#990000"
                strokeWidth="0.5"
              />
              <line
                x1="30"
                y1="40"
                x2="70"
                y2="40"
                stroke="#990000"
                strokeWidth="0.5"
              />
              <line
                x1="30"
                y1="60"
                x2="70"
                y2="60"
                stroke="#990000"
                strokeWidth="0.5"
              />
              {/* Bottom strings */}
              <line
                x1="40"
                y1="90"
                x2="35"
                y2="110"
                stroke="#333"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="90"
                x2="50"
                y2="115"
                stroke="#333"
                strokeWidth="1"
              />
              <line
                x1="60"
                y1="90"
                x2="65"
                y2="110"
                stroke="#333"
                strokeWidth="1"
              />
            </svg>
          ) : (
            // Dragon
            <svg viewBox="0 0 120 80" className="dragon-svg">
              <defs>
                <linearGradient
                  id={`dragon-${item.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" style={{ stopColor: "#8b0000" }} />
                  <stop offset="50%" style={{ stopColor: "#dc143c" }} />
                  <stop offset="100%" style={{ stopColor: "#ff6347" }} />
                </linearGradient>
              </defs>
              {/* Dragon body */}
              <ellipse
                cx="60"
                cy="40"
                rx="25"
                ry="15"
                fill={`url(#dragon-${item.id})`}
              />
              {/* Head */}
              <ellipse
                cx="90"
                cy="35"
                rx="15"
                ry="12"
                fill={`url(#dragon-${item.id})`}
              />
              {/* Tail */}
              <path
                d="M 35 40 Q 20 35 10 30 Q 5 28 8 25"
                fill="none"
                stroke="#8b0000"
                strokeWidth="6"
              />
              <path d="M 10 30 L 5 25 L 8 32 Z" fill="#dc143c" />
              {/* Wings */}
              <path
                d="M 55 35 Q 45 20 35 25 Q 40 30 55 37"
                fill="#ff4444"
                opacity="0.7"
                className="wing-left"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 55 35; -15 55 35; 0 55 35"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M 65 35 Q 75 20 85 25 Q 80 30 65 37"
                fill="#ff4444"
                opacity="0.7"
                className="wing-right"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 65 35; 15 65 35; 0 65 35"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
              {/* Eyes */}
              <circle cx="92" cy="33" r="2" fill="#ffff00" />
              {/* Fire breath */}
              <path
                d="M 105 35 Q 112 35 115 33 Q 118 35 115 37 Q 112 35 105 35"
                fill="#ff8c00"
                opacity="0.8"
              >
                <animate
                  attributeName="opacity"
                  values="0.8;0.3;0.8"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          )}
        </div>
      ))}
      <style>{`
        .flying-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .flying-item {
          position: absolute;
          bottom: -100px;
          animation: fly-up linear forwards;
          filter: drop-shadow(0 0 10px rgba(255, 200, 100, 0.5));
        }

        @keyframes fly-up {
          0% {
            bottom: -100px;
            transform: translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateX(30px) rotate(5deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            bottom: 110vh;
            transform: translateX(-20px) rotate(-3deg);
            opacity: 0;
          }
        }

        .fanus-svg, .dragon-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 8px rgba(255, 100, 50, 0.6));
        }
      `}</style>
    </div>
  );
};

export default FlyingLayer;
