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
  session.confirmAccount(req, res);
};

const testingpug = (req, res) => {
  res.render("auth/confirm_account", {
    title: "confirm your account",
    pagina: "Your account is now confirmed",
  });
};
export { createUser, createForm, confirmAccount, testingpug };
