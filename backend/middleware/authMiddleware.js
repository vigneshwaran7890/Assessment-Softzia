import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    console.log("Verifying token...");
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    
    if (!authHeader) {
      console.error('No authorization header found');
      return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    
    if (!token) {
      console.error('No token found in authorization header');
      return res.status(403).json({ message: "No token provided" });
    }

    console.log('Token found, verifying...');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ 
          message: "Invalid or expired token",
          error: err.message 
        });
      }
      
      console.log('Token verified, user:', decoded);
      
      // Ensure we have a valid user ID
      if (!decoded.id) {
        console.error('No user ID found in token');
        return res.status(401).json({ 
          message: "Invalid token: No user ID found" 
        });
      }
      
      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
      
      console.log('User authenticated:', req.user);
      next();
    });
  } catch (error) {
    console.error('Error in verifyToken middleware:', error);
    return res.status(500).json({ 
      message: "Authentication error",
      error: error.message 
    });
  }
};


