import mongoose from "mongoose";

const { Schema, model } = mongoose;
const usersCollection = "Users";

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "usuario" },
  age: { type: Number },
  password: { type: String, required: true, default: "" },
});

const Users = model(usersCollection, userSchema);

export default Users;
