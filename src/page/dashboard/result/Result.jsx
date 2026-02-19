import React, { useState, useEffect } from "react";
import ResultScreen from "./components/ResultScreen";
import UnitSize from "./components/UnitSize";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import Summary from "./components/Summary";
import Calendar from "./components/Calendar";
import CommonWrapper from "@/components/wrappers/CommonWrapper";

const Result = () => {
  const [selectedMarket, setSelectedMarket] = useState("Ultimate");

  // Sample data - this would come from your API
  // const calendarDatas = {
  //   // October 2025
  //   "2025-10-01": { value: "1.97", color: "green" },
  //   "2025-10-02": { value: "-0.25", color: "red" },
  //   "2025-10-03": { value: "3.03", color: "green" },
  //   "2025-10-04": { value: "-1.87", color: "red" },
  //   "2025-10-05": { value: "1.98", color: "green" },
  //   "2025-10-06": { value: "2.54", color: "green" },
  //   "2025-10-07": { value: "-4.1", color: "red" },
  //   "2025-10-08": { value: "0.39", color: "green" },
  //   "2025-10-09": { value: "0.41", color: "green" },
  //   "2025-10-10": { value: "-4.33", color: "red" },
  //   "2025-10-11": { value: "-3.75", color: "red" },

  //   // September 2025
  //   "2025-09-01": { value: "2.15", color: "green" },
  //   "2025-09-02": { value: "1.89", color: "green" },
  //   "2025-09-03": { value: "3.45", color: "green" },
  //   "2025-09-04": { value: "4.12", color: "green" },
  //   "2025-09-05": { value: "2.78", color: "green" },
  //   "2025-09-10": { value: "-2.45", color: "red" },
  //   "2025-09-15": { value: "5.67", color: "green" },
  //   "2025-09-20": { value: "-1.23", color: "red" },

  //   // March 2024
  //   "2024-03-01": { value: "2.15", color: "green" },
  //   "2024-03-02": { value: "1.89", color: "green" },
  //   "2024-03-03": { value: "3.45", color: "green" },
  //   "2024-03-04": { value: "4.12", color: "green" },
  //   "2024-03-05": { value: "2.78", color: "green" },
  //   "2024-03-06": { value: "3.91", color: "green" },
  //   "2024-03-07": { value: "5.23", color: "green" },
  //   "2024-03-08": { value: "4.67", color: "green" },
  //   "2024-03-09": { value: "3.12", color: "green" },
  //   "2024-03-10": { value: "2.45", color: "green" },
  //   "2024-03-11": { value: "3.78", color: "green" },
  //   "2024-03-12": { value: "4.89", color: "green" },
  //   "2024-03-13": { value: "6.01", color: "green" },
  //   "2024-03-14": { value: "5.34", color: "green" },
  //   "2024-03-15": { value: "4.21", color: "green" },
  //   "2024-03-16": { value: "3.56", color: "green" },
  //   "2024-03-17": { value: "2.98", color: "green" },
  //   "2024-03-18": { value: "4.32", color: "green" },
  //   "2024-03-19": { value: "5.67", color: "green" },
  //   "2024-03-20": { value: "6.45", color: "green" },
  //   "2024-03-21": { value: "5.89", color: "green" },
  //   "2024-03-22": { value: "4.76", color: "green" },
  //   "2024-03-23": { value: "3.32", color: "green" },
  //   "2024-03-24": { value: "2.67", color: "green" },
  //   "2024-03-25": { value: "3.89", color: "green" },
  //   "2024-03-26": { value: "5.12", color: "green" },
  //   "2024-03-27": { value: "6.23", color: "green" },
  //   "2024-03-28": { value: "5.67", color: "green" },
  //   "2024-03-29": { value: "4.45", color: "green" },
  //   "2024-03-30": { value: "3.78", color: "green" },
  //   "2024-03-31": { value: "2.91", color: "green" },

  //   // December 2024
  //   "2025-12-01": { value: "-2.34", color: "red" },
  //   "2025-12-02": { value: "3.56", color: "green" },
  //   "2025-12-05": { value: "4.89", color: "green" },
  //   "2025-12-10": { value: "-1.45", color: "red" },
  //   "2025-12-15": { value: "2.67", color: "green" },
  //   "2025-12-20": { value: "5.23", color: "green" },
  //   "2025-12-25": { value: "-3.12", color: "red" },
  //   "2025-12-31": { value: "4.78", color: "green" },
  // };

  // const summaryData = {
  //   today: { profitLoss: 0, wins: 0, losses: 0 },
  //   yesterday: { profitLoss: -3.75, wins: 14, losses: 19 },
  //   last7Days: { profitLoss: -6.82, wins: 39, losses: 44 },
  //   last30Days: { profitLoss: 3.05, wins: 192, losses: 171 },
  //   allTime: { profitLoss: 221.91, wins: 3051, losses: 2950 },
  // };

  // Create endpoint mappings
  const marketEndpoints = {
    Ultimate: "/ultimate/chart/",
    Core: "/core/chart/",
    Live: "/live/chart/",
    "Player Props": "/player-props/chart/",
    "Play of the Day": "/play-of-the-day/chart/",
    Futures: "/futures/chart/",
  };

  const unitSizeEndpoints = {
    Ultimate: "/ultimate/",
    Core: "/core/",
    Live: "/live/",
    "Player Props": "/player-props/",
    "Play of the Day": "/play-of-the-day/",
    Futures: "/futures/",
  };

  const calendarEndpoints = {
    Ultimate: "/ultimate/calendar/",
    Core: "/core/calendar/",
    Live: "/live/calendar/",
    "Player Props": "/player-props/calendar/",
    "Play of the Day": "/play-of-the-day/calendar/",
    Futures: "/futures/calendar/",
  };

  const chartEndpoint = marketEndpoints[selectedMarket] || "/ultimate/chart/";
  const unitSizeEndpoint = unitSizeEndpoints[selectedMarket] || "/ultimate/";
  const calendarEndpoint =
    calendarEndpoints[selectedMarket] || "/ultimate/calendar/";

  // Main chart data API call
  const {
    data: results,
    isLoading: chartLoading,
    refetch: refetchChart,
  } = useGet(chartEndpoint, {
    queryKey: ["result", selectedMarket],
  });

  // Separate unit size API call
  const {
    data: unitSizeResults,
    isLoading: unitSizeLoading,
    refetch: refetchUnitSize,
  } = useGet(unitSizeEndpoint, {
    queryKey: ["unitSize", selectedMarket],
  });

  const {
    data: calendarResults,
    isLoading: calendarLoading,
    refetch: refetchCalendar,
  } = useGet(calendarEndpoint, {
    queryKey: ["calendar", selectedMarket],
  });

  // Refetch both when market changes
  useEffect(() => {
    refetchChart();
    refetchUnitSize();
    refetchCalendar();
  }, [selectedMarket, refetchChart, refetchUnitSize, refetchCalendar]);

  const data = unitSizeResults?.data || {};
  const chartPointsData = results?.data || {};
  const unitSizeData = unitSizeResults?.data || {};
  const calendarData = calendarResults?.data || {};

  // Combined loading state
  const isLoading = chartLoading || unitSizeLoading || calendarLoading;

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  // Markets from API response or default fallback
  const markets = data.markets || [
    "Ultimate",
    "Live",
    "Play of the Day",
    "Futures",
    "Player Props",
  ];

  // Default structure when no data is available
  const getDefaultUnitSizes = () => {
    return [
      {
        size: "1 Unit",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
      {
        size: "2 Units",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
      {
        size: "3 Units",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
      {
        size: "4 Units",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
      {
        size: "5 Units",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
    ];
  };

  const getDefaultSportsData = () => {
    return [
      {
        sport: "NFL",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
      {
        sport: "NBA",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
      {
        sport: "MLB",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
      {
        sport: "NHL",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
      {
        sport: "Soccer",
        count: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        profit: "0.00",
        win_pct: "0.00",
      },
    ];
  };

  // Use API data if available, otherwise use default structure
  const finalUnitSizes =
    unitSizeData?.unit_sizes && unitSizeData.unit_sizes.length > 0
      ? unitSizeData.unit_sizes
      : data?.unit_sizes && data.unit_sizes.length > 0
        ? data.unit_sizes
        : getDefaultUnitSizes();

  const finalSportsData =
    unitSizeData?.sports && unitSizeData.sports.length > 0
      ? unitSizeData.sports
      : data?.sports && data.sports.length > 0
        ? data.sports
        : getDefaultSportsData();

  return (
    <div>
      <ResultScreen
        chartData={chartPointsData?.chartPoints}
        data={data}
        selectedMarket={selectedMarket}
        setSelectedMarket={setSelectedMarket}
        markets={markets}
      />
      <CommonWrapper>
        <div className="">
          <div className=" mx-auto">
            {/* <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8">
              Additional Materials
            </h1> */}

            <div className="grid grid-cols-1 xl:grid-cols-8 gap-4 sm:gap-6">
              {/* System History Summary */}
              <div className="xl:col-span-3">
                <Summary summaryData={calendarData?.calendar_summary} />
              </div>

              {/* Calendar */}
              <div className="xl:col-span-5">
                <Calendar calendarData={calendarData?.calendar_daily || {}} />
              </div>
            </div>
          </div>
        </div>
      </CommonWrapper>

      <UnitSize unitData={finalUnitSizes} sportsData={finalSportsData} />
    </div>
  );
};

export default Result;
