import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../utils/db";
import Task from "../../../models/Task";
import { verify } from "jsonwebtoken";

const tasksHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  let userId;
  try {
    const decoded: any = verify(token, process.env.JWT_SECRET!);
    userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET": {
        const page = parseInt(req.query.page as string) || 1; // Convert page to number
        const limit = parseInt(req.query.limit as string) || 10; // Convert limit to number
        const tasks = await Task.find({ user: userId })
          .skip((page - 1) * limit)
          .limit(limit);

        const totalTasks = await Task.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalTasks / limit);

        return res.status(200).json({ tasks, totalPages });
      }

    case "POST": {
      const { title, description, dueDate } = req.body;

      const newTask = new Task({ title, description, dueDate, user: userId });
      await newTask.save();
      return res.status(201).json(newTask);
    }
    case "DELETE": {
      const { id } = req.query;
      const task = await Task.findOneAndDelete({ _id: id, user: userId });
      if (!task) return res.status(404).json({ message: "Task not found" });
      return res.status(200).json({ message: "Task deleted successfully" });
    }
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default tasksHandler;
