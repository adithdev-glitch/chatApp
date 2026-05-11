import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../middleware/Cloudinary.js";
import { getReceiverSocketIds } from "../middleware/Socket.js";
import { io } from "../middleware/Socket.js";


export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;       
    const senderId = req.user.id;    

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: id },
        { senderId: id, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 }); // oldest -> newest

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const allSockets = new Set([
      ...(getReceiverSocketIds(senderId) || []),
      ...(getReceiverSocketIds(receiverId) || []),
    ]);

    allSockets.forEach((socketId) => {
      io.to(socketId).emit("newMessage", newMessage);
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } });
        res.status(200).json(filteredUsers, { message: "Users fetched successfully" });
      } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
}

export const getChatImages = async (req, res) => {
  const userId = req.params.userId; 
  const currentUserId = req.user.id; // 

  try {
    
    const messages = await Message.find({
      image: { $exists: true, $ne: "" },
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: -1 }); // new 1st verum

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chat images" });
  }
};

export const clearChat = async (req, res) => {
  try {
    const {id} = req.params;
  const currentUserId = req.user.id;
  console.log("clear chat called with userId:", id, "currentUserId:", currentUserId);

  const clear = await Message.deleteMany({
    $or: [
      { senderId: id, receiverId: currentUserId },
      { senderId: currentUserId, receiverId: id }
    ]
  });
  
  console.log("Messages deleted:", clear.deletedCount);
  
  
  res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.log("cant clear");
  }
  
}