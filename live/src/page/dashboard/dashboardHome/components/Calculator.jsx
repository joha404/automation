import SubmitButton from "@/components/buttons/SubmitButton";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { useTheme } from "@/hooks/custom/useTheme";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Calculator = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  const [startingBankroll, setStartingBankroll] = useState("1000");
  const [startingDate, setStartingDate] = useState("05 Jun 2025");
  const [unitSize, setUnitSize] = useState("100");
  const [results, setResults] = useState(null);

  // Calculate function
  const calculateResults = () => {
    const bankroll = parseFloat(startingBankroll) || 0;
    const unit = parseFloat(unitSize) || 0;

    if (unit === 0) return; // Prevent division by zero

    // Mock calculation - replace with your actual logic
    const totalProfit = bankroll * 3.75; // Example calculation
    const totalProfitInUnits = totalProfit / unit;
    const newBankroll = bankroll + totalProfit;

    setResults({
      totalProfit: totalProfit.toFixed(2),
      totalProfitInUnits: totalProfitInUnits.toFixed(2),
      newBankroll: newBankroll.toFixed(2),
    });
  };

  // Handle input changes with validation
  const handleBankrollChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setStartingBankroll(value);
  };

  const handleUnitSizeChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setUnitSize(value);
  };

  return (
    <CommonWrapper variant="bottomSmall">
      <Link to={`/dashboard/betting-calculator`}>
        <div
          className={`rounded-xl font-primary md:p-3 p-1 shadow-sm border transition-colors duration-300 ${
            theme === "dark"
              ? "bg-darkBlack border-mediumBlack"
              : "bg-white border-lightestGrey"
          } `}
        >
          <CommonParagraph variant="small" className="font-semibold pb-4">
            Betting Calculator
          </CommonParagraph>
          <div className="lg:block hidden">
            <div
              className={` ${
                sidebarOpen
                  ? "xl:mb-2.5 xl:space-y-5"
                  : "xl:mb-1.5 xl:space-y-2"
              } mb-4 xlg:space-y-2 lg:space-y-9 space-y-4`}
            >
              {/* Starting Bankroll Field */}
              <div
                className={`relative border ${
                  theme === "dark" ? "border-darkerGrey" : "border-lighterGrey"
                } rounded-lg pt-2.5 pb-2 px-4`}
              >
                <CommonParagraph
                  variant="small"
                  className={`absolute -top-3 left-3 px-2 ${
                    theme === "dark"
                      ? "text-mediumGrey bg-darkBlack"
                      : "text-darkGrey bg-white"
                  }`}
                >
                  Starting Bankroll
                </CommonParagraph>
                <input
                  type="text"
                  value={`$ ${startingBankroll}`}
                  onChange={(e) =>
                    setStartingBankroll(e.target.value.replace(""))
                  }
                  className={`w-full text-xs bg-transparent focus:outline-none font-normal ${
                    theme === "dark" ? "text-white" : "text-darkerBlack"
                  }`}
                  placeholder="0.00"
                />
              </div>

              {/* Starting Date Field */}
              <div
                className={`relative border ${
                  theme === "dark" ? "border-darkerGrey" : "border-lighterGrey"
                } rounded-lg pt-2.5 pb-2 px-4`}
              >
                <CommonParagraph
                  variant="small"
                  className={`absolute -top-3 left-3 px-2 ${
                    theme === "dark"
                      ? "text-mediumGrey bg-darkBlack"
                      : "text-darkGrey bg-white"
                  }`}
                >
                  Starting Date
                </CommonParagraph>
                <input
                  type="text"
                  value={startingDate}
                  onChange={(e) => setStartingDate(e.target.value)}
                  className={`w-full text-xs bg-transparent focus:outline-none font-normal ${
                    theme === "dark" ? "text-white" : "text-darkerBlack"
                  }`}
                  placeholder="DD MMM YYYY"
                />
              </div>
            </div>
            {/* Calculate Button */}
            <button
              className="relative
            transition-all duration-300 ease-in-out
            font-medium rounded w-full cursor-pointer
            overflow-hidden
            z-[1]
            hover:before:left-0 hover:before:right-0 hover:before:opacity-100
            disabled:opacity-90 disabled:cursor-not-allowed bg-mediumBlue text-white hover:bg-darkBlue py-2 text-sm"
              onClick={calculateResults}
            >
              Calculate
            </button>

            <div
              className={`${
                theme === "dark" ? "border-t-lightBlack" : "border-t-lightGrey"
              } mt-3`}
            >
              {/* Results Section */}
              <div
                className={`${
                  theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
                } 2xl:py-8.5 xl:py-7 py-3 px-2 rounded `}
              >
                <div className={`flex justify-between items-center `}>
                  <CommonParagraph variant="small" className={`opacity-70`}>
                    Total Profit:
                  </CommonParagraph>
                  <CommonParagraph variant="small" className={`font-semibold`}>
                    $37,516
                  </CommonParagraph>
                </div>

                <div className={`flex justify-between items-center py-2`}>
                  <CommonParagraph variant="small" className={`opacity-70`}>
                    Total Profit (In Units):
                  </CommonParagraph>
                  <CommonParagraph variant="small" className={`font-semibold`}>
                    275.16
                  </CommonParagraph>
                </div>

                <div className={`flex justify-between items-center pb-2`}>
                  <CommonParagraph variant="small" className={`opacity-70`}>
                    New Bankroll:
                  </CommonParagraph>
                  <CommonParagraph variant="small" className={`font-semibold`}>
                    $37,516
                  </CommonParagraph>
                </div>
                <div className={`flex justify-between items-center `}>
                  <CommonParagraph variant="small" className={`opacity-70`}>
                    Unit Size:
                  </CommonParagraph>
                  <CommonParagraph variant="small" className={`font-semibold`}>
                    $100
                  </CommonParagraph>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden block">
            <div
              className={` ${
                sidebarOpen
                  ? "xl:mb-2.5 xl:space-y-5"
                  : "xl:mb-1.5 xl:space-y-2"
              } mb-1`}
            >
              <div className="flex md:flex-col flex-row gap-1">
                {/* Starting Bankroll Field */}
                <div
                  className={`relative border ${
                    theme === "dark"
                      ? "border-darkerGrey"
                      : "border-lighterGrey"
                  } rounded-lg pt-2.5 pb-2 px-4`}
                >
                  <CommonParagraph
                    variant="small"
                    className={`absolute -top-3 left-3 px-2 ${
                      theme === "dark"
                        ? "text-mediumGrey bg-darkBlack"
                        : "text-darkGrey bg-white"
                    }`}
                  >
                    Bankroll
                  </CommonParagraph>
                  <input
                    type="text"
                    value={`$ ${startingBankroll}`}
                    onChange={(e) =>
                      setStartingBankroll(e.target.value.replace(""))
                    }
                    className={`w-full text-xs bg-transparent focus:outline-none font-normal ${
                      theme === "dark" ? "text-white" : "text-darkerBlack"
                    }`}
                    placeholder="0.00"
                  />
                </div>

                {/* Starting Date Field */}
                <div
                  className={`relative border ${
                    theme === "dark"
                      ? "border-darkerGrey"
                      : "border-lighterGrey"
                  } rounded-lg pt-2.5 pb-2 px-4`}
                >
                  <CommonParagraph
                    variant="small"
                    className={`absolute -top-3 left-3 px-2 ${
                      theme === "dark"
                        ? "text-mediumGrey bg-darkBlack"
                        : "text-darkGrey bg-white"
                    }`}
                  >
                    Starting Date
                  </CommonParagraph>
                  <input
                    type="text"
                    value={startingDate}
                    onChange={(e) => setStartingDate(e.target.value)}
                    className={`w-full text-xs bg-transparent focus:outline-none font-normal ${
                      theme === "dark" ? "text-white" : "text-darkerBlack"
                    }`}
                    placeholder="DD MMM YYYY"
                  />
                </div>
              </div>
            </div>
            {/* Calculate Button */}
            <button
              className="relative
            transition-all duration-300 ease-in-out
            font-medium rounded w-full cursor-pointer
            overflow-hidden
            z-[1]
            hover:before:left-0 hover:before:right-0 hover:before:opacity-100
            disabled:opacity-90 disabled:cursor-not-allowed bg-mediumBlue text-white hover:bg-darkBlue py-1 text-xs"
              onClick={calculateResults}
            >
              Calculate
            </button>

            <div
              className={`${
                theme === "dark" ? "border-t-lightBlack" : "border-t-lightGrey"
              } mt-3`}
            >
              {/* Results Section */}
              <div
                className={`grid md:grid-cols-4 grid-cols-2 gap-1 ${
                  theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
                } 2xl:py-8.5 xl:py-7 py-1 px-2 rounded `}
              >
                <div className={`flex justify-start  gap-2 items-center `}>
                  <CommonParagraph variant="extraSmall" className={`opacity-70`}>
                    Total Profit:
                  </CommonParagraph>
                  <CommonParagraph variant="extraSmall" className={`font-semibold`}>
                    $37,516
                  </CommonParagraph>
                </div>

                <div className={`flex justify-start  gap-2 items-center`}>
                  <CommonParagraph variant="extraSmall" className={`opacity-70`}>
                    Total Profit (In Units):
                  </CommonParagraph>
                  <CommonParagraph variant="extraSmall" className={`font-semibold`}>
                    275.16
                  </CommonParagraph>
                </div>

                <div className={`flex justify-start  gap-2 items-center`}>
                  <CommonParagraph variant="extraSmall" className={`opacity-70`}>
                    New Bankroll:
                  </CommonParagraph>
                  <CommonParagraph variant="extraSmall" className={`font-semibold`}>
                    $37,516
                  </CommonParagraph>
                </div>
                <div className={`flex justify-start  gap-2 items-center `}>
                  <CommonParagraph variant="extraSmall" className={`opacity-70`}>
                    Unit Size:
                  </CommonParagraph>
                  <CommonParagraph variant="extraSmall" className={`font-semibold`}>
                    $100
                  </CommonParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </CommonWrapper>
  );
};

export default Calculator;
