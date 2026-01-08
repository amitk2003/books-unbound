// import jwt from "jsonwebtoken";
// import dotenv from 'dotenv'
// dotenv.config()
// const authToken = (req, res, next) => {
//   const secret_code=process.env.JWT_AUTH_TOKEN
//   const authHeader = req.headers["authorization"];
//   console.log('Incoming auth header:', authHeader);  // Add this
//   if (!authHeader) {
//     return res.status(401).json({ message: "Authorization header missing" });
//   }
//   //  trim whitespace
//   const trimmedHeader=authHeader.trim() // removes leading and trailing white saces
//   let token=trimmedHeader
//   if(trimmedHeader.startsWith('Bearer')){
//     token=trimmedHeader.slice(7).trim();
//   } else if(trimmedHeader.startsWith('Bearer')){
//     token=trimmedHeader.slice(6).trim()
//     console.warn('warning: Bearer prefix missing space -fixed automatically')
//   }
//   console.log('Extracted token:', token ? 'Present' : 'Missing');  // Add this
//   if (!token) {
//     return res.status(401).json({ message: "Authentication token required" });
//   }


//   jwt.verify(token, secret_code, (err, decoded) => {
//     if (err) {
//       console.error('JWT verify error:', err.message);  // Add this
//       return res
//         .status(403)
//         .json({ message: "Token expired or invalid, please login again" });
//     }
    
//     console.log('Decoded user:', decoded);  // Add this (should show { id: '...' })
//     req.user = decoded;
//     next();
//   });
// };

// export default authToken;
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const authToken = (req, res, next) => {
  const currentSecret = process.env.JWT_AUTH_TOKEN;
  const previousSecret = "bookstore234"; // old secret hardcoded for migration
  const authHeader = req.headers["authorization"];
  console.log('Incoming auth header:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const trimmedHeader = authHeader.trim();
  let token = trimmedHeader;
  if (trimmedHeader.startsWith('Bearer ')) {
    token = trimmedHeader.slice(7).trim();
  } else if (trimmedHeader.startsWith('Bearer')) {
    token = trimmedHeader.slice(6).trim();
    console.warn('warning: Bearer prefix missing space - fixed automatically');
  }
  console.log('Extracted token:', token ? 'Present' : 'Missing');
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, currentSecret, (err, decoded) => {
    if (err) {
      // If verification with current secret fails, try previous secret
      jwt.verify(token, previousSecret, (errPrev, decodedPrev) => {
        if (errPrev) {
          console.error('JWT verify error:', errPrev.message);
          return res.status(403).json({ message: "Token expired or invalid, please login again" });
        }
        console.log('Token verified with previous secret:', decodedPrev);
        req.user = decodedPrev;
        next();
      });
    } else {
      console.log('Token verified with current secret:', decoded);
      req.user = decoded;
      next();
    }
  });
};

export default authToken;
