import express from "express";
import { db } from "./config/database.js";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import session from "express-session";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import __dirname from "./utils.js";
import config from "./config/config.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

import { viewRouter } from "./routes/views.router.js";
import { productRouter } from "./routes/products.router.js";
import { cartRouter } from "./routes/carts.router.js";
import loginRouter from "./routes/views/login.js";
import registerRouter from "./routes/views/register.js";
import sessionsApiRouter from "./routes/api/sessions.js";

// Config para conectar al servidor
const app = express();
const port = config.PORT;
const httpServer = app.listen(port, () => {
  console.log("Express server working on port:", port);
});
const io = new Server(httpServer);

// Config de middleware para sesiones usando connect-mongo
app.use(
  session({
    secret: config.HASH, // Clave secreta para firmar las cookies de sesión
    resave: false, // Evitar que guarde sesión en cada solicitud
    saveUninitialized: true, // Guardar la sesión incluso si no se ha modificado
    store: MongoStore.create({
      mongoUrl: config.MONGO_URL, // Url de conección a la db en mongo
      ttl: 2 * 60, // Tiempo de vida de la sesión en segundos (2m en este caso)
      dbName: "eccomerce", // Nombre de la base de datos a utilizar
    }),
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/", loginRouter);
app.use("/register", registerRouter);
app.use("/logout", sessionsApiRouter);
app.use("/api/sessions", sessionsApiRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Config io.socket
io.on("connection", (socket) => {
  console.log("A client has connected");
});

export { io };
