import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";

const getAllJobs = async (req, res) => {
  //gets all jobs posted by user acc.
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: JobId },
  } = req;
  //finds specific job linked to user acc.
  const job = await Job.findOne({ _id: JobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Unable to find job with id: ${JobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  const {
    user: { userId },
    body: { company, position },
    params: { id: JobId },
  } = req;

  //Ensure updated fields aren't empty
  if (company === "" || position === "") {
    throw new BadRequestError("Fields cannot be empty , please try again");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: JobId, createdBy: userId },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!job) {
    throw new NotFoundError(`Unable to find job with id: ${JobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: JobId },
  } = req;
  const job = await Job.findByIdAndDelete({ _id: JobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Unable to find job with id: ${JobId}`);
  }
  res.json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
export { getAllJobs, getJob, updateJob, deleteJob, createJob };
