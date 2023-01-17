import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express, { json } from "express";
import mongoose from "mongoose";
const app = express();
//DB
import connectDB from "./db/connect.js";

//Security packages
import helmet from "helmet";
import cors from "cors";
//
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";

//swagger
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");

//routes

import authRouter from "./routes/auth.js";
import jobsRouter from "./routes/jobs.js";

import authenticationMiddleware from "./middleware/authentication.js";

// error handler
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api-access", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//const rateLimiter = rateLimit({

//message:"Too ma"
//});

// extra packages

// routes
app.get("/", (req, res) => {
  res.status(200).send(`<h1>Jobs API</h1>
  <a href="/api-access">View docs</a>`);
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticationMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.DEVDB);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
