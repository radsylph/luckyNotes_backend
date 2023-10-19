import Note from "../models/Nota.js";
import Usuario from "../models/Usuario.js";
import Serie from "../models/Serie.js";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import dotenv from "dotenv";

class NoteManager {
  constructor() {}

  async createNote(req, res) {
    await check("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 300 })
      .withMessage("The title is too long")
      .run(req);
    await check("content")
      .notEmpty()
      .withMessage("Content is required")
      .run(req);
    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "you have these errors",
        errors: result.array(),
      });
    }
    const { title, content, SerieId } = req.body;
    const { owner } = req.user._id;

    if (SerieId) {
      const serie = await Serie.findOne({ Name: SerieId });
      if (!serie) {
        return res.status(404).json({
          message: "Serie not found",
          status: 404,
        });
      }
      if (req.user._id != serie.owner) {
        return res.status(403).json({
          message: "You are not authorized to edit this serie",
          status: 403,
        });
      }
    }

    try {
      const trash = false;
      const favorite = false;
      const note = new Note({
        title,
        content,
        SerieId,
        favorite,
        trash,
        owner: req.user._id,
      });
      await note.save();

      return res.status(201).json({
        message: "Note created",
        status: 201,
        note_info: {
          title,
          content,
          SerieId,
          favorite,
          trash,
          owner: req.user._id,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error creating note",
        status: 500,
        error: error,
      });
    }
  }

  async setFavorite(req, response) {
    const { id } = req.params;
    try {
      const note = await Note.findOne({ _id: id, owner: req.user._id });
      if (!note) {
        return response.status(404).json({
          message: "Note not found",
          status: 404,
        });
      }

      if (note.favorite) {
        note.favorite = false;
      } else {
        note.favorite = true;
      }
      await note.save();
      return response.status(200).json({
        message: "Note updated",
        status: 200,
        note,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: "Error updating note",
        status: 500,
        error,
      });
    }
  }

  async editNote(req, res) {
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
    const { id } = req.params;
    const { title, content, SerieId, favorite, trash } = req.body;

    try {
      if (SerieId) {
        const serie = await Serie.findOne({ Name: SerieId });
        if (!serie) {
          return res.status(404).json({
            message: "Serie not found",
            status: 404,
          });
        }
        if (req.user._id != serie.owner) {
          return res.status(403).json({
            message: "You are not authorized to edit this serie",
            status: 403,
          });
        }
      }

      const note = await Note.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        { title, content, SerieId, favorite, trash },
        { new: true }
      );
      if (!note) {
        return res.status(404).json({
          message: "Note not found",
          status: 404,
        });
      }
      if (req.user._id != note.owner) {
        return res.status(403).json({
          message: "You are not authorized to edit this note",
          status: 403,
        });
      }
      await note.save();
      return res.status(200).json({
        message: "Note updated",
        status: 200,
        note,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error updating note",
        status: 500,
        error,
      });
    }
  }

  async showNotes(req, res) {
    try {
      const notes = await Note.find({ owner: req.user._id });
      if (!notes) {
        return res.status(404).json({
          message: "Notes not found",
          status: 404,
        });
      }
      return res.status(200).json({
        message: "Notes found",
        status: 200,
        notes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error showing notes",
        status: 500,
        error,
      });
    }
  }

  async createSerie(req, res) {
    await check("Name").notEmpty().withMessage("Name is required").run(req);
    await check("Description")
      .notEmpty()
      .withMessage("Description is required")
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "you have the following errors",
        errors: errors.array(),
      });
    }
    const { Name, Description } = req.body;
    try {
      const serie = new Serie({
        Name,
        Description,
        owner: req.user._id,
      });
      await serie.save();

      return res.status(200).json({
        message: "Serie created",
        status: 200,
        serie_info: {
          Name,
          Description,
          owner: req.user._id,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error creating serie",
        status: 500,
        error,
      });
    }
  }

  async addNoteToSerie(req, res) {
    const { id } = req.params;
    const { SerieId } = req.body;
    try {
      const serie = await Serie.findOne({ Name: SerieId });
      if (!serie) {
        return res.status(404).json({
          message: "Serie not found",
          status: 404,
        });
      }
      if (req.user._id != serie.owner) {
        return res.status(403).json({
          message: "You are not authorized to edit this serie",
          status: 403,
        });
      }

      const note = await Note.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        { SerieId },
        { new: true }
      );
      if (!note) {
        return res.status(404).json({
          message: "Note not found",
          status: 404,
        });
      }
      if (req.user._id != note.owner) {
        return res.status(403).json({
          message: "You are not authorized to edit this note",
          status: 403,
        });
      }
      await note.save();
      await serie.save();
      return res.status(200).json({
        message: "Note Added to the series",
        status: 200,
        note,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error updating note",
        status: 500,
        error,
      });
    }
  }

  async showSerieNotes(req, res) {
    const { SerieId } = req.body;
    try {
      const notes = await Note.find({ owner: req.user._id, SerieId });
      if (!notes) {
        return res.status(404).json({
          message: "Notes not found",
          status: 404,
        });
      }
      return res.status(200).json({
        message: "Notes found",
        status: 200,
        notes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error showing notes",
        status: 500,
        error,
      });
    }
  }

  async showFavNotes(req, res) {
    try {
      const favNotes = await Note.find({ owner: req.user._id, favorite: true });
      if (!favNotes) {
        return res.status(404).json({
          message: "Notes not found",
          status: 404,
        });
      }
      return res.status(200).json({
        message: "Notes found",
        status: 200,
        favNotes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error showing notes",
        status: 500,
        error,
      });
    }
  }

  async showTrash(req, res) {
    try {
      const trashNotes = await Note.find({ owner: req.user._id, trash: true });
      if (!trashNotes) {
        return res.status(404).json({
          message: "Notes not found",
          status: 404,
        });
      }
      return res.status(200).json({
        message: "Notes found",
        status: 200,
        trashNotes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error showing notes",
        status: 500,
        error,
      });
    }
  }

  async deleteTrashNotes(req, res) {
    try {
      const trashNotes = await Note.deleteMany({
        owner: req.user._id,
        trash: true,
      });
      if (!trashNotes) {
        return res.status(404).json({
          message: "Notes not found",
          status: 404,
        });
      }
      return res.status(200).json({
        message: "Notes deleted",
        status: 200,
        trashNotes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error showing notes",
        status: 500,
        error,
      });
    }
  }

  async test(req, res) {
    return res.status(201).json({
      message: "Note createdasd",
      status: 201,
    });
  }
}

export { NoteManager };
