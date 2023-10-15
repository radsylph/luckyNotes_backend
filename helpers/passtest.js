import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";

const verifyPassword = async (password, user_info) => {
  const usuario = await Usuario.findOne({
    $or: [{ email: user_info }, { username: user_info }],
  }).exec();
  console.log(usuario); 
  if (!usuario) {
    return false;
  }
  const result = await bcrypt.compare(password, usuario.password);
  console.log(result); 
  return result;
};

export default verifyPassword;
