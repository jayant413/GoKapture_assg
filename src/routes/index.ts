import express from "express";
import { LoginUser, RegisterUser } from "../controllers/user-controller";
import {
  CreateTask,
  DeleteTask,
  GetTasks,
  UpdateTask,
} from "../controllers/tasks-controller";
import { AuthMiddleware } from "../middleware/auth-middleware";
import {
  FilterTasks,
  SearchTasks,
} from "../controllers/tasks-features-controller";

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

/* Filtering tasks by status , priority , dueDate */
apiRoute.post("/filterTasks", AuthMiddleware, FilterTasks);

/* Search tasks by title , description*/
apiRoute.post("/searchTasks", AuthMiddleware, SearchTasks);

export default apiRoute;
