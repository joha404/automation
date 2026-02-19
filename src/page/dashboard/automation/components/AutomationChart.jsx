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
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

const AutomationChart = () => {
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
    let rawData = [];

    switch (filterType) {
      case "1D":
        rawData = graphData?.data?.chartPoints24H || [];
        break;
      case "1W":
        rawData = graphData?.data?.chartPoints1W || [];
        break;
      case "1M":
        rawData = graphData?.data?.chartPoints1M || [];
        break;
      case "3M":
        rawData = graphData?.data?.chartPoints3M || [];
        break;
      case "1Y":
        rawData = graphData?.data?.chartPoints1Y || [];
        break;
      case "AT":
      default:
        rawData = graphData?.data?.chartPoints || [];
        break;
    }

    console.log(`${filterType} raw data:`, rawData);

    // If no data, return minimal data points to show axis lines
    if (rawData.length === 0) {
      return [
        { date: "start", value: 0, displayDate: "" },
        { date: "end", value: 0, displayDate: "" },
      ];
    }

    // Transform data - ALLOW NEGATIVE VALUES
    const transformed = rawData.map((point, index) => ({
      date: filterType === "1D" ? `${point.date}_${index}` : point.date,
      value: point.daily_units || 0, // Keep original values including negatives
      displayDate: point.date,
    }));

    return transformed;
  };

  const currentData = transformChartData(filter);
  console.log("Current data for chart:", currentData);

  // Format date for X-axis display
  const formatDateTick = (dateStr) => {
    if (
      !dateStr ||
      dateStr.endsWith("_start") ||
      dateStr.startsWith("start_") ||
      dateStr === "start" ||
      dateStr === "end"
    ) {
      return "";
    }

    // Hide X-axis labels for 1D
    if (filter === "1D") {
      return "";
    }

    const actualDate = dateStr.includes("_") ? dateStr.split("_")[0] : dateStr;
    const date = new Date(actualDate);

    // Format based on filter type
    if (filter === "1W" || filter === "1M") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (filter === "3M" || filter === "1Y" || filter === "AT") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }

    return dateStr;
  };

  const getPercentageForFilter = () => {
    const percentages = graphData?.data?.percentage;
    if (!percentages) return null;

    // Map 1D to 24H for API compatibility
    const apiFilter = filter === "1D" ? "24H" : filter;

    // Get percentage for current filter, fallback to AT, then 0
    const percentage = percentages[apiFilter] ?? percentages.AT ?? 0;
    return percentage;
  };

  const getPercentageAmountForFilter = () => {
    const percentages = graphData?.data?.percentage_amount;
    if (!percentages) return 0;

    // Map 1D to 24H for API compatibility
    const apiFilter = filter === "1D" ? "24H" : filter;

    // Get percentage amount for current filter, fallback to AT, then 0
    const amount = percentages[apiFilter] ?? percentages.AT ?? 0;
    return amount;
  };

  const currentPercentage = getPercentageForFilter();
  const currentPercentageAmount = getPercentageAmountForFilter();
  const isPositive = currentPercentageAmount >= 0;
  const isCurrentPercentagePositive = currentPercentage >= 0;

  if (balanceLoading || chartLoading) {
    return <ScreenLoader />;
  }

  return (
    <CommonWrapper>
      <div
        className={`rounded-xl font-primary sm:p-5 p-3 shadow-sm border transition-colors duration-300 ${
          theme === "dark" ? " border-mediumBlack" : " border-lightestGrey"
        }  `}
      >
        <div className={`rounded-lg xl:p-5`}>
          <div className={``}>
            <div
              className={`xl:p-10 sm:p-5 p-3 rounded-xl max-w-5xl mx-auto ${
                theme === "dark"
                  ? "bg-darkBlack border-mediumBlack"
                  : "bg-white border-lightestGrey"
              } `}
            >
              {/* Filter Buttons */}
              <div className="w-full flex flex-col gap-2 justify-center items-center mb-6">
                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center gap-2">
                    <CommonTitle
                      variant="small"
                      className="font-semibold text-mediumBlue mb-2 xlg:text-3xl md:text-2xl text-xl"
                    >
                      ${balanceData?.data?.amount || "0.00"}
                    </CommonTitle>

                    {currentPercentage !== null && currentPercentage !== 0 && (
                      <CommonTitle
                        variant="small"
                        className="flex justify-center items-center font-medium mb-2 xlg:text-2xl md:text-xl text-base"
                      >
                        {isPositive ? (
                          <IoIosArrowRoundUp className="xlg:text-4xl md:text-3xl text-2xl text-green-600" />
                        ) : (
                          <IoIosArrowRoundDown className="xlg:text-4xl md:text-3xl text-2xl text-red-600" />
                        )}
                        <span
                          className={
                            isPositive ? "text-green-600" : "text-red-600"
                          }
                        >
                          ${Math.abs(currentPercentageAmount).toFixed(2)}
                        </span>
                        <span
                          className={`ml-1 ${
                            isCurrentPercentagePositive
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ({Math.abs(currentPercentage)}%)
                        </span>
                      </CommonTitle>
                    )}
                  </div>
                </div>
                <div
                  className={`flex gap-1 flex-wrap border rounded-md shadow-lg p-1 ${
                    theme === "dark"
                      ? "bg-darkBlack border-lightBlack"
                      : "bg-lightestBlue border-lightBlue"
                  }`}
                >
                  {["1D", "1W", "1M", "3M", "1Y", "AT"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`xlg:px-3 xlg:py-1 px-2 py-1 rounded xlg:text-xs text-[10px] font-medium transition-colors cursor-pointer ${
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

              {/* Chart - Always show, even with empty data */}
              <div className="mt-6 xlg:h-[400px] md:h-[300px] h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={currentData}
                    margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                  >
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
                      dataKey="date"
                      axisLine={true}
                      tickLine={false}
                      tick={{ fontSize: 9 }}
                      tickFormatter={formatDateTick}
                      interval="preserveStartEnd"
                      minTickGap={30}
                      stroke={theme === "dark" ? "#374151" : "#d1d5db"}
                    />
                    <YAxis
                      axisLine={true}
                      tickLine={false}
                      tick={{ fontSize: 9 }}
                      width={35}
                      allowDecimals={false}
                      stroke={theme === "dark" ? "#374151" : "#d1d5db"}
                      ticks={(() => {
                        const values = currentData.map(
                          (item) => item.value || 0
                        );
                        const maxValue = Math.max(...values);
                        const minValue = Math.min(...values);

                        // If no real data (only placeholder), show simple range
                        if (
                          currentData.length === 2 &&
                          currentData[0].date === "start"
                        ) {
                          return [-10, 0, 10];
                        }

                        console.log(
                          "Min value:",
                          minValue,
                          "Max value:",
                          maxValue
                        );

                        // Determine interval based on the larger absolute value
                        const absMax = Math.max(
                          Math.abs(maxValue),
                          Math.abs(minValue)
                        );

                        console.log("absMax:", absMax);

                        let interval;
                        if (absMax <= 5) interval = 1;
                        else if (absMax <= 10) interval = 2;
                        else if (absMax <= 20) interval = 5;
                        else if (absMax <= 50) interval = 10;
                        else if (absMax <= 100) interval = 20;
                        else interval = 50;

                        console.log("Interval:", interval);

                        // Calculate ranges with minimal padding
                        let roundedPositiveMax = 0;
                        let roundedNegativeMin = 0;

                        if (maxValue > 0) {
                          const positiveMax = Math.ceil(maxValue) + interval;
                          roundedPositiveMax =
                            Math.ceil(positiveMax / interval) * interval;
                        }

                        if (minValue < 0) {
                          const negativeMin = Math.floor(minValue) - interval;
                          roundedNegativeMin =
                            Math.floor(negativeMin / interval) * interval;
                        }

                        console.log(
                          "Rounded min:",
                          roundedNegativeMin,
                          "Rounded max:",
                          roundedPositiveMax
                        );

                        // Generate ticks from negative to positive
                        const ticks = [];
                        for (
                          let i = roundedNegativeMin;
                          i <= roundedPositiveMax;
                          i += interval
                        ) {
                          ticks.push(i);
                        }

                        console.log("Generated ticks:", ticks);

                        return ticks;
                      })()}
                      domain={[
                        (() => {
                          const values = currentData.map(
                            (item) => item.value || 0
                          );
                          const minValue = Math.min(...values);
                          const maxValue = Math.max(...values);

                          // If no real data, use simple range
                          if (
                            currentData.length === 2 &&
                            currentData[0].date === "start"
                          ) {
                            return -10;
                          }

                          // If no negative values, start from 0
                          if (minValue >= 0) return 0;

                          const absMax = Math.max(
                            Math.abs(maxValue),
                            Math.abs(minValue)
                          );
                          let interval;
                          if (absMax <= 5) interval = 1;
                          else if (absMax <= 10) interval = 2;
                          else if (absMax <= 20) interval = 5;
                          else if (absMax <= 50) interval = 10;
                          else if (absMax <= 100) interval = 20;
                          else interval = 50;

                          const negativeMin = Math.floor(minValue) - interval;
                          return Math.floor(negativeMin / interval) * interval;
                        })(),
                        (() => {
                          const values = currentData.map(
                            (item) => item.value || 0
                          );
                          const maxValue = Math.max(...values);
                          const minValue = Math.min(...values);

                          // If no real data, use simple range
                          if (
                            currentData.length === 2 &&
                            currentData[0].date === "start"
                          ) {
                            return 10;
                          }

                          // If no positive values, end at 0
                          if (maxValue <= 0) return 0;

                          const absMax = Math.max(
                            Math.abs(maxValue),
                            Math.abs(minValue)
                          );
                          let interval;
                          if (absMax <= 5) interval = 1;
                          else if (absMax <= 10) interval = 2;
                          else if (absMax <= 20) interval = 5;
                          else if (absMax <= 50) interval = 10;
                          else if (absMax <= 100) interval = 20;
                          else interval = 50;

                          const positiveMax = Math.ceil(maxValue) + interval;
                          return Math.ceil(positiveMax / interval) * interval;
                        })(),
                      ]}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        fontSize: "11px",
                        backgroundColor: "#1f2937",
                        color: "white",
                        border: "none",
                      }}
                      labelStyle={{ fontWeight: 500, color: "white" }}
                      formatter={(value) => [`$${value}`, "Amount"]}
                      labelFormatter={(label) => {
                        if (
                          !label ||
                          label.endsWith("_start") ||
                          label.startsWith("start_") ||
                          label === "start" ||
                          label === "end"
                        )
                          return "";

                        const actualDate = label.includes("_")
                          ? label.split("_")[0]
                          : label;

                        return new Date(actualDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#blueGradient)"
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default AutomationChart;

