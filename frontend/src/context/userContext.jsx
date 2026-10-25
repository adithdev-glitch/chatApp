import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import { SERVER_URL } from "../library/constants";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const serverUrl = SERVER_URL;

  async function login(email, password, navigate) {
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      navigate("/home");
    } catch (error) {
      setIsAuth(false);
      toast.error(error.response.data.message);
    }
  }

  async function register(name, email, password) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
  
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }
  
    if (!passRegex.test(password)) {
      toast.error("Password must be at least 8 characters and include a number");
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/api/user/register`, {
        name,
        email,
        password
      });
      toast.success("Registered successfully. Please login.");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");
  
      const { data } = await axios.get(`${SERVER_URL}/api/user/fetch-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAuth(true);
      setUser(data.user);
    } catch (error) {
    }
  }
  

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
    disconnectSocket();
  };

  function connectSocket(user) {
    if (!user || socket?.connected) return;

    const newSocket = io(serverUrl, {
      query: { userId: user._id },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("ONLINE USERS:", userIds);
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  }

  function disconnectSocket() {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }

  // Connect once when user is ready
  useEffect(() => {
    if (user) connectSocket(user);

    return () => disconnectSocket(); // cleanup on logout / unmount
  }, [user?._id]);
  
  
  async function disconnectSocket() {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    } 
  }

  return (
    <UserContext.Provider value={{ isAuth, user, login,register, logout,onlineUsers, setOnlineUsers,socket, connectSocket,disconnectSocket }}>
      {children}
    </UserContext.Provider>
  );
};

