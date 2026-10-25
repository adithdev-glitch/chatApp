import express from 'express';
import "dotenv/config.js";
import userRoutes from './src/routes/User.js';
import messageRoutes from './src/routes/Message.js';
import connectDB from './src/DB/db.js';
import cors from 'cors';

import { app, server } from "./src/middleware/Socket.js";
const PORT = process.env.PORT || 8080;


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

connectDB();

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
