import crypto from "crypto";
import jwt from "jsonwebtoken";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateToken1 = () => {
  const token = crypto.randomBytes(10).toString("hex");
  console.log(token);
  return token;
};

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/*const generateToken2 = () => {
  let x = Math.random().toString(36).substring(2, 15) + Date.now().toString(32);
  console.log(x);
  return x;
};*/

export { generateToken1, generateJWT };
