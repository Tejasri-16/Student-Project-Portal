import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Pending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const { data } = await fetchTasks();
      setTasks(data);
      setLoading(false);
    } catch (error) { toast.error("Failed to fetch tasks."); setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setShowForm(false);
      setNewTask({ title: '', description: '', status: 'Pending' });
      loadTasks();
      toast.success("Task created successfully!");
    } catch (error) { toast.error("Failed to create task."); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      loadTasks();
    } catch (error) { toast.error("Failed to update status."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteTask(id);
        loadTasks();
      } catch (error) { toast.error("Failed to delete task."); }
    }
  };

  const processedTasks = tasks
    .filter(t => (t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase())) && (filterStatus === 'All' || t.status === filterStatus))
    .sort((a, b) => sortOrder === 'newest' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto transition-colors duration-300 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />

      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Project Portal</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400">
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Logout
          </button>
        </div>
      </header>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-blue-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Total</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-yellow-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Pending</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{tasks.filter(t => t.status === 'Pending').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-purple-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Progress</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{tasks.filter(t => t.status === 'In Progress').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-green-500">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase">Completed</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{tasks.filter(t => t.status === 'Completed').length}</p>
        </div>
      </div>

      {/* Search and List */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex gap-4">
        <input type="text" placeholder="Search..." className="flex-1 border dark:bg-gray-700 dark:text-white rounded p-2" onChange={(e) => setSearchTerm(e.target.value)} />
        <select className="border dark:bg-gray-700 dark:text-white rounded p-2" onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Task List</h2>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">{showForm ? 'Cancel' : '+ Create New Task'}</button>
        </div>
        
        {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded">
                <input type="text" required placeholder="Title" className="w-full mb-2 p-2 border dark:bg-gray-600" onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                <textarea required placeholder="Description" className="w-full mb-2 p-2 border dark:bg-gray-600" onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Task</button>
            </form>
        )}

        <ul>
            {processedTasks.map(task => (
                <li key={task._id} className="border-b py-4 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{task.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <select value={task.status} onChange={(e) => handleStatusChange(task._id, e.target.value)} className="border dark:bg-gray-700 dark:text-white rounded p-1">
                            <option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option>
                        </select>
                        <button onClick={() => handleDelete(task._id)} className="text-red-500">Delete</button>
                    </div>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;