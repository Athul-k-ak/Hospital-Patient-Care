exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("User role from token:", req.user.role); // Debug log
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};
