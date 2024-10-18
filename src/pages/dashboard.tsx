"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import TaskList from "../components/TaskList"; // Adjust the path according to your structure
import TaskForm from "../components/TaskForm"; // Import TaskForm component
import { Task } from "../types/task";
import toast, { Toaster } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout"; // Ensure the path is correct

const Dashboard = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); // Local state to manage form visibility
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(0); // Total pages state
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State for theme (example)
  const [user, setUser] = useState<{ id: string } | null>(null); // User state
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");

    setToken(storedToken);

    // Parse the userInfo string to get the user object
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser); // Set the user object
    }

    if (storedToken) {
      fetchTasks(storedToken, currentPage);
    } else {
      router.push('/'); // Redirect to home if no token
    }
  }, [router, currentPage]); // Add currentPage as a dependency

  const fetchTasks = async (token: string, page: number) => {
    const res = await fetch(`${apiUrl}/api/tasks?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to fetch tasks");
      setTasks([]);
      return;
    }

    const data = await res.json();

    // Ensure the data structure is correct
    if (data && Array.isArray(data.tasks)) {
      setTasks(data.tasks); // Update to use data.tasks
      setTotalPages(data.totalPages || 0); // Set total pages
    } else {
      toast.error("Unexpected response format.");
      setTasks([]);
    }
  };

  const handleAddTask = async (task: Task) => {
    if (!token) return;

    const res = await fetch(`${apiUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      toast.error("Failed to add task.");
      return;
    }

    toast.success("Task added successfully!");
    fetchTasks(token, currentPage); // Refresh the task list after adding
    setShowForm(false); // Hide the form after adding the task
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchTasks(token!, newPage); // Re-fetch tasks for the new page
  };

  return (
    <DashboardLayout>
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">List All Tasks</h1>
      <div className="flex justify-end items-center mb-4 px-4">
        <button
          onClick={() => setShowForm(!showForm)} // Toggle form visibility
          className="bg-blue-500 text-sm text-white rounded-full px-4 py-2 hover:bg-blue-600 transition-colors"
        >
          {showForm ? "View Tasks" : "Add Task +"}
        </button>
      </div>

      {/* Conditionally render TaskForm or TaskList */}
      {showForm ? (
        <TaskForm
          onSubmit={handleAddTask}
          token={token}  // Pass the token here
          userId={user?.id || null} // Use user?.id safely
        />
      ) : (
        <TaskList
          tasks={tasks}
          fetchTasks={() => fetchTasks(token!, currentPage)} // Pass the correct fetch function
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange} // Pass page change handler
          isDarkTheme={isDarkTheme} // Pass theme state
          itemsPerPage={10} // Specify the number of tasks per page
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
