'use strict';

// http://shapeshed.com/writing-cross-platform-node/

let os = require('os'),
    EOL = os.EOL,
    chatDb =  require('./config/database');

chatDb.init();

chatDb.registerUser({ username: 'Doncho', password: '123456' })
    .then(function () {
        return chatDb.registerUser({ username: 'Ivaylo', password: '123456' });
    })
    .then(function () {
        chatDb.allUsers()
        .then(function (data) {
            console.log(`All Users: ${EOL} ${data}`);
        })
    })
    .then(function () {
        return chatDb.sendMessage({ from: 'Ivaylo', to: 'Doncho', text: 'someText' });
    })
    .then(function () {
        chatDb.getMessages({ with: 'Doncho', and: 'Ivaylo'})
            .then(function (data) {
                console.log(`Messages between Doncho and Ivaylo: ${EOL} ${data}`);
            })
    })
    .catch(function (err) {
        console.log(err);
    });