import { generateToken } from "../DB/Token.js";
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import cloudinary from '../middleware/Cloudinary.js';

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        console.log(req.body);
        console.log(email, password, name);
        if(!email || !password || !name) {
            return res.status(400).json({ error: "Email, password and name are required" });
        }

        if(password.length < 8){
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ email, password : hashedPassword, name });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const login = async (req, res) => {
    try {
  
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      
      
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
    const token = generateToken(user._id);

    res.status(200).json({
        message: "Login successful",
        token, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  export const updateProfile = async (req, res) => {
    try {
      const { name } = req.body;
      const userId = req.user.id;
  
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      // upload buffer to cloudinary
      const uploadFromBuffer = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_pics" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
  
      const result = await uploadFromBuffer(req.file.buffer);
      const imageUrl = result.secure_url;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {name: name, profilepic: imageUrl },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
      });
  
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
  };
  
  

export const fetchUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  