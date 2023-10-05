import { SessionManager } from "../components/SessionManager.js";
const session = new SessionManager();

const createUser = async (req, res) => {
  await session.createUser(req, res);
};

const createForm = (req, res) => {
  return res.send("aqui va la vista para crear usuarios");
};
export { createUser, createForm };
