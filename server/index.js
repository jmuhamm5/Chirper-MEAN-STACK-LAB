"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var fs = require("fs");
var bp = require("body-parser");
var shortid_1 = require("shortid");
var dataPath = path.join(__dirname, 'data.json');
var base = '/api/chirps';
var app = express();
app
    .disable('x-powered-by')
    .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
    .use(bp.json())
    .use(bp.urlencoded({ extended: true }));
app.get(base, function (req, res) {
    fs.readFile(dataPath, 'utf-8', function (err, f) {
        res.send(f);
    });
});
app.post(base, function (req, res) {
    fs.readFile(dataPath, 'utf-8', function (err, f) {
        var fp = JSON.parse(f);
        var c = req.body;
        var id = shortid_1.generate();
        c.id = id;
        fp.push(c);
        fs.writeFile(dataPath, JSON.stringify(fp), function (err) {
            if (err)
                throw err;
            res.status(201).send(id).end();
        });
    });
});
app.get(base + "/:id", function (req, res) {
    fs.readFile(dataPath, 'utf-8', function (err, f) {
        var fp = JSON.parse(f);
        var found = fp.filter(function (chirp) { return chirp.id === req.params.id; });
        if (found.length !== 1) {
            res.status(404).end();
            return;
        }
        var chirp = JSON.stringify(found[0]);
        res.send(chirp).end();
    });
});
app["delete"](base + "/:id", function (req, res) {
    fs.readFile(dataPath, 'utf-8', function (err, f) {
        var fp = JSON.parse(f);
        var foundIndex = -1;
        fp.map(function (chirp, i) {
            if (chirp.id === req.params.id) {
                foundIndex = i;
            }
        });
        if (foundIndex === -1) {
            res.status(404).end();
            return;
        }
        fp.splice(foundIndex, 1);
        fs.writeFile(dataPath, JSON.stringify(fp), 'utf-8', function (err) {
            if (err)
                throw err;
            console.error(err);
            res.status(202).end();
        });
    });
});
app.listen(3000, function () {
    console.log('Server listening on port 3000.');
});
