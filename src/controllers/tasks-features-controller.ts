import { Request, Response } from "express";
import { Task } from "../entities/Task-entity";
import dataSource from "../datasource/datasource";
import { ILike } from "typeorm";

const taskRepo = dataSource.getRepository(Task);

/* Filter tasks */
export const FilterTasks = async (req: Request, res: Response) => {
  try {
    const { status, priority, dueDate } = req.body;

    const query: any = {};

    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (dueDate) {
      query.dueDate = new Date(dueDate);
    }

    const tasks = await taskRepo.find({
      where: query,
    });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error });
  }
};

/* Search tasks */
export const SearchTasks = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    const whereClause: any = {};

    if (title) {
      whereClause.title = ILike(`%${title}%`);
    }
    if (description) {
      whereClause.description = ILike(`%${description}%`);
    }

    const tasks = await taskRepo.find({
      where: whereClause,
    });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error });
  }
};
