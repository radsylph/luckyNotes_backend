import Note from "../models/Nota.js";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

class NoteManager {
  constructor() {}

  async getUserInfo(req, res) {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await Usuario.findById(decoded.id);
    console.log(user);
  }

  async createNote(req, res) {
    await check("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 300 })
      .withMessage("The title is to long")
      .run(req);
    await check("content")
      .notEmpty()
      .withMessage("Content is required")
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "you have the following errors",
        errors: errors.array(),
      });
    }
    const { title, content, SerieId, favorite, trash, owner } = req.body;
    const decoded = jwt.verify(owner, process.env.SECRET);
    console.log(decoded);
    return res.status(201).json({
      message: "Note created",
      status: 201,
    });
  }

  async test(req, res) {
    return res.status(201).json({
      message: "Note created",
      status: 201,
    });
  }
}

export { NoteManager };
