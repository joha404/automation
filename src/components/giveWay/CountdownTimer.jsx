import { useState, useEffect } from "react";

const CountdownTimer = ({ claimableAfter, theme }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const claimableTime = new Date(claimableAfter).getTime();
      const difference = claimableTime - now;

      if (difference <= 0) {
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [claimableAfter]);

  if (!timeLeft) {
    return null;
  }

  const timerTextClass = theme === "dark" ? "text-white" : "text-gray-900";

  const formatMessage = () => {
    const { days, hours } = timeLeft;

    // Less than 1 day - show only hours
    if (days === 0) {
      if (hours === 0) {
        return `Less than 1 hour until next billing`;
      }
      if (hours === 1) {
        return `1 hour until next billing`;
      }
      return `${hours} hours until next billing`;
    }

    // 1 or more days - ALWAYS show both days and hours
    const dayText = days === 1 ? "1 day" : `${days} days`;
    const hourText = hours === 1 ? "1 hour" : `${hours} hours`;

    return `${dayText} ${hourText} until next billing`;
  };

  return (
    <div
      className={`text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold ${timerTextClass} text-center`}
    >
      {formatMessage()}
    </div>
  );
};

export default CountdownTimer;
