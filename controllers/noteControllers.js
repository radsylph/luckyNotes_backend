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

export { test2, userInfo, editNote, createNote, showNotes, showFavNotes };
