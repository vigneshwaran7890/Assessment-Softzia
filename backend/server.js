import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/userRoutes.js";
import BookRoutes from "./routes/bookRoutes.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(express.json());


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: "Softzia",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
    res.json({ message: "🚀 Backend is running!" });
});

// User routes
app.use('/api/auth', UserRoutes);

// Book routes
app.use('/api/books', BookRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
