import React from "react";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { FaMapPin } from "react-icons/fa";

const ChatHeader = ({
  theme,
  pinnedMessages,
  showPinnedMessages,
  setShowPinnedMessages,
  isConnected,
}) => {
  return (
    <div className="relative z-20">
      {/* CHATROOM TITLE */}
      <div
        className={`lg:hidden py-4 border-b px-5 ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <div className="flex items-center justify-center">
          <div
            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold shadow-lg whitespace-nowrap ${
              isConnected ? "bg-[#0A9087] text-white" : "bg-red-500 text-white"
            }`}
          >
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
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
