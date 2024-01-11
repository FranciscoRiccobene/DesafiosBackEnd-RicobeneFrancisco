import express from "express";
import { loginView } from "../../controllers/views.controller.js";

const loginRouter = express.Router();

loginRouter.get("/", loginView);

export default loginRouter;
