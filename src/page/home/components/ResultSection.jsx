import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import {
  FaDesktop,
  FaLink,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FaGlobe } from "react-icons/fa6";
import image from "@/assets/home/result.png";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ResultSection = ({ data }) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true, // whether animation should happen only once
    });
  }, []);
  return (
    <section className="relative min-h-screen  bg-darkerBlack overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"></div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 xl:py-20 py-10">
          {/* Centered Title and Subtitle */}
          <div data-aos="fade-down" className="text-center mb-16">
            <CommonTitle variant="large" className="lg:mb-6 mb-2 text-white">
              {data?.title || "Results"}
            </CommonTitle>
            <CommonParagraph className="max-w-2xl mx-auto">
              {data?.sub_title ||
                "True Transparency. Real-time tracking for every prediction"}
            </CommonParagraph>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* left Side - Content */}

            <div
              data-aos="fade-right"
              className="space-y-12 order-1 lg:order-2"
            >
              <div className="grid grid-cols-1  gap-6 lg:gap-12 lg:justify-items-start justify-items-center ">
                {data?.label.map((feature, index) => (
                  <div key={index} className="">
                    <div>
                      {/* Image OR Fallback Icon + Title */}
                      <div className="flex lg:justify-start justify-center items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded lg:flex hidden items-center justify-center border border-blue-500/30 overflow-hidden ">
                          {feature?.icon ? (
                            <img
                              src={feature?.icon}
                              alt={feature?.label}
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <FaLink className="w-5 h-5 text-mediumBlue" />
                          )}
                        </div>
                        <CommonTitle
                          variant="small"
                          className="font-semibold text-white mb-1 lg:text-left text-center"
                        >
                          {feature?.label}
                        </CommonTitle>
                      </div>
                      {/* Description */}
                      <CommonParagraph className="max-w-md text-white/80 lg:text-left text-center">
                        {feature?.description}
                      </CommonParagraph>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* right Side - Dashboard Image */}
            <div
              data-aos="fade-left"
              className="relative order-1 lg:order-2 w-full"
            >
              <div className="relative w-full bg-darkerBlack/50 backdrop-blur-sm rounded-2xl lg:p-8 p-4 border border-darkerBlue/50 shadow-2xl">
                {/* <img
                  src={data?.image || image}
                  alt="Automation Section"
                  className="w-full h-[260px] sm:h-[320px] lg:h-[520px] rounded-lg object-cover"
                /> */}

                <img
                  src={data?.image || image}
                  alt="Automation Section"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultSection;
