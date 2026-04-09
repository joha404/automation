import Header from "./components/Header";
import ResultSection from "./components/ResultSection";
import PastPrediction from "./components/PastPrediction";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { useGet } from "@/hooks/api/common/useGet";
import { useState, useEffect, useRef } from "react";
import FreeTrailSvg from "./components/FreeTrialSVG";
import PredictionComponent from "./components/PredictionComponent";
import RollingBanner from "@/components/modals/FeastivalModal";
import FreeTrialPopup from "@/page/auth/FreeTrialPopup";

const Dashboard = () => {
  const { data: predictionsData, isLoading: predictionLoading } = useGet(
    "/predictions/",
    {
      queryKey: ["prediction-ultimate-dashboard"],
      secure: true,
    },
  );

  const [selectedMarket] = useState("Ultimate");
  const [showPopup, setShowPopup] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const welcomePopupTimerRef = useRef(null);
  const hasScheduledWelcomePopupRef = useRef(false);

  const { data: response, isLoading: isActiveLoading } = useGet(
    "/my-subscription/",
    {
      queryKey: ["active"],
      secure: true,
    },
  );

  const { data: bannerResponse } = useGet("/banner/", {
    queryKey: ["dashboard-banner"],
  });

  useEffect(() => {
    if (isActiveLoading) return;

    const subscriptionMeta = response?.data ?? response ?? {};
    const canPurchase = subscriptionMeta?.can_purchase_new;
    const shouldShowWelcomePopup =
      canPurchase === true &&
      localStorage.getItem("showWelcomePopup") === "true" &&
      !hasScheduledWelcomePopupRef.current;

    setIsApiReady(true);

    if (!shouldShowWelcomePopup) return;

    hasScheduledWelcomePopupRef.current = true;
    welcomePopupTimerRef.current = setTimeout(() => {
      setShowPopup(true);
      welcomePopupTimerRef.current = null;
    }, 3000);

    return () => {
      if (welcomePopupTimerRef.current) {
        clearTimeout(welcomePopupTimerRef.current);
        welcomePopupTimerRef.current = null;
      }
    };
  }, [isActiveLoading, response]);

  useEffect(() => {
    return () => {
      if (welcomePopupTimerRef.current) {
        clearTimeout(welcomePopupTimerRef.current);
      }
    };
  }, []);

  const marketEndpoints = {
    Ultimate: "/ultimate/chart/",
    "Play of the Day": "/play-of-the-day/chart/",
    "Player Props": "/player-props/chart/",
    Core: "/core/chart/",
    Live: "/live/chart/",
  };

  const { isLoading: unitLoading } = useGet("/dashboard-info/", {
    queryKey: ["unit-info"],
  });

  const { data: pastPredictionData } = useGet("/past-predictions/", {
    queryKey: ["past-prediction"],
  });
  const endpoint = marketEndpoints[selectedMarket] || "/ultimate/";

  const { data: results, isLoading: resultLoading } = useGet(endpoint, {
    queryKey: ["result-dashboard", selectedMarket],
  });

  const bannerData = bannerResponse?.data ?? bannerResponse;
  const shouldShowBanner = bannerData?.show_it !== false;
  const bannerMessage =
    bannerData?.banner_message ??
    bannerData?.bannerMessage ??
    bannerData?.text ??
    bannerData?.message ??
    "";

  if (unitLoading || resultLoading || predictionLoading || isActiveLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  const handleSvgClick = () => {
    // শুধুমাত্র API ready হওয়ার পরেই কাজ করবে
    if (isApiReady) {
      setShowPopup(true);
    }
  };

  return (
    <div>
      <RollingBanner bannerMessage={shouldShowBanner ? bannerMessage : ""} />
      <Header />
      <div className="fixed -right-4 z-50 top-16 lg:right-4 lg:top-16">
        <FreeTrailSvg onSvgClick={handleSvgClick} />
      </div>

      {/* isApiReady true হওয়ার আগে popup render-ই করবো না */}
      {isApiReady && (
        <FreeTrialPopup
          isOpen={showPopup}
          onClose={() => {
            setShowPopup(false);
            localStorage.setItem("showWelcomePopup", "false");
          }}
        />
      )}
      <PredictionComponent data={predictionsData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ResultSection data={results} />
        <PastPrediction data={pastPredictionData} />
      </div>
    </div>
  );
};

export default Dashboard;
