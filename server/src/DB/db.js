import mongoose from 'mongoose';
import "dotenv/config.js";
import dns from 'node:dns';

// Fix for Node.js / macOS querySrv ECONNREFUSED with MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB);
        console.log("MongoDB connected");
    }catch(err){
        console.error("MongoDB connection error:", err);
    }
}
 export default connectDB;