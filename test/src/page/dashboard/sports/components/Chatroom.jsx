import ScreenLoader from "@/components/loaders/ScreenLoader";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useGet } from "@/hooks/api/common/useGet";
import { useTheme } from "@/hooks/custom/useTheme";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { popularGifs } from "../../scoreDetails/gifsData";

// Components
import ChatHeader from "./ChatHeader";
import UserList from "./UserList";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import PinnedMessagesModal from "./PinnedMessagesModal";
import { useWebSocket } from "@/hooks/ useWebSocket";

// Hooks

// Cloudinary configuration
const CLOUD_NAME = "dkgnzxmy8";
const API_KEY = "788391149578185";
const UPLOAD_PRESET = "chatroom";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
// Helper functions
const isGifUrl = (url) => {
  if (!url) return false;
  return (
    url.includes("giphy.com") ||
    url.includes(".gif") ||
    (url.startsWith("http") && url.match(/\.gif($|\?)/i)) ||
    url.includes("tenor.com") ||
    url.includes("gif")
  );
};

const isImageFile = (file) => {
  if (!file) return false;
  if (file.type && typeof file.type === "string") {
    return file.type.startsWith("image/");
  }
  if (typeof file === "string") {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)$/i.test(file);
  }
  return false;
};

const isImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return (
    url.startsWith("http") &&
    /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)($|\?)/i.test(url)
  );
};

const getOptimisticTimestamp = (message) => {
  const matches = String(message?.id || "").match(/(\d+)$/);
  if (!matches) return null;

  const timestamp = parseInt(matches[1], 10);
  return Number.isNaN(timestamp) ? null : timestamp;
};

const ChatRoom = () => {
  const { theme } = useTheme();
  const user = useSelector((state) => state.user.user);
  const accessToken = useSelector((state) => state.user.access_token);
  const token = accessToken || user?.tokens?.access_token;

  // Local state
  const [message, setMessage] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [filteredGifs, setFilteredGifs] = useState(popularGifs);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Emojis
  const emojis = ["😀", "😮", "😭", "👍", "👎", "❤️"];

  // Admin check
  const {
    data: checkAdmin,
    isLoading,
    refetch,
  } = useGet("/check-role/", {
    queryKey: ["admin-role"],
  });
  const isAdmin = checkAdmin?.data?.is_superadmin || false;

  // Scroll to bottom helper
  const scrollToBottom = useCallback((force = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (force || isAtBottomRef.current) {
      try {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, []);

  // WebSocket hook
  const {
    socket,
    isConnected,
    messages,
    setMessages,
    pinnedMessages,
    setPinnedMessages,
    onlineUsers,
    offlineUsers,
    totalMembers,
    onlineCount,
    offlineCount,
    canSendMessages,
    isAtBottomRef,
  } = useWebSocket(token, user, scrollToBottom);

  // Send WebSocket message helper
  const sendWebSocketMessage = useCallback(
    (messageData) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(messageData));
        return true;
      }
      return false;
    },
    [socket],
  );

  // Cloudinary upload
  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("cloud_name", CLOUD_NAME);
      formData.append("api_key", API_KEY);

      if (isImageFile(file)) {
        formData.append("quality", "auto");
        formData.append("fetch_format", "auto");
      }

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.addEventListener("loadend", () => {
          setIsUploading(false);
          setUploadProgress(0);
        });

        xhr.open("POST", UPLOAD_URL);
        xhr.send(formData);
      });
    } catch (error) {
      console.error("💀 Cloudinary upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
      throw error;
    }
  };

  // File upload and send
  const handleFileUploadAndSend = useCallback(
    async (file, previewUrl = null) => {
      if (!canSendMessages || !file) return;

      const optimisticCreatedAt = Date.now();
      const tempId = `temp_file_${optimisticCreatedAt}`;
      const optimistic = {
        id: tempId,
        optimisticCreatedAt,
        sender_id: user?.id,
        sender: user?.name || "You",
        content: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reactions: [],
        isOwn: true,
        isOptimistic: true,
        color: "#466fff",
        avatar:
          user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "You",
          )}&background=2e3450&color=fff&bold=true&size=64`,
        isPinned: false,
        preview_url: previewUrl,
        file_name: file.name || null,
        file_type: file.type || null,
        reply_to: replyingTo
          ? {
              id: replyingTo.id,
              content: replyingTo.content,
              sender: replyingTo.sender,
            }
          : null,
      };

      setMessages((prev) => [...prev, optimistic]);
      scrollToBottom(true);

      try {
        const cloudinaryUrl = await uploadToCloudinary(file);
        const messageData = {
          type: "room_message",
          content: cloudinaryUrl,
          reply_to: replyingTo?.id || null,
          file_name: file.name || null,
          file_type: file.type || null,
        };

        if (sendWebSocketMessage(messageData)) {
          setSelectedImage(null);
          setReplyingTo(null);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, isOptimistic: false, failed: true } : m,
            ),
          );
        }
      } catch (error) {
        console.error("Upload error:", error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  isOptimistic: false,
                  failed: true,
                  content: "Upload failed",
                }
              : m,
          ),
        );
      }
    },
    [
      canSendMessages,
      sendWebSocketMessage,
      replyingTo,
      scrollToBottom,
      user,
      setMessages,
    ],
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (isImageFile(file)) {
        const previewUrl = URL.createObjectURL(file);
        setSelectedImage({
          file,
          previewUrl,
          name: file.name,
        });
      } else {
        handleFileUploadAndSend(file);
      }

      e.target.value = "";
    },
    [handleFileUploadAndSend],
  );

  // Cancel image selection
  const cancelImageSelection = useCallback(() => {
    if (selectedImage?.previewUrl) {
      try {
        URL.revokeObjectURL(selectedImage.previewUrl);
      } catch {
        // Ignore browser cleanup errors when the object URL is already gone.
      }
    }
    setSelectedImage(null);
  }, [selectedImage]);

  // GIF search
  const searchGifs = useCallback((query) => {
    if (!query.trim()) {
      setFilteredGifs(popularGifs);
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = popularGifs.filter(
      (gif) =>
        gif.title.toLowerCase().includes(searchTerm) ||
        gif.tags.some((tag) => tag.includes(searchTerm)),
    );

    setFilteredGifs(results);
  }, []);

  // Send GIF
  const sendGif = useCallback(
    (gifUrl) => {
      if (!canSendMessages || !socket || socket.readyState !== WebSocket.OPEN)
        return;

      const messageData = {
        type: "room_message",
        content: gifUrl,
        reply_to: replyingTo?.id || null,
      };

      socket.send(JSON.stringify(messageData));
      setShowGifPicker(false);
      setGifSearchTerm("");
      setFilteredGifs(popularGifs);
      setReplyingTo(null);
    },
    [canSendMessages, socket, replyingTo],
  );

  // Scroll handler
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    isAtBottomRef.current = isNearBottom;

    if (Math.abs(scrollTop - lastScrollTop) > 10) {
      setIsUserScrolling(true);
      setLastScrollTop(scrollTop);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1500);
  }, [lastScrollTop]);

  // Send message
  const handleSendMessage = useCallback(() => {
    if (!canSendMessages) return;

    if (selectedImage) {
      handleFileUploadAndSend(selectedImage.file, selectedImage.previewUrl);
      return;
    }

    const file = fileInputRef.current?.files[0];
    if (file) {
      handleFileUploadAndSend(file);
      return;
    }

    if (message.trim() && isConnected) {
      const tempId = `temp_${Date.now()}`;
      const optimisticMessage = {
        id: tempId,
        sender_id: user?.id,
        sender: user?.name || "You",
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reactions: [],
        isOwn: true,
        isOptimistic: true,
        color: "#466fff",
        avatar:
          user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "You",
          )}&background=2e3450&color=fff&bold=true&size=64`,
        isPinned: false,
        reply_to: replyingTo
          ? {
              id: replyingTo.id,
              content: replyingTo.content,
              sender: replyingTo.sender,
            }
          : null,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      scrollToBottom(true);

      const messageData = {
        type: "room_message",
        content: message,
        reply_to: replyingTo?.id || null,
      };

      if (sendWebSocketMessage(messageData)) {
        setMessage("");
        setReplyingTo(null);
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, isOptimistic: false, failed: true }
              : msg,
          ),
        );
      }
    }
  }, [
    canSendMessages,
    isConnected,
    message,
    user,
    sendWebSocketMessage,
    scrollToBottom,
    handleFileUploadAndSend,
    replyingTo,
    selectedImage,
    setMessages,
  ]);

  // Reactions
  const sendReaction = useCallback(
    (messageId, emoji) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(
        JSON.stringify({
          type: "message_reaction",
          message_id: messageId,
          emoji,
        }),
      );
    },
    [socket],
  );

  const handleReaction = useCallback(
    (messageId, emoji) => {
      sendReaction(messageId, emoji);
      setShowReactionPicker(null);
    },
    [sendReaction],
  );

  // Pin/unpin
  const togglePinMessage = useCallback(
    (messageId) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      const message = messages.find((m) => m.id === messageId);
      if (!message) return;
      const shouldPin = !message.isPinned;
      socket.send(
        JSON.stringify({
          type: "pin_message",
          message_id: messageId,
          is_pinned: shouldPin,
        }),
      );
      setActiveMessageMenu(null);
    },
    [socket, messages],
  );

  const addEmoji = useCallback((emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  const handleReply = useCallback((message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // Clean up
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (selectedImage?.previewUrl) {
        try {
          URL.revokeObjectURL(selectedImage.previewUrl);
        } catch {
          // Ignore browser cleanup errors when the object URL is already gone.
        }
      }
    };
  }, [selectedImage]);

  // Clean up optimistic messages
  useEffect(() => {
    const timer = setInterval(() => {
      setMessages((prev) =>
        prev.filter((msg) => {
          if (msg.isOptimistic && msg.id && msg.id.startsWith("temp_")) {
            const messageTime = getOptimisticTimestamp(msg);
            if (!messageTime) return true;
            const isOld = Date.now() - messageTime > 15000;
            return !isOld;
          }
          return true;
        }),
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [setMessages]);

  // Close popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showReactionPicker && !event.target.closest(".reaction-picker")) {
        setShowReactionPicker(null);
      }
      if (showEmojiPicker && !event.target.closest(".emoji-picker")) {
        setShowEmojiPicker(false);
      }
      if (activeMessageMenu && !event.target.closest(".message-menu")) {
        setActiveMessageMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReactionPicker, showEmojiPicker, activeMessageMenu]);

  // Auto resize textarea
  const autoResizeTextarea = useCallback(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, []);

  useEffect(() => {
    autoResizeTextarea();
  }, [message, autoResizeTextarea]);

  // Auto scroll
  useEffect(() => {
    scrollToBottom(false);
  }, [messages, scrollToBottom]);

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="section" className="min-h-[50vh]">
      <div
        className={`font-primary rounded-xl p-0 h-[90vh] pb-8 flex flex-col transition-colors duration-300 ${
          theme === "dark"
            ? " bg-[#021716]  text-white"
            : "bg-gradient-to-br from-white to-gray-50 text-gray-900"
        }`}
      >
        <div className="flex flex-1 h-full">
          <div className="flex-1 flex flex-col lg:flex-row h-full w-full">
            <div className="flex-1 flex flex-col h-full">
              <ChatHeader
                theme={theme}
                pinnedMessages={pinnedMessages}
                showPinnedMessages={showPinnedMessages}
                setShowPinnedMessages={setShowPinnedMessages}
                isConnected={isConnected}
                onlineCount={onlineCount}
                offlineCount={offlineCount}
              />

              <PinnedMessagesModal
                theme={theme}
                pinnedMessages={pinnedMessages}
                showPinnedMessages={showPinnedMessages}
                setShowPinnedMessages={setShowPinnedMessages}
                togglePinMessage={togglePinMessage}
                isAdmin={isAdmin}
                renderMessageContent={(msg) => msg.content}
              />

              {/* Messages area */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto lg:px-6 lg:py-4 px-4 py-3 space-y-3 thin-scrollbar h-full"
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[200px]">
                    <CommonParagraph variant="medium" className="text-gray-500">
                      {isConnected ? "Loading conversation!" : "Connecting..."}
                    </CommonParagraph>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageItem
                      key={msg.id}
                      message={msg}
                      theme={theme}
                      user={user}
                      showReactionPicker={showReactionPicker}
                      setShowReactionPicker={setShowReactionPicker}
                      handleReply={handleReply}
                      togglePinMessage={togglePinMessage}
                      handleReaction={handleReaction}
                      sendReaction={sendReaction}
                      emojis={emojis}
                      isAdmin={isAdmin}
                      isGifUrl={isGifUrl}
                      isImageUrl={isImageUrl}
                      isImageFile={isImageFile}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <MessageInput
                theme={theme}
                message={message}
                setMessage={setMessage}
                canSendMessages={canSendMessages}
                isConnected={isConnected}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                selectedImage={selectedImage}
                replyingTo={replyingTo}
                showEmojiPicker={showEmojiPicker}
                showGifPicker={showGifPicker}
                gifSearchTerm={gifSearchTerm}
                filteredGifs={filteredGifs}
                inputRef={inputRef}
                fileInputRef={fileInputRef}
                emojis={emojis}
                handleSendMessage={handleSendMessage}
                handleFileSelect={handleFileSelect}
                cancelImageSelection={cancelImageSelection}
                cancelReply={cancelReply}
                setShowEmojiPicker={setShowEmojiPicker}
                setShowGifPicker={setShowGifPicker}
                setGifSearchTerm={setGifSearchTerm}
                searchGifs={searchGifs}
                sendGif={sendGif}
                addEmoji={addEmoji}
                isImageUrl={isImageUrl}
                isGifUrl={isGifUrl}
              />
            </div>

            <UserList
              theme={theme}
              onlineUsers={onlineUsers}
              offlineUsers={offlineUsers}
              onlineCount={onlineCount}
              offlineCount={offlineCount}
              isConnected={isConnected}
              isMobile={false}
              showUserList={showUserList}
              setShowUserList={setShowUserList}
            />
          </div>
        </div>
        {/* 
        <UserList
          theme={theme}
          onlineUsers={onlineUsers}
          offlineUsers={offlineUsers}
          onlineCount={onlineCount}
          offlineCount={offlineCount}
          isConnected={isConnected}
          isMobile={true}
          showUserList={showUserList}
          setShowUserList={setShowUserList}
        /> */}
      </div>
    </CommonWrapper>
  );
};

export default ChatRoom;
