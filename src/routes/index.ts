import express from "express";
import { LoginUser, RegisterUser } from "../controllers/user-controller";
import {
  CreateTask,
  DeleteTask,
  GetTasks,
  UpdateTask,
} from "../controllers/tasks-controller";
import { AuthMiddleware } from "../middleware/auth-middleware";

// router
const apiRoute = express.Router();

/* User auth routes */
apiRoute.post("/register", RegisterUser);
apiRoute.post("/login", LoginUser);

/* Task routes */
apiRoute.post("/tasks", AuthMiddleware, CreateTask);
apiRoute.get("/tasks", AuthMiddleware, GetTasks);
apiRoute.put("/tasks/:taskId", AuthMiddleware, UpdateTask);
apiRoute.delete("/tasks/:taskId", AuthMiddleware, DeleteTask);

export default apiRoute;
