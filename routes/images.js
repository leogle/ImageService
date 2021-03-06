/**
 * Created by lrh on 2017-11-30.
 */
let express = require('express');
let router = express.Router();
const Canvas = require('canvas');
const RenderService = require('../service/RenderService');

/* GET home page. */
router.get('/', function(req, res) {
    let canvas = new Canvas(100,200);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(10,10,50,50);
    res.writeHead(200, { 'Content-Type': 'image/png' });

    canvas.pngStream().pipe(res);
});

router.get('/lidar',function (req,res) {
    let renderService = new RenderService();
    let fs = require('fs');

    fs.readFile('./data/lidar.js',function (err,data) {
        console.log(err);
        console.log(data);
        let lidardata = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        renderService.paintLidar(lidardata).pipe(res);
    });
});

router.get('/spatial',function (req,res) {
    let data = {datas:[{"lat": 23.002770, "value": 100.0, "lng": 113.252100},
        {"lat": 23.400830, "value": 79.0, "lng": 113.451250},
        {"lat": 23.400830, "value": 39.0, "lng": 113.251250},
        {"lat": 22.803480, "value": 124.0, "lng": 113.168240},
        {"lat": 23.353690, "value": 100.0, "lng": 113.267940},
        {"lat": 23.23690, "value": 200.0, "lng": 113.467940},
        {"lat": 23.094140, "value": 320.0, "lng": 113.261360}],paramName:"PM10",unit:"ug/m3"};
    let renderService = new RenderService();
    let d3 = require('d3-geo');
    let projection = d3.geoMercator()
        .center([113.25,23.40])
        .scale(8000)
        .translate([300,300]);
    renderService.paintSpatial(data,[600,600],projection,null).pipe(res);
});

router.get('/polygon',function (req,res) {
    let data = {datas:[{"lat": 23.002770, "value": 100.0, "lng": 113.252100},
        {"lat": 23.400830, "value": 79.0, "lng": 113.451250},
        {"lat": 23.400830, "value": 39.0, "lng": 113.251250},
        {"lat": 22.803480, "value": 124.0, "lng": 113.168240},
        {"lat": 23.353690, "value": 100.0, "lng": 113.267940},
        {"lat": 23.23690, "value": 200.0, "lng": 113.467940},
        {"lat": 23.094140, "value": 320.0, "lng": 113.261360}],paramName:"PM10",unit:"ug/m3"};
    let renderService = new RenderService();
    let d3 = require('d3-geo');
    let projection = d3.geoMercator()
        .center([113.25,23.40])
        .scale(5600)
        .translate([400,400]);
    let fs = require('fs');
    let polygon;
    fs.readFile('./data/china.json',function (err,geodata) {
        let geojson = JSON.parse(geodata);
        for(let i = 0;i < geojson.features.length;i++){
            if(geojson.features[i].properties.id === "44"){
                polygon = geojson.features[i].geometry.coordinates[0];
                break;
            }
        }

        console.dir(polygon);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        renderService.paintSpatial(data,[800,800],projection,polygon).pngStream().pipe(res);
    });

});

router.get('/china',function (req,res) {
    let data = {datas:[{"lat": 23.002770, "value": 100.0, "lng": 113.252100},
        {"lat": 23.400830, "value": 79.0, "lng": 113.451250},
        {"lat": 23.400830, "value": 39.0, "lng": 113.251250},
        {"lat": 22.803480, "value": 124.0, "lng": 113.168240},
        {"lat": 23.353690, "value": 100.0, "lng": 113.267940},
        {"lat": 23.23690, "value": 200.0, "lng": 113.467940},
        {"lat": 23.094140, "value": 320.0, "lng": 113.261360}],paramName:"PM10",unit:"ug/m3"};
    let renderService = new RenderService();
    let d3 = require('d3-geo');
    let projection = d3.geoMercator()
        .center([113.25,30.40])
        .scale(720)
        .translate([520,400]);
    let fs = require('fs');
    let polygon;

    fs.readFile('./data/a.json',function (err,geodata) {
        let geojson = JSON.parse(geodata);
        polygon = geojson.data;
        let poly = [];
        for(let i = 0;i<polygon.length;i++)
        {
            poly.push(polygon[i]);
            i++;
        }
        console.dir(poly);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        renderService.paintSpatial(data,[800,600],projection,poly).pngStream().pipe(res);
    });

});

module.exports = router;
