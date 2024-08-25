import { DataSource } from "typeorm";
import { User } from "../entities/User-entity";
import { Task } from "../entities/Task-entity";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "jayantss",
  database: "root",
  // logging: true,
  synchronize: true,
  entities: [User, Task],
});

export default dataSource;
