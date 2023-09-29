import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

mongoose.connect(
  `mongodb+srv://test1:123@cluster0.gpskocw.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true, // Para evitar el warning de "URL string parser"
    useUnifiedTopology: true, // Para evitar el warning de "Server Discovery and Monitoring engine"
  }
);

const db = mongoose.connection;

export default db;
