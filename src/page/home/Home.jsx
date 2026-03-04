import { useGet } from "@/hooks/api/common/useGet";
import HeroSection from "./components/HeroSection";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import PredictionSection from "./components/PredictionSection";
import Footer from "./components/Footer";
import Subscription from "./components/Subscription";
import SportsFan from "./components/SportsFan";
import FAQ from "./components/FAQ";

const Home = () => {
  // Use the GET hook to fetch home
  const { data: cms, isLoading } = useGet("/cms/all/", {
    secure: false,
    queryKey: ["homepage"],
  });
  const cmsData = cms || {};

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <div>
      <HeroSection data={cmsData?.hero} />
      <PredictionSection data={cmsData} />
      <Subscription data={cmsData?.subscription_plans} />
      <SportsFan data={cmsData?.testimonials} />
      <FAQ data={cmsData?.faqs} />
      <Footer data={cmsData?.settings} />
    </div>
  );
};

export default Home;
