import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import Dropdown from "@/components/forms/Dropdown";

// ─── Dummy Data ───────────────────────────────────────────────
const DUMMY_UNIT_DATA = {
  headline: { units: "24.50" },
  summary: {
    total_picks: "312",
    wins: "187",
    losses: "112",
    pushes: "13",
    win_pct: "62.54",
  },
};

const DUMMY_MARKETS = ["Spread", "Moneyline", "Over/Under", "Props"];

const DUMMY_CHART_DATA = {
  AT: [
    { date: "Jan", cumulative_units: 0 },
    { date: "Feb", cumulative_units: 18 },
    { date: "Mar", cumulative_units: 35 },
    { date: "Apr", cumulative_units: 28 },
    { date: "May", cumulative_units: 52 },
    { date: "Jun", cumulative_units: 70 },
    { date: "Jul", cumulative_units: 65 },
    { date: "Aug", cumulative_units: 90 },
    { date: "Sep", cumulative_units: 110 },
    { date: "Oct", cumulative_units: 145 },
    { date: "Nov", cumulative_units: 175 },
    { date: "Dec", cumulative_units: 210 },
  ],
  "1W": [
    { date: "Mon", cumulative_units: 200 },
    { date: "Tue", cumulative_units: 205 },
    { date: "Wed", cumulative_units: 202 },
    { date: "Thu", cumulative_units: 210 },
    { date: "Fri", cumulative_units: 208 },
    { date: "Sat", cumulative_units: 215 },
    { date: "Sun", cumulative_units: 210 },
  ],
  "1M": [
    { date: "W1", cumulative_units: 180 },
    { date: "W2", cumulative_units: 190 },
    { date: "W3", cumulative_units: 200 },
    { date: "W4", cumulative_units: 210 },
  ],
  "3M": [
    { date: "Oct", cumulative_units: 145 },
    { date: "Nov", cumulative_units: 175 },
    { date: "Dec", cumulative_units: 210 },
  ],
  "1Y": [
    { date: "Jan", cumulative_units: 0 },
    { date: "Mar", cumulative_units: 35 },
    { date: "May", cumulative_units: 52 },
    { date: "Jul", cumulative_units: 65 },
    { date: "Sep", cumulative_units: 110 },
    { date: "Nov", cumulative_units: 175 },
    { date: "Dec", cumulative_units: 210 },
  ],
};
// ─────────────────────────────────────────────────────────────

const ResultSection = () => {
  const [selectedMarket, setSelectedMarket] = useState("Spread");
  const [filter, setFilter] = useState("AT");
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  const unitData = DUMMY_UNIT_DATA;
  const markets = DUMMY_MARKETS;
  const chartData = DUMMY_CHART_DATA[filter] || DUMMY_CHART_DATA["AT"];

  const statsData = [
    { label: "Total", value: unitData.summary.total_picks },
    { label: "Wins", value: unitData.summary.wins },
    { label: "Losses", value: unitData.summary.losses },
    { label: "Pushes", value: unitData.summary.pushes },
    { label: "Win %", value: unitData.summary.win_pct },
  ];

  const currentData = chartData.map((point) => ({
    date: point.date,
    value: point.cumulative_units,
  }));

  const marketOptions = markets.map((market) => ({
    value: market,
    label: market,
  }));

  return (
    <CommonWrapper variant="bottomSmall" className="lg:my-0 py-1">
      <Link to={"/dashboard/results"}>
        <div
          className={`rounded-xl font-primary md:p-3 p-2 ${
            theme === "dark"
              ? "bg-[#021716] border-mediumBlack"
              : "bg-white border-lightestGrey"
          }`}
        >
          <CommonParagraph variant="small" className="font-semibold py-1">
            Results
          </CommonParagraph>

          {/* ── Stats block — DESKTOP ── */}
          <div
            className={`mb-0.5 ${
              theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
            } text-white rounded-xl p-2 lg:flex hidden flex-col items-center`}
          >
            <CommonParagraph
              variant="small"
              className="text-mediumBlue xlg:mb-0.5 mb-3"
            >
              +{unitData.headline.units} %
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

          {/* ── Stats block — MOBILE ── */}
          <div
            className={`mb-0.5 ${
              theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
            } text-white rounded-xl p-0.5 lg:hidden flex flex-col items-center`}
          >
            <CommonParagraph variant="small" className="text-mediumBlue">
              +{unitData.headline.units} Units
            </CommonParagraph>

            <div className="grid grid-cols-4 justify-center gap-1 text-xs w-full">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className={`border ${
                    theme === "dark"
                      ? "bg-darkBlack border-mediumBlack"
                      : "bg-white border-lighterGrey"
                  } text-gray-700 py-0.5 rounded flex flex-row justify-center items-center gap-2`}
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

          {/* ── Chart — DESKTOP ── */}
          <div
            className={`rounded-lg lg:block hidden p-2 ${
              theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
            }`}
          >
            <div className="w-full flex lg:flex-row flex-col-reverse gap-2 lg:justify-between justify-start items-center mb-1">
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

            <div
              className={`${
                sidebarOpen ? "2xl:h-56 xlg:h-48" : "2xl:h-40 xl:h-44"
              } h-40`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient
                      id="tealGradientDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#00e5c8"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#00e5c8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4a7a70", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4a7a70", fontSize: 11 }}
                    width={40}
                    domain={[0, "dataMax + 10%"]}
                    ticks={[0, 80, 160, 240]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      fontSize: "12px",
                      backgroundColor: "#021716",
                      color: "#00e5c8",
                      border: "1px solid rgba(0,229,200,0.2)",
                    }}
                    labelStyle={{ fontWeight: 500, color: "#fff" }}
                    itemStyle={{ color: "#00e5c8" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00e5c8"
                    strokeWidth={2}
                    fill="url(#tealGradientDesktop)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#00e5c8", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Chart — MOBILE ── */}
          <div
            className={`rounded-lg p-0.5 lg:hidden block ${
              theme === "dark" ? "bg-darkerBlack" : "bg-lightestGrey"
            }`}
          >
            {/* Filter buttons */}
            <div className="w-full flex flex-col-reverse gap-2 justify-start items-start">
              <div
                className={`flex gap-1 flex-wrap border rounded-md shadow-lg p-0.5 ${
                  theme === "dark"
                    ? "bg-darkBlack border-lightBlack"
                    : "bg-lightestBlue border-lightBlue"
                }`}
              >
                {["1W", "1M", "3M", "1Y", "AT"].map((f) => (
                  <button
                    key={f}
                    onClick={(e) => {
                      e.preventDefault();
                      setFilter(f);
                    }}
                    className={`px-1 py-0.5 rounded text-[7px] font-medium transition-colors cursor-pointer ${
                      filter === f
                        ? "bg-[#0A9087] text-white"
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

            <div className="lg:h-36 h-32 xl:mt-2 lg:mt-3 xlg:mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient
                      id="tealGradientMobile"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#00e5c8"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#00e5c8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4a7a70", fontSize: 9 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4a7a70", fontSize: 9 }}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      fontSize: "11px",
                      backgroundColor: "#021716",
                      color: "#00e5c8",
                      border: "1px solid rgba(0,229,200,0.2)",
                    }}
                    labelStyle={{ fontWeight: 500, color: "#fff" }}
                    itemStyle={{ color: "#00e5c8" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00e5c8"
                    strokeWidth={1.5}
                    fill="url(#tealGradientMobile)"
                    dot={false}
                    activeDot={{ r: 3, fill: "#00e5c8", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Link>
    </CommonWrapper>
  );
};

export default ResultSection;
