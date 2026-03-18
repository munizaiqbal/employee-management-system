const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Helper to generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET || "fallbackSecret";
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secret, options);
};

// ✅ Register new user (Admin or Employee)
const register = async (req, res) => {
  try {
    const { username, email, password, phone, dob, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ⚠️ NEW LOGIC: Determine role based on self-signup vs admin
    let finalRole = "employee"; // default for self-signup
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === "admin" && role) finalRole = role; // admin can assign role
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      dob,
      role: finalRole,
    });

    await newUser.save();

    const token = generateToken(newUser);
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// ✅ Login user (Admin or Employee)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user);
    console.log("Generated JWT payload:", jwt.decode(token));
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      msg: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// ✅ Get current user
const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Export all functions cleanly
module.exports = {
  register,
  login,
  getMe,
};
