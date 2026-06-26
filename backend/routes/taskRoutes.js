const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 1. GET: Fetch all tasks (Sorted by newest first)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. POST: Create a new task
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'Pending'
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 3. PUT: Update an existing task (e.g., changing status to "Completed")
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Returns the newly updated task
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. DELETE: Remove a task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;