import { useState } from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import GiveawayCard from "./GiveawayCard";

const GiveawayCarousel = ({
  giveaways = [],
  loading = false,
  fetchGiveawayData,
}) => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter giveaways by type in order: WEEKLY, MONTHLY, EXCLUSIVE
  const orderedGiveaways = [
    ...giveaways.filter((g) => g.giveaway_type === "WEEKLY"),
    ...giveaways.filter((g) => g.giveaway_type === "MONTHLY"),
    ...giveaways.filter((g) => g.giveaway_type === "EXCLUSIVE"),
  ];

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? orderedGiveaways.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === orderedGiveaways.length - 1 ? 0 : prev + 1
    );
  };

  const currentGiveaway = orderedGiveaways[activeIndex];

  // Arrow button styles
  const arrowButtonClass = `
    absolute top-2 -translate-y-1/2 z-20
    w-10 h-10 rounded-full
    flex items-center justify-center
    transition-all duration-300
    ${
      theme === "dark"
        ? "bg-gray-800/90 hover:bg-gray-700 text-white"
        : "bg-white/90 hover:bg-gray-100 text-gray-900"
    }
    shadow-lg hover:shadow-xl
    active:scale-95
  `;

  if (loading || orderedGiveaways.length === 0) {
    return (
      <div className="w-full">
        <GiveawayCard loading={true} />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left Arrow */}
      {/* {orderedGiveaways.length > 1 && (
        <button
          onClick={handlePrev}
          className={`${arrowButtonClass} left-2 md:left-4`}
          aria-label="Previous giveaway"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )} */}

      {/* Giveaway Card */}
      <div className="w-full px-2 md:px-4">
        <GiveawayCard
          giveaway={currentGiveaway}
          loading={loading}
          fetchGiveawayData={fetchGiveawayData}
        />
      </div>

      {/* Right Arrow */}
      {/* {orderedGiveaways.length > 1 && (
        <button
          onClick={handleNext}
          className={`${arrowButtonClass} right-2 md:right-4`}
          aria-label="Next giveaway"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )} */}

      {/* Dots Indicator */}
      {orderedGiveaways.length > 1 && (
        <div className="flex justify-center gap-2 mt-1">
          {orderedGiveaways.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? theme === "dark"
                    ? "bg-blue-500 w-6"
                    : "bg-blue-600 w-6"
                  : theme === "dark"
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to giveaway ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GiveawayCarousel;
