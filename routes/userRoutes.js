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

const router = Express.Router();

router.route("/create").get(createForm).post(createUser);
router.route("/login").post(login);
router.route("/confirm/:token").get(confirmAccount);
router.route("/testingpug").get(testingpug);
router.route("/reset_password").get(formReset).post(resetPassword);
router.route("/reset_password/:token").get(verifyPassword).post(newPassword);
router.route("reset_passwordpug/:token");
export default router;
