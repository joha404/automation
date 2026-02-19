import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "@/assets/shared/underconstruction.png";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import Logo from "@/components/svgs/Logo";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTheme } from "@/hooks/custom/useTheme";

const CommingSoon = () => {
  const date = "30 November 2025";
  const launchDate = new Date(date);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [email, setEmail] = useState("");

  function calculateTimeLeft() {
    const difference = +launchDate - +new Date();
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
    });

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="container mx-auto px-4 light">


      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <div
          data-aos="fade-up"
          className="p-6 md:p-10 w-full max-w-3xl text-center"
        >
          {/* Title Section */}
          <div
            data-aos="fade"
            data-aos-delay="200"
            className="text-center mx-auto xl:w-[80%] w-full"
          >
            <div className="flex justify-center items-center mb-10">
              <Logo/>
            </div>
            <CommonTitle variant="large" className="mb-2 font-semibold">
              Coming Soon!
            </CommonTitle>

            <CommonParagraph
              variant="small"
              className="text-center mx-auto  font-normal mb-6 md:mb-8 text-lg"
            >
              We're building something amazing! Launching on {date}
            </CommonParagraph>
          </div>

          {/* Countdown Timer */}
          {/* <div
            data-aos="zoom-in"
            data-aos-delay="300"
            className="flex justify-center gap-4 sm:gap-6 mb-8"
          >
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center bg-darkestGrey">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-mediumBlue bg-mediumBlack px-4 py-2 rounded-lg">
                  {value.toString().padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm  text-mediumGrey mt-2 uppercase">
                  {unit}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Add floating animation */}
    </div>
  );
};

export default CommingSoon;
