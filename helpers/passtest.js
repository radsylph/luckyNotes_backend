import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";

const verifyPassword = async (password, email) => {
  const usuario = await Usuario.findOne({ email: email }).exec();
  console.log(usuario); // log the usuario object to check if the password property is set correctly
  if (!usuario) {
    return false;
  }
  const result = await bcrypt.compare(password, usuario.password);
  console.log(result); // log the result of the bcrypt.compare method to check if it is true or false
  return result;
};

export default verifyPassword;
