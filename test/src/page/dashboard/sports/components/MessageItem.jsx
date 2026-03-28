import CommonParagraph from "@/components/texts/CommonParagraph";
import {
  FaReply,
  FaThumbtack,
  FaSmile,
  FaPaperclip,
  FaDownload,
} from "react-icons/fa";

const MessageItem = ({
  message,
  theme,
  user,
  showReactionPicker,
  setShowReactionPicker,
  handleReply,
  togglePinMessage,
  handleReaction,
  sendReaction,
  emojis,
  isAdmin,
  isGifUrl,
  isImageUrl,
  isImageFile,
}) => {
  const messageReactions = formatReactions(message.reactions, user?.id);
  const isOwnMessage = message.isOwn;
  const metaTextClass =
    theme === "dark"
      ? isOwnMessage
        ? "text-[#9FE9E2]"
        : "text-[#7fb7b1]"
      : isOwnMessage
      ? "text-[#0A9087]"
      : "text-gray-500";
  const messageImageSource = message.preview_url || message.content;
  const messageIsGif = isGifUrl(message.content);
  const messageIsImage =
    isImageUrl(messageImageSource) ||
    messageIsGif ||
    isImageFile({ type: message.file_type }) ||
    isImageFile(message.file_name);
  const hasTextBubble =
    message.content &&
    !messageIsImage &&
    !messageIsGif &&
    message.content.trim() !== "";
  const bubbleClasses = hasTextBubble
    ? theme === "dark"
      ? isOwnMessage
        ? "bg-[#0A9087] text-white border border-[#19b7ad]/20"
        : "bg-[#102927] text-[#E8F6F4] border border-[#12766F]/15"
      : isOwnMessage
        ? "bg-[#0A9087] text-white border border-[#03635D]/10"
        : "bg-[#eef6f5] text-darkBlack border border-[#d8e7e5]"
    : "bg-transparent text-current border-none shadow-none";

  function formatReactions(reactions, userId) {
    if (!reactions || !Array.isArray(reactions)) return {};

    const reactionCounts = {};
    reactions.forEach((reaction) => {
      reactionCounts[reaction.emoji] = {
        count: reaction.user_ids.length,
        userReacted: reaction.user_ids.includes(userId),
      };
    });
    return reactionCounts;
  }

  const renderReplyIndicator = (msg) => {
    if (!msg.reply_to) return null;

    const isGifReply = isGifUrl(msg.reply_to.content);
    const isImageReply = isImageUrl(msg.reply_to.content) || isGifReply;

    return (
      <div
        className={`flex items-center gap-2 mb-2 p-2 rounded-lg ${
          theme === "dark" ? "bg-gray-800/50" : "bg-gray-100"
        } border-l-3 border-blue-500`}
      >
        <FaReply className="flex-shrink-0 text-blue-500" size={12} />
        <div className="flex-1 min-w-0">
          <CommonParagraph
            variant="small"
            className="font-semibold text-blue-400"
          >
            {msg.reply_to.sender}
          </CommonParagraph>
          <CommonParagraph
            variant="smaller"
            className={`text-wrap max-w-xs break-all ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {isImageReply ? "Image" : msg.reply_to.content}
          </CommonParagraph>
        </div>
        {isImageReply && (
          <img
            src={msg.reply_to.content}
            alt="Preview"
            className="lg:w-6 lg:h-6 w-4 h-4 rounded object-cover flex-shrink-0"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>
    );
  };

  const renderMessageContent = (msg) => {
    const imageSource = msg.preview_url || msg.content;
    const isGif = isGifUrl(msg.content);
    const isImage =
      isImageUrl(imageSource) ||
      isGif ||
      isImageFile({ type: msg.file_type }) ||
      isImageFile(msg.file_name);
    const isFile = msg.file_name && !isImageFile({ type: msg.file_type });

    return (
      <div className="relative">
        {renderReplyIndicator(msg)}

        {isImage && (
          <div className="rounded-lg overflow-hidden mb-2 max-w-xs">
            <img
              src={imageSource}
              alt="Shared content"
              className="md:max-w-full h-auto object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              style={{ maxHeight: "300px" }}
              onClick={() => {
                if (msg.content) {
                  window.open(msg.content, "_blank");
                }
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {isFile && (
          <div
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 max-w-xs border ${
              theme === "dark"
                ? "bg-transparent border-[#1b3a37]"
                : "bg-transparent border-[#d8e7e5]"
            }`}
          >
            <div className="p-2 rounded-full bg-blue-500/20">
              <FaPaperclip className="text-blue-500" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <CommonParagraph variant="small" className="font-medium truncate">
                {msg.file_name}
              </CommonParagraph>
              <CommonParagraph variant="smaller" className="text-gray-500">
                {msg.file_type}
              </CommonParagraph>
            </div>
            <a
              href={msg.content}
              download={msg.file_name}
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <FaDownload size={14} />
            </a>
          </div>
        )}

        {msg.content && !isImage && !isGif && msg.content.trim() !== "" && (
          <div>
            {msg.type === "admin" ? (
              <p
                className={`text-current text-wrap max-w-xs break-words ${
                  msg.type === "admin"
                    ? "md:text-xl text-base font-bold text-mediumBlue"
                    : "xl:text-sm text-[13px] font-normal"
                }`}
              >
                {msg.content}
              </p>
            ) : (
              <CommonParagraph
                variant="small"
                className="text-current text-wrap max-w-xs break-words"
              >
                {msg.content}
              </CommonParagraph>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex sm:gap-3 gap-1 ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      } transition-all duration-300 hover:bg-opacity-50`}
    >
      <img
        src={message.avatar}
        alt={message.sender}
        className="sm:w-10 sm:h-10 w-5 h-5 rounded-full object-cover flex-shrink-0 shadow-md sm:mt-0 mt-1"
        onError={(e) =>
          (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            message.sender || "User",
          )}&background=2e3450&color=fff&bold=true&size=64`)
        }
      />
      <div
        className={`flex-1 flex flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`flex items-center gap-2 mb-1 ${
            isOwnMessage ? "justify-end" : "justify-start"
          }`}
        >
          {message.color === null ? (
            <CommonParagraph variant="none" className="font-semibold text-base">
              {message.sender}
            </CommonParagraph>
          ) : (
            <p
              className="font-semibold text-base"
              style={{ color: message.color }}
            >
              {message.sender}
            </p>
          )}
          <CommonParagraph
            variant="smaller"
            className={metaTextClass}
          >
            {message.timestamp} {message.isOptimistic && " • Sending..."}{" "}
            {message.failed && " ❌"}
          </CommonParagraph>
        </div>

        <div
          className={`relative max-w-xs ${
            hasTextBubble ? "px-4 py-2 rounded-2xl" : "px-0 py-0 rounded-none"
          } ${bubbleClasses}`}
        >
          {renderMessageContent(message)}
        </div>

        {Object.keys(messageReactions).length > 0 && (
          <div
            className={`flex flex-wrap gap-1 mt-0.5 ${
              isOwnMessage ? "justify-end" : "justify-start"
            }`}
          >
            {Object.entries(messageReactions).map(
              ([emoji, { count, userReacted }]) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(message.id, emoji)}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    userReacted
                      ? theme === "dark"
                        ? "bg-[#0A9087] text-white transform scale-105"
                        : "bg-[#03635D] text-white transform scale-105"
                      : theme === "dark"
                        ? "hover:bg-gray-700 hover:scale-105"
                        : "hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  {emoji} {count}
                </button>
              ),
            )}
          </div>
        )}

        <div
          className={`flex items-center gap-1 mt-1 relative ${
            isOwnMessage ? "justify-end" : "justify-start"
          }`}
        >
          <button
            onClick={() => handleReply(message)}
            className={`p-1 cursor-pointer opacity-40 rounded-full transition-all duration-200 ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            }`}
            title="Reply to message"
          >
            <FaReply size={12} />
          </button>

          {isAdmin === true && (
            <button
              onClick={() => togglePinMessage(message.id)}
              className={`p-1 cursor-pointer rounded-full transition-all duration-200 opacity-40 ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              } ${message.isPinned ? "text-yellow-500 opacity-100" : ""}`}
              title={message.isPinned ? "Unpin message" : "Pin message"}
            >
              <FaThumbtack size={12} />
            </button>
          )}

          <button
            onClick={() =>
              setShowReactionPicker(
                showReactionPicker === message.id ? null : message.id,
              )
            }
            className={`p-1 cursor-pointer opacity-40 rounded-full transition-all duration-200 ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            }`}
            title="Add reaction"
          >
            <FaSmile size={14} />
          </button>

          {showReactionPicker === message.id && (
            <div
              className={`reaction-picker absolute z-50 rounded-2xl shadow-2xl border p-3 w-[150px] ${
                isOwnMessage ? "right-0" : "left-0"
              } ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
              style={{ bottom: "100%", marginBottom: "2px" }}
            >
              <div className="grid grid-cols-3 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleReaction(message.id, emoji)}
                    className="p-2 hover:scale-125 transition-transform duration-200 text-xl rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
