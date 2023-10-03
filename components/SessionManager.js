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

    //aqui poner el email de registro

    return res.status(201).json({
      message: "Usuario creado",
    });
  }

  async verifyUse(req, res) {
    const token = req.params;
    const usuario = await Usuario.findOne({ token: token }).exec();

    if (!usuario) {
      return res.status(400).json({
        message: "El usuario no existe",
      });
    }

    usuario.confirmado = true;
    usuario.token = null;
    await usuario.save();

    return res.status(200).json({
      message: "Usuario confirmado",
    });
  }

  async resetPassword(req, res) {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ email: email }).exec();
    if (!usuario) {
      return res.status(400).json({
        message: "El usuario no existe",
      });
    }

    usuario.token = generateToken1();
    await usuario.save();
    //enviar mail para resettear password
  }

  async checkResetPassword(req, res) {
    const token = req.params;
    const usuario = await Usuario.findOne({ token: token }).exec();

    if (!usuario) {
      return res.status(400).json({
        message: "El usuario no existe",
      });
    }

    //retorno el formulario para cambiar la contrase;a o no se
  }

  async verifyNewPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token: token }).exec();
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();
    return res.status(200).json({
      message: "Contraseña cambiada",
    });
  }

  async loginVerify(req, res) {
    //validations for the front
  }

  async login(req, res) {
    const { email, password, username } = req.body;
    const usuario = await Usuario.findOne({ email: email }).exec();
    const usuario2 = await Usuario.findOne({ username: username }).exec();
    if (!usuario || !usuario2) {
      return res.status(400).json({
        message: "El usuario no existe",
      });
    }
    if (!usuario.confirmado) {
      return res.status(400).json({
        message: "El usuario no esta confirmado",
      });
    }
    if (!usuario.verificarPassword(password)) {
      return res.status(400).json({
        message: "Contraseña incorrecta",
      });
    }
    //const token = generateJWT(usuario.id); //revisar como se genera el token con el id de mongo
    return res.status(200).json({
      message: "Usuario logeado",
      //token: token,
    });
  }

  closeSession(req, res) {
    //destruir el token
  }
}
