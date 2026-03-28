import React, { useState } from "react";
import ResultScreen from "./components/ResultScreen";
import UnitSize from "./components/UnitSize";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import Summary from "./components/Summary";
import Calendar from "./components/Calendar";

const Result = () => {
  const [selectedMarket, setSelectedMarket] = useState("Ultimate");

  const unitSizeEndpoints = {
    Ultimate: "/ultimate/",
    Core: "/core/",
    Live: "/live/",
    "Player Props": "/player-props/",
    "Play of the Day": "/play-of-the-day/",
    Futures: "/futures/",
  };

  const marketEndpoints = {
    Ultimate: "/ultimate/chart/",
    Core: "/core/chart/",
    Live: "/live/chart/",
    "Player Props": "/player-props/chart/",
    "Play of the Day": "/play-of-the-day/chart/",
    Futures: "/futures/chart/",
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

  const { data: unitSizeData, isLoading: unitSizeLoading } = useGet(
    unitSizeEndpoint,
    { queryKey: ["unitSize", selectedMarket] },
  );

  const {
    data: results,
    isLoading: chartLoading,
    refetch: refetchChart,
  } = useGet(chartEndpoint, {
    queryKey: ["result", selectedMarket],
  });

  const {
    data: calendarResults,
    isLoading: calendarLoading,
    refetch: refetchCalendar,
  } = useGet(calendarEndpoint, {
    queryKey: ["calendar", selectedMarket],
  });

  const chartPointsData = results?.data || {};
  const calendarData = calendarResults?.data || {};

  const isLoading = unitSizeLoading;

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  const innerData = unitSizeData?.data || {};

  const markets = innerData?.filters?.markets || [
    "Ultimate",
    "Live",
    "Play of the Day",
    "Futures",
    "Player Props",
  ];
  const unitSizes = innerData?.unit_sizes || [];
  const sportsData = innerData?.sports || [];

  return (
    <div>
      <ResultScreen
        chartData={chartPointsData?.chartPoints}
        data={innerData}
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
      <UnitSize unitData={unitSizes} sportsData={sportsData} />
    </div>
  );
};

export default Result;
