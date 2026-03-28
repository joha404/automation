import React, { useEffect, useState } from "react";
import AutomationChart from "./components/AutomationChart";
import { useTheme } from "@/hooks/custom/useTheme";
import { useSidebar } from "@/hooks/custom/useSidebar";
import Scanner from "./components/Scanner";
import AutomationPrediction from "./components/AutomationPrediction";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { Link } from "react-router-dom";
import Logo from "@/components/svgs/Logo";
import DepositHistory from "./components/DepositHistory";
import WithdrawHistory from "./components/WithdrawHistory";
import AutomationCalender from "./components/AutomationCalender";
import AutomationSummary from "./components/AutomationSummary";
import { getAutomationCalender } from "@/api/automation/automation";

const Automation = () => {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar();
  const [activeTab, setActiveTab] = useState("deposit");
  const [loading, setLoading] = useState(false);
  const [calendarDaily, setCalendarDaily] = useState({});
  const [calendarSummary, setCalendarSummary] = useState({});
  const [mobileTab, setMobileTab] = useState("deposit");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAutomationCalender();
      if (res?.status === 200) {
        setCalendarDaily(res?.data?.calendar_daily || {});
        setCalendarSummary(res?.data?.calendar_summary || {});
      } else {
        setCalendarDaily({});
        setCalendarSummary({});
      }
    } catch (error) {
      console.log("Calendar fetch error:", error);
      setCalendarDaily({});
      setCalendarSummary({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    data: predictionsData,
    isLoading: predictionLoading,
    refetch: predictionRefetch,
  } = useGet("/predictions/ultimate-automation-pending/", {
    queryKey: ["prediction-ultimate"],
    secure: true,
  });

  const predictions = predictionsData?.data || {};

  if (predictionLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  const mainTabs = [
    { value: "calendar", label: "Results" },
    { value: "deposit", label: "Deposit" },
    { value: "prediction", label: "Active Predictions" },
  ];

  return (
    <div>
      {predictions?.has_subscription ? (
        <>
          {/* Large and Extra Large Screen Layout */}
          <div className="hidden xlg:block">
            <div className={`h-full grid gap-5 grid-cols-1 xlg:grid-cols-12`}>
              <div className="h-full pt-6 xlg:col-span-7 col-span-6">
                <AutomationChart />
              </div>
              <div className="h-full xlg:col-span-5 col-span-6 xlg:mt-6">
                <Scanner activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 sm:gap-6">
              <div className="md:col-span-3">
                <AutomationSummary
                  calendarSummary={calendarSummary}
                  loading={loading}
                />
              </div>
              <div className="md:col-span-5">
                <AutomationCalender
                  calendarDaily={calendarDaily}
                  loading={loading}
                  refetchData={fetchData}
                />
              </div>
            </div>

            <div className={`grid gap-5 grid-cols-1 xlg:grid-cols-12`}>
              <div className="xlg:pt-6 xlg:col-span-7 col-span-6">
                <AutomationPrediction
                  predictionList={predictions?.predictions}
                />
              </div>
              <div className="xlg:col-span-5 col-span-6">
                {activeTab === "deposit" ? (
                  <DepositHistory />
                ) : (
                  <WithdrawHistory />
                )}
              </div>
            </div>
          </div>

          {/* Medium and Small Screen Layout */}
          <div className="block xlg:hidden pb-8">
            <div className="pt-6">
              <AutomationChart />
            </div>

            {/* Main Tabs */}
            <div className="w-full flex justify-center items-center mt-4 mb-4">
              <div className="w-full max-w-[500px] px-4">
                <div
                  className={`flex gap-1 flex-wrap border rounded-lg  p-1 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {mainTabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setMobileTab(tab.value)}
                      className={`flex-1 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                        mobileTab === tab.value
                          ? "bg-lightBlue text-white "
                          : theme === "dark"
                          ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                          : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {mobileTab && (
              <div className="mt-4">
                {mobileTab === "calendar" && (
                  <div className="space-y-4">
                    <AutomationCalender
                      calendarDaily={calendarDaily}
                      loading={loading}
                      refetchData={fetchData}
                    />
                    <AutomationSummary
                      calendarSummary={calendarSummary}
                      loading={loading}
                    />
                  </div>
                )}

                {mobileTab === "deposit" && (
                  <div>
                    <div className="mb-4">
                      <Scanner
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      />
                    </div>
                    {activeTab === "deposit" ? (
                      <DepositHistory />
                    ) : (
                      <WithdrawHistory />
                    )}
                  </div>
                )}

                {mobileTab === "prediction" && (
                  <AutomationPrediction
                    predictionList={predictions?.predictions}
                  />
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[90vh] gap-2 font-primary">
          <Logo />
          <div className="text-center max-w-3xl pt-5">
            <CommonParagraph
              variant="none"
              className="lg:text-5xl text-3xl mb-5 font-bold"
            >
              Unlock Automation for Your Account
            </CommonParagraph>
            <CommonParagraph className="mb-5">
              Subscribe to one of our membership tiers to activate Automation on
              your account. Once you are subscribed, our system will
              automatically place bets for you after your deposit.
            </CommonParagraph>

            <Link to={"/dashboard/subscription-tiers"}>
              <button className="bg-mediumBlue text-white px-6 py-4 rounded-md text-base font-semibold cursor-pointer shadow-sm transition-colors duration-300 transform hover:bg-gradient-to-l hover:from-lightBlue hover:to-mediumBlue w-[250px]">
                View Subscription Tiers
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automation;
