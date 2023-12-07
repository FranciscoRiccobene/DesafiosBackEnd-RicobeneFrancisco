import express from "express";

const registerRouter = express.Router();

registerRouter.get("/", (req, res) => {
  let data = {
    layout: "register",
    title: "Registro de usuario",
    actionRegister: "/api/sessions/register",
  };
  res.render("index", data);
});

export default registerRouter;