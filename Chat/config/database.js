'use strict';

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let User = require('../models/user'),
    Message = require('../models/message');

function init() {
    mongoose.connect('localhost:27017/chatSystem');
    let db = mongoose.connection;

    db.on('error', function (error) {
        console.log(error);
    });

    db.once('open', function () {
        console.log('Db connection has been established.');
    });
}

function registerUser(requestedUser) {
    let newUser = new User(requestedUser);
    return newUser.save();
}

function allUsers() {
    return User.find({});
}

function getUserByName(name) {
    return User.findOne({ username: name });
}

function createMessage(requestedMessage) {
    let promise = new Promise(function (resolve, reject) {

        getUserByName(requestedMessage.from)
            .then(function (user) {
                let fromUser = user;

                getUserByName(requestedMessage.to)
                    .then(function (user) {
                        let toUser = user;

                        let newMessage = new Message({
                            from: fromUser,
                            to: toUser,
                            text: requestedMessage.text
                        });

                        newMessage.save(function (err, data) {
                            if (err) {
                                reject(err);
                            }

                            resolve(data);
                        });
                    });
            });
    });

    return promise;
}

function getMessages(users, cb) {
    var promise = new Promise(function (resolve, reject) {
        getUserByName(users.with)
            .then(function (user) {
                let oneUserId = user._id;

                getUserByName(users.and)
                    .then(function (user) {
                        let otherUserId = user._id;

                        // http://stackoverflow.com/questions/5818303/how-do-i-perform-this-query-in-mongoose-mongodb-for-node-js
                        resolve( Message.find()
                                    .where('from._id')
                                    .in([oneUserId, otherUserId])
                                    .where('to._id')
                                    .in([oneUserId, otherUserId]));
                    });
            });
    });

    return promise;
}

module.exports = {
    init: init,
    registerUser: registerUser,
    allUsers: allUsers,
    sendMessage: createMessage,
    getMessages: getMessages
};
