const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    //  this schema option will add 'createdAt' and 'updatedAt' in the documents with the timestamps of creating or updation, 
    // default value of this timestamp is false 
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;