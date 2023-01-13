import mongoose, { Schema, model } from "mongoose";

const JobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "Provide the company name"],
      maxlength: 75,
    },
    position: {
      type: String,
      required: [true, "Provide a position"],
      maxlength: 75,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    //links jobs to specific userId
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Provide a user"],
    },
  },
  { timestamps: true }
);

export default model("Job", JobSchema);
