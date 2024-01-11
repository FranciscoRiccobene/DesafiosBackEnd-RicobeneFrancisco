import Users from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import config from "../config/config.js";

export const authRegister = async (req, username, password, done) => {
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
};

export const authLogin = async (username, password, done) => {
  try {
    if (username === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
      const adminUser = {
        first_name: "Admin",
        email: config.ADMIN_EMAIL,
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
};

export const githubAuth = async (accessToken, refreshToken, profile, done) => {
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
};

export const serializeUser = (user, done) => {
  if (user.role === "admin") {
    return done(null, "admin-id");
  }

  done(null, user._id);
};

export const deserializeUser = async (id, done) => {
  try {
    if (id === "admin-id") {
      const adminUser = {
        first_name: "Admin",
        email: config.ADMIN_EMAIL,
        role: "admin",
      };
      return done(null, adminUser);
    }

    let user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
};
