import React, { forwardRef, useEffect, useState } from "react";

const Reel = forwardRef(({ position, symbols, isSpinning = false }, ref) => {
  if (!symbols || symbols.length === 0) {
    return <div className="w-full max-w-32 h-40 mx-auto" />;
  }

  // Responsive symbol heights
  const symbolHeights = {
    base: 60, // mobile
    sm: 70,
    md: 80,
    lg: 90, // original large
  };

  const getSymbolHeight = () => {
    if (typeof window === "undefined") return symbolHeights.lg;
    const width = window.innerWidth;
    if (width >= 1024) return symbolHeights.lg;
    if (width >= 768) return symbolHeights.md;
    if (width >= 640) return symbolHeights.sm;
    return symbolHeights.base;
  };

  const [currentSymbolHeight, setCurrentSymbolHeight] = useState(
    getSymbolHeight()
  );

  useEffect(() => {
    const handleResize = () => {
      setCurrentSymbolHeight(getSymbolHeight());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate the final position to snap exactly to the nearest symbol
  const finalPosition = Math.round(position);

  // Use rounded position when not spinning for perfect alignment
  const displayPosition = isSpinning ? position : finalPosition;

  const repeats = 50;
  const repeatedSymbols = Array(repeats)
    .fill(null)
    .flatMap(() => symbols);

  return (
    <div className="relative w-full max-w-32 mx-auto h-[180px] sm:h-[210px] md:h-[240px] lg:h-[270px] bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 rounded-lg overflow-hidden border-4 border-gray-900 shadow-2xl">
      {/* Top shadow */}
      <div className="absolute top-0 left-0 right-0 h-5 sm:h-6 md:h-7 lg:h-8 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

      {/* Bottom shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-5 sm:h-6 md:h-7 lg:h-8 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />

      {/* Center highlight line - exactly matches one symbol height */}
      <div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-y-2 border-yellow-400/70 z-20 pointer-events-none"
        style={{ height: `${currentSymbolHeight}px` }}
      />

      <div
        ref={ref}
        className="absolute w-full top-0"
        style={{
          transform: `translateY(-${displayPosition * currentSymbolHeight}px)`,
          willChange: "transform",
          transition: isSpinning
            ? "transform 0.6s cubic-bezier(0.2, 0.8, 0.4, 1)"
            : "transform 0.2s ease-out", // quick snap when stopping
        }}
      >
        {repeatedSymbols.map((symbol, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-full"
            style={{ height: `${currentSymbolHeight}px` }}
          >
            <span
              className={`font-bold drop-shadow-2xl ${symbol.color} text-xs sm:text-sm md:text-base lg:text-xl`}
            >
              {symbol.display}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

Reel.displayName = "Reel";

export default Reel;
