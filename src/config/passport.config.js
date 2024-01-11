import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import config from "./config.js";
import {
  authRegister,
  authLogin,
  githubAuth,
  serializeUser,
  deserializeUser,
} from "../controllers/auth.controller.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      authRegister
    )
  );

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, authLogin)
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.GIT_CLIENT_ID,
        clientSecret: config.GIT_CLIENT_SECRET,
        callbackURL: config.GIT_CALLBACK_URL,
      },
      githubAuth
    )
  );

  passport.serializeUser(serializeUser);

  passport.deserializeUser(deserializeUser);
};

export default initializePassport;
