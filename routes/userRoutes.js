import Express from "express";
import {
  createUser,
  createForm,
  confirmAccount,
  testingpug,
} from "../controllers/userControllers.js";

const router = Express.Router();

router.route("/create").get(createForm).post(createUser);
router.route("/confirm/:token").get(confirmAccount);
router.route("/testingpug").get(testingpug);

export default router;
