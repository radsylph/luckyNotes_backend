import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    SerieId: {
      type: String,
      required: false,
    },
    favorite: {
      type: Boolean,
      required: false,
    },
    trash: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
