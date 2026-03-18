module.exports = (req, res, next) => {
  console.log("ADMIN CHECK USER:", req.user);
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};