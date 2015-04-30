'use strict';

var api = require('./lib/api');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();

router.use(function(req, res, next) {
    next();
});

router.route('/')
.get(function(req, res) {
    api({})
    .then(function(data){
        console.log('salio');
        // res.set('Content-Type', 'application/json; charset=iso-8859-1');
        res.json(data);
    }).catch(function(error){
        res.status(500).json(error);
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);
app.use(function(req, res){
    res.status(400).json({code: 400, error: 'Bad request'});
});
app.listen(process.env.PORT || 3000);
