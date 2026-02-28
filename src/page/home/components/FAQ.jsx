import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const faqs = [
  {
    question: "How does HyperPicks.ai work?",
    answer:
      "HyperPicks.ai uses advanced machine learning models trained on millions of historical games, player stats, injuries, weather, and betting line movements to generate high-confidence predictions for every major sport.",
  },
  {
    question: "How much money do I need?",
    answer:
      "You can start with any bankroll, but we recommend at least $250. Having more gives you the flexibility to place larger bets and take advantage of more opportunities each day.",
  },
  {
    question: "Will this work in my location?",
    answer:
      "HyperPicks.ai works globally. As long as you have access to a sportsbook in your region, our predictions are fully applicable. We support users across the US, Canada, UK, Australia, and many more countries.",
  },
  {
    question: "What is included in the basic plan?",
    answer:
      "The basic plan includes daily AI-powered picks for major sports, access to our prediction dashboard, win/loss tracking, and email alerts. Premium plans unlock live betting signals, automation, and priority support.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel anytime from your account settings under Billing. There are no cancellation fees and your access continues until the end of your billing period.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied within the first week, contact our support team and we'll process a full refund — no questions asked.",
  },
];

// ── Variants ──
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const faqStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const faqItemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      variants={faqItemVariant}
      className={`rounded-xl border overflow-hidden ${
        isOpen
          ? "border-[#0A9087]/50 bg-[#032422] shadow-[0_0_20px_rgba(10,144,135,0.08)]"
          : "border-[#1E7C76]/20 bg-[#032422]/60 hover:border-[#1E7C76]/40"
      }`}
      animate={{
        borderColor: isOpen ? "rgba(10,144,135,0.5)" : "rgba(30,124,118,0.2)",
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 text-left gap-4 cursor-pointer"
        whileTap={{ scale: 0.99 }}
      >
        <span className="font-logo text-white font-extrabold text-[14px] sm:text-[16px] leading-snug">
          {faq.question}
        </span>
        <motion.span
          className="flex-shrink-0 text-[#0A9087]"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </motion.button>

      {/* Animated answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <motion.p
              className="font-logo text-white/60 font-normal text-[13px] sm:text-[15px] leading-[22px] sm:leading-[26px] px-5 sm:px-7 pb-5 sm:pb-6"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
            >
              {faq.answer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(1);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Scroll triggers
  const leftRef = useRef(null);
  const leftInView = useInView(leftRef, { once: true, margin: "-70px" });

  const rightRef = useRef(null);
  const rightInView = useInView(rightRef, { once: true, margin: "-70px" });

  return (
    <div className="bg-[#020C0B] relative overflow-hidden py-16 sm:py-24">
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          {/* ── Left: Heading ── */}
          <motion.div
            ref={leftRef}
            className="w-full lg:w-[383px] flex-shrink-0 text-center lg:text-left"
            variants={fadeUp}
            initial="hidden"
            animate={leftInView ? "visible" : "hidden"}
            custom={0}
          >
            <h2 className="font-logo text-white font-extrabold text-base sm:text-xl lg:text-[28px] uppercase leading-tight mb-2 lg:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-logo text-[#ECF6F4] font-normal text-[13px] sm:text-[18px] leading-[20px] sm:leading-[29px]">
              Discover quick answers to common questions about HyperPicks.ai and
              its powerful capabilities.
            </p>
          </motion.div>

          {/* ── Right: FAQ Items ── */}
          <motion.div
            ref={rightRef}
            className="flex-1 flex flex-col gap-3"
            variants={faqStagger}
            initial="hidden"
            animate={rightInView ? "visible" : "hidden"}
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={handleToggle}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
