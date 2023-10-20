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
  pugTest1,
  pugTest2,
  pugTest3,
  getUser,
  editUser,
} from "../controllers/userControllers.js";
import getUserInfo from "../middlewares/ProtectRutes.js";

const router = Express.Router();

router.route("/create").get(createForm).post(createUser);
router.route("/login").post(login);
router.route("/confirm/:token").get(confirmAccount);
router.route("/testingpug").get(testingpug);
router.route("/reset_password").get(formReset).post(resetPassword);
router.route("/reset_password/:token").get(verifyPassword).post(newPassword);
router.route("/getUser").get(getUserInfo, getUser);
router.route("/editUser").put(getUserInfo, editUser);

router.get("/pugtest1", pugTest1);
router.get("/pugtest2", pugTest2);
router.get("/pugtest3", pugTest3);

export default router;
