const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    // person: {type: Int, required: true},
    type: {type: String, required: true},
    // associatedDevice: {type: Int16Array, required: true},
    timestamp: {type: Date, required: true},
    additionalDetails: {type: String, required: false}
});

module.exports = mongoose.model('Event', EventSchema, 'event');