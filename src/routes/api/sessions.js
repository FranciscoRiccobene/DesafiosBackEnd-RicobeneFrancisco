import express from "express";
import passport from "passport";
import {
  userRegister,
  userLogin,
  logOut,
  gitHubCallback,
} from "../../controllers/sessions.controller.js";

const sessionsApiRouter = express.Router();

sessionsApiRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  userRegister
);

// sessionsApiRouter.post("/login", userLogin);

sessionsApiRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  userLogin
);

// Esto envía la solicitud a gitHub para hacer el login
sessionsApiRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

// Esto recibe los datos de login de gitHub
sessionsApiRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  gitHubCallback
);

sessionsApiRouter.get("/", logOut);

export default sessionsApiRouter;
