// FreeTrailSvg.jsx
import React, { useState } from "react";
import freeSVG from "../../../../assets/dashboard/svg/free.svg";
import { useGet } from "@/hooks/api/common/useGet";

export default function FreeTrailSvg({ onSvgClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: response, isLoading: isActiveLoading } = useGet(
    "/my-subscription/",
    {
      queryKey: ["active"],
      secure: true,
    },
  );

  const sub = response?.data || {};

  // Toggle function
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onSvgClick) {
      onSvgClick();
    }
  };

  return (
    <>
      {sub?.can_purchase_new === true && (
        <>
          {/* Badge - Mobile: Fixed bottom-right, Desktop: Normal position */}
          <div className="fixed bottom-18 right-4 z-40 md:relative md:bottom-auto md:right-auto md:mx-auto md:-mt-0 md:mr-2 lg:mt-3">
            <div
              className="relative inline-flex items-center gap-1.5 sm:gap-2 cursor-pointer px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-mediumBlue hover:bg-darkBlue text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-xs sm:text-sm"
              onClick={handleToggle}
            >
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full   bg-white animate-pulse flex-shrink-0"></div>
              <p className="whitespace-nowrap leading-tight text-base sm:text-xl font-bold">
                Claim Your Free Trial
              </p>
            </div>

            {/* Dropdown - Shows above badge */}
            {isOpen && (
              <div className="absolute bottom-full mb-2 right-0  shadow-2xl rounded-lg p-4 z-50 w-[280px] md:w-[300px] ">
                {/* Loading state */}
                {isActiveLoading && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
