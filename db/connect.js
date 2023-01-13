import mongoose from "mongoose";

const connectDB = (url) => {
  return mongoose.set("strictQuery", false).connect(url, {
    //NO LONGER SUPPORTED
    // useNewUrlParser: true,
    //  useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

export default connectDB;
