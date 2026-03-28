// src/hooks/useCountdown.js
import { useState, useEffect } from "react";

/**
 * Custom hook that returns a formatted countdown string
 * based on the number of days from now.
 *
 * @param {number} daysFromNow - Number of days to count down from today
 * @returns {string} Formatted string like "7d 12h 05m 30s" or "Ended"
 */
const useCountdown = (daysFromNow) => {
  // Calculate the exact end timestamp once when the hook is first called
  const calculateEndDate = () => {
    const end = new Date();
    end.setDate(end.getDate() + daysFromNow);
    end.setHours(23, 59, 59, 999); // Optional: set to end of the day
    return end.getTime();
  };

  const [endTime] = useState(calculateEndDate());
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Initial calculation
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft("Ended");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const format = (num) => (num < 10 ? `0${num}` : num);

      setTimeLeft(`${days}d ${hours}h ${format(minutes)}m ${format(seconds)}s`);
    };

    // Update immediately
    updateCountdown();

    // Then update every second
    const timer = setInterval(updateCountdown, 1000);

    // Cleanup on unmount or when daysFromNow changes
    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

export default useCountdown;
