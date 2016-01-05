'use strict';

let http = require('http'),
    fs = require('fs'),
    jade = require('jade');

// in a real-case scenario the data would be taken from a database
const PORT = 63342,
    TEMPLATES_PATH = 'resources/templates/',
    SMARTPHONES = {
        productsType: 'Smartphones',
        products: [
            {
                brand: 'LG',
                model: 'K10'
            },
            {
                brand: 'Samsung',
                model: 'Galaxy J7'
            }
        ]
    },
    TABLETS = {
        productsType: 'Tablets',
        products: [
            {
                brand: 'Apple',
                model: 'IPAD Air 2'
            },
            {
                brand: 'Dell',
                model: 'Venue 8 7000'
            },
            {
                brand: 'Lenovo',
                model: 'Tab 2 A10'
            }
        ]
    },
    WEARABLES = {
        productsType: 'Wearables',
        products: [
            {
                brand: 'Oculus',
                model: 'Rift'
            },
            {
                brand: 'Samsung',
                model: 'Gear VR'
            }
        ]
    };

http.createServer(function (request, response) {
    let currentUrl = request.url,
        currentRequestMethodLowered = request.method.toLowerCase();

    if (currentRequestMethodLowered !== 'get') {
        response.writeHead(400);
        response.end();
    }

    if (currentUrl === '/home') {
        respondWithHtml(response, 'home', {});
    } else if (currentUrl === '/styles/main.css') {
        fs.readFile('resources/styles/main.css', function (err, data) {
            if (err) {
                response.writeHead(404);
                response.end();
            }

            response.writeHead(200, {
                'Content-Type': 'text/css'
            });

            response.end(data);
        });
    } else if (currentUrl === '/smartphones') {
        respondWithHtml(response, 'collection', SMARTPHONES);
    } else if (currentUrl === '/tablets') {
        respondWithHtml(response, 'collection', TABLETS);
    } else if (currentUrl === '/wearables') {
        respondWithHtml(response, 'collection', WEARABLES);
    } else {
        response.writeHead(400);
        response.end();
    }

}).listen(PORT);

function respondWithHtml(response, templateName, data) {
    let compiledJade = jade.compileFile(`${TEMPLATES_PATH}${templateName}.jade`);

    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    response.end(compiledJade(data));
}