import express from "express";
import { registerView } from "../../controllers/views.controller.js";

const registerRouter = express.Router();

registerRouter.get("/", registerView);

export default registerRouter;
