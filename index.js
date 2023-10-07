import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import db from "./config/db.js";
import Usuario from "./models/Usuario.js"; // Importa el modelo de usuario
import router from "./routes/userRoutes.js"; // Importa las rutas de usuario
import cors from "cors";

const app = express();

const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors);
app.use(express.static("public"));
app.use("/auth", router);

try {
  db.on("error", (err) => {
    console.error("Error de conexión a la base de datos:", err);
  });

  db.once("open", async () => {
    console.log("La conexión a la base de datos se ha establecido");
  });
} catch (error) {
  console.log(error);
}

app.listen(port, () => console.log(`Example app listening on url ${port}!`));
