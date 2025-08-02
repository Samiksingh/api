import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.module.js";

const isAuth = async (request, response, next) => {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response
      .status(401)
      .json({ status: false, message: "not authenticated" });
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    if (!decoded.UserId) {
      return response.status(401).json({ status: false, message: "invalid token" });
    }

    const user = await User.findById(decoded.UserId).select("-password");

    if (!user) {
      return response.status(401).json({ status: false, message: "user not found" });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({ status: false, message: "invalid token" });
  }
};

export default isAuth;
