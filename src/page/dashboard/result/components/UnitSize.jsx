import React, { useRef, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import UnitCard from "./UnitCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import CommonTitle from "@/components/texts/CommonTitle";

const UnitSize = ({ unitData, sportsData }) => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();

  // Create separate refs for each slider
  const unitPrevRef = useRef(null);
  const unitNextRef = useRef(null);
  const sportsPrevRef = useRef(null);
  const sportsNextRef = useRef(null);

  // State to track if we're at the beginning/end of each slider
  const [unitSliderPosition, setUnitSliderPosition] = useState({
    isBeginning: true,
    isEnd: false,
  });
  const [sportsSliderPosition, setSportsSliderPosition] = useState({
    isBeginning: true,
    isEnd: false,
  });

  // ✅ Sort sportsData by overall ROI (unit_won) in descending order
  const sortedSportsData = useMemo(() => {
    if (!sportsData) return [];
    return [...sportsData].sort((a, b) => {
      const aROI = a?.overall?.unit_won || 0;
      const bROI = b?.overall?.unit_won || 0;
      return bROI - aROI; // Descending order
    });
  }, [sportsData]);

  // Responsive breakpoints that consider sidebar state
  const getBreakpoints = () => {
    if (sidebarOpen) {
      return {
        320: { slidesPerView: 1 },
        480: { slidesPerView: 1.2 },
        640: { slidesPerView: 1.5 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2.5 },
        1280: { slidesPerView: 3 },
        1536: { slidesPerView: 3.5 },
      };
    } else {
      return {
        320: { slidesPerView: 1 },
        480: { slidesPerView: 1.5 },
        640: { slidesPerView: 2.2 },
        768: { slidesPerView: 2.5 },
        1024: { slidesPerView: 3.2 },
        1280: { slidesPerView: 4 },
        1536: { slidesPerView: 4.5 },
      };
    }
  };

  const getSportsBreakpoints = () => {
    if (sidebarOpen) {
      return {
        320: { slidesPerView: 1 },
        480: { slidesPerView: 1.2 },
        640: { slidesPerView: 1.5 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2.5 },
        1280: { slidesPerView: 2.8 },
        1536: { slidesPerView: 3.2 },
      };
    } else {
      return {
        320: { slidesPerView: 1 },
        480: { slidesPerView: 1.5 },
        640: { slidesPerView: 2.2 },
        768: { slidesPerView: 2.5 },
        1024: { slidesPerView: 3.2 },
        1280: { slidesPerView: 3 },
        1536: { slidesPerView: 3.5 },
      };
    }
  };

  return (
    <div
      className={`rounded-xl sm:p-5 p-3 font-primary shadow-sm border transition-colors duration-300 w-full mb-5 overflow-hidden ${
        theme === "dark"
          ? "bg-darkBlack border-mediumBlack"
          : "bg-white border-lightestGrey"
      } `}
    >
      <div className="mx-auto">
        {/* Unit Size */}
        <div className="mb-12 md:mb-16">
          <div className="flex justify-between items-center mb-5">
            <CommonTitle variant="small" className="font-semibold pb-5">
              Prediction Size
            </CommonTitle>
            <div className="flex">
              <button
                ref={unitPrevRef}
                className={`cursor-pointer w-8 h-8 flex items-center justify-center transition-colors ${
                  unitSliderPosition.isBeginning
                    ? theme === "dark"
                      ? "text-lightGrey cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                    : theme === "dark"
                      ? "text-white hover:text-darkGrey"
                      : "text-gray-800 hover:text-gray-50"
                }`}
                disabled={unitSliderPosition.isBeginning}
              >
                <IoIosArrowBack size={18} />
              </button>
              <button
                ref={unitNextRef}
                className={`cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  unitSliderPosition.isEnd
                    ? theme === "dark"
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                    : theme === "dark"
                      ? "text-white hover:text-darkGrey"
                      : "text-gray-800 hover:text-gray-50"
                }`}
                disabled={unitSliderPosition.isEnd}
              >
                <IoIosArrowForward size={18} />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={sidebarOpen ? 15 : 20}
            slidesPerView={1}
            breakpoints={getBreakpoints()}
            navigation={{
              prevEl: unitPrevRef.current,
              nextEl: unitNextRef.current,
            }}
            onInit={(swiper) => {
              // Override the navigation elements after initialization
              swiper.params.navigation.prevEl = unitPrevRef.current;
              swiper.params.navigation.nextEl = unitNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();

              // Set initial position state
              setUnitSliderPosition({
                isBeginning: swiper.isBeginning,
                isEnd: swiper.isEnd,
              });
            }}
            onSlideChange={(swiper) => {
              setUnitSliderPosition({
                isBeginning: swiper.isBeginning,
                isEnd: swiper.isEnd,
              });
            }}
          >
            {unitData?.map((item, i) => (
              <SwiperSlide key={i}>
                <UnitCard title={item?.size} data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Sports Type */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-xl md:text-2xl font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Sports Type
            </h2>
            <div className="flex">
              <button
                ref={sportsPrevRef}
                className={`cursor-pointer w-8 h-8 flex items-center justify-center transition-colors ${
                  sportsSliderPosition.isBeginning
                    ? theme === "dark"
                      ? "text-lightGrey cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                    : theme === "dark"
                      ? "text-white hover:text-darkGrey"
                      : "text-gray-800 hover:text-gray-50"
                }`}
                disabled={sportsSliderPosition.isBeginning}
              >
                <IoIosArrowBack size={18} />
              </button>
              <button
                ref={sportsNextRef}
                className={`cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  sportsSliderPosition.isEnd
                    ? theme === "dark"
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                    : theme === "dark"
                      ? "text-white hover:text-darkGrey"
                      : "text-gray-800 hover:text-gray-50"
                }`}
                disabled={sportsSliderPosition.isEnd}
              >
                <IoIosArrowForward size={18} />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={sidebarOpen ? 15 : 20}
            slidesPerView={1}
            breakpoints={getSportsBreakpoints()}
            navigation={{
              prevEl: sportsPrevRef.current,
              nextEl: sportsNextRef.current,
            }}
            onInit={(swiper) => {
              // Override the navigation elements after initialization
              swiper.params.navigation.prevEl = sportsPrevRef.current;
              swiper.params.navigation.nextEl = sportsNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();

              // Set initial position state
              setSportsSliderPosition({
                isBeginning: swiper.isBeginning,
                isEnd: swiper.isEnd,
              });
            }}
            onSlideChange={(swiper) => {
              setSportsSliderPosition({
                isBeginning: swiper.isBeginning,
                isEnd: swiper.isEnd,
              });
            }}
          >
            {sortedSportsData?.map((item, i) => (
              <SwiperSlide key={i}>
                <UnitCard title={item.sport} data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default UnitSize;
