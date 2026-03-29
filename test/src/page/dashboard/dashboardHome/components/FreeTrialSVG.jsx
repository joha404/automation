// FreeTrailSvg.jsx
import { useGet } from "@/hooks/api/common/useGet";
import { useTheme } from "@/hooks/custom/useTheme";

export default function FreeTrailSvg({ onSvgClick }) {
  const { theme } = useTheme();

  const { data: response } = useGet("/my-subscription/", {
    queryKey: ["active"],
    secure: true,
  });

  const sub = response?.data || {};

  const handleClick = () => {
    if (onSvgClick) onSvgClick();
  };

  return (
    <>
      {sub?.can_purchase_new === true && (
        <>
          {/* Badge - Mobile: Fixed bottom-right, Desktop: Normal position */}
          <div className="fixed bottom-18 right-4 z-40 md:relative md:bottom-auto md:right-auto md:mx-auto md:-mt-0 md:mr-2 lg:mt-3">
            <div
              className={`relative inline-flex items-center gap-1.5 sm:gap-2 cursor-pointer px-4 py-2.5 sm:px-8 sm:py-3.5 md:px-6 md:py-3 lg:px-8 lg:py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-xs sm:text-sm ${
                theme === "dark"
                  ? "bg-[#032422] hover:bg-[#054844] text-[#9AD9D4] hover:text-white border border-[#0A9087]/20"
                  : "bg-[#E6F5F3] hover:bg-[#D5EEEB] text-[#054844] border border-[#0A9087]/15"
              }`}
              onClick={handleClick}
            >
              <div
                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full animate-pulse flex-shrink-0 ${
                  theme === "dark" ? "bg-[#0A9087]" : "bg-[#054844]"
                }`}
              ></div>
              <p className="whitespace-nowrap leading-tight text-base sm:text-xl md:text-lg lg:text-xl font-bold">
                <span className="sm:hidden">Free Trial</span>
                <span className="hidden sm:inline">Claim Your Free Trial</span>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
