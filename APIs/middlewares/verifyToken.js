//verifyToken.js middleware
const jwt = require("jsonwebtoken");
require("dotenv").config()

const verifyToken = (request, response, next) => {
  // Token verification logic

  // Get bearer token from headers of req
  let bearerToken = request.headers.authorization;

  // If bearer token is not existed, unauthorized req
  if (bearerToken === undefined) {
    return response.status(401).json({ message: "Unauthorized request" });
  }

  // If bearer token is existed, get token
  const token = bearerToken.split(" ")[1];

  // Verify token using the secret key
  try {
    const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
    request.user = decodedUser;
    next(); // If token is valid, allow access to the protected route
  } catch (err) {
    return response.status(401).json({ message: "Token verification failed", error: err.message });
  }
};

module.exports = verifyToken;