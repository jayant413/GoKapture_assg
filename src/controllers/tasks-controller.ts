import { query, Request, Response } from "express";
import { Task } from "../entities/Task-entity";
import dataSource from "../datasource/datasource";
import jwt from "jsonwebtoken";
import { User } from "../entities/User-entity";
const JWT_SECRET = process.env.JWT_SECRET || "GoKapture@123";

const taskRepo = dataSource.getRepository(Task);
let userRepo = dataSource.getRepository(User);

/* Create task : only admin can create task */
export const CreateTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, dueDate, userId } = req.body;
    const token = req.cookies["token"];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
    };
    const user = await userRepo.findOne({ where: { id: decoded.userId } });

    if (user?.role !== "admin")
      return res.status(401).json({ message: "Unauthorized access" });

    const newTask = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.status = status;
    newTask.priority = priority;
    newTask.dueDate = dueDate;
    newTask.userId = userId;

    await taskRepo.save(newTask);

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(401).json({ message: "Something went wrong.", error: error });
  }
};

/* Get tasks with pagination and role 
   admin can access all tasks while user can access only there tasks
*/
export const GetTasks = async (req: Request, res: Response) => {
  try {
    const token = req.cookies["token"];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
    };
    const user = await userRepo.findOne({ where: { id: decoded.userId } });

    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = 3;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    let query: any = { skip: offset, take: limit };

    if (user?.role === "user") {
      query.where = { userId: decoded.userId };
    }

    const [tasks, total] = await taskRepo.findAndCount(query);

    const hasMore = tasks.length === limit && offset + limit < total;

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json({
      tasks,
      pagination: {
        currentPage: page,
        pageSize,
        totalTasks: total,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to retrieve tasks", error: error });
  }
};

/* Update task : only admin and user assigned to task can update */
export const UpdateTask = async (req: Request, res: Response) => {
  try {
    const token = req.cookies["token"];
    const { title, description, status, priority, dueDate, userId } = req.body;
    const { taskId } = req.params as { taskId: string };

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
    };
    const user = await userRepo.findOne({ where: { id: decoded.userId } });

    const taskIdNumber = parseInt(taskId, 10);
    const task = await taskRepo.findOne({ where: { id: taskIdNumber } });

    if (user?.role !== "admin" || task?.userId !== user?.id)
      return res.status(401).json({ message: "Unauthorized access" });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;
    task.userId = userId ?? task.userId;

    await taskRepo.save(task);

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(401).json({ message: "Something went wrong.", error: error });
  }
};

/* Delete task : only admin can delete the task */
export const DeleteTask = async (req: Request, res: Response) => {
  try {
    const token = req.cookies["token"];
    const { taskId } = req.params as { taskId: string };

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
    };
    const user = await userRepo.findOne({ where: { id: decoded.userId } });
    if (user?.role !== "admin")
      return res.status(401).json({ message: "Unauthorized access" });

    const taskIdNumber = parseInt(taskId, 10);
    const task = await taskRepo.findOne({ where: { id: taskIdNumber } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await taskRepo.delete(taskIdNumber);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(401).json({ message: "Something went wrong.", error: error });
  }
};
