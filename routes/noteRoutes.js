import Express from "express";

import { test, test2 } from "../controllers/noteControllers.js";

const router = Express.Router();

router.route("/test").post(test).get(test2);

export default router;
