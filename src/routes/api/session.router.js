import express from "express";
import { userRegister, userLogin, logOut } from "../../controllers/auth.controller.js";
import { showProfile } from "../../controllers/user.cotroller.js";

const sessionsApiRouter = express.Router();

sessionsApiRouter.post("/register", userRegister);
sessionsApiRouter.post("/login", userLogin);
sessionsApiRouter.get("/", logOut);
sessionsApiRouter.post("/profile", showProfile);

export default sessionsApiRouter;