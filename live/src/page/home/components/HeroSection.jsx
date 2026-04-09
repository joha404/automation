import Logo from "@/components/svgs/Logo";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import { useSelector } from "react-redux";
import { useLogout } from "@/hooks/api/auth/useLogout";
import home1 from "../../../assets/home/home1.png";
import home2 from "../../../assets/home/home2.png";
import home3 from "../../../assets/home/home3.png";
import home4 from "../../../assets/home/home4.png";
import home5 from "../../../assets/home/home5.png";
import home6 from "../../../assets/home/home6.png";
import home7 from "../../../assets/home/home7.png";
import mobile from "../../../assets/home/mobile.png";

const HeroSection = ({ data }) => {
  const user = useSelector((state) => state.user.user);
  const logout = useLogout();
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleJoinNowClick = () => {
    console.log("Join Now button clicked");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020C0B] ">
      {/* Radial gradient background */}
      <div className="absolute inset-0  pointer-events-none" />

      <header className="fixed top-0 left-0 w-full z-50  pt-[40px] lg:pt-[60px] pb-10 backdrop-blur-md [background:radial-gradient(63.21%_161.75%_at_50.83%_-63.57%,#054844_25.46%,rgba(2,12,11,0)_100%)] ">
        <div className="max-w-7xl mx-auto px-3 py-2 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex w-[140px] lg:w-[184px] items-center gap-1 lg:gap-3">
              <Logo />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center md:gap-4 gap-2">
              {user ? (
                <button
                  onClick={logout}
                  className="px-3 py-2 text-lighterGrey hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300 cursor-pointer text-sm md:text-base md:px-6"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/sign-in"
                  className="px-3 py-2 text-white uppercase font-bold leading-[100%] tracking-[0%] hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300 cursor-pointer text-sm md:text-base md:px-6"
                >
                  Login
                </Link>
              )}

              {user ? (
                <Link
                  to="/dashboard"
                  className="h-[38px] px-5 rounded-full border-[1px] border-[#054844] font-bold leading-none text-center flex justify-center items-center text-white cursor-pointer hover:bg-[#054844] transition-colors duration-300 text-sm md:text-base md:w-[150px] md:h-[44px] md:px-[30px]"
                >
                  JOIN NOW
                </Link>
              ) : (
                <Link
                  onClick={handleJoinNowClick}
                  to="/sign-up"
                  className="w-[120px] h-[44px] py-[10px] px-[15px] rounded-full border-[1px] border-[#054844] font-bold leading-none text-center flex justify-center items-center text-white cursor-pointer hover:bg-[#054844] transition-colors duration-300 text-sm md:w-[150px] md:h-[44px] md:px-[30px] md:text-base  "
                >
                  JOIN NOW
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center pt-20 pb-10">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-16 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            {/* Left Content */}
            <div
              className="w-full lg:w-1/2 flex flex-col order-1 lg:order-1"
              data-aos="fade-up"
            >
              <h1 className="font-bold text-[36px] text-center lg:text-left sm:text-4xl lg:text-[47.78px] leading-tight lg:leading-[75px] tracking-tight font-logo text-[#0A9087]">
                {data?.title_line1 ? data?.title_line1 : " SMARTER PICKS."}
              </h1>
              <h1 className="font-logo font-extrabold text-center lg:text-left text-[40px] sm:text-6xl lg:text-[83.39px] leading-tight lg:leading-[75px] tracking-tight text-white mb-2 lg:mb-6">
                {data?.title_line2 ? data?.title_line2 : " BIGGER WINS."}
              </h1>

              <p className="font-logo text-center lg:text-left text-gray-300 font-normal text-[14px] lg:text-[18px] leading-relaxed lg:leading-[28px] mb-8 max-w-[415px]">
                {data?.description
                  ? data?.description
                  : "  AI-powered predictions for every major sport. Get the edge you need for better picks."}
              </p>

              <div className="w-full flex items-center justify-center lg:justify-start">
                <Link
                  onClick={handleJoinNowClick}
                  to={data?.cta_url1 ? data?.cta_url : "/sign-up"}
                  className="w-[178px] h-[44px] rounded-full border border-[#0A9087] [background:linear-gradient(0deg,rgba(10,144,135,0)_8%,#032A27_314.44%)] font-logo text-white font-bold text-[16px] leading-none text-center flex justify-center items-center cursor-pointer hover:brightness-125 transition-all duration-300 shadow-[0_0_20px_rgba(10,144,135,0.3)]"
                >
                  {data?.cta_text ? data?.cta_text : " SIGN UP NOW "}
                </Link>
              </div>

              {/* Logos strip — desktop only (lg+) */}
              <div className="hidden lg:block w-full overflow-x-auto scrollbar-hide mt-8">
                <div className="flex items-center gap-3 py-3">
                  {[home1, home2, home3, home4, home5, home6, home7].map(
                    (img, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 rounded-xl overflow-hidden hover:border-[#0A9087]/50 hover:scale-105 transition-all duration-300"
                      >
                        <img
                          src={img}
                          alt={`home${index + 1}`}
                          className="h-auto w-auto object-contain p-2 opacity-70 hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Right Content — image */}
            <div
              className="w-full lg:w-1/2 flex justify-center items-center order-2 lg:order-2"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#0A9087]/20 blur-3xl scale-75" />
                <img
                  src={data?.hero_image ?? mobile}
                  alt="Mobile Preview"
                  className="relative z-10 w-[280px] sm:w-[380px] lg:w-[500px] xl:w-[564px] h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="block lg:hidden w-full overflow-x-auto scrollbar-hide order-3 ">
              <div className="flex items-center justify-start gap-2 py-2">
                {[home1, home2, home3, home4, home5, home6, home7].map(
                  (img, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[43px] h-[27px] rounded-lg overflow-hidden flex items-center justify-center   hover:scale-105 transition-all duration-300"
                    >
                      <img
                        src={img}
                        alt={`home${index + 1}`}
                        className="w-full h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
