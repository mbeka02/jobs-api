//import { create } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
//const { BadRequestError } = require("../errors");
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
//import pkg from "bcryptjs";
//const { hash } = pkg;
//require("dotenv").config();

const register = async (req, res) => {
  //if (!name || !email || !password) {
  // throw new BadRequestError("Ensure that you have filled in all the fields");
  // }
  //console.log(name, email, password);
  //const id = new Date().getDate();

  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(
      "Unable to login, ensure that your email and password are correct"
    );
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    //console.log(password, user.password);
    throw new UnauthenticatedError(
      "The provided password is incorrect , please try again"
    );
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
    },
    token,
  });
};

export { register, login };
