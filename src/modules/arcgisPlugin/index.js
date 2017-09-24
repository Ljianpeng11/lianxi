var Vue = require('vue');
var template = require('./map.html');
var loginCtrl = require('../../controllers/loginController');
var eventHelper = require('../../utils/eventHelper');
var toolBar = require('./plugin/toolBar/toolBar');
//var arcgisExpand = require('./plugin/arcgisExpand/arcgisExpand');
var mapType = require('./plugin/mapType/mapType');

/*var flexMapLegend = require('./plugin/flexMapLegend');
 var global = require('./plugin/global');
 var facilityController = require('controllers/facilityController');
 var arcgisHelper = require('./plugin/arcgisExpand/arcgis-load-map');
 var rightPanel = require('modules/rightPanel');
 var rightPanelComplaint = require('modules/rightPanelComplaint');
 var appCarMonitor = require('modules/appCarMonitor');
 var appCarPlayback = require('modules/appCarPlayback');
 var appCarDetail = require('modules/appCarDetail');
 var appCarIllegal = require('modules/appCarIllegal');
 var appCarCase = require('modules/appCarCase');
 var appCarPollution = require('modules/appCarPollution');
 var appCheckDialog = require('modules/appCheckDialog');
 var appSearch = require('modules/appSearch');*/
var mapHelper = require('utils/mapHelper');

var initPlugin = function (facilityArr, self) {
    global.init();
    facilityController.getAllFacility(function (list) {
        self.$refs.mapLegend.init(list);
        // list.forEach(function (station) {
        //     facilityArr[station.facilityTypeName] = station.facilitys;
        //     arcgisHelper.createPoints(station);
        // })
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
        }
    },
    methods: {
        //初始化地图
        initBaseMap: function () {
            var layerURL = 'http://112.74.51.12:6080/arcgis/rest/services/hwShow201705/MapServer';
            var centerX = 121.45075120184849;
            var centerY = 31.25010784918339;
            var zoom = 10;
            var map = mapHelper.initTDMap(centerX, centerY, zoom);
            return map;
        },
        //增加线
        addLines: function () {
            var self = this;
            var lineColor = [160, 82, 45];
            var lineWidth = 3;
            var attributes = {name: 'line1', lineWidth: 3};
            mapHelper.drawLineInMap(this.leftMap, lineColor, lineWidth, function (graphic, no) {
                this.$message({
                    message: '画图完毕！！',
                    type: 'success'
                });
                // var wkt = mapTran.PolygonToWKT(graphic.geometry);
                // self.drawMapForm.wkt = wkt;
                // self.drawGraphic = graphic;
                // this.queryFeatureByWkt();
                //取消对地图的编辑画图
                mapHelper.finishDraw(true, 'line');
                self.drawLineGraphics.push(graphic);
            }.bind(this), attributes);
        },
        //删除线
        deleteLines: function () {
            if (!!this.drawLineGraphics) {
                mapHelper.removeGraphics(this.leftMap, this.drawLineGraphics);
                this.drawLineGraphics = [];
            }
        },
        //增加点
        addPoints: function () {
            var self = this;
            var iconUrl = './img/toolbar/car.png';
            var iconWidth = 20;
            var iconHeight = 20;
            var attributes = {name: 'car', weight: '5T'};
            mapHelper.drawPointInMap(this.leftMap, iconUrl, iconWidth, iconHeight, function (graphic, no) {
                this.$message({
                    message: '画图完毕！！',
                    type: 'success'
                });
                // var wkt = mapTran.PolygonToWKT(graphic.geometry);
                // self.drawMapForm.wkt = wkt;
                // self.drawGraphic = graphic;
                // this.queryFeatureByWkt();
                //取消对地图的编辑画图
                mapHelper.finishDraw(true, 'point');
                self.drawPointGraphics.push(graphic);
            }.bind(this), attributes);
        },
        //删除点
        deletePoints: function () {
            if (!!this.drawPointGraphics) {
                mapHelper.removeGraphics(this.leftMap, this.drawPointGraphics);
                this.drawPointGraphics = [];
            }
        },
        //刷新地图
        refreshMap: function () {
            var layerId = '1234';
            mapHelper.refreshLayerById(this.leftMap, layerId);
        },
        //增删线条
        addOrDeleteLine: function () {
            this.isCreateLine = !this.isCreateLine;
            if (this.isCreateLine) {
                var xyArr = [[121.35633744452429, 31.291478241029097], [121.45521439764929, 31.29662808233769], [121.47306718085241, 31.291478241029097]];
                for (var i = 0; i < xyArr.length - 1; i++) {
                    this.lineLayers.push(mapHelper.drawLine(this.leftMap, xyArr[i], xyArr[i + 1], 5, [32, 160, 255], {
                        id: 3,
                        name: 'chen',
                        age: 24
                    }));
                }
            } else {
                mapHelper.removeLayers(this.leftMap, this.lineLayers);
            }

        },
        //设置地图中心点和地图显示大小
        setMapCenter: function () {
            var x = 121.49538315985632;
            var y = 31.242554748597456;
            mapHelper.setCenter(x, y, this.leftMap, 12);
        },
        //增删网格图
        addOrDeleteGrid: function () {
            this.isCreatePolygon = !this.isCreatePolygon;
            var points = [[121.41470231268835, 31.346409881654097], [121.38963975165319, 31.317227447572066], [121.46002091620397, 31.322720611634566]];
            if (this.isCreatePolygon) {
                this.graphic = mapHelper.drawPolygon(this.leftMap, points, false, '[160, 82, 45]', 3, {
                    facilityType: 'liang',
                    id: 11,
                    gridId: 121
                });
            } else {
                mapHelper.removeGraphic(this.leftMap, this.graphic);
            }
        },
        //增删单个图层
        addOrDeleteLayer: function () {
            this.iscreateSymbol = !this.iscreateSymbol;
            if (this.iscreateSymbol) {
                this.layer = mapHelper.createSymbolNew(this.leftMap, 121.38826646063757, 31.271565521302534, './img/toolbar/car.png', 20, 20, {
                    id: 1,
                    name: 'liang',
                    age: 25
                });
            } else {
                mapHelper.removeLayer(this.leftMap, this.layer);
            }
        },
        //增删多个图层
        addOrDeleteMoreLayer: function () {
            this.iscreateSymbols = !this.iscreateSymbols;
            var xyArr = [{x: 121.29385270331335, y: 31.26469906622441}, {
                x: 121.27188004706335,
                y: 31.213543975892378
            }, {x: 121.34466447089147, y: 31.213887298646284}];
            var symbolArr = [{id: 1, name: 'liang', age: 25}, {id: 2, name: 'tan', age: 26}, {
                id: 3,
                name: 'chen',
                age: 24
            }]
            if (this.iscreateSymbols) {
                for (var i = 0; i < xyArr.length; i++) {
                    this.layers.push(mapHelper.createSymbolNew(this.leftMap, xyArr[i].x, xyArr[i].y, './img/toolbar/car.png', 20, 20, symbolArr[i]));
                }

            } else {
                mapHelper.removeLayers(this.leftMap, this.layers);
            }
        },
        cancelDraw: function () {
            mapHelper.stopDraw();
        },
        //删除画图的graphics
        deleteDrawMap: function () {
            if (!!this.drawGraphics) {
                mapHelper.removeGraphics(this.leftMap, this.drawGraphics);
                this.drawGraphics = [];
            }
        },
        //开始绘制地图
        drawPolygonInMap: function () {
            var self = this;
            var lineColor = [160, 82, 45];
            var lineWidth = 3;
            var fillColor = [0, 191, 255, 0.1];
            this.polygonId++;
            //编辑地图画图
            mapHelper.drawPolygonInMap(this.leftMap, lineColor, lineWidth, fillColor, function (graphic, no) {
                this.$message({
                    message: '画图完毕！！',
                    type: 'success'
                });
                //取消对地图的编辑画图
                mapHelper.finishDraw(true, 'polygon');
                self.drawGraphics.push(graphic);
            }.bind(this), {facilityType: 'building', id: this.polygonId});
        },
        toggleSearch: function () {
            eventHelper.emit('openPointSearch');
            // eventHelper.emit('app-car-illegal');
            // eventHelper.emit('app-car-cases');
            // eventHelper.emit('app-car-pollution');
        }
    },
    mounted: function () {
 /*       this.facilityArr = {};
        initPlugin(this.facilityArr, this);*/
        var self = this;
        //初始化地图
        var map = this.initBaseMap();
        //创建地图并把地图对象穿进去
        eventHelper.emit('mapCreated', map);
        this.leftMap = map;
        this.$on('openMapLegend', function (legend) {
            eventHelper.emit('loading-start');
            console.log(legend);
            if (!!legend.showIcon) {
                var cacheFacilities = self.facilityArr[legend.facilityTypeName];
                if (!!cacheFacilities && cacheFacilities.length > 0) {
                    arcgisHelper.createPoints(cacheFacilities, legend, true);
                    eventHelper.emit('loading-end');
                } else {
                    facilityController.getFacilityByType(legend.id, function (subFacilities) {
                        var graLayer = arcgisHelper.createPoints(subFacilities, legend, true);
                        self.facilityArr[legend.facilityTypeName] = {
                            data: subFacilities,
                            layer: graLayer
                        };
                        eventHelper.emit('loading-end');
                    });
                }
            } else {
                arcgisHelper.removePoints(self.facilityArr[legend.facilityTypeName]);
                eventHelper.emit('loading-end');
            }
        });
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
        /*        'right-panel': rightPanel,
         //'right-panel-complaint': rightPanelComplaint,
         'app-car-illegal': appCarIllegal,
         'app-car-case': appCarCase,
         'app-car-pollution': appCarPollution,
         'app-car-playback': appCarPlayback,
         'flex-map-legend': flexMapLegend,
         'app-car-monitor': appCarMonitor,
         'app-check-dialog':appCheckDialog,
         'app-car-detail':appCarDetail,
         'app-search': appSearch,*/
    }
});
module.exports = comm;