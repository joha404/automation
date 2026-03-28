import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import prediction1 from "../../../assets/home/prediction/prediction1.png";
import prediction2 from "../../../assets/home/prediction/prediction2.png";
import prediction3 from "../../../assets/home/prediction/prediction3.png";
import prediction4 from "../../../assets/home/prediction/prediction4.png";
import prediction5 from "../../../assets/home/prediction/prediction5.png";
import prediction6 from "../../../assets/home/prediction/prediction6.png";
import { useNavigate } from "react-router-dom";

const predictionImages = [
  prediction1,
  prediction2,
  prediction3,
  prediction4,
  prediction5,
  prediction6,
];

function AnimateWhenVisible({ children, variants, delay = 0, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const statsBarVariant = {
  hidden: { opacity: 0, y: -30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const statItemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.2 + i * 0.12 },
  }),
};

const cardContainerVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function StatsBar({ stats = [] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div className="flex justify-center absolute left-0 right-0 -top-20 lg:-top-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        className="w-full max-w-[749px] bg-gradient-to-r from-[#0A4F49] via-[#0c5c55] to-[#0A4F49] rounded-2xl border border-[#1E7C76]/40 shadow-[0_0_40px_rgba(10,144,135,0.15)]"
        variants={statsBarVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 py-5 sm:py-0 sm:h-[87px] gap-4 sm:gap-0">
          {stats.map((stat, i) => (
            <React.Fragment key={i}>
              <motion.div
                className="text-white text-center"
                variants={statItemVariant}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={i}
              >
                <p className="font-extrabold font-logo text-lg sm:text-[18px] leading-none">
                  {stat.value}
                  <span className="font-medium ml-2 text-white">
                    {stat.label}
                  </span>
                </p>
              </motion.div>
              {i < stats.length - 1 && (
                <div className="hidden sm:block h-[40px] w-[1px] bg-[#1E7C76]/60" />
              )}
              {i < stats.length - 1 && (
                <div className="sm:hidden w-[80%] h-[1px] bg-[#1E7C76]/40" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FeatureGrid({ features = [] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14"
      style={{
        gridTemplateColumns:
          window.innerWidth >= 768 && window.innerWidth < 1024
            ? "repeat(2, 1fr)"
            : undefined,
      }}
      variants={cardContainerVariant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.id ?? index}
          className="group relative p-4 sm:p-6 transition-all duration-400 overflow-hidden"
          variants={cardVariant}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.25, ease: "easeOut" },
          }}
        >
          <div className="flex flex-row sm:flex-col items-start gap-4 sm:gap-0">
            <motion.div
              className="relative flex-shrink-0 w-[37px] h-[37px] lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-[#0A9087] to-[#065e57] flex justify-center items-center shadow-[0_4px_20px_rgba(10,144,135,0.4)] group-hover:shadow-[0_4px_30px_rgba(10,144,135,0.6)] transition-shadow duration-300 sm:mb-5"
              whileHover={{
                rotate: [0, -8, 8, 0],
                transition: { duration: 0.4 },
              }}
            >
              <img
                src={
                  feature.icon ??
                  predictionImages[index % predictionImages.length]
                }
                alt={feature.title}
                className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
              />
            </motion.div>

            <div className="flex flex-col">
              <h3 className="font-logo text-white font-bold text-[16px] sm:text-[20px] leading-tight mb-1 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-white font-logo font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[22px]">
                {feature.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function PredictionSection({ data }) {
  const navigate = useNavigate();
  console.log(data.features);
  const statsData = data?.stats
    ? [
        {
          value: `${data.stats.daily_picks_count?.toLocaleString()}+`,
          label: data.stats.daily_picks_label,
        },
        {
          value: `${data.stats.picks_analyzed_count?.toLocaleString()}+`,
          label: data.stats.picks_analyzed_label,
        },
        {
          value: data.stats.predictions_value,
          label: data.stats.predictions_label,
        },
      ]
    : [];

  const features = data?.features ?? [];

  return (
    <div className="min-h-screen bg-[#032422] relative overflow-visible z-10">
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <StatsBar stats={statsData} />

        <AnimateWhenVisible
          variants={fadeUp}
          delay={0}
          className="text-center mt-32 sm:mt-20 mb-4"
        >
          <h2 className="text-white font-logo uppercase font-extrabold text-[17px] sm:text-3xl lg:text-[36px] leading-tight">
            Power Up Your Predictions
          </h2>
        </AnimateWhenVisible>

        <FeatureGrid features={features} />

        <AnimateWhenVisible
          variants={fadeUp}
          delay={0.2}
          className="mt-10 flex justify-center"
        >
          <motion.div
            onClick={() => navigate("/sign-up")}
            className="w-[215px] h-[44px] rounded-full bg-[#0A9087] font-logo text-white font-extrabold text-[16px] leading-[100%] tracking-[0%] text-center flex justify-center items-center cursor-pointer"
            whileHover={{
              scale: 1.06,
              backgroundColor: "#087a72",
              boxShadow: "0 0 28px rgba(10,144,135,0.55)",
              transition: { duration: 0.25 },
            }}
            whileTap={{ scale: 0.96 }}
          >
            START FREE TRIAL
          </motion.div>
        </AnimateWhenVisible>
      </div>
    </div>
  );
}
