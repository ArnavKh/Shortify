import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./src/.env" });

export async function connect() {
  try {
    const mongoUri = process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error("MONGO_URL environment variable is not defined");
    }

    await mongoose.connect(mongoUri);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Error in database connection:", error);
    process.exit(1); // Exit process with a failure code
  }
}
