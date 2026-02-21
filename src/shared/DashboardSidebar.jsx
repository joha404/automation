import { Link, useLocation } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useLogout } from "@/hooks/api/auth/useLogout";
import { useTheme } from "@/hooks/custom/useTheme";
import { useState, useEffect } from "react";
import logo from "../assets/dashboard/logo.png";
import avatar from "@/assets/shared/avatar.png";
import ThemeSwitch from "./components/ThemeSwitch";
import {
  containerVariants,
  iconVariants,
  menuItemVariants,
  sidebarVariants,
  textVariants,
} from "./components/variants";
import {
  bettingTools,
  community,
  dataAnalysis,
  account,
} from "./components/menueItems";
import SidebarMenu from "./components/SidebarMenue";
import { useSelector } from "react-redux";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const DashboardSidebar = ({ open, countData }) => {
  const location = useLocation();
  const logout = useLogout();
  const { theme, toggleTheme } = useTheme();
  const [animationKey, setAnimationKey] = useState(0);
  const user = useSelector((state) => state.user.user);

  const { data: response, isLoading: isActiveLoading } = useGet(
    "/my-subscription/",
    {
      queryKey: ["active"],
      secure: true,
    },
  );
  const sub = response?.data || [];

  useEffect(() => {
    if (open) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [open]);

  const isActive = (path) => location.pathname === path;
  if (isActiveLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }
  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed top-0 z-[1000] h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#021716] border border-[#021716] shadow-sm"
            : "bg-white border-gray-200"
        } border-r shadow-lg`}
      >
        <div className="flex h-full flex-col">
          {/* Header with user profile */}
          <div className="w-full flex justify-center items-center xl:mt-3 mb-1">
            {!open && (
              <div className="w-8 h-8 mb-1.5 ">
                <img
                  src={logo}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          <div
            className={`m-2.5 rounded-lg p-2.5 ${
              open ? " mt-10" : "mt-0 bg-transparent"
            } transition-colors duration-200 ${
              theme === "dark"
                ? "text-[#0A9087] bg-[#054844] hover:bg-mediumBlack hover:text-white"
                : "bg-lightestGrey"
            }`}
          >
            {open ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      type: "tween",
                      ease: [0.25, 0.1, 0.25, 1],
                      duration: 0.2,
                    }}
                    className={`min-w-10 min-h-10 w-10 h-10 border ${
                      theme === "dark" ? "border-[#0A9087]" : "border-lightGrey"
                    } rounded-full flex items-center justify-center overflow-hidden`}
                  >
                    <img
                      src={user?.profile_img_url || avatar}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h2
                      className={`font-logo text-[14px] ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {(user?.username?.length > 10
                        ? user.username.substring(0, 10) + "..."
                        : user?.username) || "username"}
                    </h2>
                    <p
                      className={`text-xs ${
                        [
                          "Ultimate Predictions",
                          "Ultimate Automation",
                        ].includes(sub?.package_name)
                          ? "text-mediumBlue"
                          : theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                      }`}
                    >
                      {sub?.has_access
                        ? [
                            "Ultimate Predictions",
                            "Ultimate Automation",
                          ].includes(sub?.package_name)
                          ? "Ultimate"
                          : sub?.package_name
                        : "No Package"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Link to={"/dashboard/notifications"}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "tween",
                        ease: [0.25, 0.1, 0.25, 1],
                        duration: 0.2,
                      }}
                      className={`p-1 cursor-pointer rounded-md transition-colors duration-200 relative ${
                        theme === "dark"
                          ? "bg-[#086C65] text-[#88B1AE] hover:bg-darkGrey"
                          : "bg-[#086C65] hover:bg-darkBlack text-white"
                      }`}
                    >
                      <MdNotifications size={19} />
                      <span
                        className={`absolute -top-2 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center ${
                          theme === "dark"
                            ? "bg-rose-600 text-white"
                            : "bg-rose-600 text-white"
                        }`}
                      >
                        {countData?.data?.count || "0"}
                      </span>
                    </motion.button>
                  </Link>

                  <div className="p-1">
                    <ThemeSwitch
                      theme={theme}
                      toggleTheme={toggleTheme}
                      openBar={open}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{
                    type: "tween",
                    ease: [0.25, 0.1, 0.25, 1],
                    duration: 0.2,
                  }}
                  className={`w-8 h-8 border ${
                    theme === "dark" ? "border-lightBlack" : "border-lightGrey"
                  } rounded-full flex items-center justify-center overflow-hidden`}
                >
                  <img
                    src={user?.profile_img_url || avatar}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <Link to={"/dashboard/notifications"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "tween",
                      ease: [0.25, 0.1, 0.25, 1],
                      duration: 0.2,
                    }}
                    className={`p-1.5 cursor-pointer rounded-full transition-colors duration-200 relative ${
                      theme === "dark"
                        ? "bg-[#086C65] text-[#88B1AE] hover:bg-[#024e49]"
                        : "bg-lightBlack hover:bg-darkBlack text-white"
                    }`}
                  >
                    <MdNotifications size={16} />
                    <span
                      className={`absolute -top-2 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-rose-600 text-white"
                          : "bg-rose-600 text-white"
                      }`}
                    >
                      {countData?.data?.count || "0"}
                    </span>
                  </motion.button>
                </Link>

                <ThemeSwitch
                  theme={theme}
                  toggleTheme={toggleTheme}
                  openBar={open}
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 2xl:py-3 py-1 thin-scrollbar">
            <SidebarMenu
              items={bettingTools}
              isActive={isActive}
              theme={theme}
              open={open}
              containerVariants={containerVariants}
              menuItemVariants={menuItemVariants}
              iconVariants={iconVariants}
              textVariants={textVariants}
              animationKey={animationKey}
              sectionName="bettingTools"
              title="Betting Tools"
            />

            <SidebarMenu
              items={dataAnalysis}
              isActive={isActive}
              theme={theme}
              open={open}
              containerVariants={containerVariants}
              menuItemVariants={menuItemVariants}
              iconVariants={iconVariants}
              textVariants={textVariants}
              animationKey={animationKey}
              sectionName="dataAnalysis"
              title="Data Analysis"
            />

            <SidebarMenu
              items={community}
              isActive={isActive}
              theme={theme}
              open={open}
              containerVariants={containerVariants}
              menuItemVariants={menuItemVariants}
              iconVariants={iconVariants}
              textVariants={textVariants}
              animationKey={animationKey}
              sectionName="community"
              title="Community"
            />

            <SidebarMenu
              items={account}
              isActive={isActive}
              theme={theme}
              open={open}
              containerVariants={containerVariants}
              menuItemVariants={menuItemVariants}
              iconVariants={iconVariants}
              textVariants={textVariants}
              animationKey={animationKey}
              sectionName="account"
              title="Account"
            />

            <div
              className={`lg:hidden block transition-colors duration-200 xl:pb-2 pb-1.5 ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <motion.button
                onClick={logout}
                transition={{
                  type: "tween",
                  ease: [0.25, 0.1, 0.25, 1],
                  duration: 0.5,
                }}
                className={`group relative flex ${
                  open ? "" : "justify-center"
                } items-center w-full rounded-lg px-1 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-rose-500"
                    : "text-darkGrey group-hover:text-mediumBlack hover:text-rose-600"
                }`}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-md transition-transform duration-300 group-hover:rotate-90">
                  <FaPowerOff size={16} />
                </div>
                {open && (
                  <motion.span
                    variants={textVariants}
                    initial="closed"
                    animate="open"
                    className="ml-3 whitespace-nowrap font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Logout Button */}
          <div
            className={`md:hidden block transition-colors duration-200 xl:pb-2 pb-1.5 ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <motion.button
              onClick={logout}
              transition={{
                type: "tween",
                ease: [0.25, 0.1, 0.25, 1],
                duration: 0.5,
              }}
              className={`group relative flex ${
                open ? "" : "justify-center"
              } items-center w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                theme === "dark"
                  ? "text-gray-400 hover:text-rose-500"
                  : "text-darkGrey group-hover:text-mediumBlack hover:text-rose-600"
              }`}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md transition-transform duration-300 group-hover:rotate-90">
                <FaPowerOff size={16} />
              </div>
              {open && (
                <motion.span
                  variants={textVariants}
                  initial="closed"
                  animate="open"
                  className="ml-3 whitespace-nowrap font-medium"
                >
                  Logout
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Logout Button - Desktop */}
          <div
            className={`md:block hidden transition-colors duration-200 xl:pb-2 pb-1.5 ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <motion.button
              onClick={logout}
              transition={{
                type: "tween",
                ease: [0.25, 0.1, 0.25, 1],
                duration: 0.2,
              }}
              className={`group relative flex ${
                open ? "" : "justify-center"
              } items-center w-full rounded-lg py-2.5 px-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                theme === "dark"
                  ? "text-gray-400 hover:text-rose-500"
                  : "text-darkGrey group-hover:text-mediumBlack hover:text-rose-600"
              }`}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md transition-transform duration-300 group-hover:rotate-90">
                <FaPowerOff size={16} />
              </div>
              {open && (
                <motion.span
                  variants={textVariants}
                  initial="closed"
                  animate="open"
                  className="ml-3 whitespace-nowrap font-medium"
                >
                  Logout
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
