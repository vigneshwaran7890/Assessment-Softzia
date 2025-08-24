// seedUsers.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/userModel.js"; // adjust path if needed

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Seed function
const seedUsers = async () => {
  try {
    // Remove existing users
    await User.deleteMany({});
    console.log("🗑 Existing users removed");

    // Hash passwords
    const password1 = await bcrypt.hash("123", 10);
    const password2 = await bcrypt.hash("admin123", 10);

    // Create two users
    const users = [
      {
        name: "vignesh",
        email: "vignesh@gmail.com",
        password: password1,
        title: "Software Engineer",
        role: "user",
      },
      {
        name: "Admin User",
        email: "admin@gmail.com",
        password: password2,
        title: "Admin Manager",
        role: "admin",
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log("✅ Users seeded:", createdUsers);

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(seedUsers);
