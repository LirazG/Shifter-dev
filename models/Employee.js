const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Employee = mongoose.model('employee', EmployeeSchema);