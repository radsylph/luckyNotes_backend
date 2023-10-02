import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import { generateToken1, generateJWT } from "../helpers/generateToken.js";

class SessionManager {
  constructor() {}

  async createUser(req, res) {
    const { name, lastname, email, password } = req.body;

    const ExisteUsuario = await Usuario.findOne({ emil: email }).exec();

    if (ExisteUsuario) {
      return res.status(400).json({
        message: "El usuario ya existe",
      });
    }

    const usuario = new Usuario({
      name,
      lastname,
      email,
      password,
      token: generateToken1(),
    });
    await usuario.save();

  }

  async verifyUse(req, res) {
    
  }
}
