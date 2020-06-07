const mongoose = require('mongoose');

const DeploymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    deployDate: {
        type: Date,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId
    },
    shiftId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Deployment = mongoose.model('deployment', DeploymentSchema);