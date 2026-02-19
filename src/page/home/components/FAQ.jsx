import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-[#0A9087]/50 bg-[#032422] shadow-[0_0_20px_rgba(10,144,135,0.08)]"
          : "border-[#1E7C76]/20 bg-[#032422]/60 hover:border-[#1E7C76]/40"
      }`}
    >
      <button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 text-left gap-4 cursor-pointer"
      >
        <span className="font-logo text-white font-extrabold text-[14px] sm:text-[16px] leading-snug">
          {faq.question}
        </span>
        <span className="flex-shrink-0 text-[#0A9087]">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {/* Answer */}
      <div
        className={`transition-all duration-400 ease-in-out ${
          isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <p className="font-logo text-white/60 font-normal text-[13px] sm:text-[15px] leading-[22px] sm:leading-[26px] px-5 sm:px-7 pb-5 sm:pb-6">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(1);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#020C0B] relative overflow-hidden py-16 sm:py-24 ">
      {/* Background glow */}
      {/* <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-[#0A9087]/5 blur-[120px] rounded-full pointer-events-none" /> */}

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          {/* ── Left: Heading ── */}
          <div className="w-full lg:w-[383px] flex-shrink-0 text-center lg:text-left">
            <h2 className="font-logo text-white font-extrabold text-base sm:text-xl lg:text-[28px] uppercase leading-tight mb-2 lg:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-logo text-[#ECF6F4] font-normal text-[13px] sm:text-[18px] leading-[20px] sm:leading-[29px]">
              Discover quick answers to common questions about HyperPicks.ai and
              its powerful capabilities.
            </p>
          </div>

          {/* ── Right: FAQ Items ── */}
          <div className="flex-1 flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
