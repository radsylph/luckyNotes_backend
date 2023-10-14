import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import { generateToken1, generateJWT } from "../helpers/generateToken.js";
import { emailRegistro, emailReset } from "../helpers/mails.js";
import { check, validationResult } from "express-validator";

class SessionManager {
  constructor() {}

  async createUser(req, res) {
    await check("name").notEmpty().withMessage("Name is required").run(req);
    await check("lastname")
      .notEmpty()
      .withMessage("Lastname is required")
      .run(req);
    await check("username")
      .notEmpty()
      .withMessage("Username is required")
      .run(req);
    await check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "Error al crear el usuario",
        error: result.array(),
      });
    }

    console.log(req.body);
    try {
      const { name, lastname, username, email, password } = req.body;
      console.log(req.body);

      const ExisteUsuario = await Usuario.findOne({ email: email }).exec();

      if (ExisteUsuario) {
        return res.status(400).json({
          message: "El usuario ya existe",
        });
      }

      const usuario = new Usuario({
        name,
        lastname,
        email,
        username,
        password,
        token: generateToken1(),
        confirmado: false,
      });

      await usuario.save();

      emailRegistro({
        email: usuario.email,
        nombre: usuario.name,
        token: usuario.token,
      });

      return res.status(200).json({
        message: "Usuario creado",
        status: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error al crear el usuario",
        error: error,
      });
    }
  }

  async verifyUser(req, res) {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ token: token }).exec();
    console.log(token);
    if (!usuario) {
      return res.render("auth/confirm_account", {
        pagina: "Authentication error",
        mensaje:
          "There has been an error when trying to confirm your account, try again",
        error: true,
      });
    }

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    return res.render("auth/confirm_account", {
      pagina: "Account confirmed",
      mensaje:
        "Your account has been successfully confirmed, you can now log in !",
      error: false,
    });
  }

  async resetPassword(req, res) {
    const { email } = req.body;
    await check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .run(req);

    let result = validationResult(req);
    // if (!result.isEmpty()) {
    //   return res.status(400).json({
    //     message: "Error al crear el usuario",
    //     errors: result.array(),
    //   });
    // }

    if (!result.isEmpty()) {
      return res.render("auth/reset_password", {
        pagina: "Reset Password",
        errores: result.array(),
        usuario: {
          email: email,
        },
      });
    }

    const usuario = await Usuario.findOne({ email: email }).exec();
    if (!usuario) {
      return res.render("auth/reset_password", {
        pagina: "Reset Password",
        serrores: [
          {
            msg: "The email is not registered",
          },
        ],
        usuario: {
          email: email,
        },
      });
    }

    usuario.token = generateToken1();
    await usuario.save();
    emailReset({
      email: usuario.email,
      nombre: usuario.name,
      token: usuario.token,
    });

    res.render("templates/mensajes", {
      pagina: "Reset Password",
      mensaje: "we have send a mail to your email",
    });
  }

  async checkResetPassword(req, res) {
    const token = req.params;
    const usuario = await Usuario.findOne({ token: token }).exec();

    if (!usuario) {
      return res.render("auth/reset_password", {
        pagina: "Reset Password",
        serrores: [
          {
            msg: "The email is not registered",
          },
        ],
        usuario: {
          email: email,
        },
      });
    }

    res.render("auth/set_new_password", {
      pagina: "Set new password",
      usuario: {
        token: token,
      },
    });
  }

  async verifyNewPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    await check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .notEmpty()
      .withMessage("Password is required")
      .run(req);
    await check("repeat_password")
      .equals(password)
      .withMessage("the passwords doesn't match")
      .run(req);

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

export { SessionManager };
