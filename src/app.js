import express from "express";
import { db } from "./confg/database.js";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import session from "express-session";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import __dirname from "./utils.js";

import { viewRouter } from "./routes/views.router.js";
import { productRouter } from "./routes/products.router.js";
import { cartRouter } from "./routes/carts.router.js";
import loginRouter from "./routes/views/login.js";
import registerRouter from "./routes/views/register.js";
import sessionsApiRouter from "./routes/api/session.router.js";

// Config para conectar al servidor
const app = express();
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log("Express server working on port:", port);
});
const io = new Server(httpServer);

// Config de middleware para sesiones usando connect-mongo
app.use(
  session({
    secret: "fbuisdabf32jk", // Clave secreta para firmar las cookies de sesión
    resave: false, // Evitar que guarde sesión en cada solicitud
    saveUninitialized: true, // Guardar la sesión incluso si no se ha modificado
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://franriccobene463352:T9L7sXqW09RRUcC2@codercluster.h9gmu7u.mongodb.net/?retryWrites=true&w=majority",
      ttl: 2 * 60, // Tiempo de vida de la sesión en segundos (2m en este caso)
      dbName: "eccomerce",
    }),
  })
);

// Config vistas y handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewRouter);

// Config de middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Config de rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", loginRouter);
app.use("/register", registerRouter);
app.use("/logout", sessionsApiRouter);
app.use("/api/sessions", sessionsApiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Config io.socket
io.on("connection", (socket) => {
  console.log("A client has connected");
});

export { io };
