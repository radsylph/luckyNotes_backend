import Express from "express";
import { createUser, createForm } from "../controllers/userControllers.js";

const router = Express.Router();

router.route("/create").get(createForm).post(createUser);
export default router;
