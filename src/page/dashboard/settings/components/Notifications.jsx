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
    // {
    //   id: 2,
    //   key: "text",
    //   title: "Text Messages",
    //   description: "Receive SMS notifications",
    //   enabled: false,
    // },
    // {
    //   id: 3,
    //   key: "new_predictions",
    //   title: "New Predictions",
    //   description: "Get notified about new predictions",
    //   enabled: false,
    // },
    // {
    //   id: 4,
    //   key: "results",
    //   title: "Results",
    //   description: "Important regulatory compliance results and scores",
    //   enabled: false,
    // },
    // {
    //   id: 5,
    //   key: "news_announcements",
    //   title: "News & Announcements",
    //   description: "Latest news and important announcements",
    //   enabled: false,
    // },
    // {
    //   id: 6,
    //   key: "live_content",
    //   title: "Live Content",
    //   description: "Receive notification for live content",
    //   enabled: false,
    // },
  ]);

  // Use the PUT hook for updating notifications
  const { mutate: updateNotifications, isPending: isUpdating } = usePut(
    "/notifications/",
    {
      secure: true,
    }
  );

  // Update notifications state when API data is fetched
  useEffect(() => {
    if (notificationData?.data) {
      const settings = notificationData.data;

      setNotifications((prevNotifications) =>
        prevNotifications.map((item) => ({
          ...item,
          enabled: settings[item.key] || false,
        }))
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
                  "Notification setting updated successfully!"
              );

              // Refetch the latest settings to ensure sync
              refetch();
            },
            onError: (error) => {
              errorToast(
                error?.message || "Failed to update notification setting"
              );

              // Revert the UI change if API call fails
              setNotifications((prevNotifications) =>
                prevNotifications.map((i) =>
                  i.id === id ? { ...i, enabled: !updatedItem.enabled } : i
                )
              );
            },
          });

          return updatedItem;
        }
        return item;
      })
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
          }))
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
          ? "bg-darkBlack border-mediumBlack"
          : "bg-white border-lightestGrey"
      }`}
    >
      {/* Header */}
      {/* <div
        className={`pb-5 border-b transition-colors duration-300
        ${theme === "dark" ? "border-darkerGrey" : "border-gray-100"}`}
      >
        <CommonParagraph
          variant="large"
          className={`text-xl font-semibold 
          ${theme === "dark" ? "text-white" : "text-mediumBlack"}`}
        >
          Notification Preferences
        </CommonParagraph>
        <CommonParagraph
          variant="small"
          className={`mt-1 
          ${theme === "dark" ? "text-white/60" : "text-darkGrey"}`}
        >
          Choose which notifications you'd like to receive
        </CommonParagraph>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => updateAllNotifications(true)}
            disabled={isUpdating}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              theme === "dark"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            } disabled:opacity-50`}
          >
            Enable All
          </button>
          <button
            onClick={() => updateAllNotifications(false)}
            disabled={isUpdating}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              theme === "dark"
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-rose-500 hover:bg-rose-600 text-white"
            } disabled:opacity-50`}
          >
            Disable All
          </button>
        </div>
      </div> */}

      {/* Notification List */}
      <div
        className={`divide-y transition-colors duration-300 
        ${theme === "dark" ? "divide-darkerGrey" : "divide-gray-100"}`}
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
          className={`text-center py-2 ${
            theme === "dark" ? "text-white/60" : "text-darkGrey"
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
