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
import { IoIosArrowRoundUp } from "react-icons/io";
import countryCode from "@/hooks/custom/countryCode";
import Dropdown from "@/components/forms/Dropdown";
import { Link } from "react-router-dom";

const ResultSection = ({
  selectedMarket,
  setSelectedMarket,
  markets,
  data,
  chartData,
  unitData,
}) => {
  const [filter, setFilter] = useState("AT");
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  const statsData = [
    { label: "Total", value: unitData?.summary?.total_picks || "0" },
    { label: "Wins", value: unitData?.summary?.wins || "0" },
    { label: "Losses", value: unitData?.summary?.losses || "0" },
    { label: "Pushes", value: unitData?.summary?.pushes || "0" },
    { label: "Win %", value: unitData?.summary?.win_pct || "0.00" },
  ];

  // Transform the chart data to match what the AreaChart expects
  const transformChartData = (rawData) => {
    if (!Array.isArray(rawData)) return [];

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
    <CommonWrapper variant="bottomSmall" className=" lg:my-0 py-1">
      <Link to={"/dashboard/results"}>
        <div
          className={`rounded-xl font-primary md:p-3 p-2 shadow-sm border ${
            theme === "dark"
              ? "bg-darkBlack border-mediumBlack"
              : "bg-white border-lightestGrey"
          } `}
        >
          <CommonParagraph variant="small" className="font-semibold py-1">
            Results
          </CommonParagraph>

          <div
            className={` mb-0.5 ${
              theme === "dark" ? " bg-darkerBlack" : "bg-lightestGrey "
            } text-white rounded-xl p-2 lg:flex hidden flex-col items-center`}
          >
            <CommonParagraph
              variant="small"
              className="text-mediumBlue xlg:mb-0.5 mb-3"
            >
              +{unitData?.headline?.units || "0.00"} %
            </CommonParagraph>

            <div className="flex flex-wrap justify-center gap-1 text-xs w-full">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className={`border ${
                    theme === "dark"
                      ? "bg-darkBlack border-mediumBlack"
                      : "bg-white border-lighterGrey"
                  } text-gray-700 py-1 px-2 rounded flex justify-between items-center
      w-1/2 sm:w-[100px] md:w-[120px] lg:w-[100px] xlg:w-[110px] xl:w-[130px] 2xl:w-[110px]`}
                >
                  <CommonParagraph variant="smaller" className="font-medium">
                    {stat.label}:
                  </CommonParagraph>
                  <CommonParagraph variant="small">
                    {stat.value}
                  </CommonParagraph>
                </div>
              ))}
            </div>
          </div>
          <div
            className={` mb-0.5 ${
              theme === "dark" ? " bg-darkerBlack" : "bg-lightestGrey "
            } text-white rounded-xl p-0.5 lg:hidden flex flex-col items-center`}
          >
            <CommonParagraph variant="small" className="text-mediumBlue">
              +{unitData?.headline?.units || "0.00"} Units
            </CommonParagraph>

            <div className="grid grid-cols-4 justify-center gap-1 text-xs w-full">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className={`border ${
                    theme === "dark"
                      ? "bg-darkBlack border-mediumBlack"
                      : "bg-white border-lighterGrey"
                  } text-gray-700 py-0.5  rounded flex flex-row justify-center items-center gap-2`}
                >
                  <CommonParagraph variant="extraSmall" className="font-medium">
                    {stat.label}:
                  </CommonParagraph>
                  <CommonParagraph variant="extraSmall">
                    {stat.value}
                  </CommonParagraph>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-lg lg:block hidden p-2 ${
              theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
            } `}
          >
            <div>
              {/* Filter Buttons */}
              <div className="w-full flex lg:flex-row flex-col-reverse gap-2 lg:justify-between justify-start items-center  mb-1">
                <div className="xl:w-[200px] w-[120px]">
                  <Dropdown
                    atLeft={true}
                    options={marketOptions}
                    placeholder={selectedMarket || "Select Market"}
                    variant="bg_none"
                    formInput={true}
                    value={selectedMarket}
                    onChange={(value) => setSelectedMarket(value)}
                  />
                </div>
              </div>

              {/* Chart */}
              <div
                className={` ${
                  sidebarOpen ? "2xl:h-56 xlg:h-48" : "2xl:h-40 xl:h-44"
                } h-40`}
              >
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
                      domain={[0, "dataMax + 10%"]}
                      ticks={[0, 80, 160, 240]} // ← This ensures Y-axis starts from 0
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
              </div>
            </div>
          </div>
          <div
            className={`rounded-lg p-0.5 lg:hidden block ${
              theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
            } `}
          >
            <div>
              {/* Filter Buttons */}
              <div className="w-full flex lg:flex-row flex-col-reverse gap-2 lg:justify-between justify-start items-center  ">
                <div
                  className={` flex gap-1 flex-wrap border rounded-md shadow-lg p-0.5 ${
                    theme === "dark"
                      ? "bg-darkBlack border-lightBlack"
                      : "bg-lightestBlue border-lightBlue"
                  }`}
                >
                  {["1W", "1M", "3M", "1Y", "AT"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-1 py-0.5 rounded text-[7px] font-medium transition-colors cursor-pointer ${
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
              <div className="lg:h-36 h-32 xl:mt-2 lg:mt-3 xlg:mt-0 ">
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
              </div>
            </div>
          </div>
        </div>
      </Link>
    </CommonWrapper>
  );
};

export default ResultSection;
