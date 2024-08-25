import { DataSource } from "typeorm";
import { User } from "../entities/User-entity";
import { Task } from "../entities/Task-entity";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER || "root",
  password: process.env.POSTGRES_PASSWORD || "root",
  database: process.env.POSTGRES_DB || "root",
  // logging: true,
  synchronize: true,
  entities: [User, Task],
});

export default dataSource;
