import Header from "./components/Header";
import ResultSection from "./components/ResultSection";
import PastPrediction from "./components/PastPrediction";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { useGet } from "@/hooks/api/common/useGet";
import { useState, useEffect } from "react";
import FreeTrailSvg from "./components/FreeTrialSVG";
import Streaks from "./components/Streaks";
import UpcomingEvents from "./components/UpcommingEvents";
import PredictionSection from "@/page/home/components/PredictionSection";
import PredictionComponent from "./components/PredictionComponent";

const Dashboard = () => {
  const {
    data: predictionsData,
    isLoading: predictionLoading,
    refetch: predictionRefetch,
  } = useGet("/predictions/ultimate-automation-pending/", {
    queryKey: ["prediction-ultimate-dashboard"],
    secure: true,
  });

  const [selectedMarket, setSelectedMarket] = useState("Ultimate");
  const [showPopup, setShowPopup] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);

  const { data: response, isLoading: isActiveLoading } = useGet(
    "/my-subscription/",
    {
      queryKey: ["active"],
      secure: true,
    },
  );

  useEffect(() => {
    // API পুরোপুরি load না হওয়া পর্যন্ত কিছুই করবো না
    if (isActiveLoading || !response) return;

    const canPurchase = response?.data?.can_purchase_new;
    const isNewUser = localStorage.getItem("showWelcomePopup");

    // API ready mark করো
    setIsApiReady(true);

    // Package আছে অথবা new user না হলে — popup কখনোই না
    if (canPurchase !== true || isNewUser !== "true") {
      setShowPopup(false);
      return;
    }

    // সব API load নিশ্চিত করতে 5 seconds পরে popup দেখাও
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isActiveLoading, response]);

  const marketEndpoints = {
    Ultimate: "/ultimate/chart/",
    "Play of the Day": "/play-of-the-day/chart/",
    "Player Props": "/player-props/chart/",
    Core: "/core/chart/",
    Live: "/live/chart/",
  };

  const { data: unitInfo, isLoading: unitLoading } = useGet(
    "/dashboard-info/",
    { queryKey: ["unit-info"] },
  );

  const endpoint = marketEndpoints[selectedMarket] || "/ultimate/";

  const { data: results, isLoading: resultLoading } = useGet(endpoint, {
    queryKey: ["result-dashboard", selectedMarket],
  });

  const data = results?.data || {};

  if (unitLoading || resultLoading || predictionLoading || isActiveLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  const markets = data.markets || [
    "Ultimate",
    "International",
    "North America",
    "Play of the Day",
    "Player Props",
    "Parlays",
  ];

  const handleSvgClick = () => {
    // শুধুমাত্র API ready হওয়ার পরেই কাজ করবে
    if (isApiReady) {
      setShowPopup(true);
    }
  };

  return (
    <div>
      <Header />
      <PredictionComponent />
      {/* <Streaks /> */}
      {/* <UpcomingEvents /> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ResultSection />
        <PastPrediction />
      </div>
    </div>
  );
};

export default Dashboard;
