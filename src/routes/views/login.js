import express from "express";

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  let data = {
    layout: "main",
    title: "Login",
    actionLogin: "/api/sessions/login",
  };
  res.render("index", data);
});

export default loginRouter;
