import { NoteManager } from "../components/NoteManager.js";

const note = new NoteManager();

const test = (req, res) => {
  note.createNote(req, res);
};

const test2 = (req, res) => {
  note.test(req, res);
};

export { test, test2
 };
