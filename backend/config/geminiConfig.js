// geminiConfig.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

// Get API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing in .env file");
}

// Initialize client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Choose a model (you can change later)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export { genAI, model };
c