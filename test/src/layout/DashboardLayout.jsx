import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { IoMenu } from "react-icons/io5";
import Logo from "@/components/svgs/Logo";
import { useTheme } from "@/hooks/custom/useTheme";
import DashboardSidebar from "@/shared/DashboardSidebar";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { SidebarContext } from "@/context/context";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import CommonParagraph from "@/components/texts/CommonParagraph";
import PixelTracker from "@/components/facebook/PixelTracker";
import { useGet } from "@/hooks/api/common/useGet";
import hImage from "../assets/dashboard/h.png";

const DashboardLayout = () => {
  const { theme } = useTheme();

  const [showPopup, setShowPopup] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // ✅ Real notifications from API
  const { data: response } = useGet("/in-app/", {
    queryKey: ["notifications"],
    secure: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const notifications = response?.data || [];
  const firstUnreadNotification = notifications.find(
    (notification) => !notification.is_read,
  );

  // ✅ Unread count with polling
  const { data: countData } = useGet("/in-app/unread/count/", {
    queryKey: ["total-unread-dashboard"],
    secure: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  // ✅ Detect new notification
  useEffect(() => {
    const currentCount = countData?.data?.count || 0;

    if (!hasInitialized && currentCount !== undefined) {
      setPrevCount(currentCount);
      setHasInitialized(true);
      return;
    }

    if (currentCount > prevCount) {
      setShowPopup(true);
    }
    setPrevCount(currentCount);
  }, [countData?.data?.count, prevCount, hasInitialized]);

  const { sidebarOpen, isMobile, toggleSidebar, closeSidebar } =
    useContext(SidebarContext);

  const mainRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div
      className={`flex h-screen flex-col relative rounded-[16px] border-none ${
        theme === "dark" ? "bg-[#020C0B]" : "bg-extraLightBlue"
      }`}
    >
      <PixelTracker />

      {/* Header with Logo and Toggle Button */}
      <div className="flex items-center  gap-2 ">
        <div
          className={`flex items-center w-[280px] z-[2001] fixed top-0 h-[56px] transition-all duration-300 ${
            sidebarOpen
              ? "left-0  px-5 justify-between"
              : isMobile
                ? "left-2 w-auto"
                : "left-[80px] w-auto px-4"
          }`}
        >
          <div className="flex items-center">
            <div className="text-xl font-semibold">
              {sidebarOpen && (
                <div className="flex items-center gap-2">
                  <div
                    className={`flex justify-center items-center h-[44px] p-3 w-[44px] rounded-lg overflow-hidden ${
                      theme === "dark" ? "bg-none" : "bg-[#032422]"
                    }`}
                  >
                    <img
                      src={hImage}
                      className="h-full w-full object-contain"
                      alt=""
                    />
                  </div>
                  <h1 className="font-bold font-logo text-2xl">
                    <span className="text-[#0A9087]">Hyper</span>
                    <span
                      className={`${theme === "dark" ? "text-white" : "text-green-900"}`}
                    >
                      Picks
                    </span>
                  </h1>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className={`mr-2 rounded-md p-1.5 group border transition-all duration-300 cursor-pointer ${
              sidebarOpen
                ? theme === "dark"
                  ? "bg-[#032422] border-[#0A9087]/20 hover:bg-[#054844]"
                  : "bg-[#E6F5F3] border-[#0A9087]/15 hover:bg-[#D5EEEB]"
                : theme === "dark"
                  ? "bg-[#054844] border-[#0A9087]/30 hover:bg-[#0A9087]"
                  : "bg-[#032422] border-[#032422] hover:bg-[#054844]"
            }`}
          >
            {sidebarOpen ? (
              <TbLayoutSidebarLeftCollapseFilled
                className={`h-5 w-5 transition-all duration-300 ${
                  theme === "dark"
                    ? "text-[#9AD9D4] group-hover:text-white"
                    : "text-[#054844] group-hover:text-[#032422]"
                }`}
              />
            ) : (
              <IoMenu
                className={`h-5 w-5 transition-all duration-300  ${
                  !sidebarOpen
                    ? theme === "dark"
                      ? "text-white group-hover:text-white"
                      : "text-white group-hover:text-white"
                    : ""
                }`}
              />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden ">
        {/* Sidebar */}
        <div className={`${!sidebarOpen && isMobile ? "hidden" : "block"}`}>
          <DashboardSidebar
            open={sidebarOpen}
            isMobile={isMobile}
            onClose={closeSidebar}
            countData={countData}
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 z-10 bg-black/50 sm:hidden"
            onClick={closeSidebar}
          />
        )}

        <main
          ref={mainRef}
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            !isMobile ? (sidebarOpen ? "ml-[260px]" : "ml-[78px]") : ""
          }`}
        >
          <div className="container">
            <div
              className={`overflow-x-hidden ${
                sidebarOpen ? "2xl:px-5" : "px-0"
              } font-secondary`}
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, type: "spring", damping: 25 }}
            className={`relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl  ${
              theme === "dark"
                ? "bg-[#002f2d]  text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-6 border-b ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-x-3 w-full">
                <div>
                  <h2 className="text-xl font-bold">🔔 New Notification</h2>
                </div>

                {/* Notification Count Badge */}
                <div className="px-6 pt-4">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full ${
                      theme === "dark" ? "bg-rose-900/20" : "bg-rose-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-rose-300" : "text-rose-600"
                      }`}
                    >
                      {countData?.data?.count} unread notification
                      {countData?.data?.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div
                className={`p-4 rounded-xl ${
                  theme === "dark" ? "bg-[#021716]" : "bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      theme === "dark" ? "bg-rose-400" : "bg-rose-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <CommonParagraph
                      className={`font-bold text-lg mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {firstUnreadNotification?.title || ""}
                    </CommonParagraph>

                    <CommonParagraph
                      variant="small"
                      className={`text-base leading-relaxed ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {firstUnreadNotification?.message ||
                        "You're all caught up! No new notifications."}
                    </CommonParagraph>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`flex flex-col md:flex-row gap-3 p-6 border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Link
                to="/dashboard/notifications"
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-[#054844] text-white px-6 py-3 rounded-xl font-semibold text-center hover:bg-[#01211f] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                View Notifications
              </Link>
              <button
                onClick={() => setShowPopup(false)}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold border transition-all duration-200 ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardLayout;
