import axios from 'axios';

// This is the address of your backend server
const API = axios.create({
    baseURL: 'http://localhost:5000/api/tasks',
});

// These are the 4 main actions we will use to manage tasks
export const fetchTasks = () => API.get('/');
export const createTask = (newTask) => API.post('/', newTask);
export const updateTask = (id, updatedTask) => API.put(`/${id}`, updatedTask);
export const deleteTask = (id) => API.delete(`/${id}`);