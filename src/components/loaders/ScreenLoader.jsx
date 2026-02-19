import CommonWrapper from "../wrappers/CommonWrapper";
import { tailspin } from "ldrs";
import { useTheme } from "@/hooks/custom/useTheme";

tailspin.register();

const ScreenLoader = () => {
  const { theme } = useTheme();

  return (
    <CommonWrapper>
      <div className={`fixed inset-0 z-[500] backdrop-blur-sm flex items-center justify-center ${
        theme === "light" 
          ? " bg-white/80" 
          : "bg-darkerBlack"
      }`}>
        <div className="flex flex-col items-center justify-center gap-6">
          {/* loader with professional styling */}
          <l-tailspin
            size="40"
            stroke="6"
            speed="1.2"
            color={theme === "dark" ? "#92A8C1" : "#3B82F6"} // Professional colors for both themes
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          ></l-tailspin>

          {/* Optional loading text */}
          <div className="text-center">
            <p className={`font-semibold text-lg tracking-tight mb-1 ${
              theme === "dark" ? "text-lightGrey" : "text-gray-700"
            }`}>
              Getting Things Ready
            </p>
            <p className={`text-sm opacity-80 ${
              theme === "dark" ? "text-lightGrey" : "text-gray-600"
            }`}>
              Please wait while we prepare your content
            </p>
          </div>
        </div>

        {/* Custom CSS */}
        <style>
          {`
            @keyframes progress {
              0% {
                width: 20%;
                opacity: 0.7;
              }
              50% {
                width: 80%;
                opacity: 1;
              }
              100% {
                width: 20%;
                opacity: 0.7;
              }
            }
          `}
        </style>
      </div>
    </CommonWrapper>
  );
};

export default ScreenLoader;