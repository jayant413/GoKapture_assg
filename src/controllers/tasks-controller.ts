import { Request, Response } from "express";
import { Task } from "../entities/Task-entity";
import dataSource from "../datasource/datasource";

const taskRepo = dataSource.getRepository(Task);

/* Create task */
export const CreateTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, dueDate, userId } = req.body;

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

/* Get tasks */
export const GetTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskRepo.find();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to retrieve tasks" });
  }
};

/* Update task */
export const UpdateTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, dueDate, userId } = req.body;
    const { taskId } = req.params as { taskId: string };
    const taskIdNumber = parseInt(taskId, 10);

    const task = await taskRepo.findOne({ where: { id: taskIdNumber } });

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

/* Delete task */
export const DeleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params as { taskId: string };
    console.log("🚀 ~ DeleteTask ~ taskId:", taskId);
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
