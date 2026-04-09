import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/custom/useTheme";
import RibbonSvg from "./RibbonSvg";
import FreeTrailSvg from "./FreeTrialSVG";

export default function FreeTrail() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const ribbonColor = theme === "dark" ? "#9CA3AF" : "#1e90ff ";
  const textColor = theme === "dark" ? "#9CA3AF" : "#1e90ff ";

  return (
    <div className="relative w-fit mx-auto mt-8 mr-3 md:mr-0 lg:mr-0">
      <div className="w-20 sm:w-36 md:w-40 lg:w-48 ">
        <FreeTrailSvg />
      </div>
    </div>
  );
}
