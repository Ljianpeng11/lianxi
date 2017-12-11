var Vue = require('vue');
var template = require('./map.html');
var loginCtrl = require('../../controllers/loginController');
var eventHelper = require('../../utils/eventHelper');
var toolBar = require('./plugin/toolBar/toolBar');
var mapType = require('./plugin/mapType/mapType');
var newMap = require('./plugin/newMap');
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
var onlineMonitorPlugin = require('./onlineMonitorPlugin');

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
            var currentMap = {};
            var currentView = {};
            var self = this;
            var apiInstance = mapHelper.getInstance();

            var map = mapHelper.initSuperMap("mapDiv", centerX, centerY, zoom, function (map, view) {
                    self.baseMap = map;
                    self.baseView = view;
                    var apiInstance = mapHelper.getInstance();
                    self.graLayer = apiInstance.createGraphicsLayer(self.baseMap,'graphicLayer');
                    currentMap = map;
                    currentView = view;
                    /*mapHelper.registerMapTool(view, 'draw-line', 'top-right', function () {
                        var graphiceLayer = apiInstance.createGraphicsLayer(currentMap, 'testLayer');
                        mapHelper.createPolyline(graphiceLayer, [[113.32397997379353, 23.107584714889605], [113.32745611667683, 23.107584714889605]], {
                            color: [226, 119, 40],
                            width: 4
                        })
                    });*/
                    mapHelper.registerMapTool(view, 'statusToolsBox', 'top-right');
                    //注册地图地名地址查询插件
                    mapHelper.registerMapTool(view, 'addressService', 'top-right');
                    self.graLayer.on('layerview-create',function(evt){
                        var graView = evt.view;
                        var graLayerView = evt.layerView;
                        var layerId = evt.layerView.layer.id;
                        var getMap={};
                        getMap.map = map;
                        getMap.view = view;
                        eventHelper.emit('get-map', getMap);
                        graView.on('click',function(event){
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
                        });
                    });
                }
            );
            return map;
        },
        createPoint:function(legend,subFacilities){
            subFacilities.forEach(function (item) {
                if(this.isNumber(item.x)&&this.isNumber(item.y)){
                    var icon = !!legend.icon ? legend.icon : legend.facilityTypeName;
                    var newIcon = './img/toolbar/huawei-' + icon + '.png';
                    item.fid = 'f' + legend.id;
                    var imgObj = {
                        url: newIcon,
                        width: "30px",
                        height: "36px"
                    };
                    var textObj = {
                        color:'red',
                        text:item.name,
                        yoffset:-18,
                        verticalAlignment:'top',
                        font:{
                            size:12
                        }
                    };
                    var attributes = {
                        'item':item,
                        'facilityTypeName':legend.facilityTypeName,
                        'id':item.fid
                    };
                    var graphic = mapHelper.createPictureMarkSymbol(this.graLayer, item.x, item.y, imgObj,attributes);
                    this.graphics.push(graphic);
                    this.graphics.push(mapHelper.createTextSymbol(this.graLayer,item.x,item.y,textObj));
                }
            }.bind(this));
            this.facilityArr[legend.facilityTypeName] = {
                graphics:this.graphics,
                data:subFacilities,
                layer:this.graLayer
            };
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
            console.log(legend);
            if (!!legend.showIcon) {
                var cacheFacilities = self.facilityArr[legend.facilityTypeName];
                if (!!cacheFacilities && cacheFacilities.length > 0) {
                    // arcgisHelper.createPoints(cacheFacilities, legend, true);
                    eventHelper.emit('loading-end');
                } else {
                    facilityController.getFacilityByType(legend.id, function (subFacilities) {
                        // if (legend.facilityTypeName == 'CP') {
                        //     this.reportPointInterval = setInterval(function () {
                        //         var cacheFacilities = self.facilityArr[legend.facilityTypeName];
                        //         facilityController.getFacilityByType(legend.id, function (subFacilities) {
                        //             debugger;
                        //             if (cacheFacilities.data.length == subFacilities.length) {
                        //
                        //             } else {
                        //                 self.$notify({
                        //                     title: '提示信息',
                        //                     message: '新增巡查上报点',
                        //                     type: 'warning'
                        //                 });
                        //                 var items = [{
                        //                     title: '上报时间',
                        //                     content: moment().format('MM-DD HH:mm:ss', new Date())
                        //                 }, {
                        //                     title: '案件类型',
                        //                     content: subFacilities[subFacilities.length - 1].name
                        //                 }]
                        //                 eventHelper.emit('alert-point', [{
                        //                     items: items,
                        //                     x: subFacilities[subFacilities.length - 1].x,
                        //                     y: subFacilities[subFacilities.length - 1].y
                        //                 }]);
                        //                 mapHelper.removeGraphics(self.facilityArr[legend.facilityTypeName].layer,self.facilityArr[legend.facilityTypeName].graphics);
                        //                 self.createPoint(legend,subFacilities);
                        //                 cacheFacilities = self.facilityArr[legend.facilityTypeName];
                        //             }
                        //         }.bind(this));
                        //     }, 1000);
                        // } else {
                        //     if (!!self.reportPointInterval) {
                        //         clearInterval(self.reportPointInterval);
                        //         eventHelper.emit('alert-point-close');
                        //     }
                        // }
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
        'new-map':newMap,
        'online-monitor':onlineMonitorPlugin,
        'address-service-input':addressServiceInput
    }
});
module.exports = comm;