'use strict';

let http = require('http'),
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    formidable = require('formidable'),
    uuid = require('node-uuid'),
    os = require('os'),
    EOL = os.EOL;

const PORT = 63342,
    DATA_DIR = 'data';

http.createServer(function(req, res) {
    let currentUrl = req.url,
        currentRequestMethodLowered = req.method.toLowerCase();

    if (currentUrl === '/home' && currentRequestMethodLowered === 'get') {
        fs.readFile('resources/index.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.end(data);
        });
    } else if (currentUrl === '/index.css' && currentRequestMethodLowered === 'get') {
        fs.readFile('resources/index.css', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/css'
            });

            res.end(data);
        });
    } else if (currentUrl === '/upload' && currentRequestMethodLowered === 'post') {
        handleUpload(req, res);
    } else if (currentUrl.indexOf('/download/') >= 0) {
        handleDownload(req, res, currentUrl);
    } else {
        res.writeHead(404);
        res.end();
    }
}).listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}${EOL}Please, visit /home`) });

function handleUpload(req, res) {
    let form = new formidable.IncomingForm();

    form.uploadDir = DATA_DIR;
    form.keepExtensions = true;
    form.multiples = false;

    let newFileName = uuid.v4();

    form.on('fileBegin', function(name, file) {
        let fileExtension = getFileExtension(file.name);

        file.path = form.uploadDir + '/' + newFileName + '.' + fileExtension;
    }).parse(req, function (err, fields, files) {
        if (err || files.file.size === 0) {
            res.writeHead(400);
            res.end();
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            res.end(`Download available at download/${newFileName}`);
        }
    });
}

function handleDownload(req, res, url) {
    let wantedFile = getFileNameFromUrl(url);

    fs.readdir(DATA_DIR, function (err, fileNames) {
        if (err) {
            res.writeHead(500);
            res.end();
        }

        let filesCount = fileNames.length,
            result;

        for (let i = 0; i < filesCount; i += 1) {
            if (fileNames[i].indexOf(wantedFile) >= 0) {
                result = fileNames[i];
                break;
            }
        }

        if (!result) {
            res.writeHead(404);
            res.end();
        }

        res.writeHead(200, {
            'Content-Disposition': 'attachment',
            'Filename': `${result}`
        });

        let readStream = fs.createReadStream(path.join(DATA_DIR, result));
        readStream.pipe(res);
    });
}

function getFileExtension(fileName) {
    if (fileName == undefined) {
        throw new Error('fileName is undefined.');
    }

    var lastDotIndex = fileName.lastIndexOf('.'),
        extension = fileName.substring(lastDotIndex + 1, fileName.length + 1);

    return extension;
}

function getFileNameFromUrl(url) {
    let lastSlashIndex = url.lastIndexOf('/'),
        fileName = url.substring(lastSlashIndex + 1, url.length + 1);

    return fileName;
}
