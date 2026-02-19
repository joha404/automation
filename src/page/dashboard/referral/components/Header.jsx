import React, { useState } from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import CommonParagraph from "@/components/texts/CommonParagraph";

const Header = () => {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("KG-7OPC928W");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <CommonWrapper variant="">
      <div className="rounded-xl mx-auto font-primary">
        <div className="mx-auto p-4 md:p-6 relative">
          {/* Blue Header Section */}
          <div className="bg-darkBlue rounded-lg p-6 md:p-8 text-center text-white xl:min-h-[40vh] lg:min-h-[50vh] h-full">
            <div className="mb-4">
              <span className="bg-blue-600 px-3 py-1 rounded-md text-xs md:text-sm inline-block">
                Hint: Referral rewards give users 50% off codes automatically
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mt-10">
              Referral System
            </h1>
            <p className="text-sm md:text-lg opacity-90 max-w-2xl mx-auto">
              Share your link, get friends to sign up and purchase, and earn an
              automatic 50% off code for the same package.
            </p>
          </div>

          {/* Reward Section - White Card */}
          <div
            className={`border border-lightBlue shadow-xl lg:absolute left-0 right-0 lg:-bottom-16  xl:w-5xl xlg:w-3xl lg:w-2xl md:w-lg sm:w-md w-full mx-auto  mt-5 ${
              theme === "dark" ? "bg-gray-900 " : "bg-extraLightBlue"
            } rounded-xl p-4 md:p-6 shadow-lg `}
          >
            <div className="mb-2 flex xlg:justify-start items-center justify-center">
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-mediumGrey" : "text-darkGrey"
                }`}
              >
                Reward unlocked
              </span>
            </div>

            <div className="flex flex-col xlg:flex-row md:items-center gap-4">
              <div className="flex-1">
                <CommonParagraph
                  variant="large"
                  className="font-semibold text-base md:text-lg"
                >
                  50% off Ultimate Predictions — Code: KG-7OPC928W
                </CommonParagraph>
                <div
                  className={`text-xs md:text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  } mt-1`}
                >
                  Valid until 8/7/2025 • 1 use • Non-transferable
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyCode}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
                >
                  {copiedCode ? "Copied!" : "Copy Code"}
                </button>

                <button className="cursor-pointer border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base">
                  Apply at Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Header;
