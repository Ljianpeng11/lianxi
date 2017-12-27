var Vue = require('vue');
var template = require('./map.html');
var eventHelper = require('../../utils/eventHelper');
var toolBar = require('./plugin/toolBar/toolBar');
var mapType = require('./plugin/mapType');
var layerList = require('./plugin/layerList');
var facilityController = require('controllers/facilityController');
var infoWindow = require('./plugin/infoWindow');
var rightPanel = require('modules/rightPanel');
var mapHelper = require('utils/mapHelper');
var infoBoard = require('modules/emergencyRescue/mapTool/infoBoard');
var facilityIdentify = require('./plugin/facilityIdentify');
var addressServiceInput = require('./plugin/addressServiceInput');
var retrospectDetail = require('modules/retrospectDetail');
var statusTools = require('modules/onlineMonitor/mapPlugin/statusTools');
var deviceList = require('modules/onlineMonitor/mapPlugin/deviceList');
var devicePanel = require('modules/onlineMonitor/mapPlugin/devicePanel');
var eLTEVideo = require('modules/onlineMonitor/eLTEVideo');
var mapConfigHelper = require('utils/mapConfigHelper');
var facilityModel = require('controllers/model/facilityModel');
var commandCenter = require('modules/emergencyRescue/commandCenter');
var rainPollution = require('modules/pipeAnalysis/rainPollution');
var analysisByRoad = require('modules/pipeAnalysis/analysisByRoad');

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
            baseView: {},
            graLayer: {},
            graphics: [],
            dialogVisible: false,
            showWeatherReportPanel: false,
            weatherImg: "",
            radarImg: "",
            rainSewageLayer : "",
            isSuperRainSewageOpen : false,
            hightWaterLineLayer : "",
            isHightWaterLineOpen : false,
        }
    },
    methods: {
        //初始化地图
        /*    initBaseMap: function () {
         var layerURL = 'http://112.74.51.12:6080/arcgis/rest/services/hwShow201705/MapServer';

            var centerX = 117.82261612882854;
            var centerY = 37.16445993323195;
            var zoom = 13;
            var self = this;
            var apiInstance = mapHelper.getInstance();

            var map = mapHelper.initSuperMap("mapDiv", centerX, centerY, zoom, function (map, view) {
                    self.baseMap = map;
                    self.baseView = view;
                    var apiInstance = mapHelper.getInstance();
                    self.graLayer = apiInstance.createGraphicsLayer(self.baseMap,'graphicLayer');
                    mapHelper.registerMapTool(view, 'statusToolsBox', 'top-right');
                    //注册地图地名地址查询插件
                    mapHelper.registerMapTool(view, 'addressService', 'top-right');
                    //加载测站数据
                    facilityController.getCurrentUserFacilitysMonitor(function (list) {
                        //地图加载测站数据
                        this.createPoint(list);
                        //设备列表加载测站数据
                        this.$refs.deviceList.renderList(list);
                    }.bind(this));
                    self.graLayer.on('layerview-create',function(evt){
                        var graView = evt.view;
                        var graLayerView = evt.layerView;
                        var layerId = evt.layerView.layer.id;
                        var getMap={};
                        getMap.map = map;
                        getMap.view = view;
                        eventHelper.emit('get-map', getMap);
                    });
                }.bind(this)
            );
            return map;
        },*/
        createPoints:function(legend,facilities){
            var graphics=[];
            for(var i=0,len=facilities.length;i<len;i++){
                if(this.isNumber(facilities[i].x)&&this.isNumber(facilities[i].y)){
                    var newIcon = './img/mapLegend/gaoqing/' + legend.icon + '.png';
                    facilities[i].show = true;
                    var imgObj = {
                        url: newIcon,
                        width: "30px",
                        height: "42px"
                    };
                    var attributes = {
                        'item': facilities[i],
                        'facilityTypeName': facilities[i].facilityTypeName,
                        'id': facilities[i].fid
                    };
                    var graphic = mapHelper.createPictureMarkSymbol(this.graLayer, facilities[i].x, facilities[i].y, imgObj, attributes);
                    graphics.push(graphic);
                }
            }
            var facility = facilityModel.getFacilityByTypeName(legend.facilityTypeName);
            facility.graphics = graphics;
            //eventHelper.emit('alert-point', facilities, false);
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
                var centerAndZoom = mapConfigHelper.getCenterAndZoom();
                var centerX = centerAndZoom.x;
                var centerY = centerAndZoom.y;
                var zoom = centerAndZoom.zoom;
                self.currentMap = {};
                var apiInstance = mapHelper.getInstance();
                mapHelper.initMap("mapDiv", centerX, centerY, zoom, function (map, view) {
                    self.currentMap = map;
                    self.baseView = view;
                    self.cacheLayers.baseMaps = apiInstance.processBaseMapConfig(map, baseMaps);
                    //临时加载管网图层
                    mapHelper.initFacilitySuperMap(view);
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
                              /*      if (layerId === 'graphicLayer') {
                                        eventHelper.emit('openDevicePanel',selectItem);
                                        self.$refs.rightPanel.open(attributes.item, attributes.facilityTypeName);
                                        return;
                                    }*/
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
                    eventHelper.emit('change-map-type', baseMaps[0].id);//默认选取第一张作为地图
                    mapHelper.registerMapTool(view, 'statusToolsBox', 'top-right');
                    //注册地图地名地址查询插件
                    mapHelper.registerMapTool(view, 'addressService', 'top-right');
                    //初始化ep820视频图层
                    this.initVideoGraphicsLayer(view);
                    this.$refs.infoWindow.loadData();
                }.bind(this));
            }.bind(this));
        },
        initVideoGraphicsLayer:function(view){
            //临时加载
            var ep820VideoLayer = mapHelper.createGraphicsLayer(view.map,"ep820Video");
        }
    },
    mounted: function () {
        var self = this;
        //初始化地图
        this.initMapConfig();
        eventHelper.on('openMapLegend', function (legend) {
            var cacheFacilities = facilityModel.getFacilityByTypeName(legend.facilityTypeName);
            if (!!cacheFacilities && !!cacheFacilities.facilities && cacheFacilities.facilities.length > 0) {
                if (!!legend.showIcon) {
                    self.createPoints(legend, cacheFacilities.facilities);
                } else {
                    eventHelper.emit('alert-point-close', cacheFacilities.facilities);
                    var graphics = cacheFacilities.graphics;
                    mapHelper.removeGraphics(this.graLayer, graphics);
                }
            }
            eventHelper.emit('loading-end');
        }.bind(this));
        eventHelper.on('subFacility-clicked', function (point) {
            console.log(point);
            map.centerAt([parseFloat(point.center[0]) + 0.005, point.center[1]]);
            this.$refs.rightPanel.open(point.item, point.facilityTypeName);
        }.bind(this));
        //开启应急调度功能
        eventHelper.on('openCommandBox',function(){
            if(this.$refs.devicePanel.isOpenPanel){
                this.$refs.devicePanel.isOpenPanel = false;
            }
            if(this.$refs.rainPollution.openRainPollution){
                this.$refs.rainPollution.openRainPollution = false;
            }
            this.$refs.commandCenter.init();
        }.bind(this));
        //开启雨污分析功能
        eventHelper.on('openRainPollution',function(){
            mapHelper.setCenter(this.baseView,117.8391141229457,37.16665107307562,13);
            if(this.$refs.devicePanel.isOpenPanel){
                this.$refs.devicePanel.isOpenPanel = false;
            }
            if(this.$refs.commandCenter.showCommandBox){
                this.$refs.commandCenter.showCommandBox = false;
            }
            if(this.$refs.analysisRoad.openAnalysisRoadBox){
                this.$refs.analysisRoad.openAnalysisRoadBox = false;
            }
            this.$refs.rainPollution.init();
            if(this.isSuperRainSewageOpen){
                this.isSuperRainSewageOpen = false;
                this.rainSewageLayer.visible = false;
            }else{
                this.isSuperRainSewageOpen = true;
                //临时加载雨污分析图层
                this.rainSewageLayer = mapHelper.initSuperRainSewageMapLayer(this.baseView);
                this.rainSewageLayer.opacity = 0.45;
            }
        }.bind(this));
        //开启高水位管线分析功能
        eventHelper.on('openAnalysisRoad',function(){
            mapHelper.setCenter(this.baseView,117.8391141229457,37.16665107307562,13);
            if(this.$refs.devicePanel.isOpenPanel){
                this.$refs.devicePanel.isOpenPanel = false;
            }
            if(this.$refs.commandCenter.showCommandBox){
                this.$refs.commandCenter.showCommandBox = false;
            }
            if(this.$refs.rainPollution.openRainPollution){
                this.$refs.rainPollution.openRainPollution = false;
            }
            this.$refs.analysisRoad.init();
            if(this.isHightWaterLineOpen){
                this.isHightWaterLineOpen = false;
                this.hightWaterLineLayer.visible = false;
            }else{
                this.isHightWaterLineOpen = true;
                //临时加载高水位隐患排查图层
                this.hightWaterLineLayer = mapHelper.initSuperHighWaterLineMapLayer(this.baseView);
                this.hightWaterLineLayer.opacity = 0.75;
            }
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
        'device-panel': devicePanel,
        'elte-video' :eLTEVideo,
        'facility-identify' :facilityIdentify,
        'command-center':commandCenter,
        'rain-pollution':rainPollution,
        'analysis-road':analysisByRoad
    }
});
module.exports = comm;