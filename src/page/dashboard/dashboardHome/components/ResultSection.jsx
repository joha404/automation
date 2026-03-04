import { useState, useMemo } from "react";
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
import { useGet } from "@/hooks/api/common/useGet";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import Dropdown from "@/components/forms/Dropdown";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { FaChartLine } from "react-icons/fa6";

// ── Filter chart data by date range ──────────────────────────
const filterByRange = (chartPoints = [], filter) => {
  if (!chartPoints.length) return [];

  const now = new Date();

  const cutoff =
    {
      "1W": new Date(now - 7 * 24 * 60 * 60 * 1000),
      "1M": new Date(now - 30 * 24 * 60 * 60 * 1000),
      "3M": new Date(now - 90 * 24 * 60 * 60 * 1000),
      "1Y": new Date(now - 365 * 24 * 60 * 60 * 1000),
      AT: null,
    }[filter] ?? null;

  const filtered = cutoff
    ? chartPoints.filter((p) => new Date(p.date) >= cutoff)
    : chartPoints;

  // For large datasets, sample to max 60 points to keep chart clean
  if (filtered.length <= 60) return filtered;
  const step = Math.ceil(filtered.length / 60);
  return filtered.filter((_, i) => i % step === 0 || i === filtered.length - 1);
};

// ── Format date label for X axis ─────────────────────────────
const formatDateLabel = (dateStr, filter) => {
  const d = new Date(dateStr);
  if (filter === "1W")
    return d.toLocaleDateString("en-US", { weekday: "short" });
  if (filter === "1M")
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (filter === "3M")
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

// ─────────────────────────────────────────────────────────────

const ResultSection = ({ data: propData }) => {
  const [selectedMarket, setSelectedMarket] = useState("Ultimate");
  const [filter, setFilter] = useState("AT");
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  // ✅ Fetch chart data
  const { data: chartResponse, isLoading: chartLoading } = useGet(
    "/ultimate/chart/",
    { queryKey: ["resultSection-chart"] },
  );

  // ✅ Fetch summary/unit data
  const { data: summaryResponse, isLoading: summaryLoading } = useGet(
    "/ultimate/",
    { queryKey: ["resultSection-summary"] },
  );

  const isLoading = chartLoading || summaryLoading;

  // ✅ Unwrap — confirmed pattern: response = { status, data: { chartPoints, ... } }
  const chartInner = chartResponse?.data || chartResponse || {};
  const summaryInner = summaryResponse?.data || summaryResponse || {};

  const chartPoints = chartInner?.chartPoints || [];
  const headline = summaryInner?.headline || {};
  const summary = summaryInner?.summary || {};
  const markets = summaryInner?.filters?.markets || [
    "Ultimate",
    "Live",
    "Play of the Day",
    "Futures",
    "Player Props",
  ];

  // ✅ Filter chart points by selected time range
  const filteredPoints = useMemo(
    () => filterByRange(chartPoints, filter),
    [chartPoints, filter],
  );

  // ✅ Map to recharts format
  const currentData = filteredPoints.map((p) => ({
    date: formatDateLabel(p.date, filter),
    value: p.cumulative_units,
  }));

  const statsData = [
    { label: "Total", value: summary.total_picks ?? "—" },
    { label: "Wins", value: summary.wins ?? "—" },
    { label: "Losses", value: summary.losses ?? "—" },
    { label: "Pushes", value: summary.pushes ?? "—" },
    {
      label: "Win %",
      value: summary.win_pct != null ? `${summary.win_pct}%` : "—",
    },
  ];

  const marketOptions = markets.map((m) => ({ value: m, label: m }));

  const headlineUnits =
    headline?.units != null
      ? (Number(headline.units) >= 0 ? "+" : "") +
        Number(headline.units).toFixed(2)
      : "—";

  if (isLoading) {
    return (
      <CommonWrapper variant="bottomSmall" className="lg:my-0 py-1">
        <div className="flex w-full justify-center py-8">
          <ScreenLoader />
        </div>
      </CommonWrapper>
    );
  }

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
          <div className="flex items-center gap-2 p-2">
            <FaChartLine
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            />
            <CommonParagraph variant="small" className="font-semibold py-1">
              Results
            </CommonParagraph>
          </div>

          {/* ── Stats block — DESKTOP ── */}
          <div
            className={`mb-0.5 ${
              theme === "dark" ? "bg-[#020C0B]" : "bg-lightestGrey"
            } text-white rounded-xl p-2 lg:flex hidden flex-col items-center`}
          >
            <CommonParagraph
              variant="small"
              className="text-[#0A9087] xlg:mb-0.5 my-4"
            >
              {headlineUnits} %
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
              theme === "dark" ? "bg-[#020C0B]" : "bg-lightestGrey"
            } text-white rounded-xl p-0.5 lg:hidden flex flex-col items-center`}
          >
            <CommonParagraph variant="small" className="text-[#0A9087] my-1">
              {headlineUnits} Units
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
              theme === "dark" ? "bg-[#020C0B]" : "bg-lightestGrey"
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
                    domain={["dataMin - 10", "dataMax + 10"]}
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
                    formatter={(value) => [
                      `${value > 0 ? "+" : ""}${value.toFixed(2)}`,
                      "Units",
                    ]}
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
              theme === "dark" ? "bg-[#020C0B]" : "bg-lightestGrey"
            }`}
          >
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
                    domain={["dataMin - 10", "dataMax + 10"]}
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
                    formatter={(value) => [
                      `${value > 0 ? "+" : ""}${value.toFixed(2)}`,
                      "Units",
                    ]}
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
