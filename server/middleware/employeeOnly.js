module.exports = (req, res, next) => {
  if (req.user?.role !== 'employee') {
    return res.status(403).json({ msg: 'Access denied. Employees only.' });
  }
  next();
};