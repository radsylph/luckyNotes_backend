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
  setFavorite,
  showSeries,
  deleteNote,
  deleteSerie,
} from "../controllers/noteControllers.js";

const router = Express.Router();

router.route("/create_note").post(getUserInfo, createNote);
router.route("/edit_note/:id").post(getUserInfo, editNote); //cambiar a put
router.route("/user").get(getUserInfo, showNotes);
router.route("/Fav").get(getUserInfo, showFavNotes);
router.route("/series").get(getUserInfo, showSeries);
router.route("/create_series").post(getUserInfo, createSerie);
router.route("/set_fav/:id").patch(getUserInfo, setFavorite);
router.route("/addNote/:id").post(getUserInfo, addNoteToSerie); //cambiar a patch
router.route("/series/:SerieId").get(getUserInfo, showSerieNotes);
router.route("/delete_note/:id").delete(getUserInfo, deleteNote);
router.route("/delete_serie/:id").delete(getUserInfo, deleteSerie);

export default router;
