"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "../components/TaskForm";
import { Task } from "../types/task";
import toast, { Toaster } from "react-hot-toast";

const AddTask = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // State for userId
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || '{}'); // Parsing user object
    const storedUserId = user.id; // Assuming user object has an 'id' field

    setToken(storedToken);
    setUserId(storedUserId); // Set userId from local storage

    if (!storedToken) {
      router.push('/'); // Redirect to home if no token
    }
  }, [router]);

  const handleAddTask = async (task: Task) => {
    if (!token || !userId) return; // Check both token and userId

    const res = await fetch(`${apiUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...task, user: userId }), // Include userId in the task body
    });

    if (!res.ok) {
      toast.error("Failed to add task.");
      return;
    }

    toast.success("Task added successfully!");
    router.push('/dashboard'); // Redirect back to the dashboard after adding
  };

  return (
    <div className="p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Add New Task</h1>
      <TaskForm onSubmit={handleAddTask} token={token} userId={userId} /> {/* Pass token and userId */}
    </div>
  );
};

export default AddTask;
