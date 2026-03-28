import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/custom/useTheme";
import RibbonSvg from "./RibbonSvg";

export default function RibbonBanner() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const ribbonColor = theme === "dark" ? "#9CA3AF" : "#1e90ff ";
  const textColor = theme === "dark" ? "#9CA3AF" : "#1e90ff ";

  return (
    <div className="relative w-fit mx-auto mt-8 mr-3 md:mr-0 lg:mr-0">
      {/* SVG Container with proper aspect ratio */}
      <div className="w-20 sm:w-36 md:w-40 lg:w-48 ">
        <RibbonSvg color={ribbonColor} textColor={textColor} />
      </div>
    </div>
  );
}
