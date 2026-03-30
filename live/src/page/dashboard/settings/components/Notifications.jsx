import { useState, useEffect } from "react";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { useTheme } from "@/hooks/custom/useTheme";
import ToggleButton from "@/components/buttons/ToggleButton";
import successToast from "@/hooks/custom/successToast";
import errorToast from "@/hooks/custom/errorToast";
import { useGet } from "@/hooks/api/common/useGet";
import { usePut } from "@/hooks/api/common/usePut";
import ScreenLoader from "@/components/loaders/ScreenLoader";

const Notification = () => {
  const { theme } = useTheme();

  // Use the GET hook to fetch notification settings
  const {
    data: notificationData,
    isLoading,
    refetch,
  } = useGet("/notifications/", {
    secure: true,
    queryKey: ["notification-settings"],
  });

  // Initialize notifications state based on API response
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      key: "email",
      title: "Email Notifications",
      description: "Receive important account notifications",
      enabled: false,
    },
  ]);

  // Use the PUT hook for updating notifications
  const { mutate: updateNotifications, isPending: isUpdating } = usePut(
    "/notifications/",
    {
      secure: true,
    },
  );

  // Update notifications state when API data is fetched
  useEffect(() => {
    if (notificationData?.data) {
      const settings = notificationData.data;

      setNotifications((prevNotifications) =>
        prevNotifications.map((item) => ({
          ...item,
          enabled: settings[item.key] || false,
        })),
      );
    }
  }, [notificationData]);

  const toggleNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, enabled: !item.enabled };

          // Prepare the data for API call in the required format
          const updateData = {
            [updatedItem.key]: updatedItem.enabled,
          };

          // Call the API to update the specific setting
          updateNotifications(updateData, {
            onSuccess: (response) => {
              successToast(
                response?.message ||
                  "Notification setting updated successfully!",
              );

              // Refetch the latest settings to ensure sync
              refetch();
            },
            onError: (error) => {
              errorToast(
                error?.message || "Failed to update notification setting",
              );

              // Revert the UI change if API call fails
              setNotifications((prevNotifications) =>
                prevNotifications.map((i) =>
                  i.id === id ? { ...i, enabled: !updatedItem.enabled } : i,
                ),
              );
            },
          });

          return updatedItem;
        }
        return item;
      }),
    );
  };

  // Bulk update all notifications
  const updateAllNotifications = (enableAll) => {
    const bulkUpdateData = {};
    notifications.forEach((item) => {
      bulkUpdateData[item.key] = enableAll;
    });

    updateNotifications(bulkUpdateData, {
      onSuccess: (response) => {
        successToast(response?.message || "All notification settings updated!");

        // Update local state immediately for better UX
        setNotifications((prevNotifications) =>
          prevNotifications.map((item) => ({
            ...item,
            enabled: enableAll,
          })),
        );

        // Refetch to ensure sync with server
        refetch();
      },
      onError: (error) => {
        errorToast(error?.message || "Failed to update notification settings");
      },
    });
  };

  // Show loading state while fetching data

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl font-primary md:p-10 p-5 shadow-sm border h-full ${
        theme === "dark"
          ? "bg-[#054844] border-mediumBlack"
          : "bg-white border-lightestGrey"
      }`}
    >
      {/* Notification List */}
      <div
        className={`divide-y transition-colors duration-300 
        ${theme === "dark" ? "divide-[#054844]" : "divide-gray-100"}`}
      >
        {notifications.map((item) => (
          <div key={item.id} className="py-4">
            <div className="flex flex-col items-start justify-start">
              <div className="w-full flex justify-between items-center">
                <CommonParagraph
                  className={`font-medium 
                  ${theme === "dark" ? "text-white" : "text-mediumBlack"}`}
                >
                  {item.title}
                </CommonParagraph>

                <ToggleButton
                  enabled={item.enabled}
                  onChange={() => toggleNotification(item.id)}
                  disabled={isUpdating}
                />
              </div>
              <CommonParagraph
                variant="small"
                className={`mt-1 
                ${theme === "dark" ? "text-white/60" : "text-darkGrey"}`}
              >
                {item.description}
              </CommonParagraph>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State for Updates */}
      {isUpdating && (
        <div
          className={`text-center font-logo py-2 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Updating preferences...
        </div>
      )}

      {/* Error State */}
      {!notificationData && !isLoading && (
        <div
          className={`text-center py-4 ${
            theme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        >
          <CommonParagraph>
            Failed to load notification settings.{" "}
            <button
              onClick={() => refetch()}
              className="underline hover:no-underline"
            >
              Try again
            </button>
          </CommonParagraph>
        </div>
      )}
    </div>
  );
};

export default Notification;
