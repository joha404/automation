import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import React from "react";
import { FaCrown, FaUserFriends, FaCog, FaPlay, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const QuickLinks = () => {
  const { theme } = useTheme();

  const features = [
    {
      id: 1,
      link:"/dashboard/subscription-tiers",
      title: "Subscription Tiers",
      icon: FaCrown,
      description: "Choose from flexible subscription plans",
    },
    {
      id: 2,
      link:"/dashboard/referral-program",
      title: "Referral Program",
      icon: FaUserFriends,
      description: "Earn rewards by referring friends",
    },
    {
      id: 3,
      link:"/dashboard/settings",
      title: "Settings",
      icon: FaCog,
      description: "Customize your experience",
    },
    {
      id: 4,
      link:"/dashboard/how-to-videos",
      title: "How To Videos",
      icon: FaPlay,
      description: "Learn with step-by-step tutorials",
    },
  ];

  return (
    <CommonWrapper variant="bottomSmall">
      <div className="">
        <div className="w-full lg:block hidden">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xlg:grid-cols-4 gap-2">
            {features.map((feature) => {
              const IconComponent = feature.icon;

              return (
                <Link to={feature.link}
                  key={feature.id}
                  className={`group rounded-xl font-primary sm:p-5 p-3 shadow-sm border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                    theme === "dark"
                      ? "bg-darkBlack border-mediumBlack"
                      : "bg-darkBlue border-lightestBlue"
                  }`}
                >
                  <div className="flex justify-between items-center gap-5 h-full ">
                    {/* Icon Container */}
                    <div className="w-[10%]">
                                      <div className={`min-w-13 h-13 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      theme === "dark" ? "bg-darkBlue" : "bg-white"
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                      theme === "dark" ? "text-white" : "text-darkBlue"
                    }`} />
                    </div>

                    </div>
    
                    {/* Content */}
                    <div className="flex  flex-col justify-center items-center w-full">
                      <h3 className={`text-sm font-bold ${
                        theme === "dark" ? "text-white" : "text-white"
                      }`}>
                        {feature.title}
                      </h3>

                      <p className={`text-xs text-center xlg:w-[80%] lg:w-[75%] w-[80%] ${
                        theme === "dark" ? "text-gray-300" : "text-lightestGrey"
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>

                </Link>
              );
            })}
          </div>
        </div>
        <div className="w-full lg:hidden block">
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature) => {
              const IconComponent = feature.icon;

              return (
                <Link to={feature.link}
                  key={feature.id}
                  className={`group rounded-xl font-primary sm:p-5 p-3 shadow-sm border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                    theme === "dark"
                      ? "bg-darkBlack border-mediumBlack"
                      : "bg-darkBlue border-lightestBlue"
                  }`}
                >
                  <div className="flex justify-center items-start gap-1 h-full ">
                    {/* Icon Container */}
                    <div className="w-[10%]">
                                      <div className={`md:min-w-10 md:h-10 min-w-4 h-4 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      theme === "dark" ? "bg-darkBlue" : "bg-white"
                    }`}>
                      <IconComponent className={`md:w-6 md:h-6 w-3 h-3 ${
                      theme === "dark" ? "text-white" : "text-darkBlue"
                    }`} />
                    </div>

                    </div>
    
                    {/* Content */}
                    <div className="flex  flex-col justify-center items-center w-full">
                      <h3 className={`text-[10px] font-bold ${
                        theme === "dark" ? "text-white" : "text-white"
                      }`}>
                        {feature.title}
                      </h3>

                      <p className={`text-[10px] text-center  ${
                        theme === "dark" ? "text-gray-300" : "text-lightestGrey"
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>

                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default QuickLinks;