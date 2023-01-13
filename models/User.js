import { Schema, model } from "mongoose";
import pkg from "bcryptjs";
const { genSalt, hash, compare } = pkg;

import pkg2 from "jsonwebtoken";
const { sign } = pkg2;
import dotenv from "dotenv";
dotenv.config();

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "provide a value"],
    trim: true,
    //maxlength: [20, "name is longer than 20 characters"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide a valid email address"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    //maxlength: 15,
  },
});

//MIDDLEWARE
UserSchema.pre("save", async function () {
  //hashes password
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});
//INSTANCE METHODS

UserSchema.methods.createJWT = function () {
  return sign({ userId: this.id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (userPassword) {
  const valid = await compare(userPassword, this.password);
  return valid;
};

export default model("User", UserSchema);
