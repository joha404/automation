import React from "react";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { FaMapPin, FaTimes } from "react-icons/fa";

const ChatHeader = ({
  theme,
  pinnedMessages,
  showPinnedMessages,
  setShowPinnedMessages,
  isConnected,
  onlineCount,
  offlineCount,
}) => {
  return (
    <div className="relative z-20">
      {/* CONNECTION STATUS - TOP RIGHT - MOBILE ONLY */}
      <div
        className={`lg:hidden py-4 border-b px-5 ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* LEFT SIDE - Online/Offline Counter */}
          <div className="flex items-center gap-2">
            {/* Online Counter */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                theme === "dark"
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span
                  className={`text-xs font-medium ${
                    theme === "dark" ? "text-green-400" : "text-green-700"
                  }`}
                >
                  Online
                </span>
              </div>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                {onlineCount || 0}
              </span>
            </div>

            {/* Offline Counter */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-500/10 border border-gray-500/20"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span
                  className={`text-xs font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Offline
                </span>
              </div>
              <span
                className={`text-sm font-bold ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {offlineCount || 0}
              </span>
            </div>
          </div>

          {/* RIGHT SIDE - Connected Badge */}
          <div
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold shadow-lg ${
              isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {isConnected ? "🟢" : "🔴"}
          </div>
        </div>
      </div>

      {/* PINNED BAR - DESKTOP */}
      {pinnedMessages.length > 0 && (
        <div
          className={`hidden lg:flex items-center justify-between px-4 py-3 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-500/20">
              <FaMapPin className="text-yellow-500" size={14} />
            </div>
            <div>
              <CommonParagraph variant="small" className="font-bold">
                Pinned Messages
              </CommonParagraph>
              <CommonParagraph
                variant="smaller"
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                {pinnedMessages.length} message
                {pinnedMessages.length !== 1 ? "s" : ""} pinned
              </CommonParagraph>
            </div>
          </div>

          <button
            onClick={() => setShowPinnedMessages(!showPinnedMessages)}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            {showPinnedMessages ? "Hide" : "Show All"}
          </button>
        </div>
      )}

      {/* MOBILE PINNED BAR */}
      {pinnedMessages.length > 0 && (
        <div
          className={`lg:hidden px-4 py-3 border-b flex items-center justify-between ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-500/20">
              <FaMapPin className="text-yellow-500" size={14} />
            </div>
            <div>
              <CommonParagraph variant="small" className="font-bold">
                Pinned Messages
              </CommonParagraph>
              <CommonParagraph
                variant="smaller"
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                {pinnedMessages.length} message
                {pinnedMessages.length !== 1 ? "s" : ""} pinned
              </CommonParagraph>
            </div>
          </div>

          <button
            onClick={() => setShowPinnedMessages(!showPinnedMessages)}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            {showPinnedMessages ? "Hide" : "Show All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
