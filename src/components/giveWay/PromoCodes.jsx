import { useState } from "react";
import { useTheme } from "@/hooks/custom/useTheme";
import PromoCodePopUp from "./PromoCodePopUp";
import ClaimPromoCodePopUp from "./ClaimPromoCodePopUp";
import { claimedPromoCode } from "@/api/giveWay/giveWay.api";
import { toast } from "react-hot-toast";
import Pagination from "./Pagination.jsx";
import SlotMachineCard from "./SlotMachineCard";
import GiveawayCardComponent from "./GiveawayCardComponent";
import TabNavigation from "./TabNavigation";

const PromoCodes = ({ promoList, winnerData, loading, fetchPromoCodes }) => {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState("slot");
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [claiming, setClaiming] = useState(null);
  const [claimConfirmModalOpen, setClaimConfirmModalOpen] = useState(false);
  const [selectedPromoForClaim, setSelectedPromoForClaim] = useState(null);

  // Pagination states
  const [slotCurrentPage, setSlotCurrentPage] = useState(1);
  const [giveawayCurrentPage, setGiveawayCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClaimClick = (win) => {
    setSelectedWinner(win);
    setClaimModalOpen(true);
  };

  const closeClaimModal = () => {
    setClaimModalOpen(false);
    setSelectedWinner(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleClaimButtonClick = (promo) => {
    setSelectedPromoForClaim(promo);
    setClaimConfirmModalOpen(true);
  };

  const closeClaimConfirmModal = () => {
    setClaimConfirmModalOpen(false);
    setSelectedPromoForClaim(null);
  };

  const handleConfirmClaim = async () => {
    if (!selectedPromoForClaim) return;

    try {
      setClaiming(selectedPromoForClaim.id);

      const payload = {
        slot_pull_id: selectedPromoForClaim.id,
      };

      const res = await claimedPromoCode(payload);
      console.log("Promo code claimed successfully:", res);

      toast.success(
        `${selectedPromoForClaim.discount_value}% off next month package has been applied.`,
      );

      closeClaimConfirmModal();
      fetchPromoCodes();
      setClaiming(null);
    } catch (error) {
      console.error("Failed to claim promo code:", error);
      toast.error(
        error.response?.data?.message || "Failed to claim promo code",
      );
      setClaiming(null);
      closeClaimConfirmModal();
    }
  };

  const formatGiveawayType = (type) => {
    if (!type) return "Unknown";
    const typeUpper = String(type).toUpperCase();

    if (typeUpper.includes("EXCLUSIVE") || typeUpper.includes("ULTIMATE")) {
      return "Exclusive";
    }
    if (typeUpper.includes("WEEKLY")) return "Weekly";
    if (typeUpper.includes("MONTHLY")) return "Monthly";

    return type;
  };

  const weeklyBgColor = "bg-green-200";
  const monthlyBgColor = "bg-purple-200";
  const yearlyBgColor = "bg-yellow-200";
  const weeklyTextColor = "text-green-700";
  const monthlyTextColor = "text-purple-700";
  const yearlyTextColor = "text-yellow-700";

  const mutedTextClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const buttonBgClass = theme === "dark" ? "bg-gray-700" : "bg-white";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const modalBgClass = theme === "dark" ? "bg-gray-900" : "bg-white";
  const modalOverlayClass = theme === "dark" ? "bg-black/70" : "bg-black/50";
  const textClass = theme === "dark" ? "text-white" : "text-gray-900";
  const cardBgClass = theme === "dark" ? "bg-mediumBlack/50" : "bg-gray-50";

  if (loading) {
    return (
      <div className="rounded-2xl border p-8 bg-inherit border-inherit">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  const hasSlotData = promoList && promoList.length > 0;
  const hasGiveawayData = winnerData && winnerData.length > 0;

  if (!hasSlotData && !hasGiveawayData) {
    return (
      <div className="rounded-2xl border p-8 bg-inherit border-inherit">
        <p className={`text-center ${mutedTextClass}`}>No rewards available</p>
      </div>
    );
  }

  // Pagination calculations for Slot Machine
  const slotTotalPages = Math.ceil((promoList?.length || 0) / itemsPerPage);
  const slotStartIndex = (slotCurrentPage - 1) * itemsPerPage;
  const slotEndIndex = slotStartIndex + itemsPerPage;
  const paginatedPromoList =
    promoList?.slice(slotStartIndex, slotEndIndex) || [];

  // Pagination calculations for Giveaway
  const giveawayTotalPages = Math.ceil(
    (winnerData?.length || 0) / itemsPerPage,
  );
  const giveawayStartIndex = (giveawayCurrentPage - 1) * itemsPerPage;
  const giveawayEndIndex = giveawayStartIndex + itemsPerPage;
  const paginatedWinnerData =
    winnerData?.slice(giveawayStartIndex, giveawayEndIndex) || [];

  return (
    <>
      <div className="rounded-2xl p-1 lg:p-2 w-full">
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="space-y-4 w-full">
          {/* Slot Machine Tab */}
          {activeTab === "slot" && (
            <>
              {hasSlotData ? (
                <>
                  <div className="space-y-4">
                    {paginatedPromoList.map((promo) => (
                      <SlotMachineCard
                        key={promo.id}
                        promo={promo}
                        claiming={claiming}
                        handleClaimButtonClick={handleClaimButtonClick}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>

                  {slotTotalPages > 1 && (
                    <div className="mt-6">
                      <Pagination
                        totalPages={slotTotalPages}
                        currentPage={slotCurrentPage}
                        onPageChange={setSlotCurrentPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className={`text-center py-8 ${mutedTextClass}`}>
                  No slot machine rewards available
                </div>
              )}
            </>
          )}

          {/* Giveaway Tab */}
          {activeTab === "giveaway" && (
            <>
              {hasGiveawayData ? (
                <>
                  <div className="space-y-4">
                    {paginatedWinnerData.map((win) => (
                      <GiveawayCardComponent
                        key={win.id}
                        win={win}
                        handleClaimClick={handleClaimClick}
                        formatGiveawayType={formatGiveawayType}
                      />
                    ))}
                  </div>

                  {giveawayTotalPages > 1 && (
                    <div className="mt-6">
                      <Pagination
                        totalPages={giveawayTotalPages}
                        currentPage={giveawayCurrentPage}
                        onPageChange={setGiveawayCurrentPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className={`text-center py-8 ${mutedTextClass}`}>
                  No giveaway rewards available
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Giveaway Claim Modal */}
      {claimModalOpen && selectedWinner && (
        <PromoCodePopUp
          modalOverlayClass={modalOverlayClass}
          modalBgClass={modalBgClass}
          buttonBgClass={buttonBgClass}
          borderClass={borderClass}
          mutedTextClass={mutedTextClass}
          textClass={textClass}
          cardBgClass={cardBgClass}
          weeklyBgColor={weeklyBgColor}
          weeklyTextColor={weeklyTextColor}
          monthlyBgColor={monthlyBgColor}
          monthlyTextColor={monthlyTextColor}
          yearlyBgColor={yearlyBgColor}
          yearlyTextColor={yearlyTextColor}
          selectedWinner={selectedWinner}
          closeClaimModal={closeClaimModal}
          handleCopy={handleCopy}
          copiedCode={copiedCode}
        />
      )}

      {/* Promo Code Claim Confirmation Modal */}
      {claimConfirmModalOpen && selectedPromoForClaim && (
        <ClaimPromoCodePopUp
          isOpen={claimConfirmModalOpen}
          onClose={closeClaimConfirmModal}
          promoCode={selectedPromoForClaim.code}
          discountValue={selectedPromoForClaim.discount_value}
          validFrom={selectedPromoForClaim.valid_from}
          validUntil={selectedPromoForClaim.valid_until}
          onConfirm={handleConfirmClaim}
          isLoading={claiming === selectedPromoForClaim.id}
          modalOverlayClass={modalOverlayClass}
          modalBgClass={modalBgClass}
          textClass={textClass}
          mutedTextClass={mutedTextClass}
          borderClass={borderClass}
        />
      )}
    </>
  );
};

export default PromoCodes;
