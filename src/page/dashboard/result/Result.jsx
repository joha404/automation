import React, { useState } from "react";
import ResultScreen from "./components/ResultScreen";
import UnitSize from "./components/UnitSize";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";

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

  const chartEndpoint = marketEndpoints[selectedMarket] || "/ultimate/chart/";

  const unitSizeEndpoint = unitSizeEndpoints[selectedMarket] || "/ultimate/";

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

  const chartPointsData = results?.data || {};

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
      <UnitSize unitData={unitSizes} sportsData={sportsData} />
    </div>
  );
};

export default Result;
