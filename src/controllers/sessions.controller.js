export const userRegister = async (req, res) => {
  try {
    let user = req.user;
    delete user.password;
    req.session.user = user;
    res.redirect("/products");
  } catch (error) {
    console.error("Error registering user", error);
    res.redirect("/");
  }
};

export const userLogin = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error handling login", error);
    res.redirect("/");
  }
};

export const gitHubCallback = async (req, res) => {
  try {
    req.session.user = req.user;
    res.redirect("/products");
  } catch (error) {
    console.error("Error handling GitHub login", error);
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
