import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  },
});

// userId -> Set of socketIds
const userSocketMap = new Map();

export const getReceiverSocketIds = (userId) => {
  return userSocketMap.get(userId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    socket.join(userId);

    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }

    userSocketMap.get(userId).add(socket.id);
  }

  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId && userSocketMap.has(userId)) {
      userSocketMap.get(userId).delete(socket.id);

      if (userSocketMap.get(userId).size === 0) {
        userSocketMap.delete(userId);
      }
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };
