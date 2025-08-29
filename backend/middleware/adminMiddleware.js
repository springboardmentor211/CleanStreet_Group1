const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ msg: "Access denied: Admins only" });
  }
};

module.exports = adminMiddleware;
// This middleware assumes that authMiddleware has already run
// and attached the user object to req (i.e., req.user).
// Make sure to use authMiddleware before adminMiddleware in your routes. 