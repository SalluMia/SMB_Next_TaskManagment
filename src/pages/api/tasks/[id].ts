import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../utils/db";
import Task from "../../../models/Task";
import { verify } from "jsonwebtoken";

const taskHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, description, dueDate, completed } = req.body;
    const task = await Task.findById(id);
    if (!task || task.user.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.completed = completed;
    await task.save();
    res.status(200).json(task);
  } else if (req.method === "DELETE") {
    const task = await Task.findById(id);
    if (!task || task.user.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await task.deleteOne({ _id: id });
    res.status(204).end();
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default taskHandler;
