'use strict';

let mongoose = require('mongoose'),
    userSchema = mongoose.model('User').schema;

let schema = new mongoose.Schema({
    from: {
        type: [userSchema],
        required: true
    },
    to: {
        type: [userSchema],
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

let Message = mongoose.model('Message', schema);

module.exports = Message;