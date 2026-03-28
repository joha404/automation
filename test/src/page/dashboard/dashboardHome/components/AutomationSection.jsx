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
} from "recharts";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { Link } from "react-router-dom";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { useGet } from "@/hooks/api/common/useGet";

const AutomationSection = () => {
  const [filter, setFilter] = useState("AT");
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  const { data: balanceData, isLoading: balanceLoading } = useGet("/balance/", {
    queryKey: ["balance"],
    secure: true,
  });

  const { data: graphData, isLoading: chartLoading } = useGet(
    "/chart/user-deposits/",
    {
      queryKey: ["graph"],
      secure: true,
    }
  );

  const transformChartData = (filterType) => {
    const rawData = graphData?.data?.chartData || [];

    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    const now = new Date();

    const getFilteredData = (daysBack) => {
      let filteredData = [];

      if (daysBack === null) {
        filteredData = rawData;
      } else {
        const cutoffDate = new Date(now);
        cutoffDate.setDate(now.getDate() - daysBack);

        filteredData = rawData.filter((item) => {
          const itemDate = new Date(item[0]);
          return itemDate >= cutoffDate;
        });
      }

      // Add 0 point with the same date as first data point
      if (filteredData.length > 0) {
        const firstDate = filteredData[0][0];
        // Use a special marker for the 0 point
        const zeroPoint = [`${firstDate}_start`, 0];
        filteredData = [zeroPoint, ...filteredData];
      }

      return filteredData.map((item) => ({
        date: item[0],
        value: item[1],
        displayDate: item[0].endsWith("_start") ? "" : item[0], // Hide date for 0 point
      }));
    };

    const timeRanges = {
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "1Y": 365,
      AT: null,
    };

    return getFilteredData(timeRanges[filterType]);
  };

  const currentData = transformChartData(filter);

  const getPercentageForFilter = () => {
    const percentages = graphData?.data?.percentage;
    if (!percentages) return null;

    return percentages[filter] || percentages.AT || 0;
  };

  const getPercentageAmountForFilter = () => {
    const percentages = graphData?.data?.percentage_amount;
    if (!percentages) return null;

    return percentages[filter] || percentages.AT || 0;
  };

  const currentPercentage = getPercentageForFilter();
  const currentPercentageAmount = getPercentageAmountForFilter();

  const isPositive = currentPercentage >= 0;
  const percentageColor = isPositive ? "text-green-500" : "text-red-500";

  if (balanceLoading || chartLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="bottomSmall" className="my-3 lg:my-0">
      <Link to={`/dashboard/automation`}>
        <div
          className={`rounded-xl font-primary md:p-3 p-1 shadow-sm border transition-colors duration-300 ${
            theme === "dark"
              ? "bg-darkBlack border-mediumBlack"
              : "bg-white border-lightestGrey"
          } `}
        >
          <CommonParagraph variant="small" className="font-semibold ">
            Automation
          </CommonParagraph>
          <div
            className={`rounded-lg md:p-2 ${
              theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
            } `}
          >
            <div className="flex flex-col justify-center items-center">
              <div className="flex items-center gap-2">
                <CommonParagraph
                  variant="small"
                  className="font-semibold text-mediumBlue"
                >
                  ${balanceData?.data?.amount || "0.00"}
                </CommonParagraph>

                {/* Percentage with arrow */}
                {currentPercentage !== null && (
                  <div className={`flex items-center gap-1 ${percentageColor}`}>
                    <CommonParagraph
                      variant="small"
                      className="flex justify-center items-center font-medium text-current"
                    >
                      {isPositive ? (
                        <IoIosArrowRoundUp className="text-xl" />
                      ) : (
                        <IoIosArrowRoundDown className="text-xl" />
                      )}
                      $ {Math.abs(currentPercentageAmount)} (
                      {Math.abs(currentPercentage)}%)
                    </CommonParagraph>
                  </div>
                )}
              </div>
            </div>

            <div className={`lg:block hidden`}>
              {/* Filter Buttons */}
              <div className="w-full flex justify-center items-center ">
                <div
                  className={`flex gap-1 flex-wrap border rounded-md shadow-lg p-1 ${
                    theme === "dark"
                      ? "bg-darkBlack border-lightBlack"
                      : "bg-lightestBlue border-lightBlue"
                  }`}
                >
                  {["24H", "1W", "1M", "3M", "1Y", "AT"].map((f) => (
                    <button
                      key={f}
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   e.stopPropagation();
                      //   setFilter(f);
                      // }}
                      className={`px-3 rounded text-xs font-medium transition-colors cursor-pointer ${
                        filter === f
                          ? "bg-blue-500 text-white"
                          : theme === "dark"
                          ? "hover:bg-darkerGrey text-lightGrey hover:text-white"
                          : "hover:bg-mediumBlue text-darkBlue hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="lg:h-42 h-36 xl:mt-2 lg:mt-3 xlg:mt-0">
                {currentData.length > 0 ? (
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
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        width={40}
                        domain={[0, "dataMax"]}
                        allowDecimals={false}
                        ticks={(() => {
                          // Get the maximum value from the data
                          const maxValue = Math.max(
                            ...currentData.map((item) => item.value || 0)
                          );

                          // If maxValue is 0 or very small, return default ticks
                          if (maxValue <= 0) return [0, 1, 2, 3, 4, 5];

                          // Calculate nice ticks based on the max value
                          let interval;
                          if (maxValue <= 1) {
                            interval = 2; // 0, 2, 4, 6, 8, 10
                          } else if (maxValue <= 20) {
                            interval = 5; // 0, 5, 10, 15, 20
                          } else if (maxValue <= 50) {
                            interval = 10; // 0, 10, 20, 30, 40, 50
                          } else {
                            // For larger values, round up to nearest multiple of appropriate interval
                            interval = Math.ceil(maxValue / 5 / 10) * 10;
                          }

                          // Generate ticks from 0 to maxValue with the calculated interval
                          const ticks = [];
                          const roundedMax =
                            Math.ceil(maxValue / interval) * interval;

                          for (let i = 0; i <= roundedMax; i += interval) {
                            ticks.push(i);
                          }

                          return ticks;
                        })()}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          fontSize: "12px",
                          backgroundColor: "#1f2937",
                          color: "white",
                          border: "none",
                        }}
                        labelStyle={{ fontWeight: 500, color: "white" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#blueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CommonParagraph className="text-mediumGrey">
                      {graphData?.data?.chartData?.length === 0
                        ? "No chart data available"
                        : `No data available for ${filter} filter`}
                    </CommonParagraph>
                  </div>
                )}
              </div>
            </div>
            <div className={`lg:hidden block`}>
              {/* Filter Buttons */}
              <div className="w-full flex justify-center items-center ">
                <div
                  className={`flex flex-wrap border rounded-md shadow-lg p-1 ${
                    theme === "dark"
                      ? "bg-darkBlack border-lightBlack"
                      : "bg-lightestBlue border-lightBlue"
                  }`}
                >
                  {["1W", "1M", "3M", "1Y", "AT"].map((f) => (
                    <button
                      key={f}
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   e.stopPropagation();
                      //   setFilter(f);
                      // }}
                      className={`px-3 rounded text-[7px] font-medium transition-colors cursor-pointer ${
                        filter === f
                          ? "bg-blue-500 text-white"
                          : theme === "dark"
                          ? "hover:bg-darkerGrey text-lightGrey hover:text-white"
                          : "hover:bg-mediumBlue text-darkBlue hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="lg:h-40 h-36 xl:mt-2 lg:mt-3 xlg:mt-0">
                {currentData.length > 0 ? (
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
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        width={40}
                        domain={[0, "dataMax"]}
                        allowDecimals={false}
                        ticks={(() => {
                          // Get the maximum value from the data
                          const maxValue = Math.max(
                            ...currentData.map((item) => item.value || 0)
                          );

                          // If maxValue is 0 or very small, return default ticks
                          if (maxValue <= 0) return [0, 1, 2, 3, 4, 5];

                          // Calculate nice ticks based on the max value
                          let interval;
                          if (maxValue <= 1) {
                            interval = 2; // 0, 2, 4, 6, 8, 10
                          } else if (maxValue <= 20) {
                            interval = 5; // 0, 5, 10, 15, 20
                          } else if (maxValue <= 50) {
                            interval = 10; // 0, 10, 20, 30, 40, 50
                          } else {
                            // For larger values, round up to nearest multiple of appropriate interval
                            interval = Math.ceil(maxValue / 5 / 10) * 10;
                          }

                          // Generate ticks from 0 to maxValue with the calculated interval
                          const ticks = [];
                          const roundedMax =
                            Math.ceil(maxValue / interval) * interval;

                          for (let i = 0; i <= roundedMax; i += interval) {
                            ticks.push(i);
                          }

                          return ticks;
                        })()}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          fontSize: "12px",
                          backgroundColor: "#1f2937",
                          color: "white",
                          border: "none",
                        }}
                        labelStyle={{ fontWeight: 500, color: "white" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#blueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CommonParagraph className="text-mediumGrey">
                      {graphData?.data?.chartData?.length === 0
                        ? "No chart data available"
                        : `No data available for ${filter} filter`}
                    </CommonParagraph>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </CommonWrapper>
  );
};

export default AutomationSection;
