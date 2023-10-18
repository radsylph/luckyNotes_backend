import mongoose from "mongoose";

const serieSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    owner: {
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
