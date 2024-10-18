import React, { useState } from "react";
import { Task } from "../types/task"; // Ensure the Task type is defined appropriately

interface TaskFormProps {
  onSubmit: (task: Task) => void; // Prop for handling form submission
  token: string | null; // Authorization token
  userId: string | null; // User ID
}



const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, token, userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // State for due date
  const [completed, setCompleted] = useState(false); // State for completed status

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      title,
      description,
      dueDate: dueDate,
      completed,
      user: userId || "",
    };

    onSubmit(newTask);

    setTitle("");
    setDescription("");
    setDueDate("");
    setCompleted(false);
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border rounded-md p-2 mb-2"
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="border rounded-md p-2 mb-4"
      />
      <input
        type="date"
        placeholder="Due Date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="border rounded-md p-2 mb-2"
      />
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="mr-2"
        />
        <label>Mark as Completed</label>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
