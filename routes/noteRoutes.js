import Express from "express";
import getUserInfo from "../middlewares/ProtectRutes.js";

import {
  createNote,
  editNote,
  test2,
  userInfo,
  showNotes,
  showFavNotes,
  createSerie,
  addNoteToSerie,
  showSerieNotes,
} from "../controllers/noteControllers.js";

const router = Express.Router();

router.route("/create_note").post(getUserInfo, createNote);
router.route("/edit_note/:id").post(getUserInfo, editNote);
router.route("/user").get(showNotes);
router.route("/Fav").post(getUserInfo, showFavNotes);
router.route("/create_series").post(getUserInfo, createSerie);
router.route("/addNote/:id").post(getUserInfo, addNoteToSerie);
router.route("/series/:id").post(getUserInfo, showSerieNotes);

export default router;
