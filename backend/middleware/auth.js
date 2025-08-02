import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.module";

const isAuth = async (request, response, next) => {
  const token = request.cookies.session;

  if (!token) {
    return response
      .status(401)
      .json({ status: false, message: "not authenticated" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

  if (!decodedtoken) {
    return response.status(401).json({ status: false, message: "invalid" });
  }

  const user = await User.FindById(decodedtoken.UserId).select("-password");

  if (!user) {
    return response.status(401).json({ status: false, message: "not found" });
  }

  request.user = user;
  next();
};

export default isAuth;
