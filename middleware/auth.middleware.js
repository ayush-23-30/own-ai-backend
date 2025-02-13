import jwt from "jsonwebtoken";
import redisClient from "../services/redis.services.js";

export const authUser = async (req, res, next) => {
  try {
    // Extract token from cookies or authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log("No token provided in Auth middleware.");
      return res.status(401).send({
        error: "Please authenticate",
      });
    }

    // Check if the token is blacklisted
    const isBlackListed = await redisClient.get(token);
    if (isBlackListed) {
      console.log("Token is blacklisted.");
      res.cookie("token", ""); // Clear token in cookies
      return res.status(401).send({
        error: "Token has been blacklisted. Please authenticate again.",
      });
    }

    // Verify token and decode user info
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded; // Attach decoded user info to the request object

    next(); 
  } catch (error) {
    console.error("Error in Auth middleware:", error.message);
    res.status(401).send({
      error: "Please authenticate",
    });
  }
};
