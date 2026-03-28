import React from "react";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { FaMapPin, FaTimes } from "react-icons/fa";

const PinnedMessagesModal = ({
  theme,
  pinnedMessages,
  showPinnedMessages,
  setShowPinnedMessages,
  togglePinMessage,
  isAdmin,
  renderMessageContent,
}) => {
  if (!showPinnedMessages || pinnedMessages.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-lg max-h-[500px] overflow-y-auto w-full rounded-lg shadow-sm thin-scrollbar ${
          theme === "dark"
            ? "bg-darkerBlack border border-darkBlack"
            : "bg-white border border-gray-300"
        }`}
      >
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaMapPin className="text-blue-500" size={14} />
            <span className="font-medium">
              Pinned ({pinnedMessages.length})
            </span>
          </div>
          <button
            onClick={() => setShowPinnedMessages(false)}
            className={`p-1 rounded ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-200 text-gray-500"
            }`}
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-2">
          {pinnedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded ${
                theme === "dark" ? "bg-darkBlack" : "bg-lightestBlue"
              }`}
            >
              <div className="flex gap-2">
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-6 h-6 rounded object-cover mt-2"
                  onError={(e) =>
                    (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      msg.sender || "User",
                    )}&background=2e3450&color=fff&bold=true&size=32`)
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CommonParagraph
                        variant="small"
                        className="font-semibold"
                      >
                        {msg.sender}
                      </CommonParagraph>
                      <span
                        className={`text-xs mt-1 ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {isAdmin === true && (
                      <button
                        onClick={() => {
                          togglePinMessage(msg.id);
                          setShowPinnedMessages(false);
                        }}
                        className="text-xs text-white bg-mediumBlue px-2 py-1 rounded hover:bg-darkBlue font-medium flex-shrink-0"
                      >
                        Unpin
                      </button>
                    )}
                  </div>

                  {renderMessageContent(msg)}

                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex gap-1">
                      {msg.reactions.slice(0, 3).map((reaction, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700"
                        >
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinnedMessagesModal;
