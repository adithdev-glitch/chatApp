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

  // Send a message
  const sendMessages = async ({ text, image }) => {
    if (!selectedUser) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/message/send/${selectedUser._id}`,
        { text, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // No need to append manually; socket will handle it
      // But if you want immediate update for sender:
      setMessagesMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(res.data._id, res.data);
        return newMap;
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
      toast.success("Chat cleared successfully");
    } catch (error) {
      console.error("Clear chat error:", error);
      toast.error(error?.response?.data?.error || "Failed to clear chat");
    }
  }

  // Handle real-time messages
  useEffect(() => {
    if (!socket || !selectedUser || !user) return;

    const handleNewMessage = (newMessage) => {
      if (!newMessage?._id) return;

      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        setMessagesMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(newMessage._id, newMessage); // automatically deduplicates
          return newMap;
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Clear previous messages and load chat history
    setMessagesMap(new Map());
    getMessages(selectedUser._id);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser?._id, user]);


  return (
    <MsgContext.Provider
      value={{
        fetchUsers,
        filteresUser,
        setFilteresUser,
        selectedUser,
        setSelectedUser,
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
