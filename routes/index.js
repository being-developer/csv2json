var express = require('express');
var router = express.Router();
const fs = require("fs");
const readline = require('readline');
const https = require('https');
const url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
router.get('/csv/to/json', function(req, res, next) {
    if (req.query.q) {
        var keys = [];
        var file = req.query.q;
        var leftover = '';
        var leftOverKey = "";
        var virgin = true;
        https.get(file, function(result) {
            result.setEncoding('utf8');
            result.on('data', function(chunk) {
                chunk = chunk + leftover;
                if (virgin) {
                    chunk = chunk + leftOverKey;
                    var data = chunk.split('\n');
                    if (data.length) {
                        keys = data[0].split(',');
                        for (var i = 1; i < data.length; i++) chunk = data.join('\n')
                        virgin = false;
                    } else {
                        leftOverKey = leftOverKey + chunk;
                    }

                }
                var csvData = chunk.split('\n');
                leftover = csvData[csvData.length - 1];
                for (var i = 1; i < csvData.length - 1; i++) {
                    var temp = {};
                    var splitDataArr = csvData[i].split(',')
                    var splitDataLength = csvData[i].split(',').length;
                    for (var j = 0; j < splitDataLength; j++) temp[keys[j]] = splitDataArr[j];
                      res.write(JSON.stringify(temp));
                }
            });

        });
    } else {
        res.send("No q is passed");
    }
});


module.exports = router;
