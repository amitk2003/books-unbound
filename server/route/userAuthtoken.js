import jwt from "jsonwebtoken";

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log('Incoming auth header:', authHeader);  // Add this
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log('Extracted token:', token ? 'Present' : 'Missing');  // Add this
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, "bookstore234", (err, decoded) => {
    if (err) {
      console.error('JWT verify error:', err.message);  // Add this
      return res
        .status(403)
        .json({ message: "Token expired or invalid, please login again" });
    }
    console.log('Decoded user:', decoded);  // Add this (should show { id: '...' })
    req.user = decoded;
    next();
  });
};

export default authToken;