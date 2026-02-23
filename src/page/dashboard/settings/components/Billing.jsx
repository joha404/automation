import React, { useState } from "react";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { useTheme } from "@/hooks/custom/useTheme";
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
          ? "text-white bg-black"
          : "text-gray-600 bg-gray-100";
      default:
        return theme === "dark"
          ? "text-white bg-black"
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
              ? "bg-[#054844] border-[#032a28]"
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
        ? "bg-[#054844] border-[#032a28]"
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
              className={theme === "dark" ? "text-white" : "text-black"}
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
                        theme === "dark"
                          ? "border-[#032a28]"
                          : "border-gray-200"
                      }`}
                    >
                      <th
                        className={`pb-3 font-medium text-xs font-logo uppercase tracking-wide ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Duration
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs font-logo uppercase tracking-wide ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Plan Name
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs font-logo uppercase tracking-wide ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Amount
                      </th>
                      <th
                        className={`pb-3 font-medium text-xs font-logo uppercase tracking-wide ${
                          theme === "dark" ? "text-white" : "text-black"
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
                        className={`text-sm font-logo ${
                          theme === "dark"
                            ? "border-gray-800"
                            : "border-gray-100"
                        } border-b`}
                      >
                        <td
                          className={`py-4 text-sm font-logo ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {item.startDate} - {item.endDate}
                        </td>
                        <td
                          className={`py-4 text-sm font-logo ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {item.plan}
                        </td>
                        <td
                          className={`py-4 font-medium text-sm font-logo ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {item.price}
                        </td>
                        <td className="py-4 text-right">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-logo font-medium ${getStatusColor(
                              item.status,
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
                  className={`px-4 py-2 text-sm font-logo font-medium rounded-md transition-colors
                    ${
                      theme === "dark"
                        ? "text-white hover:bg-[#013633]"
                        : "text-black hover:bg-[#054844]"
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
