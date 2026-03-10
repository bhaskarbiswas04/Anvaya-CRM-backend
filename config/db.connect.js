import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to Anvaya CRM database.");
    })
    .catch((error) => console.log("Error connecting to database", error));
};

export default initializeDatabase;
