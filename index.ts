import "reflect-metadata";
import express, { Request, Response } from "express";
import dataSource from "./src/datasource/datasource";
import "colors";
import apiRoute from "./src/routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3000;
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

dataSource
  .initialize()
  .then(() => {
    console.log(
      "DataSource successfully connected with database".bgMagenta.white
    );
  })
  .catch((err) => {
    console.log("DataSource connection failed ".bgRed.white, err);
  });

app.use("/api", apiRoute);

app.listen(PORT, () => {
  console.log(`Server Has Started On PORT ${PORT}`.bgBlue.white);
});
