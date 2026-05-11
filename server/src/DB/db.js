import mongoose from 'mongoose';
import "dotenv/config.js";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB);
        console.log("MongoDB connected");
    }catch(err){
        console.error("MongoDB connection error:", err);
    }
}
 export default connectDB;