import SubmitButton from "@/components/buttons/SubmitButton";
import Dropdown from "@/components/forms/Dropdown";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { useTheme } from "@/hooks/custom/useTheme";
import React, { useState } from "react";
import Howto from "./Howto";
import { usePost } from "@/hooks/api/common/usePost";

const Calculator = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  const [startingBankroll, setStartingBankroll] = useState("1000");
  const [startingDate, setStartingDate] = useState("2025-06-05");
  const [unitSize, setUnitSize] = useState("100");
  const [selectedMarket, setSelectedMarket] = useState("Ultimate");
  const [results, setResults] = useState(null);
  const [dateError, setDateError] = useState("");

  // Define endpoints
  const endpoints = {
    "Ultimate": "/ultimate/",
    "Core": "/core/",
    "Live": "/live/",
    "Player Props": "/player-props/",
    "Play of the Day": "/play-of-the-day/",
    
  };

  // Convert endpoints to dropdown options
  const marketOptions = Object.keys(endpoints).map(market => ({
    value: market,
    label: market
  }));

  // Get the endpoint based on selected market
  const getEndpoint = () => {
    if (selectedMarket && endpoints[selectedMarket]) {
      return `/betting-calculator${endpoints[selectedMarket]}`;
    }
    return "/betting-calculator/"; // fallback
  };

  // Use the usePost hook for the API call with dynamic endpoint
  const { mutate: calculateProfit, isPending } = usePost(getEndpoint());

  // Validate date format (YYYY-MM-DD)
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  // Handle date change with validation
  const handleDateChange = (e) => {
    const value = e.target.value;
    setStartingDate(value);

    if (value && !isValidDate(value)) {
      setDateError("Please use YYYY-MM-DD format");
    } else {
      setDateError("");
    }
  };

  // Handle bankroll change with validation (only digits)
  const handleBankrollChange = (e) => {
    const value = e.target.value.replace("$ ", "");
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setStartingBankroll(value);
    }
  };

  // Handle unit size change with validation (only digits)
  const handleUnitSizeChange = (e) => {
    const value = e.target.value.replace("$ ", "");
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setUnitSize(value);
    }
  };

  // Handle market change
  const handleMarketChange = (value) => {
    setSelectedMarket(value);
    setResults(null); // Clear previous results when market changes
  };

  // Calculate function using API
  const calculateResults = () => {
    // Validate market selection
    if (!selectedMarket) {
      alert("Please select a market");
      return;
    }

    // Validate date before calculation
    if (!isValidDate(startingDate)) {
      setDateError("Please enter a valid date in YYYY-MM-DD format");
      return;
    }

    const bankroll = parseFloat(startingBankroll) || 0;

    // Prepare data for API call
    const requestData = {
      starting_bankroll: bankroll,
      starting_date: startingDate,
    };

    // Make API call with current endpoint
    calculateProfit(requestData, {
      onSuccess: (data) => {
        if (data) {
          setResults({
            totalProfit: data?.data?.total_profit,
            totalProfitInUnits: data?.data?.total_profit_units,
            newBankroll: data?.data?.new_bankroll,
            unitSize: data?.data?.unit_size,
            market: selectedMarket, // Include selected market in results
          });
        }
      },
      onError: (error) => {
        setResults(null);
        console.error("Calculation error:", error);
      },
    });
  };

  return (
    <div
      className={`rounded-xl max-w-5xl mx-auto font-primary lg:p-16 p-5 shadow-sm border transition-colors duration-300  ${
        theme === "dark"
          ? "bg-darkBlack border-mediumBlack"
          : "bg-white border-lightestGrey"
      } `}
    >
      <CommonTitle
        variant="large"
        className="font-semibold lg:pb-8 pb-6 text-center"
      >
        Betting Calculator
      </CommonTitle>
      
      {/* Market Dropdown - Added below title */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
          <Dropdown
            atLeft={true}
            options={marketOptions}
            placeholder={selectedMarket || "Select an option"}
            variant="bg_none"
            formInput={true}
            value={selectedMarket}
            onChange={handleMarketChange}
          />
        </div>
      </div>

      <div>
        <div
          className={`flex flex-col xl:flex-row w-full gap-4 ${
            sidebarOpen ? "xl:mb-2.5" : "xl:mb-1.5"
          }`}
        >
          {/* Starting Bankroll Field */}
          <div
            className={`relative border ${
              theme === "dark" ? "border-darkerGrey" : "border-lighterGrey"
            } rounded-lg py-4 px-4 flex-1`}
          >
            <CommonParagraph
              className={`absolute -top-3 left-3 px-2 ${
                theme === "dark"
                  ? "text-white bg-darkBlack opacity-70"
                  : "text-darkGrey bg-white"
              }`}
            >
              Starting Bankroll
            </CommonParagraph>
            <input
              type="text"
              value={`$ ${startingBankroll}`}
              onChange={handleBankrollChange}
              className={`w-full text-sm xl:text-base bg-transparent focus:outline-none font-normal ${
                theme === "dark" ? "text-lighterGrey" : "text-darkerBlack"
              }`}
              placeholder="0.00"
            />
          </div>

          {/* Starting Date Field */}
          <div className="relative flex-1">
            <div
              className={`border ${
                theme === "dark" ? "border-darkerGrey" : "border-lighterGrey"
              } rounded-lg py-4 px-4 h-full`}
            >
              <CommonParagraph
                className={`absolute -top-3 left-3 px-2 ${
                  theme === "dark"
                    ? "text-white bg-darkBlack opacity-70"
                    : "text-darkGrey bg-white"
                }`}
              >
                Starting Date
              </CommonParagraph>
              <input
                type="text"
                value={startingDate}
                onChange={handleDateChange}
                className={`w-full text-sm xl:text-base bg-transparent focus:outline-none font-normal ${
                  theme === "dark" ? "text-lighterGrey" : "text-darkerBlack"
                }`}
                placeholder="YYYY-MM-DD"
              />
            </div>
            {/* Move error message to absolute positioning */}
            {dateError && (
              <p className="text-red-500 text-xs mt-1 absolute bottom-0 transform translate-y-full">
                {dateError}
              </p>
            )}
          </div>
        </div>

        {/* Calculate Button */}
        <SubmitButton
          variant="bg_blue"
          size="regular"
          isLoading={isPending}
          loadingText="Calculating"
          onClick={calculateResults}
          disabled={isPending || !selectedMarket}
          type="button"
          className="w-full py-3 xl:text-lg text-base mt-5"
        >
          Calculate
        </SubmitButton>

        <div className={`mt-5`}>
          {/* Results Section */}
          <div
            className={`border-2 border-dashed grid lg:grid-cols-2 grid-cols-1 gap-3 justify-between ${
              theme === "dark"
                ? "bg-darkerBlack border-mediumGrey"
                : "bg-lightestGrey border-lighterGrey"
            } p-3 rounded `}
          >
            <div
              className={`flex justify-between items-center p-3 rounded gap-5 w-full ${
                theme === "dark" ? "bg-mediumBlack" : "bg-white"
              }`}
            >
              <CommonParagraph variant="small" className={`opacity-70`}>
                Total Profit:
              </CommonParagraph>
              <CommonParagraph variant="small" className={`font-semibold`}>
                ${results ? results.totalProfit : "0.00"}
              </CommonParagraph>
            </div>

            <div
              className={`flex justify-between items-center p-3 rounded gap-5 w-full ${
                theme === "dark" ? "bg-mediumBlack" : "bg-white"
              }`}
            >
              <CommonParagraph variant="small" className={`opacity-70`}>
                Total Profit (In Units):
              </CommonParagraph>
              <CommonParagraph variant="small" className={`font-semibold`}>
                $
                {results
                  ? parseFloat(results.totalProfitInUnits).toFixed(2)
                  : "0.00"}
              </CommonParagraph>
            </div>

            <div
              className={`flex justify-between items-center p-3 rounded gap-5 w-full ${
                theme === "dark" ? "bg-mediumBlack" : "bg-white"
              } `}
            >
              <CommonParagraph variant="small" className={`opacity-70`}>
                New Bankroll:
              </CommonParagraph>
              <CommonParagraph variant="small" className={`font-semibold`}>
                ${results ? results.newBankroll : "0.00"}
              </CommonParagraph>
            </div>

            <div
              className={`flex justify-between items-center p-3 rounded gap-5 w-full ${
                theme === "dark" ? "bg-mediumBlack" : "bg-white"
              } `}
            >
              <CommonParagraph variant="small" className={`opacity-70`}>
                Unit Size:
              </CommonParagraph>
              <CommonParagraph variant="small" className={`font-semibold`}>
                ${results ? results.unitSize : "0.00"}
              </CommonParagraph>
            </div>
          </div>
          
          {/* Show selected market in results if available */}
          {/* {results && (
            <div className="mt-3 text-center">
              <CommonParagraph variant="small" className="opacity-70">
                Market: <span className="font-semibold">{results.market}</span>
              </CommonParagraph>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Calculator;