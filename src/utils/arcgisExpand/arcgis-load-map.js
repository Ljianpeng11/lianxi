cesc.define(["esri/map"], function (Map) {
    console.log(Map);
    /*    var Map = cesc.require("esri/map"),
     TDTLayer = require('./TDTLayer'),
     eventHelper = require('utils/eventHelper'),
     TDTAnnoLayer = require('./TDTAnnoLayer'),
     FeatureLayer = cesc.require("esri/layers/FeatureLayer"),
     Graphic = cesc.require("esri/graphic"),
     Color = cesc.require("esri/Color"),
     Point = cesc.require('esri/geometry/Point'),
     GraphicsLayer = cesc.require("esri/layers/GraphicsLayer"),
     PictureMarkerSymbol = cesc.require("esri/symbols/PictureMarkerSymbol"),
     TextSymbol = cesc.require("esri/symbols/TextSymbol"),
     ArcGISDynamicMapServiceLayer = cesc.require('esri/layers/ArcGISDynamicMapServiceLayer'),
     deviceModel = require('./deviceModel');*/
    var map;
    var deviceList = {};
    var savedPoint;
    return {
        /**
         * 天地图WMTS
         **/
        tdWmtsServer: function (layerURL, centerX, centerY) {
            map = new Map("mapDiv", {
                center: [centerX, centerY],
                zoom: 10
            });
            window.cesc.map = map;
            var basemap = new TDTLayer();
            //var tomcatLayer = new TomcatLayer({url:'http://172.17.5.150:8080/shenzhen/ArcgisServerTiles/_alllayers'});
            //console.log(tomcatLayer);
            //map.addLayer(tomcatLayer);
            //console.log(basemap);
            map.addLayer(basemap);
            var annolayer = new TDTAnnoLayer();
            map.addLayer(annolayer);
            var labels = new ArcGISDynamicMapServiceLayer(layerURL, {opacity: 0.6, id: '1234'});
            map.addLayer(labels);
            map.on('click', function (event) {
                console.log(event);
            });
            map.on('update-end', function () {
                console.log('地图加载完毕！');
            });
            labels.on('update-end', function () {
                console.log('地图图层加载完毕！');
            });
            deviceModel.createTextSymbol(map);
            return map;
        },
        createPoint: function (item) {
            var graLayer = new GraphicsLayer();
            deviceModel.createSymbol(Color, PictureMarkerSymbol, Point, Graphic, TextSymbol, graLayer, item.x, item.y, item.icon, item, '');
            map.addLayer(graLayer);
            return graLayer;
        },
        createPoints: function (facilitys, legend, hideName) {
            var graLayer = new GraphicsLayer();
            facilitys.forEach(function (item) {
                var icon = item.icon;
                var fid = legend.id;
                item.fid = fid;
                deviceModel.createSymbol(Color, PictureMarkerSymbol, Point, Graphic, TextSymbol, graLayer, item.x, item.y, icon, item, legend, hideName);
                //创建地图上图标
                //deviceModel.ssjkCreatePoint(map, item.id, 'f' + item.id, item.name, item.type, item.x, item.y, '', icon, '22', '22', legend.facilityTypeName, item);
            });
            graLayer.on('click', function (evt) {
                eventHelper.emit('subFacility-clicked', {
                    id: 'f' + evt.graphic.attributes.item.fid,
                    item: evt.graphic.attributes.item,
                    facilityTypeName: evt.graphic.attributes.facilityTypeName,
                    center: [evt.graphic.geometry.x, evt.graphic.geometry.y]
                });
            });
            map.addLayer(graLayer);
            return graLayer;
        },
        createDistrict: function (map) {
            deviceModel.ssjkCreatePoint(map, 999, 'f999', '兴宁区 1', 'abc', 108.36375263916017, 22.857919934082034, '', './img/mapLegend/district.png', '50', '30', 'abc', {
                fid: 123,
                name: 123
            });
        },
        //删除地图上图标
        removePoints: function (graLayer) {
            map.removeLayer(graLayer.layer);
        },
        removeGraphic: function (graphic) {
            map.graphics.remove(graphic);
        }
    }
});