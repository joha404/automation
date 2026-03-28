import ScreenLoader from "@/components/loaders/ScreenLoader";
import CommonParagraph from "@/components/texts/CommonParagraph";
import CommonWrapper from "@/components/wrappers/CommonWrapper";
import { useGet } from "@/hooks/api/common/useGet";
import { useTheme } from "@/hooks/custom/useTheme";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaPaperclip,
  FaSmile,
  FaEllipsisH,
  FaPhone,
  FaVideo,
  FaInfoCircle,
  FaSearch,
  FaUserPlus,
  FaHashtag,
  FaUsers,
  FaBell,
  FaBellSlash,
  FaThumbtack,
  FaArchive,
  FaCopy,
  FaShare,
  FaReply,
  FaTimes,
  FaPaperPlane,
  FaMapPin,
  FaUserFriends,
  FaImage,
  FaDownload,
} from "react-icons/fa";
import { FaThumbtackSlash } from "react-icons/fa6";
import { HiGif } from "react-icons/hi2";
import { IoMdSend, IoIosCheckmarkCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import { popularGifs } from "./gifsData";

// Cloudinary configuration
const CLOUD_NAME = "dkgnzxmy8";
const API_KEY = "788391149578185";
const UPLOAD_PRESET = "chatroom";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

// GIF detection helper function
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

// Image type detection - FIXED: Handle both file objects and URLs
const isImageFile = (file) => {
  if (!file) return false;

  // If it's a file object with type property
  if (file.type && typeof file.type === "string") {
    return file.type.startsWith("image/");
  }

  // If it's a string (URL), check for image extensions
  if (typeof file === "string") {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file);
  }

  return false;
};

// Helper function to check if content is an image URL
const isImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return (
    url.startsWith("http") &&
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)($|\?)/i.test(url)
  );
};

const ChatRoom = () => {
  const { theme } = useTheme();
  const user = useSelector((state) => state.user.user);
  const accessToken = useSelector((state) => state.user.access_token);
  const token = accessToken || user?.tokens?.access_token;

  const [message, setMessage] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [messages, setMessages] = useState([]);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [canSendMessages, setCanSendMessages] = useState(true);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [filteredGifs, setFilteredGifs] = useState(popularGifs);

  // Enhanced scroll tracking
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const scrollTimeoutRef = useRef(null);
  const isAtBottomRef = useRef(true);

  // Track pending messages to prevent duplicates
  const pendingMessagesRef = useRef(new Set());

  const {
    data: checkAdmin,
    isLoading,
    refetch,
  } = useGet("/check-role/", {
    queryKey: ["admin-role"],
  });

  const isAdmin = checkAdmin?.data?.is_superadmin || {};

  // Enhanced emoji list for reactions (matching the HTML template)
  const emojis = ["😀", "😮", "😭", "👍", "👎", "❤️"];

  // Cloudinary upload function with progress tracking
  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("cloud_name", CLOUD_NAME);
      formData.append("api_key", API_KEY);

      // For images, add optimization parameters
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

  // Enhanced scroll management
  const scrollToBottom = useCallback((force = false) => {
    const container = messagesContainerRef.current;
    if (container) {
      if (force || isAtBottomRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  // Send message function
  const sendWebSocketMessage = useCallback(
    (messageData) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(messageData));
        return true;
      } else {
        return false;
      }
    },
    [socket],
  );

  // Enhanced file upload and send function - FIXED: Send image URL in content field
  const handleFileUploadAndSend = useCallback(
    async (file) => {
      if (!canSendMessages || !file) {
        return;
      }

      const isImage = isImageFile(file);
      const tempId = `temp_file_${Date.now()}`;

      // Create optimistic message - FIXED: Don't show "Sent an image" text

      setMessages((prev) => [...prev]);
      scrollToBottom(true);

      try {
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file);

        // FIXED: Send image URL in content field instead of image field
        const messageData = {
          type: "room_message",
          content: isImage ? cloudinaryUrl : message.trim(), // FIXED: Send image URL in content
          reply_to: replyingTo?.id || null,
        };

        if (sendWebSocketMessage(messageData)) {
          setMessage("");
          setReplyingTo(null);
          setSelectedImage(null);
        } else {
          // Mark as failed if couldn't send
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? { ...msg, isOptimistic: false, failed: true }
                : msg,
            ),
          );
        }
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  ...msg,
                  isOptimistic: false,
                  failed: true,
                  content: "Failed to upload file",
                }
              : msg,
          ),
        );
      }
    },
    [
      canSendMessages,
      user,
      sendWebSocketMessage,
      message,
      replyingTo,
      uploadToCloudinary,
      scrollToBottom,
    ],
  );

  // Handle file selection and preview
  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        // Check if it's an image file
        if (isImageFile(file)) {
          // Create preview URL
          const previewUrl = URL.createObjectURL(file);
          setSelectedImage({
            file,
            previewUrl,
            name: file.name,
          });
        } else {
          // For non-image files, upload immediately
          handleFileUploadAndSend(file);
        }

        // Clear the file input
        e.target.value = "";
      }
    },
    [handleFileUploadAndSend],
  );

  // Cancel image selection
  const cancelImageSelection = useCallback(() => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
  }, [selectedImage]);

  // WebSocket connection with enhanced error handling
  useEffect(() => {
    if (!token) {
      return;
    }

    const wsUrl = `wss://admin.hyperpicks.ai/ws/rooms/chatroom/?token=${token}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      setIsConnected(true);
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        handleWebSocketMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error, event.data);
      }
    };

    newSocket.onclose = (event) => {
      setIsConnected(false);
      setSocket(null);

      // Enhanced auto-reconnect with exponential backoff
      const delay = 1200;
      setTimeout(() => {}, delay);
    };

    newSocket.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.close(1000, "Component unmounting");
      }
    };
  }, [token]);

  // Enhanced Message handler with permission checks - FIXED: Handle image detection properly
  const handleWebSocketMessage = useCallback(
    (data) => {
      switch (data.type) {
        case "permission": {
          const allowed = data.can_send;
          setCanSendMessages(allowed);
          break;
        }

        case "error":
          if (data.message) {
            console.error("Server error:", data.message);
          }
          break;

        case "history":
          if (data.messages && Array.isArray(data.messages)) {
            const formattedMessages = data.messages.map((msg) => {
              const isGif = isGifUrl(msg.content);
              const hasImage = isImageUrl(msg.content) || isGif; // FIXED: Use isImageUrl helper

              // FIXED: Use content field for both text and images
              return {
                id: msg.id,
                sender_id: msg.sender_id,
                sender: msg.sender,
                content: msg.content, // FIXED: Use content directly for both text and images
                timestamp: msg.timestamp,
                image_url: null, // FIXED: Don't use image_url field
                file_name: msg.file_name,
                file_type: msg.file_type,
                subscription_pack: msg.subscription_pack,
                reactions: msg.reactions || [],
                isOwn: msg.sender_id === user?.id,
                color: msg.color,
                type: msg.member_type,
                avatar:
                  msg.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    msg.sender || "User",
                  )}&background=2e3450&color=fff&bold=true&size=64`,
                isPinned: msg.is_pinned || false,
                is_removed_by_admin: msg.is_removed_by_admin || false,
                removed_reason: msg.removed_reason || null,
                reply_to: msg.reply_to || null,
              };
            });

            // Sort by ID to ensure correct order
            formattedMessages.sort((a, b) => a.id - b.id);

            setMessages(formattedMessages);

            const pinned = formattedMessages.filter((msg) => msg.isPinned);
            setPinnedMessages(pinned);

            setTimeout(() => {
              scrollToBottom(true);
            }, 100);
          }
          break;

        case "content_cleared": {
          if (data.message_id) {
            // Update ONLY the specific message with the given ID to show "This message was deleted"
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.message_id
                  ? {
                      ...msg,
                      content: "This message was deleted",
                      is_removed_by_admin: true,
                      removed_reason: `Deleted by ${
                        data.cleared_by || "ADMIN TEAM"
                      }`,
                      // Clear any image/file content since message is deleted
                      image_url: null,
                      file_name: null,
                      file_type: null,
                      // Clear reactions since message is deleted
                      reactions: [],
                      // Keep all other properties for display
                      timestamp: msg.timestamp,
                      sender: msg.sender,
                      sender_id: msg.sender_id,
                      avatar: msg.avatar,
                      color: msg.color,
                      type: msg.type,
                      isOwn: msg.isOwn,
                      reply_to: msg.reply_to,
                    }
                  : msg,
              ),
            );

            // Also update in pinned messages if it was pinned
            setPinnedMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.message_id
                  ? {
                      ...msg,
                      content: "This message was deleted",
                      is_removed_by_admin: true,
                      removed_reason: `Deleted by ${
                        data.cleared_by || "ADMIN TEAM"
                      }`,
                      image_url: null,
                      file_name: null,
                      file_type: null,
                      reactions: [],
                    }
                  : msg,
              ),
            );

            console.log("✅ Message ID", data.message_id, "marked as deleted");
          } else {
            console.log("❌ No message_id provided in content_cleared");
          }
          break;
        }

        case "message":
          if (data.message) {
            console.log("📨 New Message Received:", data.message);

            const isGif = isGifUrl(data.message.content);
            const hasImage = isImageUrl(data.message.content) || isGif; // FIXED: Use isImageUrl helper

            // FIXED: Use content field directly for both text and images
            const newMessage = {
              id: data.message.id,
              sender_id: data.message.sender_id,
              sender: data.message.sender,
              content: data.message.content, // FIXED: Use content directly
              timestamp: data.message.timestamp,
              image_url: null, // FIXED: Don't use image_url field
              file_name: data.message.file_name,
              file_type: data.message.file_type,
              subscription_pack: data?.message.subscription_pack,
              reactions: data.message.reactions || [],
              isOwn: data.message.sender_id === user?.id,
              color: data.message.color,
              type: data.message.member_type,
              avatar:
                data.message.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.message.sender || "User",
                )}&background=2e3450&color=fff&bold=true&size=64`,
              isPinned: data.message.is_pinned || false,
              is_removed_by_admin: data.message.is_removed_by_admin || false,
              removed_reason: data.message.removed_reason || null,
              reply_to: data.message.reply_to || null,
            };

            setMessages((prev) => {
              const existingIndex = prev.findIndex(
                (msg) =>
                  msg.id === newMessage.id ||
                  (msg.isOptimistic &&
                    msg.sender_id === newMessage.sender_id &&
                    Math.abs(
                      new Date().getTime() -
                        parseInt(msg.id.split("_")[1] || 0),
                    ) < 10000),
              );

              if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = newMessage;
                return updated;
              } else {
                const newMessages = [...prev, newMessage];
                setTimeout(() => {
                  if (isAtBottomRef.current) {
                    scrollToBottom();
                  }
                }, 50);
                return newMessages;
              }
            });

            if (newMessage.isPinned) {
              setPinnedMessages((prev) => {
                const exists = prev.some((msg) => msg.id === newMessage.id);
                if (!exists) {
                  return [...prev, newMessage];
                }
                return prev.map((msg) =>
                  msg.id === newMessage.id ? newMessage : msg,
                );
              });
            }
          }
          break;

        case "message_deleted":
          if (data.message_id) {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== data.message_id),
            );
            setPinnedMessages((prev) =>
              prev.filter((msg) => msg.id !== data.message_id),
            );
          }
          break;

        case "message_updated":
          if (data.message) {
            const updatedMessage = {
              id: data.message.id,
              sender_id: data.message.sender_id,
              sender: data.message.sender,
              content: data.message.content, // FIXED: Use content directly
              timestamp: data.message.timestamp,
              image_url: null, // FIXED: Don't use image_url field
              file_name: data.message.file_name,
              file_type: data.message.file_type,
              reactions: data.message.reactions || [],
              isOwn: data.message.sender_id === user?.id,
              color: data.message.color || "#466fff",
              avatar:
                data.message.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.message.sender || "User",
                )}&background=2e3450&color=fff&bold=true&size=64`,
              isPinned: data.message.is_pinned || false,
              is_removed_by_admin: data.message.is_removed_by_admin || false,
              removed_reason: data.message.removed_reason || null,
              reply_to: data.message.reply_to || null,
            };

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg,
              ),
            );

            setPinnedMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg,
              ),
            );
          }
          break;

        case "room_stats":
          setOnlineCount(data.online_count || 0);
          setTotalMembers(data.total_count || 0);
          break;

        case "member_list": {
          if (data.members && Array.isArray(data.members)) {
            const onlineMembers = data.members.filter(
              (member) => member.online === true,
            );

            const formattedMembers = onlineMembers.map((member) => ({
              id: member.id,
              name: member.name,
              avatar:
                member.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  member.name || "User",
                )}&background=2e3450&color=fff&bold=true&size=64`,
              online: member.online,
              role: member.job || "Member",
              subscription_pack: member.subscription_pack,
              color: member.color,
            }));
            setOnlineUsers(formattedMembers);
            setOnlineCount(formattedMembers.length);
          }
          break;
        }

        case "message_reaction":
          if (data.message_id && data.reactions) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.message_id
                  ? { ...msg, reactions: data.reactions }
                  : msg,
              ),
            );

            setPinnedMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.message_id
                  ? { ...msg, reactions: data.reactions }
                  : msg,
              ),
            );
          }
          break;

        case "pin_update":
          if (data.message) {
            const updatedMessage = {
              id: data.message.id,
              sender_id: data.message.sender_id,
              sender: data.message.sender,
              content: data.message.content, // FIXED: Use content directly
              timestamp: data.message.timestamp,
              image_url: null, // FIXED: Don't use image_url field
              file_name: data.message.file_name,
              file_type: data.message.file_type,
              reactions: data.message.reactions || [],
              isOwn: data.message.sender_id === user?.id,
              color: data.message.color || "#466fff",
              avatar:
                data.message.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.message.sender || "User",
                )}&background=2e3450&color=fff&bold=true&size=64`,
              isPinned: data.message.is_pinned || false,
              is_removed_by_admin: data.message.is_removed_by_admin || false,
              removed_reason: data.message.removed_reason || null,
              reply_to: data.message.reply_to || null,
            };

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg,
              ),
            );

            setPinnedMessages((prev) => {
              if (updatedMessage.isPinned) {
                const exists = prev.some((msg) => msg.id === updatedMessage.id);
                if (!exists) {
                  return [...prev, updatedMessage];
                }
                return prev.map((msg) =>
                  msg.id === updatedMessage.id ? updatedMessage : msg,
                );
              } else {
                return prev.filter((msg) => msg.id !== updatedMessage.id);
              }
            });
          }
          break;

        default:
        // Handle other message types if needed
      }
    },
    [user?.id, scrollToBottom],
  );

  // GIF search function
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

  // Send GIF function
  const sendGif = useCallback(
    (gifUrl) => {
      if (!canSendMessages || !socket || socket.readyState !== WebSocket.OPEN)
        return;

      const messageData = {
        type: "room_message",
        content: gifUrl, // FIXED: Send GIF URL in content field
        reply_to: replyingTo?.id || null,
      };

      console.log("📤 Sending GIF message:", messageData);
      socket.send(JSON.stringify(messageData));
      setShowGifPicker(false);
      setGifSearchTerm("");
      setFilteredGifs(popularGifs);
      setReplyingTo(null);
    },
    [canSendMessages, socket, replyingTo],
  );

  // Enhanced scroll handler
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Clean up any object URLs
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, []);

  // Clean up optimistic messages
  useEffect(() => {
    const timer = setInterval(() => {
      setMessages((prev) =>
        prev.filter((msg) => {
          if (msg.isOptimistic && msg.id && msg.id.startsWith("temp_")) {
            const messageTime = parseInt(msg.id.split("_")[1]);
            const isOld = Date.now() - messageTime > 15000;
            return !isOld;
          }
          return true;
        }),
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Enhanced send message function - FIXED: Unified send logic
  const handleSendMessage = useCallback(() => {
    if (!canSendMessages) {
      return;
    }

    // If there's a selected image, send it automatically
    if (selectedImage) {
      handleFileUploadAndSend(selectedImage.file);
      return;
    }

    const file = fileInputRef.current?.files[0];

    // If there's a file selected, handle file upload
    if (file) {
      handleFileUploadAndSend(file);
      return;
    }

    // Regular text message or GIF
    if (message.trim() && isConnected) {
      const tempId = `temp_${Date.now()}`;
      const isGif = isGifUrl(message);

      const optimisticMessage = {
        id: tempId,
        sender_id: user?.id,
        sender: user?.name || "You",
        content: message, // FIXED: Don't change content for GIFs
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        image_url: null, // FIXED: Don't use image_url field
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

      console.log("📤 Sending text message:", messageData);

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
  ]);

  // Enhanced reaction functions
  const sendReaction = useCallback(
    (messageId, emoji) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;

      socket.send(
        JSON.stringify({
          type: "message_reaction",
          message_id: messageId,
          emoji: emoji,
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

  // Enhanced Pin/Unpin message function
  const togglePinMessage = useCallback(
    (messageId) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const message = messages.find((msg) => msg.id === messageId);
      if (!message) {
        return;
      }

      const shouldPin = !message.isPinned;
      const pinData = {
        type: "pin_message",
        message_id: messageId,
        is_pinned: shouldPin,
      };
      socket.send(JSON.stringify(pinData));

      setActiveMessageMenu(null);
    },
    [socket, messages],
  );

  const shareMessage = useCallback((message) => {
    if (navigator.share) {
      navigator.share({
        title: `Message from ${message.sender}`,
        text: message.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${message.sender}: ${message.content}`);
      const originalText = message.content;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id
            ? { ...msg, content: "✓ Copied to clipboard!" }
            : msg,
        ),
      );
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, content: originalText } : msg,
          ),
        );
      }, 2000);
    }
  }, []);

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

  // Enhanced reaction formatting with user tracking
  const formatReactions = useCallback(
    (reactions) => {
      if (!reactions || !Array.isArray(reactions)) return {};

      const reactionCounts = {};
      reactions.forEach((reaction) => {
        reactionCounts[reaction.emoji] = {
          count: reaction.user_ids.length,
          userReacted: reaction.user_ids.includes(user?.id),
        };
      });
      return reactionCounts;
    },
    [user?.id],
  );

  // Close popups when clicking outside
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

  // Auto-resize textarea
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

  // Enhanced renderReplyPreview function
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
          <FaReply className="flex-shrink-0 text-blue-500" size={14} />
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
              className="w-8 h-8 rounded object-cover"
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

  // Enhanced renderReplyIndicator function to handle images in replies
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
            className="w-6 h-6 rounded object-cover flex-shrink-0"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>
    );
  };

  // Render image preview - FIXED: Removed separate send button for images
  const renderImagePreview = () => {
    if (!selectedImage) return null;

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
            className="w-14 h-14 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
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
                  ></div>
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

  // Enhanced message bubble with image display - FIXED: Only show image from content field
  const renderMessageContent = (msg) => {
    const isGif = isGifUrl(msg.content);
    const isImage = isImageUrl(msg.content) || isGif;
    const isFile = msg.file_name && !isImageFile({ type: msg.file_type });

    return (
      <div className="relative">
        {/* Reply indicator */}
        {renderReplyIndicator(msg)}

        {/* Image/GIF display from content field */}
        {isImage && (
          <div className="rounded-lg overflow-hidden mb-2 max-w-xs">
            <img
              src={msg.content}
              alt="Shared content"
              className="max-w-full h-[100px] object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              style={{ maxHeight: "300px" }}
              onClick={() => window.open(msg.content, "_blank")}
              onError={(e) => {
                console.error("Failed to load image:", msg.content);
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* File display for non-image files */}
        {isFile && (
          <div
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 max-w-xs border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="p-2 rounded-full bg-blue-500/20">
              <FaPaperclip className="text-blue-500" size={16} />
              ff
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

        {/* Message text content - only show if it's not an image/GIF URL and not empty */}
        {msg.content && !isImage && !isGif && msg.content.trim() !== "" && (
          <div>
            {msg.type === "admin" ? (
              <p
                className={`leading-relaxed  text-wrap max-w-xs break-all text-current ${
                  msg.type === "admin"
                    ? "lg:text-lg text-base font-bold"
                    : "xl:text-sm text-[13px] font-normal"
                }`}
                style={{
                  color: msg.color,
                }}
              >
                {msg.content}
              </p>
            ) : (
              <CommonParagraph
                variant="smaller"
                className="leading-relaxed text-current text-wrap max-w-xs break-all "
              >
                {msg.content}
              </CommonParagraph>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl mx-auto justify-center">
        <ScreenLoader />
      </div>
    );
  }

  return (
    <CommonWrapper variant="bottomSection">
      <div
        className={`font-primary rounded-xl p-2 shadow-2xl transition-colors duration-300 min-h-[40vh] flex flex-col lg:flex-row overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-br from-mediumBlack/50 to-darkBlack text-white"
            : "bg-gradient-to-br from-white to-gray-50 text-gray-900"
        }`}
      >
        {/* Connection Status Indicator */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10 ${
            isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>

        {/* Main Chat Area - Left Side */}
        <div className="flex-1 flex flex-col max-h-[535px] min-h-[535px] relative">
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto  lg:py-3 px-4 py-2 space-y-3 thin-scrollbar"
            onScroll={handleScroll}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <CommonParagraph variant="medium" className="text-gray-500">
                  {isConnected
                    ? "No messages yet. Start a conversation!"
                    : "Connecting..."}
                </CommonParagraph>
              </div>
            ) : (
              messages.map((msg) => {
                const messageReactions = formatReactions(msg.reactions);
                const isOwnMessage = msg.isOwn;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    } ${
                      msg.isPinned ? "" : ""
                    } transition-all duration-300 hover:bg-opacity-50`}
                  >
                    {/* Avatar */}
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0 shadow-md"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          msg.sender || "User",
                        )}&background=2e3450&color=fff&bold=true&size=64`;
                      }}
                    />

                    {/* Message Content */}
                    <div
                      className={`flex-1 flex flex-col ${
                        isOwnMessage ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Sender Name & Pinned Badge */}
                      <div
                        className={`flex items-center gap-2 mb-1 ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        {
                          <>
                            {msg.color === null ? (
                              <CommonParagraph
                                variant="none"
                                className="font-semibold text-sm"
                              >
                                {msg.sender}
                              </CommonParagraph>
                            ) : (
                              <p
                                className="font-semibold text-sm"
                                style={{ color: msg.color }}
                              >
                                {msg.sender}
                              </p>
                            )}
                          </>
                        }
                        <CommonParagraph
                          variant="smaller"
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          {msg.timestamp} {msg.isOptimistic && "Blocked"}{" "}
                          {msg.failed && " ❌"}
                        </CommonParagraph>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`relative px-4 py-2 rounded-xl max-w-xs ${
                          theme === "dark"
                            ? "bg-lightBlack/20 text-white"
                            : "bg-lightBlack/10 text-darkBlack"
                        }`}
                      >
                        {renderMessageContent(msg)}
                      </div>

                      {/* Reactions Display */}
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
                                onClick={() => sendReaction(msg.id, emoji)}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                  userReacted
                                    ? " text-white transform scale-105"
                                    : theme === "dark"
                                      ? " hover:bg-gray-600 hover:scale-105"
                                      : " hover:bg-gray-300 hover:scale-105"
                                }`}
                              >
                                {emoji} {count}
                              </button>
                            ),
                          )}
                        </div>
                      )}

                      {/* Action Buttons Row */}
                      <div
                        className={`flex items-center gap-1 mt-1 relative ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* Reply Button */}
                        <button
                          onClick={() => handleReply(msg)}
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
                            onClick={() => togglePinMessage(msg.id)}
                            className={`p-1 cursor-pointer rounded-full transition-all duration-200 opacity-40 ${
                              theme === "dark"
                                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                                : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                            } ${
                              msg.isPinned ? "text-yellow-500 opacity-100" : ""
                            }`}
                            title={
                              msg.isPinned ? "Unpin message" : "Pin message"
                            }
                          >
                            <FaThumbtack size={12} />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setShowReactionPicker(
                              showReactionPicker === msg.id ? null : msg.id,
                            )
                          }
                          className={`p-1 cursor-pointer opacity-40 rounded-full transition-all duration-200 ${
                            theme === "dark"
                              ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                              : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                          }`}
                          title="Add reaction"
                        >
                          <FaSmile size={12} />
                        </button>

                        {/* Reaction Picker */}
                        {showReactionPicker === msg.id && (
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
                                  onClick={() => handleReaction(msg.id, emoji)}
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
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Message Input with Image Preview and Reply Preview */}
          <div
            className={` md:px-2 py-1 border-t ${
              theme === "dark" ? " border-lightBlack/50" : " border-gray-300"
            } backdrop-blur-sm`}
          >
            {/* Image Preview */}
            {renderImagePreview()}

            {/* Reply Preview */}
            {renderReplyPreview()}

            <div
              className={`flex items-center md:gap-1 gap-0.5 p-2 rounded-2xl shadow-lg ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } ${
                !canSendMessages ? "opacity-60" : ""
              } transition-all duration-300 ${
                replyingTo || selectedImage ? "rounded-t-none" : ""
              }`}
            >
              {/* File Attachment Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!canSendMessages}
                className={`p-2 mb-1 rounded-md transition-all duration-200 ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
              >
                <FaPaperclip size={15} />
              </button>

              {/* GIF Button */}
              {canSendMessages && (
                <button
                  onClick={() => setShowGifPicker(!showGifPicker)}
                  disabled={!canSendMessages}
                  className={`p-1 mb-2 rounded-md transition-all duration-200 ${
                    theme === "dark"
                      ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                      : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                  } disabled:opacity-50 disabled:cursor-not-allowed shadow-md ${
                    showGifPicker ? "bg-mediumBlue text-white" : ""
                  } ${replyingTo ? "ring-2 ring-yellow-500" : ""}`}
                  title={
                    replyingTo
                      ? `Send GIF in reply to ${replyingTo.sender}`
                      : "Send GIF"
                  }
                >
                  <HiGif size={25} />
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*"
                disabled={!canSendMessages}
              />

              {/* Message Input with Enhanced Emoji Picker */}
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

                {/* Enhanced Emoji Picker */}
                {showEmojiPicker && (
                  <div
                    className={`absolute bottom-full mb-2 right-1 p-4 rounded-2xl shadow-2xl border z-50 ${
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

              {/* Emoji Picker Toggle */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={!canSendMessages}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
              >
                <FaSmile size={15} />
              </button>

              {/* Unified Send Button - FIXED: Works for all message types */}
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
                className={`p-2 rounded transition-all duration-200 shadow-lg ${
                  (message.trim() ||
                    fileInputRef.current?.files[0] ||
                    selectedImage) &&
                  isConnected &&
                  canSendMessages &&
                  !isUploading
                    ? `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-105`
                    : `${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      } cursor-not-allowed`
                }`}
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <IoMdSend size={15} />
                )}
              </button>

              {/* Enhanced GIF Picker with reply context */}
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
                        setFilteredGifs(popularGifs);
                      }}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>

                  {/* GIF Search Input */}
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

                  {/* GIF Results */}
                  <div
                    className="overflow-y-auto thin-scrollbar"
                    style={{
                      maxHeight: "240px",
                      minHeight: "100px",
                    }}
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
        </div>
      </div>
    </CommonWrapper>
  );
};

export default ChatRoom;
