import logo from "@/assets/shared/logo.png";
import { useGet } from "@/hooks/api/common/useGet";
import { Link } from "react-router-dom";
import ScreenLoader from "../loaders/ScreenLoader";

const DepositLogo = () => {
  // Use the GET hook to fetch home
  const {
    data: cms,
    isLoading,
    refetch,
  } = useGet("/cms/", {
    secure: false,
    queryKey: ["logo"],
  });

  const cmsData = cms?.data.hero?.[0]?.hero || {};

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <div className="">
      <Link to="/">
        <div className="flex items-center sm:gap-2 gap-1 xl:w-40 xl:h-40 w-32 h-32 relative overflow-hidden shadow-lg mx-auto">
          {/* Logo Image */}
          <div className="h-full">
            <img
              src={cmsData?.logo || logo}
              alt="logo"
              className="h-full w-auto object-cover"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DepositLogo;
