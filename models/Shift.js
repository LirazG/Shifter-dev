const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startHour: {
        type: String
    },
    endHour: {
        type: String
    },
    numberOfEmployees: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Shift = mongoose.model('shift', ShiftSchema);