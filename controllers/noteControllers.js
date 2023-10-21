import { NoteManager } from "../components/NoteManager.js";

const note = new NoteManager();

const createNote = (req, res) => {
  note.createNote(req, res);
};

const test2 = (req, res) => {
  note.test(req, res);
};

const userInfo = (req, res) => {
  note.test3(req, res);
};

const editNote = (req, res) => {
  note.editNote(req, res);
};

const showNotes = (req, res) => {
  note.showNotes(req, res);
};

const showFavNotes = (req, res) => {
  note.showFavNotes(req, res);
};

const createSerie = (req, res) => {
  note.createSerie(req, res);
};

const showSeries = (req, res) => {
  note.showSeries(req, res);
};

const addNoteToSerie = (req, res) => {
  note.addNoteToSerie(req, res);
};

const showSerieNotes = (req, res) => {
  note.showSerieNotes(req, res);
};

const setFavorite = (req, res) => {
  note.setFavorite(req, res);
};

const deleteNote = (req, res) => {
  note.deleteNote(req, res);
};

const deleteSerie = (req, res) => {
  note.deleteSerie(req, res);
};

export {
  test2,
  userInfo,
  editNote,
  createNote,
  showNotes,
  showFavNotes,
  createSerie,
  addNoteToSerie,
  showSerieNotes,
  setFavorite,
  showSeries,
  deleteNote,
  deleteSerie,
};
