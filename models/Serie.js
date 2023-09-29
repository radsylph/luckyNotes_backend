import mongoose from "mongoose";

const serieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    noteId: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Serie = mongoose.model("Serie", serieSchema);

export default Serie;
