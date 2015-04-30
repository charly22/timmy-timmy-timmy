'use strict';

var URI = require('URIjs');
var http = require('request-promise');
var tabletojson = require('tabletojson');
var cheerio = require('cheerio');
// var q = require('Q');
var selector = 'table > tr:nth-child(2) > td > table > tr:nth-child(5) > td';

module.exports = function(params) {
    params.province = params.province || 0;
    params.route = params.route || 0;
    var url = URI('http://www.vialidad.gov.ar/partes/index.php')
        .query({
            'cboProvincia': params.province,
            'cboRuta': params.route,
            'verResultado': 'Consultar'
        })
        .toString();
    return http({
        uri: url
    }).then(function(res){
        var retu = {};
        var $ = cheerio.load(res);
        var table = tabletojson.convert($(selector).html())[0];
        console.log(table);
        var route = null;
        for (var i in table){
            /*
            if (table[i] === '' || i === 0) {
                continue;
            }
            if (table[i][1] === void(0)) {
                route = table[i][0];
                retu[route] = [];
            } else {
                retu[route].push(table[i]);
            }
            */
        }
        return retu;
    });
};
