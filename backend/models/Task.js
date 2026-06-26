const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a task title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a task description']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    }
}, { 
    timestamps: true // This automatically adds the "Created Date" we need for sorting later!
});

module.exports = mongoose.model('Task', taskSchema);