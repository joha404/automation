import ScreenLoader from "@/components/loaders/ScreenLoader";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useGet } from "@/hooks/api/common/useGet";
import { useTheme } from "@/hooks/custom/useTheme";
import React, { useState } from "react";
import { PiClockCountdownFill } from "react-icons/pi";

const WithdrawHistory = () => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  // Fetch withdraw data
  const {
    data: response,
    isLoading,
    error,
  } = useGet(`/withdrawals/`, {
    queryKey: ["withdraw-history"],
    secure: true,
  });

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Transform API withdraw data to history format
  const history = (withdrawals) => {
    if (!withdrawals || !Array.isArray(withdrawals)) return [];

    return withdrawals.map((withdrawal) => ({
      id: withdrawal.id,
      currency: withdrawal.wallet_currency_name,
      walletAddress: withdrawal.user_wallet_address,
      amount: `$${withdrawal.amount}`,
      status: withdrawal.status,
      statusMessage: withdrawal.status_message,
      process: withdrawal.process,
      date: formatDate(withdrawal.created_at),
      originalData: withdrawal,
    }));
  };

  const withdrawHistory = response?.data ? history(response.data) : [];

  const displayedHistory = showAll
    ? withdrawHistory
    : withdrawHistory.slice(0, 10);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return theme === "dark"
          ? "text-green-400 bg-green-900/30"
          : "text-green-700 bg-green-100";
      case "Canceled":
        return theme === "dark"
          ? "text-rose-400 bg-rose-900/30"
          : "text-rose-600 bg-rose-100";
      case "Pending":
        return theme === "dark"
          ? "text-yellow-400 bg-yellow-900/30"
          : "text-yellow-600 bg-yellow-100";
      default:
        return theme === "dark"
          ? "text-gray-400 bg-gray-700"
          : "text-gray-600 bg-gray-100";
    }
  };

  // Truncate wallet address for better display
  const truncateAddress = (address) => {
    if (!address) return "N/A";
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  if (error) {
    return (
      <CommonWrapper>
        <div
          className={`rounded-xl shadow-sm border p-6 transition-colors duration-300
          ${
            theme === "dark"
              ? "bg-darkBlack border-mediumBlack"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-center py-8">
            <CommonParagraph className="text-red-500">
              Error loading withdrawal history. Please try again later.
            </CommonParagraph>
          </div>
        </div>
      </CommonWrapper>
    );
  }

  return (
    <CommonWrapper>
      {/* Withdraw History Card */}
      <div
        className={`xlg:mt-6 rounded-xl shadow-sm border p-6 transition-colors duration-300
    ${
      theme === "dark"
        ? "bg-darkBlack border-mediumBlack"
        : "bg-white border-gray-200"
    }`}
      >
        {withdrawHistory.length > 0 && (
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <PiClockCountdownFill className="text-mediumBlue lg:text-2xl text-xl" />
              <CommonTitle
                variant="small"
                className="font-semibold text-mediumBlue"
              >
                Withdrawal History
              </CommonTitle>
            </div>

            {/* <CommonParagraph
              variant="smaller"
              className="font-normal opacity-60"
            >
              {withdrawHistory.length} withdrawal
              {withdrawHistory.length !== 1 ? "s" : ""} found
            </CommonParagraph> */}
          </div>
        )}

        {withdrawHistory.length === 0 ? (
          <div className="text-center py-8">
            <CommonParagraph
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            >
              No withdrawal history found.
            </CommonParagraph>
          </div>
        ) : (
          <>
            {/* Responsive Scroll Wrapper */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle max-h-[800px] thin-scrollbar">
                <table className="min-w-[800px] w-full text-left mb-10">
                  <thead>
                    <tr
                      className={`border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Currency
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Wallet Address
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Amount
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Date
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide px-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } text-right`}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedHistory.map((item) => (
                      <tr
                        key={item.id}
                        className={`text-sm ${
                          theme === "dark"
                            ? "border-gray-800"
                            : "border-gray-100"
                        } border-b`}
                      >
                        <td
                          className={`py-4 text-sm px-4 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item.currency}
                        </td>
                        <td
                          className={`py-4 text-sm px-4 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          } font-mono`}
                          title={item.walletAddress} // Show full address on hover
                        >
                          {item.walletAddress}
                        </td>
                        <td
                          className={`py-4 font-medium text-sm px-4 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.amount}
                        </td>
                        <td
                          className={`py-4 text-sm px-4 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item.date}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {withdrawHistory.length > 10 && (
              <div className="mt-5 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      theme === "dark"
                        ? "text-lightGrey hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {showAll
                    ? "Show Less"
                    : `View All (${withdrawHistory.length})`}
                </button>
              </div>
            )}

            <CommonParagraph
              variant="smaller"
              className={`w-full text-center mt-10 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Reminder: All crypto transactions have varying fees, your account
              balance may differ from your deposit amount.
              <br />
              All withdrawals will be charged a 1 USD fee.
            </CommonParagraph>
          </>
        )}
      </div>
    </CommonWrapper>
  );
};

export default WithdrawHistory;
