import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import CommonTitle from "@/components/texts/CommonTitle";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { useTheme } from "@/hooks/custom/useTheme";
import { useGet } from "@/hooks/api/common/useGet";
import { useDelete } from "@/hooks/api/common/useDelete";
import { usePost } from "@/hooks/api/common/usePost";
import { useQueryClient } from "@tanstack/react-query";
import ScreenLoader from "@/components/loaders/ScreenLoader";
import successToast from "@/hooks/custom/successToast";
import { GiCheckMark } from "react-icons/gi";

const Notifications = () => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: response, isLoading } = useGet("/in-app/", {
    queryKey: ["notifications"],
    secure: true,
  });

  // Fetch notifications
  const { data: countData, isLoading: countLoading } = useGet(
    "/in-app/unread/count/",
    {
      queryKey: ["total-unread"],
      secure: true,
    },
  );

  console.log(countData);

  const notifications = response?.data || [];

  // Correct delete mutation
  const deleteMutation = useDelete("/in-app", {
    secure: true,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      successToast("Notification deleted successfully");
    },
  });

  // Mark as read mutation
  const markAsReadMutation = usePost("/in-app/mark-read/", {
    secure: true,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      successToast("Notification marked as read");
    },
  });

  // Clear all mutation
  const clearAllMutation = useDelete("/in-app/delete-all/", {
    secure: true,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      successToast("All notifications cleared successfully");
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = usePost("/in-app/mark-read/", {
    secure: true,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      successToast("All notifications marked as read");
    },
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  // Mark single notification as read
  const markAsRead = (id) => {
    markAsReadMutation.mutate({ notification_id: id });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    markAllAsReadMutation.mutate({ mark_all: true });
  };

  // Delete single notification (no confirmation)
  const deleteNotification = (id) => {
    deleteMutation.mutate(id);
  };

  // Clear all (no confirmation)
  const clearAll = () => {
    if (notifications.length === 0) return;
    clearAllMutation.mutate();
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  if (isLoading || countLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header Card - Mobile Optimized */}
      <div
        className={`rounded-xl border p-4 sm:p-6 mb-4 sm:mb-6 transition-colors duration-300
          ${
            theme === "dark"
              ? "bg-[#021716] "
              : "bg-white border-gray-200 shadow-sm"
          }`}
      >
        <div className="flex md:flex-row flex-col w-full justify-between items-center gap-4">
          {/* Title Section */}
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"
              }`}
            >
              <FiBell
                className={`text-lg ${
                  theme === "dark" ? "text-[#098c83] " : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <CommonTitle
                variant="small"
                className="font-semibold mb-1 text-sm sm:text-base"
              >
                Notifications
              </CommonTitle>
              <CommonParagraph
                variant="small"
                className={`text-xs sm:text-sm ${
                  theme === "dark" ? "text-lightGrey" : "text-gray-600"
                }`}
              >
                {notifications.length}{" "}
                {notifications.length === 1 ? "notification" : "notifications"}{" "}
                • {countData?.data?.count} unread
              </CommonParagraph>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex lg:flex-row flex-col gap-2 sm:gap-3">
            <button
              onClick={markAllAsRead}
              disabled={
                notifications.length === 0 ||
                markAllAsReadMutation.isPending ||
                unreadCount === 0
              }
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-[#054844] text-white font-medium hover:bg-darkBlue transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <GiCheckMark className="text-sm" />
              {markAllAsReadMutation.isPending
                ? "Marking..."
                : "Mark all as read"}
            </button>
            <button
              onClick={clearAll}
              disabled={
                notifications.length === 0 || clearAllMutation.isPending
              }
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FiTrash2 className="text-sm" />
              {clearAllMutation.isPending ? "Clearing..." : "Clear all"}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List Card */}
      <div
        className={`rounded-xl border transition-colors duration-300
          ${
            theme === "dark"
              ? "bg-[#021716]"
              : "bg-white border-gray-200 shadow-sm"
          }`}
      >
        {/* Notifications List */}
        <div
          className={`divide-y ${
            theme === "dark" ? "divide-gray-700" : "divide-gray-200"
          }`}
        >
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 sm:p-6 transition-colors duration-200 flex w-full justify-between items-center ${
                  notification.is_read
                    ? theme === "dark"
                      ? "bg-darkBlack"
                      : "bg-gray-50"
                    : theme === "dark"
                      ? "bg-blue-900/10 hover:bg-gray-800/30"
                      : "bg-blue-50 hover:bg-gray-50/80"
                }`}
              >
                {/* Content Section */}
                <div className="flex-1">
                  <CommonParagraph
                    className={`font-semibold text-sm sm:text-base mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {notification.title}
                  </CommonParagraph>

                  <CommonParagraph
                    variant="small"
                    className={`text-xs sm:text-sm mb-2 ${
                      theme === "dark" ? "text-lightGrey" : "text-gray-700"
                    }`}
                  >
                    {notification.message}
                  </CommonParagraph>

                  <CommonParagraph
                    variant="small"
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {formatDate(notification.created_at)}
                  </CommonParagraph>
                </div>

                {/* Actions Section */}
                <div className="flex justify-end items-center gap-2 ml-4">
                  {/* Mark as Read Button - Only show for unread notifications */}
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      disabled={markAsReadMutation.isPending}
                      className={`p-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-green-400 hover:bg-green-900/20"
                          : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                      title="Mark as read"
                    >
                      <GiCheckMark className="text-sm" />
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    disabled={deleteMutation.isPending}
                    className={`p-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-rose-400 hover:bg-rose-900/20"
                        : "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                    }`}
                    title="Delete notification"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <FiBell
                className={`text-3xl sm:text-4xl mx-auto mb-3 ${
                  theme === "dark" ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <CommonParagraph
                className={`text-sm sm:text-base ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No notifications yet
              </CommonParagraph>
              <CommonParagraph
                variant="small"
                className={`text-xs sm:text-sm ${
                  theme === "dark" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                When you get notifications, they'll appear here.
              </CommonParagraph>
            </div>
          )}
        </div>

        {/* View All Button */}
        {notifications.length > 5 && (
          <div
            className={`p-4 sm:p-6 border-t text-center ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 mx-auto
                ${
                  theme === "dark"
                    ? "text-lightGrey hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {showAll ? "Show Less" : `View All (${notifications.length})`}
              {showAll ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
