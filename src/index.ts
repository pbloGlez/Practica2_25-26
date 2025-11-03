import { connecToMongo } from "./mongo";
import express from "express";
import rutas from "./routes";

connecToMongo();
const app = express();
app.use(express.json());

app.use("/api/books", rutas);

app.listen(3000, () => console.log("Servidor arrancado en el puerto 3000"));
