var Vue = require('vue');
var template = require('./map.html');
var loginCtrl = require('../../controllers/loginController');
var eventHelper = require('../../utils/eventHelper');
var toolBar = require('./plugin/toolBar/toolBar');
var mapType = require('./plugin/mapType/mapType');
var layerList = require('./plugin/layerList');
var global = require('./plugin/global');
var facilityController = require('controllers/facilityController');
var infoWindow = require('./plugin/infoWindow');
var rightPanel = require('modules/rightPanel');
var mapHelper = require('utils/mapHelper');
var tabModel = require('controllers/model/appTabModel');


var initPlugin = function (facilityArr, self) {
    global.init();
    facilityController.getAllFacility(function (list) {
        self.$refs.mapLegend.init(list);
    });
}

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            message: '',
            roleName: '',
            userName: '',
            loginSuccess: false,
            detailOpen: false,
            facility: '',
            showtools: false,
            leftMap: {},
            iscreateSymbol: false,
            iscreateSymbols: false,
            isCreatePolygon: false,
            isCreateLine: false,
            layer: '',
            layers: [],
            lineLayers: [],
            drawGraphics: [],
            drawPointGraphics: [],
            drawLineGraphics: [],
            polygonId: 1,
            baseMap:{}
        }
    },
    methods: {
        //初始化地图
        initBaseMap: function () {
            var layerURL = 'http://112.74.51.12:6080/arcgis/rest/services/hwShow201705/MapServer';
            var centerX = 121.45075120184849;
            var centerY = 31.25010784918339;
            var zoom = 10;
            var currentMap = {};
            var currentView = {};
            var self = this;
            var apiInstance = mapHelper.getInstance();
            var map = mapHelper.initTDMap('', centerX, centerY, zoom, function (map, view) {
                self.baseMap = map;
                currentMap = map;
                currentView = view;
                apiInstance.createMapImageLayer(currentMap, layerURL, 'haimianlayer');
                mapHelper.registerMapTool(view, 'draw-line', 'top-right', function () {
                    var graphiceLayer = apiInstance.createGraphicsLayer(currentMap, 'testLayer');
                    mapHelper.createPolyline(graphiceLayer, [[113.32397997379353, 23.107584714889605], [113.32745611667683, 23.107584714889605]], {
                        color: [226, 119, 40],
                        width: 4
                    })
                });
            }, function (evt) {
                console.log(evt);
                mapHelper.setCenter(currentView, evt.mapPoint.x, evt.mapPoint.y);
            });
            return map;
        }
    },
    mounted: function () {
        //加载设备
        this.facilityArr = {};
        initPlugin(this.facilityArr, this);
        var self = this;
        //初始化地图
        this.initBaseMap();
        eventHelper.on('openMapLegend', function (legend) {
            eventHelper.emit('loading-start');
            console.log(legend);
            if (!!legend.showIcon) {
                var cacheFacilities = self.facilityArr[legend.facilityTypeName];
                if (!!cacheFacilities && cacheFacilities.length > 0) {
                    // arcgisHelper.createPoints(cacheFacilities, legend, true);
                    eventHelper.emit('loading-end');
                } else {
                    facilityController.getFacilityByType(legend.id, function (subFacilities) {
                        if (legend.facilityTypeName == 'WD') {
                            subFacilities.forEach(function (subFacility) {
                                subFacility.icon = './css/images/huawei-yj.png'
                            })
                        } else if (legend.facilityTypeName == 'WP') {
                            subFacilities.forEach(function (subFacility) {
                                subFacility.icon = './css/images/huawei-yld.png'
                            })
                        }
                        var apiInstance = mapHelper.getInstance();
                        var graLayer = apiInstance.createGraphicsLayer(this.baseMap,legend.id);
                        var graphics = [],textSymbols = [];
                        subFacilities.forEach(function (item) {
                            var icon = legend.icon;
                            if (!!item.icon) {
                                icon = item.icon;
                            }
                            var imgObj = {
                                url: icon,
                                width: "30px",
                                height: "36px"
                            };
                            var styleObj = {
                                color:'blue',
                                size:'8px'
                            };
                            graphics.push(mapHelper.createPictureMarkSymbol(graLayer, item.x, item.y, imgObj));
                            markerSymbols.push(mapHelper.createMarkerSymbol(graLayer,item.x,item.y,styleObj))
                        });
                        self.facilityArr[legend.facilityTypeName] = {
                            graphics:graphics,
                            layer:graLayer
                        }
                        eventHelper.emit('loading-end');
                    }.bind(this));
                }
            } else {
                var layer = self.facilityArr[legend.facilityTypeName].layer;
                var graphics = self.facilityArr[legend.facilityTypeName].graphics;
                mapHelper.removeGraphics(layer,graphics);
                eventHelper.emit('loading-end');
            }
        }.bind(this));
        eventHelper.on('subFacility-clicked', function (point) {
            console.log(point);
            map.centerAt([parseFloat(point.center[0]) + 0.005, point.center[1]]);
            this.$refs.rightPanel.open(point.item, point.facilityTypeName);
        }.bind(this));
        eventHelper.on('carDetail-clicked', function (point) {
            console.log(point);
            this.$refs.carDetail.open(point.item);
        }.bind(this));
    },
    components: {
        'layer-list':layerList,
        'info-window': infoWindow,
        'right-panel':rightPanel
    }
});
module.exports = comm;