import React from "react";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { FaUsers, FaTimes, FaUserFriends } from "react-icons/fa";

const UserList = ({
  theme,
  onlineUsers,
  offlineUsers,
  onlineCount,
  offlineCount,
  isConnected,
  isMobile = false,
  showUserList,
  setShowUserList,
}) => {
  const renderUserItem = (user, isOnline) => (
    <div
      key={user.id}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
        theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"
      } cursor-pointer group backdrop-blur-sm`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
          className={`w-12 h-12 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform duration-300 ${
            !isOnline ? "opacity-50 grayscale" : ""
          }`}
          onError={(e) =>
            (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name || "User",
            )}&background=2e3450&color=fff&bold=true&size=64`)
          }
        />
        <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 shadow-lg ${
            theme === "dark" ? "border-gray-900" : "border-white"
          } ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
        ></div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        {/* Username - Always use user's color or default */}
        <p
          className="text-sm truncate font-medium"
          style={{
            color: isOnline
              ? user?.color || (theme === "dark" ? "#FFFFFF" : "#000000")
              : "#9CA3AF",
          }}
        >
          {user.name}
        </p>

        {/* Subscription Pack - Ultimate in Blue, others use user's color */}
        {user?.subscription_pack === "Ultimate Predictions" ||
        user?.subscription_pack === "Ultimate Automation" ? (
          <p
            className={`text-xs truncate font-semibold ${
              isOnline ? "text-[#0A9087]" : "text-gray-400"
            }`}
          >
            Ultimate
          </p>
        ) : (
          <p
            className="text-xs truncate"
            style={{
              color: isOnline
                ? user?.color || (theme === "dark" ? "#9CA3AF" : "#6B7280")
                : "#9CA3AF",
            }}
          >
            {user?.subscription_pack}
          </p>
        )}
      </div>
    </div>
  );

  const content = (
    <>
      {/* Header Section */}
      <div
        className={`py-4 border-b px-5 ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          {isMobile ? (
            <>
              <div>
                <CommonParagraph
                  variant="medium"
                  className="font-bold mb-1 flex gap-1 justify-center items-center"
                >
                  <FaUserFriends className="text-lg text-[#0A9087]" /> Members
                </CommonParagraph>
              </div>
              <button
                onClick={() => setShowUserList(false)}
                className="p-2 rounded"
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <div
              className={`flex flex-col gap-3 w-full ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl text-center text-xs font-semibold shadow-md ${
                  isConnected
                    ? "bg-[#0A9087] text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
              </div>

              {/* Connection Status Badge */}
            </div>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-4 thin-scrollbar">
        {/* Online Users Section */}
        {onlineUsers.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-0 px-2">
              {/* <div className="w-2 h-2 bg-[#0A9087] rounded-full animate-pulse"></div> */}
              {/* <CommonParagraph
                variant="small"
                className="font-bold text-[#0A9087]"
              >
                Online ({onlineCount})
              </CommonParagraph> */}
            </div>
            <div className="space-y-3">
              {onlineUsers.map((user) => renderUserItem(user, true))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {onlineUsers.length === 0 && offlineUsers.length === 0 && (
          <div className="text-center py-8">
            <div
              className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <FaUsers
                className={theme === "dark" ? "text-gray-600" : "text-gray-400"}
                size={24}
              />
            </div>
            <CommonParagraph variant="small" className="text-gray-500">
              Loading members...
            </CommonParagraph>
          </div>
        )}
      </div>
    </>
  );

  // Mobile version
  if (isMobile) {
    return (
      <div
        className={`lg:hidden w-80 border rounded-xl mt-2 ${
          theme === "dark"
            ? "bg-gradient-to-b border-gray-700"
            : "bg-gradient-to-b border-gray-300"
        } flex flex-col ${showUserList ? "block" : "hidden"}`}
      >
        {content}
      </div>
    );
  }

  // Desktop version
  return (
    <aside
      className={`w-72 border-l flex flex-col h-full flex-shrink-0
    ${
      theme === "dark"
        ? "bg-[#021716] border-gray-700"
        : "bg-white border-gray-300"
    }`}
    >
      {content}
    </aside>
  );
};

export default UserList;
