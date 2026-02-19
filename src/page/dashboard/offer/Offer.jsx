// pages/Offer.jsx or components/Offer.jsx
import { getPromoCodes } from "@/api/giveWay/giveWay.api";
import GiveawaySection from "@/components/giveWay/GiveawaySection";
import PromoCodes from "@/components/giveWay/PromoCodes";
import "./offer.css";
import { useTheme } from "@/hooks/custom/useTheme";
import { useCallback, useEffect, useState } from "react";
import PromoHistory from "@/components/giveWay/PromoHistory";
import NeonSlotMachine from "@/components/giveWay/NeonSlotMachine";

const Offer = () => {
  const { theme } = useTheme();

  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoList, setPromoList] = useState([]);
  const [winnerData, setWinnderData] = useState([]);
  const [activeTab, setActiveTab] = useState("rewards");

  // Theme-based classes
  const tabContainerBg = theme === "dark" ? "bg-gray-800/50" : "bg-slate-100";
  const activeTabBg = theme === "dark" ? "bg-gray-700" : "bg-white";
  const activeTabText = theme === "dark" ? "text-white" : "text-slate-900";
  const inactiveTabText = theme === "dark" ? "text-gray-400" : "text-slate-600";
  const inactiveTabHover =
    theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-slate-200";

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await getPromoCodes();
      if (response?.success && response.data) {
        setPromoList(
          Array.isArray(response.data.promo_codes)
            ? response.data.promo_codes
            : [],
        );

        setWinnderData(
          Array.isArray(response.data.slot_machine_wins)
            ? response.data.giveaway_wins
            : [],
        );
      } else {
        setPromoList([]);
        setWinnderData([]);
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      setPromoList([]);
      setWinnderData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="w-full px-1 sm:px-3 lg:px-4 sm:pt-1 lg:pt-2">
        <GiveawaySection />

        <section className="slot-layout">
          {/* Slot Machine */}
          <div className="slot">
            <NeonSlotMachine
              fetchPromoCodes={fetchPromoCodes}
              loading={loading}
            />
          </div>

          {/* Promo Codes / History with Tabs */}
          <div className="promo">
            {/* Tab Navigation */}
            <div className="w-full">
              <div className="relative right-0">
                <ul
                  className={`relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md ${tabContainerBg}`}
                  data-tabs="tabs"
                  role="list"
                >
                  <li className="z-30 flex-auto text-center">
                    <a
                      onClick={() => setActiveTab("rewards")}
                      className={`z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                        activeTab === "rewards"
                          ? `${activeTabBg} ${activeTabText} font-semibold shadow-md`
                          : `${inactiveTabText} bg-inherit ${inactiveTabHover}`
                      }`}
                      data-tab-target=""
                      role="tab"
                      aria-selected={activeTab === "rewards"}
                    >
                      Rewards
                    </a>
                  </li>
                  <li className="z-30 flex-auto text-center">
                    <a
                      onClick={() => setActiveTab("history")}
                      className={`z-30 flex items-center justify-center w-full px-0 py-2 mb-0 text-sm transition-all ease-in-out border-0 rounded-lg cursor-pointer ${
                        activeTab === "history"
                          ? `${activeTabBg} ${activeTabText} font-semibold shadow-md`
                          : `${inactiveTabText} bg-inherit ${inactiveTabHover}`
                      }`}
                      data-tab-target=""
                      role="tab"
                      aria-selected={activeTab === "history"}
                    >
                      Reward History
                    </a>
                  </li>
                </ul>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === "rewards" ? (
                  <PromoCodes
                    fetchPromoCodes={fetchPromoCodes}
                    loading={loading}
                    promoList={promoList}
                    winnerData={winnerData}
                  />
                ) : (
                  <PromoHistory />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Offer;
