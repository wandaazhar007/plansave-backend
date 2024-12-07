import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Get the token from "Bearer <token>"

  if (!token) {
    return res.status(401).send({ message: "Access token is required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid or expired token." });
  }
};