import mongoose from "mongoose";
import config from "./config.js";

mongoose.connect(config.MONGO_URL, { dbName: "eccomerce" });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to database"));
db.once("open", () => {
  console.log("Connected to database");
});

export { mongoose, db };
