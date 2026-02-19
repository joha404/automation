import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getFirstHero } from "@/api/home/hero.api";
import { useNavigate } from "react-router-dom";
import useCompressedImage from "@/hooks/useCompressedImage";

const logo2 =
  "https://res.cloudinary.com/dmvfzjgtb/image/upload/v1768289068/logo2_i2eqle.png";

export default function FirstHeroSection() {
  const [loading, setLoading] = useState(true);
  const [FirstHeroData, setFirstHeroData] = useState(null);

  const { src: compressedLogo, loading: logoLoading } =
    useCompressedImage(logo2);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getFirstHero();
      setFirstHeroData(res.data.net_units);
    } catch (error) {
      console.error("Error fetching First Hero Data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const goToSignUp = () => {
    navigate("/sign-up");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const phoneFloat = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const glowPulse = {
    animate: {
      opacity: [0.25, 0.4, 0.25],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 },
  };

  const buttonTap = {
    scale: 0.95,
  };

  return (
    <div className="relative min-h-screen mt-16 lg:mt-2 overflow-hidden bg-black">
      {/* Background Gradients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 85% 90% at 0% 20%,
              #2563eb 0%,
              #1e40af 20%,
              #1e3a8a 35%,
              #0f172a 55%,
              #000000 75%
            )
          `,
        }}
      />

      {/* Dark Gray gradient bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 40% 50% at calc(100% - 300px) 100%, 
              #2c2b30 10%, 
              #2c2b30 20%, 
              #2c2b30 25%, 
              transparent 95%
            )
          `,
        }}
      />

      {/* MOBILE & TABLET LAYOUT - SIMPLIFIED */}
      <div className="xl:hidden relative z-10 min-h-screen flex flex-col px-6 sm:px-8 md:px-12 py-8 md:py-12">
        {/* Text Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex-shrink-0 mb-8 md:mb-12 relative z-20"
        >
          <motion.div variants={fadeInLeft} className="hidden md:block mb-6">
            <img src={logo2} className="h-16 md:h-20 -ml-4" alt="Logo" />
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] font-bold text-white mb-3"
          >
            Invest in Sports.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light mb-2"
          >
            With true artificial intelligence.
          </motion.p>

          <motion.div variants={staggerContainer} className="space-y-1 mb-6">
            <motion.p
              variants={fadeInUp}
              className="text-sm md:text-lg font-semibold text-gray-200"
            >
              2024:{" "}
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl md:text-2xl font-bold text-blue-400"
              >
                133.42%{" "}
              </motion.span>
              ROI
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-sm md:text-lg font-semibold text-gray-200"
            >
              2025:{" "}
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl md:text-2xl font-bold text-blue-400"
              >
                158.25%{" "}
              </motion.span>
              ROI
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-sm md:text-lg font-semibold text-gray-200"
            >
              All Time (2024):{" "}
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-xl md:text-2xl font-bold text-blue-400"
              >
                {FirstHeroData ? FirstHeroData : "000%"}
                {" % "}
              </motion.span>
              ROI
            </motion.p>
          </motion.div>

          <motion.button
            onClick={() => goToSignUp()}
            variants={fadeInUp}
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="relative z-50 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold transition-colors duration-300 flex items-center gap-2 cursor-pointer touch-manipulation"
          >
            Sign Up
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center pointer-events-none"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-blue-600 pointer-events-none"
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
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex-1 flex justify-center items-center relative z-10"
        >
          {/* Blue Glow Effect */}
          <motion.div
            variants={glowPulse}
            animate="animate"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />

          {/* Phone Image with 3D effect */}
          <motion.div
            className="-mt-20"
            variants={phoneFloat}
            animate="animate"
            style={{
              transform: "perspective(1200px) rotateY(-8deg) rotateX(2deg)",
              filter: "drop-shadow(-15px 20px 40px rgba(0, 0, 0, 0.5))",
              pointerEvents: "none",
            }}
          >
            <img
              src="https://res.cloudinary.com/dmvfzjgtb/image/upload/v1768128822/Mobile_Phone_uduuaw.png"
              alt="Mobile App Preview"
              className="w-[300px] sm:w-[350px] md:w-[400px] h-auto rounded-[2.5rem] md:rounded-[3rem] pointer-events-none"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden xl:block relative z-10">
        <div className="flex flex-col xl:flex-row items-center min-h-screen px-6 md:px-8 xl:px-12 container mx-auto">
          {/* Left Side - Content (60%) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="w-full xl:w-[60%] min-h-screen border-4 border-gray-500 border-l-0 border-t-0 border-b-0 rounded-[50%] flex justify-center items-center text-white py-12 xl:py-0 xl:pr-16"
          >
            <div className="max-w-3xl">
              {/* Logo */}
              <motion.div
                variants={fadeInLeft}
                className="flex items-center gap-3 mb-12 xl:mb-8"
              >
                <div className="rounded-full flex items-center -ml-4">
                  <img src={logo2} className="h-full" alt="Logo" />
                </div>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl xl:text-7xl font-bold leading-tight mb-1 md:mb-2"
              >
                Invest in Sports.
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-gray-300 font-light mb-8 md:mb-12"
              >
                With true artificial intelligence.
              </motion.p>

              <motion.div
                variants={staggerContainer}
                className="space-y-2 mb-8 md:mb-12"
              >
                <motion.p
                  variants={fadeInUp}
                  className="text-base md:text-lg font-semibold text-gray-200"
                >
                  2024:{" "}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-2xl font-bold text-blue-400"
                  >
                    133.42%{" "}
                  </motion.span>
                  ROI
                </motion.p>
                <motion.p
                  variants={fadeInUp}
                  className="text-base md:text-lg font-semibold text-gray-200"
                >
                  2025:{" "}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-2xl font-bold text-blue-400"
                  >
                    158.25%{" "}
                  </motion.span>
                  ROI
                </motion.p>

                <motion.p
                  variants={fadeInUp}
                  className="text-base md:text-lg font-semibold text-gray-200"
                >
                  All Time (2024):{" "}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-2xl font-bold text-blue-400"
                  >
                    {FirstHeroData ? FirstHeroData : "000%"}
                    {" % "}
                  </motion.span>
                  ROI
                </motion.p>
              </motion.div>

              <motion.button
                onClick={() => goToSignUp()}
                variants={fadeInUp}
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 flex items-center gap-2 cursor-pointer"
              >
                Sign Up
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center pointer-events-none"
                >
                  <svg
                    className="w-5 h-5 text-blue-600 pointer-events-none"
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
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side - Phone Mockup (40%) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
            className="w-full xl:w-[40%] relative flex justify-center items-center py-12 xl:py-0"
          >
            {/* Blue Glow Effect */}
            <motion.div
              variants={glowPulse}
              animate="animate"
              className="absolute -bottom-10 xl:-bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            {/* Phone Image with 3D effect */}
            <motion.div
              variants={phoneFloat}
              animate="animate"
              className="pointer-events-none"
            >
              <img
                src="https://res.cloudinary.com/dmvfzjgtb/image/upload/v1768128822/Mobile_Phone_uduuaw.png"
                alt="Mobile App Preview"
                className="w-[600px] h-auto rounded-[3.5rem] pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
