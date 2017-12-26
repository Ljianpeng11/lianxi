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
            radarImg: ""
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
                    this.initVideoGraphicsLayer(view);
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
                    this.$refs.infoWindow.loadData();
                }.bind(this));
            }.bind(this));
        },
        initVideoGraphicsLayer:function(view){
            //临时加载
            var ep820VideoLayer = mapHelper.createVideoGraphicsLayer(view.map,"ep820Video");
            var imgObj = {
                url:  './img/toolbar/buliding-video.png',
                width: "24px",
                height: "24px"
            };
            var popupTemplate = {
                title: "测试",
                content: "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('initeLTEVideo','1');\"><span>打开视频</span></button><button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('SDSSendMessage');\"><span>发短信</span></button>"
            };

            var graphic = mapHelper.createPictureMarkSymbol(ep820VideoLayer,117.84152008042109, 37.164073261494835, imgObj,{},popupTemplate);
            //测试ep820轨迹
            /*var points = [[37.16078158522525,117.81400013975333],
                [37.16074587770515,117.8141280984407],
                [37.16074888897242,117.81418424076709],
                [37.1607935393567,117.81417695695299],
                [37.16102850350542,117.81419978340911],
                [37.1610475483038,117.81421037864804],
                [37.161070900816625,117.81418172600505],
                [37.161096899650616,117.81414094469105],
                [37.1610836787862,117.81411498596941],
                [37.16119627518448,117.81411001662183],
                [37.161205114880595,117.81410818753363],
                [37.16126327184435,117.8141191390979],
                [37.16135662939532,117.81412899670694],
                [37.161457949337915,117.814131308204],
                [37.1615380202964,117.81413361781583],
                [37.16161645333695,117.81411977998056],
                [37.16168398353028,117.81412090990743],
                [37.16175577027065,117.81410897065686],
                [37.16185020227207,117.81410772676587],
                [37.162015808306734,117.81409272450219],
                [37.16209385263507,117.8140948476217],
                [37.162181347626735,117.81407841370505],
                [37.16228538388643,117.81408488881539],
                [37.16236405114765,117.81409024110502],
                [37.16246146015366,117.81409131841058],
                [37.16253988520383,117.81407545704121],
                [37.162617653139556,117.81409080769323],
                [37.16269327861203,117.8141747511878],
                [37.16276369354736,117.81417729781211],
                [37.16280246874191,117.81417244836167],
                [37.162841575558296,117.81408505383133],
                [37.162946644801835,117.81406212256103],
                [37.16304443740392,117.81405307344043],
                [37.163140261561054,117.81404383851068],
                [37.16320771904871,117.81402065417394],
                [37.16329938506756,117.81404914725066],
                [37.16338449906765,117.81406907529538],
                [37.163443371814516,117.81415709355424],
                [37.16345461502476,117.81424728891254],
                [37.1634383055143,117.81436462470755],
                [37.163457798149444,117.81447214716638],
                [37.163473548310364,117.8146047668387],
                [37.163482269513615,117.81472726239771],
                [37.16351239408901,117.81482591613536],
                [37.163534309185195,117.81491460373724],
                [37.16354820847493,117.8150527224036],
                [37.16354336067367,117.81519845962603],
                [37.163541895596644,117.81533257697973],
                [37.16355487421709,117.81545701172585],
                [37.1635328232259,117.81547216789643],
                [37.16346636731724,117.81548617245996],
                [37.16334999677576,117.81540798516444],
                [37.16394538647302,117.8157284231508],
                [37.16394538647302,117.8157284231508],
                [37.163225019262065,117.81542539865904],
                [37.16328774972514,117.81545000293711],
                [37.16333815508235,117.81550191089045],
                [37.16333815508235,117.81550191089045],
                [37.1633613640947,117.81547143623544],
                [37.16336031578723,117.81550736331818],
                [37.16336031578723,117.81550736331818],
                [37.16343435633892,117.81541375685886],
                [37.16341688850374,117.81542356172542],
                [37.16341688850374,117.81542356172542],
                [37.16341688850374,117.81542356172542],
                [37.163281988061954,117.81548068524695],
                [37.163281988061954,117.81548068524695],
                [37.163192600874304,117.81567044560134],
                [37.163165233419825,117.81554235197663],
                [37.16316815320486,117.81553606327621],
                [37.16350449190376,117.81537215297837],
                [37.163526181692596,117.8154765933411],
                [37.16351873273486,117.81547633521777],
                [37.163359987031114,117.81547781649346],
                [37.1634207913685,117.81547035620915],
                [37.163487993117855,117.81542618462178],
                [37.16346981414402,117.81541950380337],
                [37.163432897161776,117.81542847683423],
                [37.16339678303287,117.81541440094556],
                [37.16339610154788,117.81541373151556],
                [37.16319761337835,117.81559700700771],
                [37.16340429533117,117.81541138681182],
                [37.163527562749586,117.81527678441724],
                [37.16340810366018,117.81537484053466],
                [37.16330331468871,117.81551051810365],
                [37.16337513324103,117.81549480539674],
                [37.16344997308281,117.81550015227255],
                [37.16349618890008,117.81550366690253],
                [37.16354022622144,117.81537037259243],
                [37.16353117804502,117.81528794111051],
                [37.16354307238356,117.81518906443326],
                [37.163548080817314,117.81506477950279],
                [37.1634893754099,117.81498916300635],
                [37.163511199863244,117.8148367464091],
                [37.16350795341627,117.81470730014782],
                [37.16347748066312,117.81455708970583],
                [37.163465650305994,117.8144437205896],
                [37.16345878833205,117.81432403760944],
                [37.16344375254366,117.81418540494148],
                [37.16337210440587,117.81411253742809],
                [37.16327658386517,117.814085027256],
                [37.16320349061284,117.81405318208986],
                [37.163117066103716,117.81405640405109],
                [37.16301345166632,117.81406873476011],
                [37.16290625055766,117.8140630474708],
                [37.16283139935949,117.81414329726869],
                [37.16281471832957,117.8142066623221],
                [37.162774615657256,117.81416720194382],
                [37.1628940270673,117.81420496237668],
                [37.16281840520765,117.81417655027042],
                [37.16278375032819,117.81430612626956],
                [37.16283014620518,117.81424898647325],
                [37.162796709619954,117.81421943365456],
                [37.16277351655381,117.81420801423855],
                [37.16277907043083,117.81419138925243],
                [37.16279074142407,117.81420211922146],
                [37.16279324720823,117.8141918176744],
                [37.16279301436931,117.81417904289694],
                [37.162717529267255,117.81420408321411],
                [37.16265118810647,117.81416822315926],
                [37.16257839705404,117.81416725638972],
                [37.16254432830892,117.81414840371797],
                [37.16245826393334,117.81412342694503],
                [37.162363546128795,117.81411818171183],
                [37.162301921752025,117.81412841791287],
                [37.16225283120054,117.81408504662454],
                [37.16215103499446,117.81397307304896],
                [37.16219058196727,117.81412120351682],
                [37.1621982694548,117.8141635148902]];
            points.forEach(function(item){
                var y = item[0];
                item[0] = item[1];
                item[1] = y;
            })
            var styleObj = {
                color: [226, 119, 40],
                width: 4
            };
            mapHelper.createPolyline(ep820VideoLayer,points,styleObj)*/
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
        eventHelper.on('openCommandBox',function(){
            this.$refs.commandCenter.showCommandBox = true;
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
        'command-center':commandCenter
    }
});
module.exports = comm;