import userModel from "../models/users.model.js";

export const userRegister = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const user = new userModel({ first_name, last_name, email, age, password });

    await user.save();
    req.session.user = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      age: user.age,
    };
    res.redirect("/products");
  } catch (error) {
    console.error("Error registering user", error);
    res.redirect("/");
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        first_name: "Admin",
        email: "adminCoder@coder.com",
        role: "admin",
      };
      req.session.admin = true;
      res.redirect("/products");
    } else {
      const user = await userModel.findOne({ email, password });

      if (user) {
        req.session.user = {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          age: user.age,
        };
        req.session.admin = false;
        res.redirect("/products");
      } else {
        console.log("User or password incorrect");
        res.redirect("/");
      }
    }
  } catch (error) {
    console.error("Error login user", error);
    res.redirect("/");
  }
};

export const logOut = async (req, res) => {
  try {
    if (req.session.user) {
      delete req.session.user;
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout user error", err);
          res.status(500).send("Logout user error");
        } else {
          res.redirect("/");
        }
      });
    }
  } catch (error) {
    console.error("Logout error", error);
    res.status(500).send({ message: "Logout error" });
  }
};
