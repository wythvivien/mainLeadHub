// Connecting MongoDb Config
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Establishing a connection to MongoDB Database 
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Console log connection details
    console.log(`MongoDB Connect: ${conn.connection.host}`);
  } catch (error) {
    console.error(`${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
