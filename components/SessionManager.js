import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import {
  generateToken1,
  generateJWT,
  storeToken,
  removeToken,
} from "../helpers/generateToken.js";
import { emailRegistro, emailReset } from "../helpers/mails.js";
import { check, validationResult } from "express-validator";
import verifyPassword from "../helpers/passtest.js";

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
        errors: result.array(),
      });
    }

    console.log(req.body);
    try {
      const { name, lastname, username, email, password } = req.body;
      console.log(req.body);

      const ExisteUsuario = await Usuario.findOne({ email: email }).exec();

      if (ExisteUsuario) {
        return res.status(400).json({
          message: "there was these errors",
          error: [
            {
              type: "field",
              value: email,
              msg: "the email is already registered",
              path: "email",
              location: "body",
            },
          ],
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
        message: "there was these errors",
        error: [
          {
            type: "server",
            value: "",
            msg: "there was an error in the server",
            path: "",
            location: "",
          },
        ],
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
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "Error al crear el usuario",
        errors: result.array(),
      });
    }

    // if (!result.isEmpty()) {
    //   return res.render("auth/reset_password", {
    //     pagina: "Reset Password",
    //     errores: result.array(),
    //     usuario: {
    //       email: email,
    //     },
    //   });
    // }

    const usuario = await Usuario.findOne({ email: email }).exec();
    // if (!usuario) {
    //   return res.render("auth/reset_password", {
    //     pagina: "Reset Password",
    //     serrores: [
    //       {
    //         msg: "The email is not registered",
    //       },
    //     ],
    //     usuario: {
    //       email: email,
    //     },
    //   });
    // }
    if (!usuario) {
      return res.status(400).json({
        message: "there was these errors",
        error: [
          {
            type: "field",
            value: email,
            msg: "the email is not registered",
            path: "email",
            location: "body",
          },
        ],
      });
    }

    usuario.token = generateToken1();
    await usuario.save();
    emailReset({
      email: usuario.email,
      nombre: usuario.name,
      token: usuario.token,
    });

    return res.status(200).json({
      message: "we have send an mail to your email",
    });

    // res.render("templates/mensajes", {
    //   pagina: "Reset Password",
    //   mensaje: "we have send a mail to your email",
    // });
  }

  async checkResetPassword(req, res) {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ token: token }).exec();

    if (!usuario) {
      return res.render("auth/reset_password", {
        pagina: "Reset Password",
        errores: [
          {
            msg: "The email is not registered",
          },
        ],
      });
    }

    res.render("auth/set_new_password", {
      pagina: "Set new password",
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

    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.render("auth/set_new_password", {
        pagina: "Set new password",
        errores: result.array(),
      });
    }

    const usuario = await Usuario.findOne({ token: token }).exec();
    // const salt = await bcrypt.genSalt(10);
    // usuario.password = await bcrypt.hash(password, salt); //we encrypt the password
    usuario.password = password;
    usuario.token = null;
    await usuario.save();
    return res.status(200).json({
      message: "Contraseña cambiada",
    });
  }

  async loginVerify(req, res) {
    await check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("Password is required")
      .run(req);
    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "Error al crear el usuario",
        error: result.array(),
      });
    }
  }

  async login(req, res) {
    const { user_info, password } = req.body;
    await check("user_info")
      .notEmpty()
      .withMessage("Email or username is required")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("Password is required")
      .run(req);

    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "there was these errors",
        error: result.array(),
      });
    }
    const usuario = await Usuario.findOne({
      $or: [{ email: user_info }, { username: user_info }],
    }).exec();

    if (!usuario) {
      return res.status(400).json({
        message: "there was these errors",
        error: [
          {
            type: "field",
            value: "",
            msg: "the user doesn't exist",
            path: "user_info",
            location: "body",
          },
        ],
      });
    }
    if (!usuario.confirmado) {
      return res.status(400).json({
        message: "there was these errors",
        error: [
          {
            type: "field",
            value: user_info,
            msg: "the user isn't confirmed",
            path: "user_info",
            location: "body",
          },
        ],
      });
    }

    const passwordMatch = await verifyPassword(password, user_info);
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(400).json({
        message: "there was these errors",
        error: [
          {
            type: "field",
            value: password,
            msg: "the password is incorrect",
            path: "password",
            location: "body",
          },
        ],
      });
    }

    const token = generateJWT(usuario.id);
    console.log(usuario);
    // storeToken(token);
    return res.status(200).json({
      message: "Usuario logeado",
      token: token,
    });
  }

  closeSession(req, res) {
    removeToken();
    return res.status(200).json({
      message: "Sesion cerrada",
    });
  }
}

export { SessionManager };
