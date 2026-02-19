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

  const statsData = [
    { label: "Total", value: data?.summary?.total_picks || "0" },
    { label: "Wins", value: data?.summary?.wins || "0" },
    { label: "Losses", value: data?.summary?.losses || "0" },
    { label: "Pushes", value: data?.summary?.pushes || "0" },
    { label: "Win %", value: data?.summary?.win_pct || "0.00" },
  ];

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
      <div
        className={`rounded-xl font-primary sm:p-5 p-3 shadow-sm border ${
          theme === "dark"
            ? "bg-darkBlack border-mediumBlack"
            : "bg-white border-lightestGrey"
        } `}
      >
        <div
          className={` mb-2 ${
            theme === "dark" ? " bg-[#114F8C]" : "bg-mediumBlue "
          } text-white rounded-xl lg:p-6 p-2 flex flex-col items-center`}
        >
          <div className="flex items-center justify-between lg:justify-center gap-2 lg:gap-6 w-full my-2 lg:my-1">
            {/* Text */}
            <CommonTitle
              variant="regular"
              className="text-white !mb-0 ml-4 lg:ml-5 leading-none whitespace-nowrap"
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
          <div className="lg:flex hidden justify-center lg:justify-between gap-2 w-full lg:pt-6">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className={`border ${
                  theme === "dark"
                    ? "bg-mediumBlack border-mediumBlack"
                    : "bg-white border-lighterGrey"
                }
      text-gray-700 rounded flex justify-center items-center
      whitespace-nowrap leading-none
      
      ${window.innerWidth < 640 ? "w-full gap-1 px-3 py-2 min-h-[40px] text-[10px] shadow-sm" : ""}
      ${window.innerWidth >= 640 && window.innerWidth < 768 ? "w-[160px] gap-1.5 px-4 py-2 text-[11px] shadow-sm" : ""}
      ${window.innerWidth >= 768 && window.innerWidth < 1024 ? "w-[240px] gap-2 px-5 py-2.5 text-xs shadow" : ""}
      ${window.innerWidth >= 1024 && window.innerWidth < 1280 ? "w-[200px] gap-2 px-6 py-3 text-xs shadow-sm" : ""}
      ${window.innerWidth >= 1280 && window.innerWidth < 1536 ? "w-[260px] gap-2.5 px-7 py-4 text-sm shadow-md" : ""}
      ${window.innerWidth >= 1536 ? "w-[320px] gap-3 px-8 py-5 text-base shadow-lg" : ""}
      `}
              >
                <CommonParagraph className="font-medium">
                  {stat.label}
                </CommonParagraph>

                <CommonParagraph className="font-semibold">
                  {stat.value}
                </CommonParagraph>
              </div>
            ))}
          </div>
          <div className="lg:hidden grid md:grid-cols-4 grid-cols-2 justify-center gap-1 text-xs w-full lg:pt-5">
            {statsData.slice(0, 4).map((stat, index) => (
              <div
                key={index}
                className={`border ${
                  theme === "dark"
                    ? "bg-mediumBlack border-mediumBlack"
                    : "bg-white border-lighterGrey"
                } text-gray-700 py-2 px-5 rounded flex justify-center gap-2 lg:gap-3 items-center
      w-full `}
              >
                <CommonParagraph variant="small" className="font-medium">
                  {stat.label}:
                </CommonParagraph>
                <CommonParagraph>{stat.value}</CommonParagraph>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-lg sm:p-5 p-3 ${
            theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
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
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
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
                    stroke="#3b82f6"
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
