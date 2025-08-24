import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";

// ✅ GET /auth/people
export const getPeople = async (req, res) => {
  try {
    const people = await Users.find().populate("company_id");
    res.json(people);
  } catch (err) {
    console.error("❌ Error fetching people:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ POST /auth/people (Register)
export const createPerson = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const person = new Users({
      ...rest,
      password: hashedPassword,
    });

    await person.save();

    // Generate JWT on signup
    const token = jwt.sign({ id: person._id, email: person.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    res.status(201).json({
      message: "Person created successfully",
      token,
      person: {
        id: person._id,
        name: person.name,
        email: person.email,
      },
    });
  } catch (err) {
    console.error("❌ Error creating person:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ POST /auth/login
export const loginPerson = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const person = await Users.findOne({ email });
    if (!person) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, person.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: person._id, email: person.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    res.json({
      message: "Login successful",
      token,
      person: {
        id: person._id,
        name: person.name,
        full_name: person.full_name,
        email: person.email,
      },
    });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ message: "Server error" });
  }
};
