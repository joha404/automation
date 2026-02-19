// components/GiveawayCardSkeleton.jsx
import { useTheme } from "@/hooks/custom/useTheme";

const GiveawayCardSkeleton = () => {
  const { theme } = useTheme();

  const skeletonClass =
    theme === "dark"
      ? "animate-pulse bg-gray-700/70 rounded"
      : "animate-pulse bg-gray-200/70 rounded";

  const cardClass = `relative rounded-2xl overflow-hidden border transition-all duration-300 p-4 lg:p-6 ${
    theme === "dark"
      ? "bg-darkBlack border-mediumBlack"
      : "bg-white border-lightestGrey"
  }`;

  return (
    <div className={cardClass}>
      {/* Giveaway Type Badge - Absolute Top Center */}
      <div className="absolute -mt-3 lg:-mt-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`h-9 w-44 ${skeletonClass} rounded-full`} />
      </div>

      <div className="relative z-10 top-2 space-y-4">
        {/* Prize Amount and Entries Row */}
        <div className="flex -mt-4 lg:-mt-6 items-center justify-between">
          {/* Prize Amount - Left */}
          <div className={`h-8 w-24 ${skeletonClass}`} />

          {/* Entries Badge - Right */}
          <div className="shrink-0">
            <div
              className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg
              py-1 px-2 lg:py-1.5 lg:px-4 border border-white/20 shadow-md
              flex items-center gap-2"
            >
              <div className={`h-3 lg:h-4 w-12 ${skeletonClass}`} />
              <div className={`h-5 w-16 ${skeletonClass}`} />
            </div>
          </div>
        </div>

        {/* Status + Info Icon */}
        <div className="flex items-center gap-3 w-full mt-6">
          <div className="flex-1 min-w-0">
            <div
              className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-lg
              py-1 px-4 border border-white/20 shadow-md flex items-center justify-between gap-2"
            >
              <div className={`h-5 w-32 mx-auto ${skeletonClass}`} />
              <div className={`h-8 w-8 ${skeletonClass} rounded-full`} />
            </div>
          </div>
        </div>

        {/* Enter Button */}
        <div
          className={`h-12 lg:h-14 w-full ${skeletonClass} rounded-xl mt-3 lg:mt-6`}
        />
      </div>
    </div>
  );
};

export default GiveawayCardSkeleton;
