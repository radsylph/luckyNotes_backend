import Express from "express";
import getUserInfo from "../middlewares/ProtectRutes.js";

import {
  createNote,
  editNote,
  test2,
  userInfo,
  showNotes,
  showFavNotes,
} from "../controllers/noteControllers.js";

const router = Express.Router();

router.route("/create_note").post(getUserInfo, createNote);
router.route("/edit_note/:id").post(getUserInfo, editNote);
router.route("/user").post(getUserInfo, showNotes);
router.route("/Fav").post(getUserInfo, showFavNotes);

export default router;
