import "reflect-metadata";
import express, { Request, Response } from "express";
import dataSource from "./src/datasource/datasource";
import "colors";
import { User } from "./src/entities/User-entity";
import apiRoute from "./src/routes";
import cookieParser from "cookie-parser";

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cookieParser());

// Middleware to parse URL-encoded bodies (from forms)
// app.use(express.urlencoded({ extended: true }));

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

// app.use("/", async (req: Request, res: Response) => {
//   res.send("Welcome to GoKapture");
// });

app.use("/api", apiRoute);

app.listen(PORT, () => {
  console.log(`Server Has Started On PORT ${PORT}`.bgBlue.white);
});
