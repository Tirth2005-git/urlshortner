import express from "express";
import { router } from "./controllers/routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());



app.use(router);
app.listen(process.env.PORT ||5000, () => {
  console.log(`running at http://localhost:${process.env.PORT}/`);
});
