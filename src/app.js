import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { db } from "./confg/database.js";
import { Server } from "socket.io";
import { viewRouter } from "./routes/views.router.js";
import { productRouter } from "./routes/products.router.js";
import { cartRouter } from "./routes/carts.router.js";

const app = express();
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log("Express server working on port:", port);
});
const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewRouter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

io.on("connection", (socket) => {
  console.log("A client has connected");
});

export { io };
