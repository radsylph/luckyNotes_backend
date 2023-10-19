import Express from "express";
import {
  createUser,
  createForm,
  confirmAccount,
  testingpug,
  formReset,
  resetPassword,
  newPassword,
  verifyPassword,
  login,
} from "../controllers/userControllers.js";
import getUserInfo from "../middlewares/ProtectRutes.js";

const router = Express.Router();

router.route("/create").get(createForm).post(createUser);
router.route("/login").post(login);
router.route("/confirm/:token").get(confirmAccount);
router.route("/testingpug").get(testingpug);
router.route("/reset_password").get(formReset).post(resetPassword);
router.route("/reset_password/:token").get(verifyPassword).post(newPassword);

export default router;
