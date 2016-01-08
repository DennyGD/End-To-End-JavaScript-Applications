'use strict';

let mongoose = require('mongoose');
let schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index : {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    }
});

let User = mongoose.model('User', schema);

module.exports = User;