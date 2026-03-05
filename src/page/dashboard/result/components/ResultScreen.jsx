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
              {data?.headline?.units || "0.00"}
            </CommonTitle>

            {/* Dropdown */}
            {/* <div className="flex items-center w-[153px] sm:w-[160px] md:w-[140px] lg:w-[180px] xl:w-[180px] 2xl:min-w-[180px]">
              <ResultDropdown
                atLeft={true}
                options={marketOptions}
                placeholder={selectedMarket || "Select an option"}
                variant={theme === "dark" ? "bg_black" : "bg_white"}
                formInput={true}
                value={selectedMarket}
                onChange={(value) => setSelectedMarket(value)}
              />
            </div> */}
          </div>
        </div>
        <div
          className={`rounded-lg sm:p-5 p-3 ${
            theme === "dark" ? "bg-[#021716]" : "bg-lightestGrey"
          } `}
        >
          <div>
            {/* Chart */}
            <div className="mt-6 lg:h-[400px] md:h-[200px] h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#00e5cc" stopOpacity={0.4} />
                      <stop
                        offset="100%"
                        stopColor="#00e5cc"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    width={40}
                    tickFormatter={(value) => `${value}`}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.2}
                    vertical={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      fontSize: "12px",
                      backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                      color: theme === "dark" ? "white" : "#1f2937",
                      border: "none",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    formatter={(value) => [
                      `${Number(value).toFixed(2)} units`,
                      "Cumulative Units",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00e5cc"
                    strokeWidth={2}
                    fill="url(#blueGradient)"
                    dot={false}
                    activeDot={{ r: 4, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default ResultScreen;
