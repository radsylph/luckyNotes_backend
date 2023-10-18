import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const getUserInfo = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "Token is required",
      status: 405,
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await Usuario.findById(decoded.id);
    console.log(user);
    if (user) {
      req.user = user;
    } else {
      return res.status(400).json({
        message: "User not found",
        status: 400,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "you have to login again",
      status: 500,
    });
  }
  next();
};

export default getUserInfo;
