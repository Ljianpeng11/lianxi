var Vue = require('vue');
var template = require('./map.html');
var loginCtrl = require('../../controllers/loginController');
var eventHelper = require('../../utils/eventHelper');
var toolBar = require('./plugin/toolBar/toolBar');
var mapType = require('./plugin/mapType');
var layerList = require('./plugin/layerList');
var global = require('./plugin/global');
var facilityController = require('controllers/facilityController');
var infoWindow = require('./plugin/infoWindow');
var rightPanel = require('modules/rightPanel');
var mapHelper = require('utils/mapHelper');
var infoBoard = require('modules/emergencyRescue/mapTool/infoBoard');
var addressServiceInput = require('./plugin/addressServiceInput')
var tabModel = require('controllers/model/appTabModel');
var retrospectDetail = require('modules/retrospectDetail');
var statusTools = require('modules/onlineMonitor/mapPlugin/statusTools');
var deviceList = require('modules/onlineMonitor/mapPlugin/deviceList');
var devicePanel = require('modules/onlineMonitor/mapPlugin/devicePanel');
var mapConfigHelper = require('utils/mapConfigHelper');
var facilityModel = require('controllers/model/facilityModel');

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
            baseMap: {},
            baseView: {},
            graLayer: {},
            dialogVisible: false,
            showWeatherReportPanel: false,
            weatherImg: "",
            radarImg: ""
        }
    },
    methods: {
        //初始化地图
        initBaseMap: function () {
            var layerURL = 'http://112.74.51.12:6080/arcgis/rest/services/hwShow201705/MapServer';

            var centerX = 117.82261612882854;
            var centerY = 37.16445993323195;
            var zoom = 13;
            var currentMap = {};
            var currentView = {};
            var self = this;
            var apiInstance = mapHelper.getInstance();

            var map = mapHelper.initSuperMap("mapDiv", centerX, centerY, zoom, function (map, view) {
                    self.baseMap = map;
                    self.baseView = view;
                    var apiInstance = mapHelper.getInstance();
                    currentMap = map;
                    currentView = view;
                    mapHelper.registerMapTool(view, 'statusToolsBox', 'top-right');
                    //注册地图地名地址查询插件
                    mapHelper.registerMapTool(view, 'addressService', 'top-right');
                    self.graLayer.on('layerview-create', function (evt) {
                        var graView = evt.view;
                        var graLayerView = evt.layerView;
                        var layerId = evt.layerView.layer.id;
                        var getMap = {};
                        getMap.map = map;
                        getMap.view = view;
                        eventHelper.emit('get-map', getMap);
                        graView.on('click', function (event) {
                            graView.hitTest(event).then(function (response) {
                                var graphic = response.results[0].graphic;
                                var attributes = graphic.attributes;
                                if (attributes.facilityType == 'IP') {
                                    eventHelper.emit('open-facilityInfo-dialog', attributes);
                                    return;
                                }
                                // mapHelper.setCenter(graView, evt.mapPoint.x, evt.mapPoint.y);
                                if (layerId === 'graphicLayer') {
                                    self.$refs.rightPanel.open(attributes.item, attributes.facilityTypeName);
                                    return;
                                }
                            });
                        });
                    });
                }
            );
            return map;
        },
        createPoints: function (legend, subFacilities) {
            var graphics = [];
            subFacilities.forEach(function (item) {
                if (this.isNumber(item.x) && this.isNumber(item.y)) {
                    var icon = !!legend.icon ? legend.icon : legend.facilityTypeName;
                    var newIcon = './img/toolbar/huawei-' + icon + '.png';
                    item.fid = 'f' + legend.id;
                    var imgObj = {
                        url: newIcon,
                        width: "30px",
                        height: "36px"
                    };
                    var textObj = {
                        color: 'red',
                        text: item.name,
                        yoffset: -18,
                        verticalAlignment: 'top',
                        font: {
                            size: 12
                        }
                    };
                    var attributes = {
                        'item': item,
                        'facilityTypeName': legend.facilityTypeName,
                        'id': item.fid
                    };
                    var graphic = mapHelper.createPictureMarkSymbol(this.graLayer, item.x, item.y, imgObj, attributes);
                    graphics.push(graphic);
                  //graphics.push(mapHelper.createTextSymbol(this.graLayer, item.x, item.y, textObj));
                }
            }.bind(this));
            var facility = facilityModel.getFacilityByTypeName(legend.facilityTypeName);
            facility.graphics = graphics;
        },
        startPlan: function () {
            this.dialogVisible = false;
            var h = this.$createElement;
            this.$notify({
                title: '预案启动成功!',
                message: h('i', {style: 'color: teal'}, '请把易涝点水位监测，窨井水位监测的数据采集频率设置为10s/次')
            });

        },
        initPlugin: function (list) {
            this.$refs.layerList.init(list);
        },
        isNumber: function (value) {
            var patrn = /^(-)?\d+(\.\d+)?$/;
            if (patrn.exec(value) == null || value == "") {
                return false;
            } else {
                return true;
            }
        },
        initMapConfig: function () {
            var self = this;
            this.cacheLayers = {};
            mapConfigHelper.init(function (config) {
                var baseMaps = mapConfigHelper.getBaseMapConfig();
                var facilities = mapConfigHelper.getFacilityConfig();

                var centerX = 117.82261612882854;
                var centerY = 37.16445993323195;
                var zoom = 13;
                self.currentMap = {};
                self.currentView = {};
                var apiInstance = mapHelper.getInstance();
                mapHelper.initMap("mapDiv", centerX, centerY, zoom, function (map, view) {
                    self.currentMap = map;
                    self.currentView = view;
                    self.cacheLayers.baseMaps = apiInstance.processBaseMapConfig(map, baseMaps);
                    eventHelper.emit('init-map-type', mapConfigHelper.getBaseMapConfig());
                    eventHelper.on('change-map-type', function (layerID) {
                        for (var key in this.cacheLayers.baseMaps) {
                            if (key !== layerID + '') {
                                this.cacheLayers.baseMaps[key].forEach(function (layer) {
                                    layer.visible = false;
                                })
                            }
                            else {
                                this.cacheLayers.baseMaps[key].forEach(function (layer) {
                                    layer.visible = true;
                                });
                            }
                        }

                    }.bind(this));
                    eventHelper.emit('change-map-type', baseMaps[0].id);//默认选取第一张作为地图
                    if (mapConfigHelper.getFacilityConfig().length > 0) {
                        var counter = facilities.length;
                        self.graLayer = apiInstance.createGraphicsLayer(self.currentMap, 'graphicLayer');
                        self.graLayer.on('layerview-create', function (evt) {
                            var graView = evt.view;
                            var graLayerView = evt.layerView;
                            var layerId = evt.layerView.layer.id;
                            var getMap = {};
                            getMap.map = map;
                            getMap.view = view;
                            eventHelper.emit('get-map', getMap);
                            graView.on('click', function (event) {
                                graView.hitTest(event).then(function (response) {
                                    var graphic = response.results[0].graphic;
                                    var attributes = graphic.attributes;
                                    if (attributes.facilityType == 'IP') {
                                        eventHelper.emit('open-facilityInfo-dialog', attributes);
                                        return;
                                    }
                                    // mapHelper.setCenter(graView, evt.mapPoint.x, evt.mapPoint.y);
                                    if (layerId === 'graphicLayer') {
                                        self.$refs.rightPanel.open(attributes.item, attributes.facilityTypeName);
                                        return;
                                    }
                                });
                            });
                        });
                        facilities.forEach(function (facilityConfig) {
                            var url = facilityConfig.layer.url;
                            var facilityTypeName = facilityConfig.layer.funId;
                            facilityConfig.icon = facilityConfig.layer.icon1;
                            facilityConfig.facilityTypeName = facilityTypeName;
                            facilityController.getFacilityByTypeName(facilityTypeName, url, function (subFacilities) {
                                counter--;
                                facilityModel.addFacility(facilityConfig, subFacilities);
                                if (counter == 0) {
                                    //get all data;
                                    self.initPlugin(facilities);
                                }
                            })
                        });
                    }
                }.bind(this));
            }.bind(this));
        },
    },
    mounted: function () {
        var self = this;
        //初始化地图
        this.initMapConfig();
        eventHelper.on('openMapLegend', function (legend) {
            var cacheFacilities = facilityModel.getFacilityByTypeName(legend.facilityTypeName);
            if (!!cacheFacilities) {
                if (!!legend.showIcon) {
                    eventHelper.emit('loading-end');
                    self.createPoints(legend, cacheFacilities.facilities);

                } else {
                    var graphics = cacheFacilities.graphics;
                    mapHelper.removeGraphics(this.graLayer, graphics);
                }
            }
        }.bind(this));
        eventHelper.on('subFacility-clicked', function (point) {
            //self.currentView.centerAt([parseFloat(point.center[0]) + 0.005, point.center[1]]);
            this.$refs.rightPanel.open(point.item, point.facilityTypeName);
        }.bind(this));
        eventHelper.on('carDetail-clicked', function (point) {
            console.log(point);
            this.$refs.carDetail.open(point.item);
        }.bind(this));
    },
    components: {
        'layer-list': layerList,
        'info-window': infoWindow,
        'right-panel': rightPanel,
        'retrospect-detail': retrospectDetail,
        'info-board': infoBoard,
        'map-type': mapType,
        'status-tools': statusTools,
        'device-list': deviceList,
        'address-service-input': addressServiceInput,
        'device-panel': devicePanel
    }
});
module.exports = comm;