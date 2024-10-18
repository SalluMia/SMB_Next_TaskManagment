// src/components/EditTaskModal.tsx
import React from 'react';
import { Task } from '../types/task';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  fetchTasks: () => void;
  isDarkTheme: boolean; // Receive theme state
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, fetchTasks, isDarkTheme }) => {
  const [formData, setFormData] = React.useState<Task>(task);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not authorized to edit tasks.");
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update the task.');
      }

      onClose();
      fetchTasks(); // Fetch tasks to update the list
    } catch (error) {
      alert(error.message || "An error occurred while updating the task.");
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isDarkTheme ? 'bg-none border border-gray-700' : 'bg-none border border-gray-500'}`}>
      <div className={`bg-white w-[600px] rounded-md shadow-lg p-6 ${isDarkTheme ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-500'}`}>
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`border rounded-lg p-2 w-full ${isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`border rounded-lg p-2 w-full ${isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white rounded-md px-4 py-2 mr-2">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
