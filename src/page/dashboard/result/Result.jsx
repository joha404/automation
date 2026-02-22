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
