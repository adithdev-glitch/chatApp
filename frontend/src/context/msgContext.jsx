import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "./userContext";

// Create context
export const MsgContext = createContext();

// Provider
export const MsgProvider = ({ children }) => {
  const { socket, user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [filteresUser, setFilteresUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Use Map to prevent duplicate messages
  const [messagesMap, setMessagesMap] = useState(new Map());

  // Convert Map to array for rendering
  const messages = Array.from(messagesMap.values());

  // Fetch all users except current user
  async function fetchUsers() {
    try {
      const response = await axios.get("http://localhost:8080/api/message/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteresUser(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  // Load messages with a selected user
  const getMessages = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/message/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newMap = new Map(res.data.map((m) => [m._id, m]));
      setMessagesMap(newMap);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to load messages");
    }
  };

  // Select user and clear unread badge
  const selectConversation = (u) => {
    setSelectedUser(u);
    if (u?._id) {
      setUnreadCounts((prev) => {
        if (!prev[u._id]) return prev;
        const next = { ...prev };
        delete next[u._id];
        return next;
      });
    }
  };

  // Send a message
  const sendMessages = async ({ text, image }) => {
    if (!selectedUser) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/message/send/${selectedUser._id}`,
        { text, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Append immediately for sender
      setMessagesMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(res.data._id, res.data);
        return newMap;
      });

      // Update sidebar last message immediately
      setFilteresUser((prev) => {
        if (!prev) return prev;
        const updated = prev.map((u) => {
          if (u._id === selectedUser._id) {
            return {
              ...u,
              lastMessage: {
                text: res.data.text,
                image: !!res.data.image,
                senderId: user?._id,
                createdAt: res.data.createdAt || new Date().toISOString(),
              },
            };
          }
          return u;
        });

        // Re-sort with most recent message at top
        return updated.sort((a, b) => {
          const timeA = a.lastMessage?.createdAt
            ? new Date(a.lastMessage.createdAt).getTime()
            : 0;
          const timeB = b.lastMessage?.createdAt
            ? new Date(b.lastMessage.createdAt).getTime()
            : 0;
          return timeB - timeA;
        });
      });
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error?.response?.data?.error || "Failed to send message");
    }
  };

  const clearChat = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/message/clear/${selectedUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessagesMap(new Map()); // Clear local messages

      // Clear lastMessage in sidebar as well
      setFilteresUser((prev) => {
        if (!prev) return prev;
        return prev.map((u) =>
          u._id === selectedUser._id ? { ...u, lastMessage: null } : u
        );
      });

      toast.success("Chat cleared successfully");
    } catch (error) {
      console.error("Clear chat error:", error);
      toast.error(error?.response?.data?.error || "Failed to clear chat");
    }
  };

  // Load chat messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      setMessagesMap(new Map());
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id]);

  // Handle real-time incoming and outgoing messages
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (newMessage) => {
      if (!newMessage?._id) return;

      const otherUserId =
        newMessage.senderId === user._id
          ? newMessage.receiverId
          : newMessage.senderId;

      // 1. If currently chatting with this user, update the open chat window
      if (
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id)
      ) {
        setMessagesMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(newMessage._id, newMessage);
          return newMap;
        });
      }

      // 2. If message is incoming from another user
      if (newMessage.senderId !== user._id) {
        // If chat with sender is not currently open, increment unread count
        if (!selectedUser || selectedUser._id !== newMessage.senderId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
        }
      }

      // 3. Update the last message in sidebar and re-sort
      setFilteresUser((prev) => {
        if (!prev) return prev;
        const updated = prev.map((u) => {
          if (u._id === otherUserId) {
            return {
              ...u,
              lastMessage: {
                text: newMessage.text,
                image: !!newMessage.image,
                senderId: newMessage.senderId,
                createdAt: newMessage.createdAt || new Date().toISOString(),
              },
            };
          }
          return u;
        });

        return updated.sort((a, b) => {
          const timeA = a.lastMessage?.createdAt
            ? new Date(a.lastMessage.createdAt).getTime()
            : 0;
          const timeB = b.lastMessage?.createdAt
            ? new Date(b.lastMessage.createdAt).getTime()
            : 0;
          return timeB - timeA;
        });
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, user]);

  return (
    <MsgContext.Provider
      value={{
        fetchUsers,
        filteresUser,
        setFilteresUser,
        selectedUser,
        setSelectedUser: selectConversation,
        unreadCounts,
        setUnreadCounts,
        messages,
        setMessagesMap,
        sendMessages,
        getMessages,
        clearChat,
      }}
    >
      {children}
    </MsgContext.Provider>
  );
};
