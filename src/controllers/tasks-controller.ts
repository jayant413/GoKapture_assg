import { Request, Response } from "express";

/* Create task */
export const CreateTask = (req: Request, res: Response) => {
  res.send("Create task");
};

/* Get tasks */
export const GetTasks = (req: Request, res: Response) => {
  res.send("Get tasks");
};

/* Update task */
export const UpdateTask = (req: Request, res: Response) => {
  res.send("Update task");
};

/* Delete task */
export const DeleteTask = (req: Request, res: Response) => {
  res.send("Delete task");
};
