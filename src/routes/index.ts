import express from "express";
import { LoginUser, RegisterUser } from "../controllers/user-controller";
import {
  CreateTask,
  DeleteTask,
  GetTasks,
  UpdateTask,
} from "../controllers/tasks-controller";

// router
const apiRoute = express.Router();

/* User auth routes */
apiRoute.post("/register", RegisterUser);
apiRoute.post("/login", LoginUser);

/* Task routes */
apiRoute.post("/tasks", CreateTask);
apiRoute.get("/tasks", GetTasks);
apiRoute.put("/tasks/:taskId", UpdateTask);
apiRoute.delete("/tasks/:taskId", DeleteTask);

export default apiRoute;
