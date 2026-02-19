import React from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSlotLayout } from "@/hooks/api/useSlotScale";

const SlotReel = ({ reelRef, symbols }) => {
  const { theme } = useTheme();
  const isLight = theme !== "dark";

  const { itemH, width, height, fontSize } = useSlotLayout();

  const repeatedSymbols = Array(30)
    .fill(null)
    .flatMap(() => symbols);

  const CENTER_TOP = (height - itemH) / 2;

  // Check if mobile device
  const isMobile = width < 768;

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width,
        height,
        borderRadius: isMobile ? "16px" : "20px",
        background: isMobile
          ? "linear-gradient(135deg, #0853c2 0%, #063a8f 50%, #0853c2 100%)"
          : "linear-gradient(180deg, #0853c2, #063a8f)",
        border: isMobile ? "2px solid #0853c2" : "1px solid #0853c2",
        boxShadow: isMobile
          ? "0 8px 32px rgba(0, 0, 0, 0.8), 0 0 40px rgba(8, 83, 194, 0.4)"
          : "0 12px 32px rgba(8, 83, 194, 0.5)",
      }}
    >
      {/* Reel */}
      <div
        ref={reelRef}
        className="absolute inset-x-0"
        style={{
          transform: "translateY(0px)",
          willChange: "transform",
          height: repeatedSymbols.length * itemH,
        }}
      >
        {repeatedSymbols.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-center overflow-hidden"
            style={{
              height: itemH,
              padding: isMobile ? "4px" : "0",
            }}
          >
            <p className={`${s.color} font-slot25 text-3xl lg:text-6xl`}>
              {s.display}
            </p>
          </div>
        ))}
      </div>

      {/* Top Fade */}
      <div
        className="absolute top-0 inset-x-0 z-10 pointer-events-none"
        style={{
          height: isMobile ? itemH * 1.2 : itemH,
          background: isMobile
            ? "linear-gradient(to bottom, rgba(6,58,143,0.9) 0%, rgba(8,83,194,0.3) 50%, transparent 100%)"
            : "linear-gradient(to bottom, #063a8f, transparent)",
        }}
      />

      {/* Bottom Fade */}
      <div
        className="absolute bottom-0 inset-x-0 z-10 pointer-events-none"
        style={{
          height: isMobile ? itemH * 1.2 : itemH,
          background: isMobile
            ? "linear-gradient(to top, rgba(6,58,143,0.9) 0%, rgba(8,83,194,0.3) 50%, transparent 100%)"
            : "linear-gradient(to top, #063a8f, transparent)",
        }}
      />

      {/* Center Highlight */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          left: isMobile ? "6px" : "8px",
          right: isMobile ? "6px" : "8px",
          top: CENTER_TOP,
          height: itemH,
          borderRadius: isMobile ? "12px" : "12px",
          border: isMobile ? "2.5px solid #0a5fd9" : "2px solid #0853c2",
          boxShadow: isMobile
            ? "0 0 24px rgba(10, 95, 217, 0.7), 0 0 40px rgba(8, 83, 194, 0.4)"
            : "0 0 20px rgba(8, 83, 194, 0.5)",
          background: isMobile
            ? "linear-gradient(90deg, transparent 0%, rgba(10, 95, 217, 0.15) 50%, transparent 100%)"
            : undefined,
        }}
      />

      {/* Mobile-only: Corner accents */}
      {isMobile && (
        <>
          <div
            className="absolute top-0 left-0 z-5 pointer-events-none"
            style={{
              width: "40px",
              height: "40px",
              borderTop: "2px solid #0a5fd9",
              borderLeft: "2px solid #0a5fd9",
              borderTopLeftRadius: "16px",
            }}
          />
          <div
            className="absolute top-0 right-0 z-5 pointer-events-none"
            style={{
              width: "40px",
              height: "40px",
              borderTop: "2px solid #0a5fd9",
              borderRight: "2px solid #0a5fd9",
              borderTopRightRadius: "16px",
            }}
          />
          <div
            className="absolute bottom-0 left-0 z-5 pointer-events-none"
            style={{
              width: "40px",
              height: "40px",
              borderBottom: "2px solid #0a5fd9",
              borderLeft: "2px solid #0a5fd9",
              borderBottomLeftRadius: "16px",
            }}
          />
          <div
            className="absolute bottom-0 right-0 z-5 pointer-events-none"
            style={{
              width: "40px",
              height: "40px",
              borderBottom: "2px solid #0a5fd9",
              borderRight: "2px solid #0a5fd9",
              borderBottomRightRadius: "16px",
            }}
          />
        </>
      )}
    </div>
  );
};

export default SlotReel;
