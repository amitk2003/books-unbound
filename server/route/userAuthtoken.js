import jwt from "jsonwebtoken";

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, "bookstore234", (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token expired or invalid, please login again" });
    }
    req.user = decoded; // contains { id: user._id, ... }
    next();
  });
};

export default authToken;
