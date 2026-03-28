import React from "react";

export default function MobileHeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 100% 70% at 0% 15%,
              #3b82f6 0%,
              #2563eb 20%,
              #1e40af 35%,
              #1e3a8a 50%,
              #0f172a 65%,
              #000000 85%
            )
          `,
        }}
      />

      {/* Bottom Right Gray/White Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 75% at 100% 100%,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(156, 163, 175, 0.06) 35%,
              transparent 65%
            )
          `,
        }}
      />

      {/* LEFT SIDE - Content with Curved Border */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Curved Section - Logo, Text, Button */}
        <div
          className="relative px-6 py-10 pb-8"
          style={{
            borderBottom: "3px solid rgba(156, 163, 175, 0.4)",
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "50%",
            marginRight: "10%",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#2563eb">
                <path d="M12 2L15 8L21 9L16.5 13.5L17.5 20L12 17L6.5 20L7.5 13.5L3 9L9 8L12 2Z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-wide text-white">
              Hyper Picks
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[44px] leading-[1.1] font-bold text-white mb-3">
            Invest in Sports.
          </h1>
          <p className="text-lg text-gray-300 font-light mb-8">
            With true artificial intelligence.
          </p>

          {/* Stats */}
          <div className="space-y-1.5 mb-10">
            <p className="text-sm font-semibold text-gray-300">
              2025: <span className="text-white font-bold">158.25% Return</span>
            </p>
            <p className="text-sm font-semibold text-gray-300">
              Since Launch (2024):{" "}
              <span className="text-white font-bold">+317% Return</span>
            </p>
          </div>

          {/* CTA Button */}
          <button className="inline-flex items-center gap-3 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-full transition-all duration-200 border-2 border-white/20 shadow-xl active:scale-95">
            View the Dashboard
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* BOTTOM CURVED SECTION - Phone Mockup */}
        <div
          className="relative flex-1 flex justify-center items-center px-6 py-8"
          style={{
            borderTop: "3px solid rgba(156, 163, 175, 0.4)",
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "0",
            marginLeft: "10%",
          }}
        >
          {/* Blue Glow */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 h-80 opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />

          {/* Phone Device */}
          <div
            className="relative w-[270px] h-[540px] rounded-[2.75rem] overflow-hidden shadow-2xl"
            style={{
              transform: "perspective(1200px) rotateY(-12deg) rotateX(3deg)",
              boxShadow: `
                -20px 20px 60px rgba(0, 0, 0, 0.6),
                -10px 10px 30px rgba(0, 0, 0, 0.4),
                inset 0 0 20px rgba(0, 0, 0, 0.3)
              `,
              background: "linear-gradient(145deg, #2d2d3a, #1c1c26)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Phone Screen */}
            <div className="w-full h-full bg-gradient-to-b from-gray-900 via-black to-black p-5">
              {/* Status Bar */}
              <div className="flex justify-between items-center text-white text-xs mb-6">
                <span className="font-medium">12:26</span>
                <div className="flex gap-1">
                  <div className="w-3.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-3.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-3.5 h-1.5 bg-white/70 rounded-sm"></div>
                </div>
              </div>

              {/* Greeting */}
              <div className="mb-5">
                <h2 className="text-white text-base font-bold mb-0.5">
                  Good Evening, Ethan!
                </h2>
                <p className="text-gray-400 text-xs mb-1">
                  Your betting overview below.
                </p>
                <p className="text-blue-400 text-[11px] font-medium">
                  Prediction: December 11
                </p>
              </div>

              {/* Chart Section */}
              <div className="mb-5">
                <h3 className="text-white text-sm font-bold mb-1">
                  Ultimate Automation
                </h3>
                <p className="text-gray-400 text-[11px] mb-3 flex items-center gap-1">
                  <span className="text-green-400 text-xs">✓</span> Active
                  prediction
                </p>

                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-3 backdrop-blur-sm border border-gray-700/30">
                  <div className="flex justify-between items-end h-20 gap-1.5">
                    {[35, 50, 38, 60, 45, 70, 50, 65, 55].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md transition-all duration-300"
                        style={{
                          height: `${height}%`,
                          background:
                            "linear-gradient(to top, #3b82f6, #60a5fa)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-white text-xs font-bold mb-2.5">Results</h3>
                <div className="space-y-1.5">
                  {["Sat, Nov 23", "Mon, Nov 25", "Wed, Nov 27"].map(
                    (date, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-gray-800/40 rounded-lg px-3 py-2 border border-gray-700/20"
                      >
                        <span className="text-gray-400 text-[11px] font-medium">
                          {date}
                        </span>
                        <span className="text-green-400 text-[11px] font-bold">
                          +$127,932 (3.5%)
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
