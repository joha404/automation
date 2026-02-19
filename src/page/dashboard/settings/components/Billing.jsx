import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { useTheme } from "@/hooks/custom/useTheme";
import CommingSoon from "@/shared/errorPages/CommingSoon";
import { useGet } from "@/hooks/api/common/useGet";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const Billing = () => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  // Fetch subscription data
  const {
    data: response,
    isLoading,
    error,
  } = useGet(`/subscription/`, {
    queryKey: ["billing"],
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

  // Transform API data to billing history format
  const transformSubscriptionData = (subscriptions) => {
    if (!subscriptions || !Array.isArray(subscriptions)) return [];

    return subscriptions.map((sub) => ({
      id: sub.id,
      startDate: formatDate(sub.start_date),
      endDate: formatDate(sub.end_date),
      price: `$${sub.package?.price || "0.00"}`,
      plan: sub.package?.name || "Unknown Plan",
      status: sub.is_active ? "Active" : "Deactivated",
      originalData: sub,
    }));
  };

  const billingHistory = response?.data
    ? transformSubscriptionData(response.data)
    : [];

  const displayedHistory = showAll
    ? billingHistory
    : billingHistory.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return theme === "dark"
          ? "text-green-400 bg-green-900/30"
          : "text-green-700 bg-green-100";
      case "Deactivated":
        return theme === "dark"
          ? "text-gray-400 bg-gray-700"
          : "text-gray-600 bg-gray-100";
      default:
        return theme === "dark"
          ? "text-gray-400 bg-gray-700"
          : "text-gray-600 bg-gray-100";
    }
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
              Error loading billing history. Please try again later.
            </CommonParagraph>
          </div>
        </div>
      </CommonWrapper>
    );
  }

  return (
    <CommonWrapper>
      {/* Billing History Card */}
      <div
        className={`rounded-xl shadow-sm border p-6 transition-colors duration-300
    ${
      theme === "dark"
        ? "bg-darkBlack border-mediumBlack"
        : "bg-white border-gray-200"
    }`}
      >
        {billingHistory.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <CommonTitle variant="medium" className="font-semibold">
              Subscription History
            </CommonTitle>
            <CommonParagraph className="text-sm">
              {billingHistory.length} subscription
              {billingHistory.length !== 1 ? "s" : ""} found
            </CommonParagraph>
          </div>
        )}

        {billingHistory.length === 0 ? (
          <div className="text-center py-8">
            <CommonParagraph
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            >
              No subscription history found.
            </CommonParagraph>
          </div>
        ) : (
          <>
            {/* Responsive Scroll Wrapper */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-[600px] w-full text-left">
                  <thead>
                    <tr
                      className={`border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Duration
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Plan Name
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Amount
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs uppercase tracking-wide ${
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
                          className={`py-4 text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item.startDate} - {item.endDate}
                        </td>
                        <td
                          className={`py-4 text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item.plan}
                        </td>
                        <td
                          className={`py-4 font-medium text-sm ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.price}
                        </td>
                        <td className="py-4 text-right">
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

            {billingHistory.length > 5 && (
              <div className="mt-6 text-center">
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
                    : `View All (${billingHistory.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </CommonWrapper>
  );
};

export default Billing;
