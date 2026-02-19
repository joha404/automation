import { useTheme } from "@/hooks/custom/useTheme";
import Header from "./components/Header";
import PredictionSection from "./components/PredictionSection";
import AutomationSection from "./components/AutomationSection";
import { useSidebar } from "@/hooks/custom/useSidebar";
import ResultSection from "./components/ResultSection";
import PastPrediction from "./components/PastPrediction";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import { useGet } from "@/hooks/api/common/useGet";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GooglePlayAndAppStore from "./components/GooglePlayAndAppStore";
import RollingBanner from "@/components/modals/FeastivalModal";
import FreeTrialPopup from "@/page/auth/FreeTrialPopup";
import FreeTrailSvg from "./components/FreeTrialSVG";

const Dashboard = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  const {
    data: predictionsData,
    isLoading: predictionLoading,
    refetch: predictionRefetch,
  } = useGet("/predictions/ultimate-automation-pending/", {
    queryKey: ["prediction-ultimate-dashboard"],
    secure: true,
  });
  const predictions = predictionsData?.data || {};

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
      <RollingBanner />
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

      <div className="grid gap-2 grid-cols-1 lg:grid-cols-8">
        <div className="xlg:col-span-4 lg:col-span-5 col-span-8">
          <PredictionSection />
        </div>
        <div className="xlg:col-span-4 lg:col-span-3 col-span-8">
          {predictions?.has_subscription ? (
            <AutomationSection />
          ) : (
            <div className="relative">
              <div className="filter blur-sm pointer-events-none">
                <AutomationSection />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-30 rounded-lg">
                <Link
                  to="/dashboard/subscription-tiers"
                  className="bg-mediumBlue hover:bg-darkBlue text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200"
                >
                  Subscribe To Unlock
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="xlg:col-span-4 lg:col-span-4 col-span-8">
          <ResultSection
            unitData={unitInfo?.data}
            chartData={data?.chartPoints}
            data={data}
            selectedMarket={selectedMarket}
            setSelectedMarket={setSelectedMarket}
            markets={markets}
          />
        </div>
        <div className="xlg:col-span-2 lg:col-span-4 col-span-8 lg:block hidden">
          <PastPrediction />
        </div>
        <div className="xlg:col-span-2 lg:col-span-3 col-span-8">
          <GooglePlayAndAppStore />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
