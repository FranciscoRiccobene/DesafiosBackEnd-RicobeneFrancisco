import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import Users from "../dao/models/users.model.js";
import config from "./config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await Users.findOne({ email: username });
          if (user) {
            console.log("User exists");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await Users.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error obtaining user" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          if (
            username === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            const adminUser = {
              first_name: "Admin",
              email: "adminCoder@coder.com",
              role: "admin",
            };
            return done(null, adminUser);
          }

          let user = await Users.findOne({ email: username });
          if (!user) {
            console.log("User does not exist");
            return done(null, false);
          }

          if (!isValidPassword(user, password)) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.GIT_CLIENT_ID,
        clientSecret: config.GIT_CLIENT_SECRET,
        callbackURL: config.GIT_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await Users.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name.split(" ")[0],
              last_name: profile._json.name.split(" ").slice(1).join(" "),
              email: profile._json.email,
              age: 18,
              password: createHash(profile.id),
            };

            let result = await Users.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    if (user.role === "admin") {
      return done(null, "admin-id");
    }

    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      if (id === "admin-id") {
        const adminUser = {
          first_name: "Admin",
          email: "adminCoder@coder.com",
          role: "admin",
        };
        return done(null, adminUser);
      }

      let user = await Users.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
