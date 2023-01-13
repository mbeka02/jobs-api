//import User from "../models/User.js";
import jwt from "jsonwebtoken";
import UnauthenticatedError from "../errors/unauthenticated.js";
import dotenv from "dotenv";
dotenv.config();

const authenticationMiddleware = async (req, res, next) => {
  const AuthHeader = req.headers.authorization;

  if (!AuthHeader || !AuthHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError(
      "You do not have permission to access this content"
    );
  }

  const token = AuthHeader.split(" ")[1];

  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: verifiedToken.userId, name: verifiedToken.name };
    next();
  } catch (error) {
    // console.log(error)
    throw new UnauthenticatedError("Authentication fail");
  }
};

export default authenticationMiddleware;
