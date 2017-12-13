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
            baseMap:{},
            baseView:{},
            graLayer:{},
            graphics:[],
            dialogVisible:false,
            showWeatherReportPanel:false,
            weatherImg:"",
            radarImg:""
        }
    },
    methods: {
        //初始化地图
        initBaseMap: function () {
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
                        /*graView.on('click',function(event){
                            graView.hitTest(event).then(function(response){
                                var graphic = response.results[0].graphic;
                                var attributes = graphic.attributes;
                                if(attributes.facilityType == 'IP'){
                                    eventHelper.emit('open-facilityInfo-dialog',attributes);
                                    return;
                                }
                                // mapHelper.setCenter(graView, evt.mapPoint.x, evt.mapPoint.y);
                                if(layerId === 'graphicLayer'){
                                    self.$refs.rightPanel.open(attributes.item, attributes.facilityTypeName);
                                    return;
                                }
                            });
                        });*/
                    });
                }.bind(this)
            );
            return map;
        },
        createPoint:function(facilities){
            for(var i=0,len=facilities.length;i<len;i++){
                if(this.isNumber(facilities[i].x)&&this.isNumber(facilities[i].y)){
                    var apiInstance = mapHelper.getInstance();
                    var facilityGraphicLayer = apiInstance.getGraphicsLayer(facilities[i].facilityTypeName+"GraphicLayer",1,this.baseMap);
                    //facilities[i].facilityTypeName
                    var newIcon = './img/mapLegend/gaoqing/yj-01.png';
                    //facilities[i].fid = 'f' + legend.id;
                    facilities[i].show = true;
                    var imgObj = {
                        url: newIcon,
                        width: "24px",
                        height: "24px"
                    };
                    var attributes = {
                        'item':facilities[i],
                        'facilityTypeName':facilities[i].facilityTypeName,
                        'id':facilities[i].fid
                    };
                    var graphic = mapHelper.createPictureMarkSymbol(facilityGraphicLayer, facilities[i].x, facilities[i].y, imgObj,attributes);
                    facilityGraphicLayer.add(graphic)
                }
            }
            eventHelper.emit('alert-point', facilities, false);
        },
        startPlan: function () {
            this.dialogVisible = false;
            var h = this.$createElement;
            this.$notify({
                title: '预案启动成功!',
                message: h('i', {style: 'color: teal'}, '请把易涝点水位监测，窨井水位监测的数据采集频率设置为10s/次')
            });

        },
        initPlugin: function (facilityArr, self) {
            //global.init();
            facilityController.getAllFacilityType(function (list) {
                self.$refs.layerList.init(list);
            });
        },
        isNumber:function (value) {
            var patrn = /^(-)?\d+(\.\d+)?$/;
            if (patrn.exec(value) == null || value == "") {
                return false;
            } else {
                return true;
            }
        }
    },
    mounted: function () {
        //加载设备
        this.facilityArr = {};
        this.initPlugin(this.facilityArr, this);
        var self = this;
        //初始化地图
        this.initBaseMap();
        eventHelper.on('openMapLegend', function (legend) {
            eventHelper.emit('loading-start');
            if (!!legend.showIcon) {
                var cacheFacilities = self.facilityArr[legend.facilityTypeName];
                if (!!cacheFacilities && cacheFacilities.length > 0) {
                    eventHelper.emit('loading-end');
                } else {
                    facilityController.getFacilityByType(legend.id, function (subFacilities) {
                        self.createPoint(legend,subFacilities);
                        eventHelper.emit('loading-end');
                    });
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
        'right-panel':rightPanel,
        'retrospect-detail':retrospectDetail,
        'info-board':infoBoard,
        'map-type':mapType,
        'status-tools':statusTools,
        'device-list':deviceList,
        'address-service-input':addressServiceInput,
        'device-panel':devicePanel
    }
});
module.exports = comm;