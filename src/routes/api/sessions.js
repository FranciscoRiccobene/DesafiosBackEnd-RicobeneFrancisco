import express from "express";
import {
  userRegister,
  userLogin,
  logOut,
} from "../../controllers/auth.controller.js";
import passport from "passport";

const sessionsApiRouter = express.Router();

// sessionsApiRouter.post("/register", userRegister);

sessionsApiRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    let user = req.user;
    delete user.password;
    req.session.user = user;
    res.redirect("/products");
  }
);

// sessionsApiRouter.post("/login", userLogin);

sessionsApiRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    let user = req.user;
    if (!user)
      return res
        .status(400)
        .send({ status: "Error", error: "Invalid credentials" });

    if (user.role === "admin") {
      req.session.user = {
        first_name: user.first_name,
        email: user.email,
        role: user.role,
      };
      req.session.admin = true;
    } else {
      req.session.user = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        age: user.age,
      };
      req.session.admin = false;
    }
    delete req.session.user.password;
    res.redirect("/products");
  }
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
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

sessionsApiRouter.get("/", logOut);

export default sessionsApiRouter;
