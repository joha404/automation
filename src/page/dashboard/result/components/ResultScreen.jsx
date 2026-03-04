import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useSidebar } from "@/hooks/custom/useSidebar";
import { useTheme } from "@/hooks/custom/useTheme";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Dropdown from "@/components/forms/Dropdown";
import ResultDropdown from "@/components/forms/ResultDropdown";

const ResultScreen = ({
  selectedMarket,
  setSelectedMarket,
  markets,
  chartData,
  data,
}) => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  // Transform the chart data to match what the AreaChart expects
  const transformChartData = (rawData) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      // Return a single point with value 0 to show the graph
      return [{ date: "No Data", value: 0 }];
    }

    return rawData.map((point) => ({
      date: point.date,
      value: point.cumulative_units,
    }));
  };

  // Get the chart data
  const currentData = transformChartData(chartData);

  // Convert markets array to dropdown options format
  const marketOptions =
    markets?.map((market) => ({
      value: market,
      label: market,
    })) || [];

  return (
    <CommonWrapper>
      <div className={`rounded-xl font-primary sm:p-5 p-3 shadow-sm   `}>
        <div
          className={` mb-2 ${
            theme === "dark" ? " bg-[#021716]" : "bg-lightestGrey "
          } text-white rounded-xl lg:p-6 p-2 flex flex-col items-center`}
        >
          <div className="flex items-center justify-between lg:justify-center gap-2 lg:gap-6 w-full my-2 lg:my-1">
            {/* Text */}
            <CommonTitle
              variant="regular"
              className="text-[#0A9087] !mb-0 ml-4 lg:ml-5 leading-none whitespace-nowrap"
            >
              {data?.headline?.units || "0.00"} %
            </CommonTitle>

            {/* Dropdown */}
            <div className="flex items-center w-[153px] sm:w-[160px] md:w-[140px] lg:w-[180px] xl:w-[180px] 2xl:min-w-[180px]">
              <ResultDropdown
                atLeft={true}
                options={marketOptions}
                placeholder={selectedMarket || "Select an option"}
                variant={theme === "dark" ? "bg_black" : "bg_white"}
                formInput={true}
                value={selectedMarket}
                onChange={(value) => setSelectedMarket(value)}
              />
            </div>
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default ResultScreen;
