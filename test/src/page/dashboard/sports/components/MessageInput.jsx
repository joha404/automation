import React from "react";
import CommonParagraph from "@/components/texts/CommonParagraph";
import { FaPaperclip, FaSmile, FaTimes, FaReply } from "react-icons/fa";
import { HiGif } from "react-icons/hi2";
import { IoMdSend } from "react-icons/io";

const MessageInput = ({
  theme,
  message,
  setMessage,
  canSendMessages,
  isConnected,
  isUploading,
  uploadProgress,
  selectedImage,
  replyingTo,
  showEmojiPicker,
  showGifPicker,
  gifSearchTerm,
  filteredGifs,
  inputRef,
  fileInputRef,
  emojis,
  handleSendMessage,
  handleFileSelect,
  cancelImageSelection,
  cancelReply,
  setShowEmojiPicker,
  setShowGifPicker,
  setGifSearchTerm,
  searchGifs,
  sendGif,
  addEmoji,
  isImageUrl,
  isGifUrl,
}) => {
  const renderImagePreview = () => {
    if (!selectedImage) return null;
    console.log(canSendMessages);

    return (
      <div
        className={`p-3 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <CommonParagraph variant="small" className="font-semibold">
            Image Preview
          </CommonParagraph>
          <button
            onClick={cancelImageSelection}
            className={`p-1 rounded-full ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-300 text-gray-500"
            }`}
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={selectedImage.previewUrl}
            alt="Preview"
            className="w-16 h-16 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
          />
          <div className="flex-1">
            <CommonParagraph variant="small" className="font-medium">
              {selectedImage.name}
            </CommonParagraph>
            {isUploading && (
              <div className="mt-2">
                <div className="lg:w-[40%] w-[80%] bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <CommonParagraph
                  variant="smaller"
                  className="text-gray-500 mt-1"
                >
                  Uploading... {Math.round(uploadProgress)}%
                </CommonParagraph>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderReplyPreview = () => {
    if (!replyingTo) return null;

    const isGifReply = isGifUrl(replyingTo.content);
    const isImageReply = isImageUrl(replyingTo.content) || isGifReply;

    return (
      <div
        className={`flex items-center justify-between p-3 rounded-t-lg border-b ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-gray-100 border-gray-300 text-gray-800"
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FaReply className="flex-shrink-0 text-[#0A9087]" size={14} />
          <div className="flex-1 min-w-0">
            <CommonParagraph variant="small" className="font-semibold truncate">
              Replying to {replyingTo.sender}
            </CommonParagraph>
            <CommonParagraph
              variant="smaller"
              className={`truncate ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {isImageReply ? "Image" : replyingTo.content}
            </CommonParagraph>
          </div>
          {isImageReply && (
            <img
              src={replyingTo.content}
              alt="Preview"
              className="lg:w-8 lg:h-8 w-4 h-4 rounded object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
        </div>
        <button
          onClick={cancelReply}
          className={`p-1 rounded-full flex-shrink-0 ${
            theme === "dark"
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-300 text-gray-500"
          }`}
        >
          <FaTimes size={14} />
        </button>
      </div>
    );
  };

  return (
    <div
      className={`md:px-2 py-2 border-t ${
        theme === "dark" ? "border-lightBlack/50" : "border-gray-300"
      } backdrop-blur-sm`}
    >
      {renderImagePreview()}
      {renderReplyPreview()}

      <div
        className={`flex items-center md:gap-3 gap-0.5 md:p-4 p-2 rounded-2xl shadow-lg ${
          theme === "dark" ? "bg-[#021e1b]" : "bg-white"
        } ${!canSendMessages ? "opacity-60" : ""} transition-all duration-300 ${
          replyingTo || selectedImage ? "rounded-t-none" : ""
        }`}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!canSendMessages}
          className={`p-2 mb-1 rounded-md transition-all duration-200 ${
            theme === "dark"
              ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
              : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
        >
          <FaPaperclip size={18} />
        </button>

        {canSendMessages && (
          <button
            onClick={() => setShowGifPicker(!showGifPicker)}
            disabled={!canSendMessages}
            className={`p-1 mb-2 rounded-md transition-all duration-200 ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
            } disabled:opacity-50 disabled:cursor-not-allowed shadow-md ${
              showGifPicker ? "bg-[#0A9087] text-white" : ""
            } ${replyingTo ? "ring-2 ring-yellow-500" : ""}`}
            title={
              replyingTo
                ? `Send GIF in reply to ${replyingTo.sender}`
                : "Send GIF"
            }
          >
            <HiGif size={30} />
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,application/*"
          disabled={!canSendMessages}
        />

        <div className="flex-1 relative emoji-picker">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              replyingTo
                ? `Replying to ${replyingTo.sender}...`
                : !canSendMessages
                  ? "⚠️ You need an active subscription to send messages"
                  : isConnected
                    ? "Type here..."
                    : "Connecting..."
            }
            disabled={!isConnected || !canSendMessages}
            className={`w-full text-wrap ${
              !canSendMessages && "text-center"
            } resize-none bg-transparent focus:outline-none text-sm ${
              theme === "dark"
                ? "text-white placeholder-gray-400"
                : "text-gray-900 placeholder-gray-600"
            } disabled:opacity-90 disabled:cursor-not-allowed leading-relaxed`}
            rows="1"
            style={{ maxHeight: "120px" }}
          />

          {showEmojiPicker && (
            <div
              className={`absolute bottom-full mb-2 right-0 p-4 rounded-2xl shadow-2xl border z-50 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <CommonParagraph variant="small" className="font-bold">
                  Choose an emoji
                </CommonParagraph>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="p-1 hover:scale-125 transition-transform duration-200 text-xl rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={!canSendMessages}
          className={`p-3 rounded-xl transition-all duration-200 ${
            theme === "dark"
              ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
              : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
        >
          <FaSmile size={18} />
        </button>

        <button
          onClick={handleSendMessage}
          disabled={
            (!message.trim() &&
              !fileInputRef.current?.files[0] &&
              !selectedImage) ||
            !isConnected ||
            !canSendMessages ||
            isUploading
          }
          className={`p-3 rounded-xl transition-all duration-200 shadow-lg ${
            message.trim() || fileInputRef.current?.files[0] || selectedImage
              ? isConnected && canSendMessages && !isUploading
                ? "bg-[#0A9087]  text-white transform hover:scale-105"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
              : theme === "dark"
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoMdSend size={20} />
          )}
        </button>

        {showGifPicker && (
          <div
            className={`absolute bottom-full mb-2 left-0 right-0 p-4 rounded-2xl shadow-2xl border z-50 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
            style={{
              maxHeight: "350px",
              width: "300px",
              overflow: "hidden",
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <div>
                <CommonParagraph variant="small" className="font-bold">
                  GIFs
                </CommonParagraph>
                {replyingTo && (
                  <CommonParagraph
                    variant="smaller"
                    className="text-yellow-500"
                  >
                    Replying to {replyingTo.sender}
                  </CommonParagraph>
                )}
              </div>
              <button
                onClick={() => {
                  setShowGifPicker(false);
                  setGifSearchTerm("");
                  searchGifs("");
                }}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="mb-2">
              <input
                type="text"
                value={gifSearchTerm}
                onChange={(e) => {
                  setGifSearchTerm(e.target.value);
                  searchGifs(e.target.value);
                }}
                placeholder="Search GIFs..."
                className={`w-full p-2 text-sm rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div
              className="overflow-y-auto thin-scrollbar"
              style={{ maxHeight: "240px", minHeight: "100px" }}
            >
              <div className="grid grid-cols-2 gap-2">
                {filteredGifs.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => sendGif(gif.url)}
                    className="w-full rounded-lg overflow-hidden hover:opacity-80 transition-opacity border border-gray-300 dark:border-gray-600"
                  >
                    <img
                      src={gif.preview}
                      alt={gif.title}
                      className="w-full h-20 object-cover"
                    />
                    <div className="p-1 bg-black bg-opacity-50 text-white text-xs truncate">
                      {gif.title}
                    </div>
                  </button>
                ))}
              </div>

              {filteredGifs.length === 0 && (
                <div className="text-center py-4">
                  <CommonParagraph variant="small">
                    No GIFs found
                  </CommonParagraph>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
