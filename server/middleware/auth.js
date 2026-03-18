const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization; // ✅ lowercase

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token. Authorization denied." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("Decoded token in middleware:", decoded);
    const user = await User.findById(decoded.id).select("-password");
console.log("User found in DB:", user);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user; // attach user object
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};