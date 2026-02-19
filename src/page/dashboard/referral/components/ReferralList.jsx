import React from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import { cn } from "@/lib/utils";
import { IoCopy } from "react-icons/io5";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { useGet } from "@/hooks/api/common/useGet";
import AllOffer from "@/components/offer/AllOffer";

const ReferralList = () => {
  const { theme } = useTheme();

  // Fetch referral link
  const { data: response, isLoading } = useGet("/referrals/generate-link/", {
    queryKey: ["referrals"],
    secure: true,
  });

  console.log(response);

  // Add state for copy feedback and generating state
  const [copied, setCopied] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // FIX: Extract data from the nested response structure
  const referralData = response?.data;
  const hasReferralLink = referralData?.referral_link;
  const referralLink = referralData?.referral_link;

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    // The API call is handled by the useGet hook, so we just need to trigger a refetch
    // In a real scenario, you might use a mutation hook here
    // For now, we'll simulate the generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const featureTags = [
    "Auto-applied discount",
    "Referral link lives in your profile",
    "Confirmation emails for both sides",
  ];

  const steps = [
    {
      number: "01",
      title: "Copy Referral Link",
      description:
        "Grab it anytime from your profile's Referral Program panel.",
    },
    {
      number: "02",
      title: "Invite Friends",
      description:
        "Share the link wherever you connect; email, socials, or chat.",
    },
    {
      number: "03",
      title: "Earn Discounts",
      description:
        "Once they join a paid plan, we reward a one-time 50% renewal credit for you.",
    },
  ];

  const faqs = [
    {
      question: "When will the discount show up?",
      answer:
        "It lands on your next renewal invoice as soon as your referral's payment clears.",
    },
    {
      question: "Do I need to manage codes?",
      answer:
        "No. We tag your account automatically and email both you and your friend when the credit activates.",
    },
    {
      question: "Can I stack rewards?",
      answer:
        "Yes-every successful referral adds a separate 50% credit. We apply them in the order they're earned.",
    },
    {
      question: "What if I change or pause my plan?",
      answer:
        "The credit waits for the next eligible renewal before the expiry date listed in your profile.",
    },
  ];

  return (
    <div className="min-h-screen sm:p-2 lg:p-8 xl:p-10">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        {/* <h1
          className={`text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 ${
            theme === "dark" ? "text-white" : "text-darkBlack"
          }`}
        >
          Referral Program
        </h1> */}
        {/* <AllOffer /> */}

        {/* Info Banner */}
        <div
          className={`rounded-2xl p-4 sm:p-6  mb-6 sm:mb-8 backdrop-blur-lg border
            ${
              theme === "dark"
                ? "bg-darkBlack/60 border-lightBlack/80"
                : "bg-white/60 border-lightGrey/50"
            }
            shadow-lg
          `}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            {/* Blue Circle - Aligned with first line of text */}
            <div className="sm:w-3 sm:h-3 w-2 h-2 rounded-full bg-lightBlue flex-shrink-0  sm:mt-1.5 mt-2 shadow-md"></div>

            {/* Text Content */}
            <CommonParagraph className="text-sm sm:text-base leading-relaxed">
              Give your friends a head start and earn{" "}
              <span className="font-semibold text-blue-500">
                50% off your next subscription renewal automatically.
              </span>
            </CommonParagraph>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            {/* Blue Circle - Aligned with first line of text */}
            <div className="sm:w-3 sm:h-3 w-2 h-2 rounded-full bg-lightBlue flex-shrink-0  sm:mt-1.5 mt-2 shadow-md"></div>

            {/* Text Content */}
            <CommonParagraph className="text-sm sm:text-base leading-relaxed">
              New users who signed up with your referral link will get
              <span className="font-semibold text-blue-500 ps-1">
                10 USD off their first purchase.
              </span>
            </CommonParagraph>
          </div>
        </div>

        {/* Referral Link Section */}
        <div
          className={`
          rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8
          backdrop-blur-lg border
          ${
            theme === "dark"
              ? "bg-darkBlack/60 border-lightBlack/80"
              : "bg-white/60 border-lightGrey/50"
          }
          shadow-lg
        `}
        >
          <CommonParagraph
            variant="large"
            className={`font-semibold mb-4 lg:text-left text-center ${
              theme === "dark" ? "text-lightestGrey" : "text-gray-900"
            }`}
          >
            Your Referral Link
          </CommonParagraph>

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Referral Link Display */}
            <div
              className={`
                flex-1 rounded-xl p-3 sm:p-3.5 border backdrop-blur-md
                ${
                  theme === "dark"
                    ? "bg-darkerBlack/80 border-lightBlack/50 text-lightGrey"
                    : "bg-white/70 border-lightGrey/30 text-darkGrey"
                }
                break-all font-mono text-sm sm:text-base
              `}
            >
              {hasReferralLink ? (
                referralLink
              ) : (
                <span
                  className={
                    theme === "dark" ? "text-lightGrey/60" : "text-darkGrey/60"
                  }
                >
                  Generate your referral link and share...
                </span>
              )}
            </div>

            {/* Generate/Copy Button */}
            {!hasReferralLink ? (
              // Generate Button for new users
              <button
                onClick={handleGenerateLink}
                disabled={isLoading || isGenerating}
                className={`
                  rounded-xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2
                  backdrop-blur-md border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                  min-w-[140px] lg:min-w-[160px]
                  ${
                    theme === "dark"
                      ? "bg-green-600/80 border-green-500/50 hover:bg-green-500/80 text-white disabled:bg-green-600/50"
                      : "bg-green-500/80 border-green-400/50 hover:bg-green-400/80 text-white disabled:bg-green-500/50"
                  }
                  shadow-md font-medium disabled:cursor-not-allowed
                `}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Generate Link</span>
                  </>
                )}
              </button>
            ) : (
              // Copy Button for existing users
              <button
                onClick={handleCopyLink}
                className={`
                  rounded-xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2
                  backdrop-blur-md border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                  min-w-[140px] sm:min-w-[160px]
                  ${
                    copied
                      ? theme === "dark"
                        ? "bg-green-600/80 border-green-500/50 text-white"
                        : "bg-green-500/80 border-green-400/50 text-white"
                      : theme === "dark"
                        ? "bg-blue-600/80 border-blue-500/50 hover:bg-blue-500/80 text-white"
                        : "bg-blue-500/80 border-blue-400/50 hover:bg-blue-400/80 text-white"
                  }
                  shadow-md font-medium
                `}
              >
                <IoCopy className="text-lg" />
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            )}
          </div>

          {/* Success Messages */}
          {copied && hasReferralLink && (
            <CommonParagraph
              variant="small"
              className="text-green-500 mt-3 text-center sm:text-left flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Link copied to clipboard!
            </CommonParagraph>
          )}
        </div>

        {/* How It Works Section */}
        <div
          className={`
          rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8
          backdrop-blur-lg border
          ${
            theme === "dark"
              ? "bg-darkBlack/60 border-lightBlack/80"
              : "bg-white/60 border-lightGrey/50"
          }
          shadow-lg
        `}
        >
          <CommonParagraph
            variant="large"
            className={`font-semibold mb-2 ${
              theme === "dark" ? "text-lightestGrey" : "text-gray-900"
            }`}
          >
            How It Works
          </CommonParagraph>
          <CommonParagraph variant="small" className="mb-6">
            Every qualified signup locks a 50% credit onto your next
            subscription invoice; no promo codes, no back-and-forth.
          </CommonParagraph>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            {featureTags.map((tag, index) => (
              <div
                key={index}
                className={`
                px-3 sm:px-4 py-1.5  rounded-full flex items-center gap-2 shadow-sm
                backdrop-blur-md border 
                ${
                  theme === "dark"
                    ? "bg-darkerBlack border-lightBlack/80"
                    : "bg-white/60 border-lightGrey/50"
                }
              `}
              >
                <div className="w-2 h-2  bg-green-500 rounded-full"></div>
                <CommonParagraph variant="small" className="font-normal ">
                  {tag}
                </CommonParagraph>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`
                rounded-2xl p-4 sm:p-6 transition-transform hover:scale-[1.02]
                backdrop-blur-md border 
                ${
                  theme === "dark"
                    ? "bg-darkerBlack/80 border-lightBlack/50"
                    : "bg-lightestBlue/40 border-mediumBlue/20"
                }
              `}
              >
                <div
                  className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 shadow-md
                  backdrop-blur-sm
                  ${theme === "dark" ? "bg-lightBlack/70" : "bg-white/70"}
                `}
                >
                  <span
                    className={`text-base sm:text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className={`text-base font-semibold sm:text-lg mb-2 ${
                    theme === "dark" ? "text-lightestGrey" : "text-darkGrey"
                  }`}
                >
                  {step.title}
                </h3>
                <CommonParagraph variant="small">
                  {step.description}
                </CommonParagraph>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referral FAQs */}
      <div
        className={`
        rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg
        backdrop-blur-lg border
          ${
            theme === "dark"
              ? "bg-darkBlack/60 border-lightBlack/80"
              : "bg-white/60 border-lightGrey/50"
          }
      `}
      >
        <CommonParagraph
          variant="large"
          className={`font-semibold mb-5 ${
            theme === "dark" ? "text-lightestGrey" : "text-gray-900"
          }`}
        >
          Referral FAQs
        </CommonParagraph>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`
              rounded-2xl p-4 sm:p-6 transition-colors
              backdrop-blur-md border border-opacity-20
              ${
                theme === "dark"
                  ? "bg-darkerBlack/80 border-lightBlack/50"
                  : "bg-lightestBlue/40 border-mediumBlue/20"
              }
            `}
            >
              <CommonParagraph
                variant="small"
                className={`font-medium mb-1 text-base sm:text-lg ${
                  theme === "dark" ? "text-white" : "text-darkGrey"
                }`}
              >
                {faq.question}
              </CommonParagraph>
              <CommonParagraph variant="small" className="font-normal">
                {faq.answer}
              </CommonParagraph>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralList;
