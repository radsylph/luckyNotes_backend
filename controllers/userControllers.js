import { SessionManager } from "../components/SessionManager.js";
const session = new SessionManager();

const createUser = (req, res) => {
  session.createUser(req, res);
};

const createForm = (req, res) => {
  return res.json({
    message: "Formulario de registro",
    status: 200,
  });
};

const confirmAccount = (req, res) => {
  session.verifyUser(req, res);
};

const login = (req, res) => {
  // session.loginVerify(req, res);
  session.login(req, res);
};

const testingpug = (req, res) => {
  res.render("auth/confirm_account", {
    title: "confirm your account",
    pagina: "Your account is now confirmed",
  });
};

const formReset = (req, res) => {
  res.render("auth/reset_password", {
    title: "Reset your password",
    pagina: "Reset your password",
  });
};

const resetPassword = (req, res) => {
  session.resetPassword(req, res);
};

const newPassword = (req, res) => {
  session.verifyNewPassword(req, res);
};

const verifyPassword = (req, res) => {
  session.checkResetPassword(req, res);
};

const pugTest1 = (req, res) => {
  res.render("auth/confirm_account", {
    title: "confirm your account",
    pagina: "Your account is now confirmed",
  });
};

const pugTest2 = (req, res) => {
  res.render("auth/reset_password", {
    title: "Reset your password",
    pagina: "Reset your password",
  });
};

const pugTest3 = (req, res) => {
  res.render("auth/set_new_password", {
    title: "Reset your password",
    pagina: "Reset your password",
  });
};

export {
  createUser,
  createForm,
  confirmAccount,
  testingpug,
  resetPassword,
  formReset,
  newPassword,
  verifyPassword,
  login,
  pugTest1,
  pugTest2,
  pugTest3,
};
