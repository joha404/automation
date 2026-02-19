// GiveawaySection.jsx
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import GiveawayCard from "./GiveawayCard";
import GiveawayBox from "./GiveawayBox";
import {
  getWeeklyGiveaways,
  getMonthlyGiveaways,
  getUltimateGiveaways,
} from "@/api/giveWay/giveWay.api";

const GiveawaySection = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [ultimate, setUltimate] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [weeklyRes, monthlyRes, ultimateRes] = await Promise.all([
        getWeeklyGiveaways(),
        getMonthlyGiveaways(),
        getUltimateGiveaways(),
      ]);

      setWeekly(weeklyRes.data || null);
      setMonthly(monthlyRes.data || null);
      setUltimate(ultimateRes.data || null);
    } catch (error) {
      console.error("Error fetching giveaways:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const isFullyActive = (gw) =>
    gw?.status === "ACTIVE" && gw?.is_active === true;

  const isScheduled = (gw) =>
    gw?.status === "SCHEDULED" && gw?.is_active === false;

  const getScheduledCountdown = (startDate) => {
    if (!startDate) return "Calculating...";
    const start = new Date(startDate).getTime();
    const now = Date.now();
    const distance = start - now;

    if (distance <= 0) return "Event Ended";

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const format = (n) => (n < 10 ? `0${n}` : n);

    return `${days}d ${hours}h ${format(minutes)}m ${format(seconds)}s`;
  };

  const [scheduledCountdowns, setScheduledCountdowns] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const updates = {};
      if (isScheduled(weekly))
        updates.weekly = getScheduledCountdown(weekly.start_date);
      if (isScheduled(monthly))
        updates.monthly = getScheduledCountdown(monthly.start_date);
      if (isScheduled(ultimate))
        updates.ultimate = getScheduledCountdown(ultimate.start_date);
      if (Object.keys(updates).length > 0)
        setScheduledCountdowns((prev) => ({ ...prev, ...updates }));
    }, 1000);

    return () => clearInterval(interval);
  }, [weekly, monthly, ultimate]);

  const getStatusText = (gw, type) => {
    if (!gw) return "Coming Soon";
    if (isScheduled(gw)) {
      return scheduledCountdowns[type] || getScheduledCountdown(gw.start_date);
    }
    if (isFullyActive(gw) && gw.time_remaining) {
      const { days, hours, minutes, seconds } = gw.time_remaining;
      const format = (n) => (n < 10 ? `0${n}` : n);
      return `${days}d ${hours}h ${format(minutes)}m ${format(seconds)}s`;
    }
    if (gw.status === "ENDED") return "Event Ended";
    return "Coming Soon";
  };

  const getButtonText = (gw) => {
    if (!gw) return "Coming Soon";
    if (isScheduled(gw)) return "Starts Soon";
    if (isFullyActive(gw)) {
      if (gw.user_entries_count > 0) return "Already Entered";
      if (gw.can_enter?.allowed) return "Enter Now";
      return "Need Subscription";
    }
    return "Giveaway Ended";
  };

  const getNoteText = (gw, type) => {
    if (!gw) return "Active subscription required";
    if (isScheduled(gw))
      return `Starts ${new Date(gw.start_date).toLocaleDateString()}`;
    if (gw.requires_ultimate_subscription || type === "EXCLUSIVE")
      return "Requires Ultimate Subscription";
    return "Active subscription required";
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // Minimum drag distance to trigger slide

    if (dragOffset < -threshold) {
      // Dragged left - go to next
      handleNext();
    } else if (dragOffset > threshold) {
      // Dragged right - go to previous
      handlePrev();
    }

    setDragOffset(0);
  };

  const arrowButtonClass = `
    absolute top-24 -translate-y-1/2 z-20
    w-10 h-10 rounded-full
    flex items-center justify-center
    transition-all duration-300
    ${
      theme === "dark"
        ? "bg-gray-800/90 hover:bg-gray-700 text-white border border-gray-700"
        : "bg-white/90 hover:bg-gray-100 text-gray-900 border border-gray-200"
    }
    shadow-lg hover:shadow-xl
    active:scale-95
  `;

  if (isLoading) {
    return (
      <section className="mb-4 lg:mb-10">
        <div className="block lg:hidden px-4">
          <GiveawayBox loading={true} />
        </div>
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <GiveawayBox key={i} loading={true} />
            ))}
        </div>
      </section>
    );
  }

  // Always show all 3 giveaways (with or without data)
  const giveaways = [
    {
      type: "WEEKLY",
      data: weekly,
      fallbackAmount: "100.00",
      fallbackTitle: "Weekly Giveaway",
    },
    {
      type: "MONTHLY",
      data: monthly,
      fallbackAmount: "500.00",
      fallbackTitle: "Monthly Giveaway",
    },
    {
      type: "EXCLUSIVE",
      data: ultimate,
      fallbackAmount: "1000.00",
      fallbackTitle: "Ultimate Exclusive",
    },
  ];

  const renderGiveawayContent = (type, data, fallbackAmount, fallbackTitle) => {
    const fullyActive = isFullyActive(data);
    const scheduled = isScheduled(data);

    const renderBoxWithImage = () => {
      const bgStyle = data?.image
        ? {
            backgroundImage: `url(${data.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : {};

      return (
        <div className="relative rounded-3xl overflow-hidden" style={bgStyle}>
          {data?.image && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          )}
          <div className="relative z-10">
            <GiveawayBox
              type={type}
              amount={data?.prize_amount || fallbackAmount}
              title={data?.title || fallbackTitle}
              statusText={getStatusText(data, type.toLowerCase())}
              entries={data?.total_entries || 0}
              buttonText={getButtonText(data)}
              note={getNoteText(data, type)}
              image={data?.image}
              disabled={!fullyActive && !scheduled}
              isScheduled={scheduled}
              loading={false}
            />
          </div>
        </div>
      );
    };

    if (fullyActive) {
      return (
        <GiveawayCard
          giveaway={{
            ...data,
            giveaway_type: type,
            title: data.title || fallbackTitle,
            prize_amount: data.prize_amount || fallbackAmount,
          }}
          loading={false}
          fetchGiveawayData={handleRefresh}
        />
      );
    }

    return renderBoxWithImage();
  };

  return (
    <section className="mb-4 lg:mb-10">
      {/* 📱 MOBILE: Carousel View - Always 3 items */}
      <div className="block lg:hidden relative overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className={`${arrowButtonClass} -left-4 opacity-50`}
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

        {/* Carousel Container with Drag Support */}
        <div
          className="w-full px-2 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          style={{
            transform: isDragging ? `translateX(${dragOffset}px)` : "none",
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          {giveaways.map(
            ({ type, data, fallbackAmount, fallbackTitle }, index) =>
              index === activeIndex ? (
                <div key={type} className="w-full pointer-events-auto">
                  {renderGiveawayContent(
                    type,
                    data,
                    fallbackAmount,
                    fallbackTitle,
                  )}
                </div>
              ) : null,
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className={`${arrowButtonClass} -right-4 opacity-70`}
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

        {/* Dots Indicator - Always 3 dots */}
        <div className="flex justify-center gap-2 mt-3">
          {giveaways.map(({ type }, index) => (
            <button
              key={type}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? theme === "dark"
                    ? "bg-blue-500 w-8"
                    : "bg-blue-600 w-8"
                  : theme === "dark"
                    ? "bg-gray-600 hover:bg-gray-500 w-2"
                    : "bg-gray-300 hover:bg-gray-400 w-2"
              }`}
              aria-label={`Go to ${type} giveaway`}
            />
          ))}
        </div>
      </div>

      {/* 🖥️ DESKTOP: Grid View - Always 3 items */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {giveaways.map(({ type, data, fallbackAmount, fallbackTitle }) => (
          <div key={type}>
            {renderGiveawayContent(type, data, fallbackAmount, fallbackTitle)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default GiveawaySection;
