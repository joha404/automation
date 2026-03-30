import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useTheme } from "@/hooks/custom/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCreditCard,
  FaBell,
  FaLock,
  FaChevronDown,
} from "react-icons/fa";
import { GrCompliance } from "react-icons/gr";

import General from "./components/General";
import Billing from "./components/Billing";
import Notifications from "./components/Notifications";
import ChangePassword from "./components/ChangePassword";
import CommonParagraph from "@/components/texts/CommonParagraph";
import Policy from "./components/Policy";

const Setting = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const tabs = [
    { id: "general", label: "General", icon: FaUser },
    { id: "billing", label: "Billing", icon: FaCreditCard },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "password", label: "Change Password", icon: FaLock },
    { id: "policy", label: "Compliance", icon: GrCompliance },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="">
      <div
        className={`font-primary min-h-[80vh] lg:p-5 justify-center items-center`}
      >
        <div className="max-w-6xl mx-auto lg:pt-5">
          {/* Mobile Tab Selector */}
          {isMobile && (
            <div className="mb-6 lg:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`w-full flex items-center justify-between rounded-xl border p-3 transition-colors ${
                  theme === "dark"
                    ? "border-[#12766F]/35 bg-[#032422] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                    : "border-gray-200 bg-white text-darkerGrey shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-2 text-sm font-medium">
                  {activeTabData && (
                    <>
                      <activeTabData.icon
                        size={16}
                        className={theme === "dark" ? "text-[#0A9087]" : ""}
                      />
                      <span>{activeTabData.label}</span>
                    </>
                  )}
                </div>
                <FaChevronDown
                  className={`transition-transform ${
                    showMobileMenu ? "rotate-180" : ""
                  } ${theme === "dark" ? "text-[#0A9087]" : ""}`}
                  size={14}
                />
              </button>

              {showMobileMenu && (
                <div
                  className={`mt-2 overflow-hidden rounded-xl border ${
                    theme === "dark"
                      ? "border-[#12766F]/30 bg-[#032422]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full cursor-pointer flex items-center space-x-3 p-3 text-left text-sm font-medium transition-colors duration-150 ${
                          isActive
                            ? theme === "dark"
                              ? "bg-[#054844] text-white"
                              : "bg-blue-50 text-darkBlue"
                            : theme === "dark"
                              ? "text-[#A7CBC7] hover:bg-[#054844]/80 hover:text-white"
                              : "text-darkerGrey hover:bg-blue-50 hover:text-darkBlue"
                        }`}
                      >
                        <IconComponent
                          size={16}
                          className={
                            isActive
                              ? theme === "dark"
                                ? "text-[#0A9087]"
                                : "text-darkBlue"
                              : theme === "dark"
                                ? "text-[#7DC7C0]"
                                : "text-darkerGrey"
                          }
                        />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Desktop Tabs */}
          {!isMobile && (
            <div className="flex lg:justify-start justify-center pb-10 pt-10">
              <div className="w-full max-w-3xl">
                <div
                  className={`relative flex p-1 rounded-lg ${
                    theme === "dark"
                      ? "sm:bg-transparent bg-[#054844]"
                      : "sm:bg-transparent bg-gray-100"
                  }`}
                >
                  <motion.div
                    className={`absolute bottom-0 h-0.5 ${
                      theme === "dark" ? "bg-[#0A9087]" : "bg-[#0A9087]"
                    }`}
                    style={{
                      width: `calc(100% / ${tabs.length})`,
                    }}
                    animate={{
                      x: `${
                        tabs.findIndex((tab) => tab.id === activeTab) * 100
                      }%`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                  {/* Tab buttons */}
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative z-10 px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer flex-1 ${
                          activeTab === tab.id
                            ? theme === "dark"
                              ? "text-[#0A9087]"
                              : "text-[#0A9087]"
                            : theme === "dark"
                              ? "text-lighterGrey hover:text-white"
                              : "text-darkGrey hover:text-darkerBlack"
                        }`}
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <IconComponent size={16} />
                          <span className="hidden sm:block">{tab.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <CommonWrapper>
            <div className={`w-full rounded-xl`}>
              <AnimatePresence mode="wait">
                {activeTab === "general" && <General />}
                {activeTab === "billing" && <Billing />}
                {activeTab === "notifications" && <Notifications />}
                {activeTab === "password" && <ChangePassword />}
                {activeTab === "policy" && <Policy />}
              </AnimatePresence>
            </div>
            <CommonParagraph
              variant="small"
              className="w-full text-center mt-2"
            >
              For any customer support issues, please email{" "}
              <span className="text-[#0A9087]">
                customersupport@hyperpicks.ai
              </span>
            </CommonParagraph>
          </CommonWrapper>
        </div>
      </div>
    </div>
  );
};

export default Setting;
