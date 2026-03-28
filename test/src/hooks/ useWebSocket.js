import { useState, useEffect, useCallback, useRef } from "react";

const getOptimisticTimestamp = (message) => {
  if (typeof message?.optimisticCreatedAt === "number") {
    return message.optimisticCreatedAt;
  }

  const matches = String(message?.id || "").match(/(\d+)$/);
  if (!matches) return null;

  const timestamp = parseInt(matches[1], 10);
  return Number.isNaN(timestamp) ? null : timestamp;
};

const isMatchingOptimisticMessage = (optimisticMessage, incomingMessage) => {
  if (!optimisticMessage?.isOptimistic) return false;
  if (optimisticMessage.sender_id !== incomingMessage.sender_id) return false;

  const optimisticTimestamp = getOptimisticTimestamp(optimisticMessage);
  if (!optimisticTimestamp || Date.now() - optimisticTimestamp > 15000) {
    return false;
  }

  const optimisticReplyId = optimisticMessage.reply_to?.id || null;
  const incomingReplyId = incomingMessage.reply_to?.id || null;
  if (optimisticReplyId !== incomingReplyId) return false;

  const isIncomingFileMessage = Boolean(
    incomingMessage.file_name || optimisticMessage.file_name,
  );

  if (isIncomingFileMessage) {
    return Boolean(optimisticMessage.file_name);
  }

  return (
    (optimisticMessage.content || "").trim() ===
    (incomingMessage.content || "").trim()
  );
};

const getWebSocketBaseUrl = () =>
  import.meta.env.VITE_USS_URL_LIVE || import.meta.env.VITE_USS_URL_TEST || "";

const buildWebSocketUrl = (token) => {
  const wsBaseUrl = getWebSocketBaseUrl();
  if (!wsBaseUrl || !token) return null;

  try {
    const url = new URL(wsBaseUrl);
    url.searchParams.set("token", token);
    return url.toString();
  } catch {
    return `${wsBaseUrl}${token}`;
  }
};

const sanitizeWebSocketUrl = (url) => {
  if (!url) return url;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.searchParams.has("token")) {
      parsedUrl.searchParams.set("token", "[redacted]");
    }
    return parsedUrl.toString();
  } catch {
    return url.replace(/token=[^&]+/, "token=[redacted]");
  }
};

export const useWebSocket = (token, user, scrollToBottom) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [canSendMessages, setCanSendMessages] = useState(true);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);
  const lastValidMemberCountRef = useRef(0);
  const memberUpdateTimestampRef = useRef(0);
  const memberCountHistoryRef = useRef([]);
  const initialLoadCompleteRef = useRef(false);
  const isAtBottomRef = useRef(true);

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

  const isImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    return (
      url.startsWith("http") &&
      /\.(jpg|jpeg|png|gif|webp|bmp|svg)($|\?)/i.test(url)
    );
  };

  // Core websocket message handler
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
            const formattedMessages = data.messages.map((msg) => ({
              id: msg.id,
              sender_id: msg.sender_id,
              sender: msg.sender,
              content: msg.content,
              timestamp: msg.timestamp,
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
            }));

            formattedMessages.sort((a, b) => a.id - b.id);
            setMessages(formattedMessages);
            setPinnedMessages(formattedMessages.filter((m) => m.isPinned));
            setTimeout(() => scrollToBottom(true), 120);
          }
          break;

        case "message":
          if (data.message) {
            const newMessage = {
              id: data.message.id,
              sender_id: data.message.sender_id,
              sender: data.message.sender,
              content: data.message.content,
              timestamp: data.message.timestamp,
              file_name: data.message.file_name,
              file_type: data.message.file_type,
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
                  isMatchingOptimisticMessage(msg, newMessage),
              );

              if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = newMessage;
                return updated;
              } else {
                const newMessages = [...prev, newMessage];
                setTimeout(() => {
                  if (isAtBottomRef.current) scrollToBottom();
                }, 50);
                return newMessages;
              }
            });

            if (newMessage.isPinned) {
              setPinnedMessages((prev) => {
                const exists = prev.some((msg) => msg.id === newMessage.id);
                if (!exists) return [...prev, newMessage];
                return prev.map((msg) =>
                  msg.id === newMessage.id ? newMessage : msg,
                );
              });
            }
          }
          break;

        case "content_cleared": {
          if (data.message_id) {
            const updateMessage = (msg) =>
              msg.id === data.message_id
                ? {
                    ...msg,
                    content: "This message was deleted",
                    is_removed_by_admin: true,
                    removed_reason: `Deleted by ${
                      data.cleared_by || "ADMIN TEAM"
                    }`,
                    reactions: [],
                    file_name: null,
                    file_type: null,
                  }
                : msg;

            setMessages((prev) => prev.map(updateMessage));
            setPinnedMessages((prev) => prev.map(updateMessage));
          }
          break;
        }

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
              content: data.message.content,
              timestamp: data.message.timestamp,
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
          setTotalMembers(data.total_count || 0);
          console.log("📊 room_stats - Total members:", data.total_count);
          break;

        case "member_list": {
          if (data.members && Array.isArray(data.members)) {
            const now = Date.now();
            console.log("📦 Received members:", data.members.length);

            // Format all members
            const formattedMembers = data.members.map((member) => ({
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

            // Split into online and offline
            const online = formattedMembers.filter((m) => m.online === true);
            const offline = formattedMembers.filter((m) => m.online === false);

            const newOnlineCount = online.length;
            const newOfflineCount = offline.length;

            // Track count history
            memberCountHistoryRef.current.push(newOnlineCount);
            if (memberCountHistoryRef.current.length > 3) {
              memberCountHistoryRef.current.shift();
            }

            // Smart update logic
            const timeSinceLastUpdate = now - memberUpdateTimestampRef.current;
            const countAppearances = memberCountHistoryRef.current.filter(
              (c) => c === newOnlineCount,
            ).length;
            const isStableCount = countAppearances >= 2;

            // Initial load
            if (!initialLoadCompleteRef.current) {
              if (
                isStableCount ||
                newOnlineCount > (lastValidMemberCountRef.current || 0)
              ) {
                setOnlineUsers(online);
                setOfflineUsers(offline);
                setOnlineCount(newOnlineCount);
                setOfflineCount(newOfflineCount);
                lastValidMemberCountRef.current = newOnlineCount;
                memberUpdateTimestampRef.current = now;
                initialLoadCompleteRef.current = true;
              } else {
                console.log("⏳ Waiting for stable count...");
                return;
              }
            } else {
              // After initial load
              const shouldUpdate =
                newOnlineCount > lastValidMemberCountRef.current ||
                (isStableCount && timeSinceLastUpdate > 3000);

              if (shouldUpdate) {
                setOnlineUsers(online);
                setOfflineUsers(offline);
                setOnlineCount(newOnlineCount);
                setOfflineCount(newOfflineCount);
                lastValidMemberCountRef.current = newOnlineCount;
                memberUpdateTimestampRef.current = now;
              } else {
                console.log("⏭️ Keeping stable count");
                // Update lists but keep count stable
                if (online.length > 0 || offline.length > 0) {
                  setOnlineUsers(online);
                  setOfflineUsers(offline);
                  setOfflineCount(newOfflineCount);
                }
              }
            }
          }
          break;
        }

        case "message_reaction":
          if (data.message_id && data.reactions) {
            const updateReactions = (msg) =>
              msg.id === data.message_id
                ? { ...msg, reactions: data.reactions }
                : msg;

            setMessages((prev) => prev.map(updateReactions));
            setPinnedMessages((prev) => prev.map(updateReactions));
          }
          break;

        case "pin_update":
          if (data.message) {
            const updatedMessage = {
              id: data.message.id,
              sender_id: data.message.sender_id,
              sender: data.message.sender,
              content: data.message.content,
              timestamp: data.message.timestamp,
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
                if (!exists) return [...prev, updatedMessage];
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
        // ignore unknown types
      }
    },
    [user?.id, scrollToBottom],
  );

  // WebSocket connection setup
  useEffect(() => {
    if (!token) return;

    if (
      isConnectingRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      console.log("⚠️ WebSocket already connected or connecting");
      return;
    }

    isConnectingRef.current = true;
    const wsBaseUrl = getWebSocketBaseUrl();

    if (!wsBaseUrl) {
      console.error(
        "Missing websocket URL. Set VITE_USS_URL_LIVE or VITE_USS_URL_TEST in your Vite env.",
      );
      isConnectingRef.current = false;
      return;
    }

    const wsUrl = buildWebSocketUrl(token);
    const safeWsUrl = sanitizeWebSocketUrl(wsUrl);

    if (!wsUrl) {
      console.error("Unable to build websocket URL.");
      isConnectingRef.current = false;
      return;
    }

    const newSocket = new WebSocket(wsUrl);
    wsRef.current = newSocket;

    newSocket.onopen = () => {
      if (wsRef.current !== newSocket) return;
      console.info("WebSocket connected:", safeWsUrl);
      setIsConnected(true);
      setSocket(newSocket);
      isConnectingRef.current = false;
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error("Error parsing ws message", error);
      }
    };

    newSocket.onclose = (event) => {
      if (wsRef.current === newSocket) {
        wsRef.current = null;
      }
      console.error("WebSocket closed:", {
        url: safeWsUrl,
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      setIsConnected(false);
      setSocket(null);
      isConnectingRef.current = false;
    };

    newSocket.onerror = (event) => {
      if (wsRef.current === newSocket) {
        wsRef.current = null;
      }
      console.error("WebSocket error:", {
        url: safeWsUrl,
        readyState: newSocket.readyState,
        event,
      });
      setIsConnected(false);
      isConnectingRef.current = false;
    };

    return () => {
      if (wsRef.current === newSocket) {
        wsRef.current = null;
      }
      isConnectingRef.current = false;

      if (
        newSocket &&
        (newSocket.readyState === WebSocket.CONNECTING ||
          newSocket.readyState === WebSocket.OPEN)
      ) {
        newSocket.close(1000, "Component unmounting");
      }
    };
  }, [token, handleWebSocketMessage]);

  return {
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
  };
};
