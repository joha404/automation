import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "@/assets/shared/underconstruction.png";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import Logo from "@/components/svgs/Logo";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTheme } from "@/hooks/custom/useTheme";

const UnderConstruction = () => {
  const date = "25 October 2025";
  const launchDate = new Date(date);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme(); 
    


  function calculateTimeLeft() {
    const difference = +launchDate - +new Date();
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Email submitted:", email);
      setIsSubscribed(true);
      setEmail("");
      setIsLoading(false);
    }, 1500);
  };

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
        {/* Logo */}
        <div className="flex xlg:justify-start justify-center mt-5  lg:mb-5">
          <Logo />
        </div>

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
          <div
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
          </div>

          {/* Email Notification Form */}
          {/* <div
            data-aos="fade-up"
            data-aos-delay="500"
            className="md:max-w-md mx-auto px-2" // Added px-2 for small screens
          >
            <h3  className={`light:text-black dark:text-white`}>
              Get notified when we launch
            </h3>

            {isSubscribed ? (
              <div className="bg-darkerBlue md:text-sm text-xs text-white px-4 py-3 rounded-lg border border-lightBlue mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Thank you! We'll notify you when we're ready.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative mt-2">
                <div className="flex shadow-lg rounded-md overflow-hidden border border-mediumGrey focus-within:border-mediumBlue focus-within:ring-[1px] focus-within:ring-blue-100 transition-all duration-300 p-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                    className="dark-theme flex-grow min-h-[45px] px-4 text-lighterGrey text-sm sm:text-base focus:outline-none placeholder:text-darkGrey w-0" // Added w-0 and adjusted padding
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-gradient-to-r from-mediumBlue to-blue-700 rounded-sm cursor-pointer text-white px-4 sm:px-6 py-2 text-sm sm:text-base font-medium transition-all duration-300 whitespace-nowrap ${
                      isLoading ? "opacity-80" : "hover:opacity-90"
                    }`}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white mx-2 sm:mx-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Notify Me"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div> */}
        </div>
      </div>

      {/* Add floating animation */}
    </div>
  );
};

export default UnderConstruction;
