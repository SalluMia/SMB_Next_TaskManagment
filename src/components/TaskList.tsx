// src/components/TaskList.tsx
import toast, { Toaster } from "react-hot-toast";
import { Task } from "../types/task";
import { useState } from "react";
import EditTaskModal from "../components/EditTaskModal"; // Ensure this component is implemented
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"; // Import the new modal
import '../app/globals.css';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface TaskListProps {
  tasks: Task[];
  fetchTasks: () => void;
  currentPage: number; // Current page for pagination
  totalPages: number; // Total pages for pagination
  onPageChange: (page: number) => void; // Function to handle page change
  isDarkTheme: boolean; // Receive theme state
  itemsPerPage: number; // Number of tasks displayed per page
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  fetchTasks,
  currentPage,
  totalPages,
  onPageChange,
  isDarkTheme,
  itemsPerPage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); // State for delete confirmation modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authorized to delete tasks.");
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete the task.");
      }

      toast.success("Task deleted successfully.");
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      toast.error(error.message || "An error occurred while deleting the task.");
    }
  };

  const confirmDelete = (task: Task) => {
    setSelectedTask(task);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTask) {
      handleDelete(selectedTask._id);
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setIsConfirmDeleteOpen(false); // Close the confirm delete modal
  };

  return (
    <div className={`p-4 ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Toaster />
      {Array.isArray(tasks) && tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available.</p>
      ) : (
        <div className={`overflow-x-auto ${isDarkTheme ? 'border border-white rounded-md' : 'border border-gray-400 rounded-md'}`}>
          <table className={`min-w-full ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
            <thead>
              <tr className={`py-3 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <th className="py-3 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">Title</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Due Date</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task._id} className={`border-b text-sm ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  {/* Calculate the serial number based on current page and items per page */}
                  <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}.</td>
                  <td className="py-2 px-4">{task.title.slice(0, 15)}...</td>
                  <td className="py-2 px-4">{task.description.slice(0, 15)}...</td>
                  <td className="py-2 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmDelete(task)} // Open confirmation modal
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 ${currentPage === 1 && isDarkTheme ? 'bg-gray-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'} `}
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 ${currentPage === totalPages && isDarkTheme ? 'bg-gray-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'} `}
        >
          Next
        </button>
      </div>

      {/* Modal for editing task */}
      {isModalOpen && selectedTask && (
        <EditTaskModal task={selectedTask} onClose={closeModal} fetchTasks={fetchTasks} />
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TaskList;
