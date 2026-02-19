import { useGet } from "@/hooks/api/common/useGet";
import DashboardSection from "./components/DashboardSection";
import HeroSection from "./components/HeroSection";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import AutomationSection from "./components/AutomationSection";
import PredictionSection from "./components/PredictionSection";
import ResultSection from "./components/ResultSection";
import SportSection from "./components/SportSection";
import Footer from "./components/Footer";
import Subscription from "./components/Subscription";
import FirstHeroSection from "./components/FirstHeroSection";
import UltimateGraph from "./components/UltimateGraph";
import SportsFan from "./components/SportsFan";
import FAQ from "./components/FAQ";

const Home = () => {
  // Use the GET hook to fetch home
  const {
    data: cms,
    isLoading,
    refetch,
  } = useGet("/cms/pages/", {
    secure: false,
    queryKey: ["homepage"],
  });

  const cmsData = cms?.data || {};

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <div>
      {/* <FirstHeroSection />
      <UltimateGraph /> */}
      <HeroSection data={cmsData?.hero?.[0]?.hero} />
      <PredictionSection />
      <Subscription />
      <SportsFan />
      <FAQ />
      {/* <ResultSection data={cmsData?.result?.[0]?.result} />
      <DashboardSection data={cmsData?.dashboard?.[0]?.dashboard} />
      <AutomationSection data={cmsData?.automation?.[0]?.automation} /> */}
      {/* <SportSection data={cmsData?.sports_hub?.[0]?.sports_hub} /> */}
      <Footer data={cmsData?.footer?.[0]} />
    </div>
  );
};

export default Home;
