import "reflect-metadata";
import express, { Request, Response } from "express";
import dataSource from "./src/datasource/datasource";
import "colors";
import { User } from "./src/entities/User-entity";
import apiRoute from "./src/routes";

const PORT = 3000;
const app = express();
app.use(express.json());

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
// let userRepo = dataSource.getRepository(User);

// const user1 = new User();
// user1.username = "Jayant";
// user1.password = "jayantss";

// res.json(await userRepo.save(user1));
//   res.send("Welcome to GoKapture");
// });

app.use("/api", apiRoute);

app.listen(PORT, () => {
  console.log(`Server Has Started On PORT ${PORT}`.bgBlue.white);
});
