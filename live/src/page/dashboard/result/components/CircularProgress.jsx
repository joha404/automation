import React, { useState, useEffect } from "react";

const CircularProgress = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  animationDuration = 1000,
}) => {
  const [progress, setProgress] = useState(0);

  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    // Animate the progress when percentage changes
    let start = 0;
    const end = percentage;
    const duration = animationDuration;
    const incrementTime = 20;

    const timer = setInterval(() => {
      start += 1;
      const currentProgress = Math.min(start, end);
      setProgress(currentProgress);

      if (currentProgress >= end) {
        clearInterval(timer);
      }
    }, duration / end);

    return () => clearInterval(timer);
  }, [percentage, animationDuration]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#033533"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#0A9087"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* Text content - properly centered and responsive */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[#0A9087]">
        <div className="text-xs font-normal font-logo leading-tight">Win</div>
        <div className="font-bold font-logo" style={{ fontSize: size * 0.18 }}>
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
