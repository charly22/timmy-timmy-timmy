'use strict';

var URI = require('URIjs');
var http = require('request-promise');
var tabletojson = require('tabletojson');
// var iconv = require('iconv-lite');
// var cheerio = require('cheerio');
// var q = require('Q');
var selector = 'table > tr:nth-child(2) > td > table > tr:nth-child(5) > td';
selector = 'table > tr:nth-child(2) > td > table > tr:nth-child(5) > td';


function proccessRow(row){
    return row;
}
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
        uri: url,
    }).then(function(res){
        var tableStartPos = res.search('<table width="100%" cellpadding="0" cellspacing="0" bordercolor="#FFFFFF" class="planilla-partes">');
        res = res.substr(tableStartPos);
        res = res.substr(0, res.search('</table>'));
//        res = iconv.decode(res, 'iso-8859-2');
        var retu = {};
        var table = tabletojson.convert(res)[0];
        var route = 0;
        var total = table.length;
        for (var i = 0; i<total; i++){
            var rowLength =  Object.keys(table[i]).length;
            // don't use empty rows
            if(i === 0 || rowLength === 7){
                continue;
            }
            if(rowLength === 1){
                route = table[i][0];
                retu[route] = [];
                console.log(table[i][0]);
            } else {
                retu[route].push(proccessRow(table[i]));
            }
            // if(rowLength == 1){
            //     console.log(rowLength);
            // // //     route = table[i][0];
            //     console.log('new route ', table[i]);
            // // //     if(!retu.hasOwnProperty(route)){
            // // //         retu[route] = []
            // // //     }
            // // // } else {
            // // //     retu[route].push(table[i]);
            // }

        //     // if (table[i] === '' || i === 0) {
        //     //     continue;
        //     // }
        //     if (table[i][1] === void(0)) {
        //         route = table[i][0];
        //         retu[route] = [];
        //     } else {
        //         retu[route].push(table[i]);
        //     }

        }
        return retu;
    });
};
