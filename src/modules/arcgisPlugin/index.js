var Vue = require('vue');
var template = require('./map.html');
var loginCtrl = require('../../controllers/loginController');
var eventHelper = require('../../utils/eventHelper');
var toolBar = require('./plugin/toolBar/toolBar');
var mapType = require('./plugin/mapType/mapType');
var flexMapLegend = require('./plugin/flexMapLegend');
var global = require('./plugin/global');
var facilityController = require('controllers/facilityController');
var arcgisHelper = require('./plugin/arcgisExpand/arcgis-load-map');
var rightPanel = require('modules/rightPanel');
var infoWindow = require('modules/arcgisPlugin/plugin/infoWindow');
var initBaseMap = function () {
    //init map
    var layerURL = 'http://112.74.51.12:6080/arcgis/rest/services/hwShow201705/MapServer';
    var centerX = 113.32526513187868;
    var centerY = 23.145541015892572;
    var map = arcgisHelper.tdWmtsServer(layerURL, centerX, centerY);
    return map;
}
var initPlugin = function (facilityArr, self) {
    global.init();
    facilityController.getAllFacilityType(function (list) {
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
            weatherImg: './img/weather.png',
            radarImg: '',
            message: '',
            roleName: '',
            userName: '',
            dialogVisible: false,
            showWeatherReportPanel: false,
            loginSuccess: false,
            detailOpen: false,
            facility: '',
            showtools: false
        }
    },
    methods: {
        startPlan: function () {
            this.dialogVisible = false;
            var h = this.$createElement;
            this.$notify({
                title: '预案启动成功!',
                message: h('i', {style: 'color: teal'}, '请把易涝点水位监测，窨井水位监测的数据采集频率设置为10s/次')
            });

        },
        toggleSearch: function () {
            eventHelper.emit('openPointSearch');
            // eventHelper.emit('app-car-illegal');
            // eventHelper.emit('app-car-cases');
            // eventHelper.emit('app-car-pollution');
        }
    },
    mounted: function () {
        this.facilityArr = {};
        initPlugin(this.facilityArr, this);
        var self = this;
        var map = initBaseMap();
        eventHelper.emit('mapCreated', map);
        this.$on('openMapLegend', function (legend) {
            eventHelper.emit('loading-start');
            //console.log(legend);
            if (!!legend.showIcon) {
                var cacheFacilities = self.facilityArr[legend.facilityTypeName];
                if (!!cacheFacilities && cacheFacilities.length > 0) {
                    arcgisHelper.createPoints(cacheFacilities, legend);
                    eventHelper.emit('loading-end');
                } else {
                    facilityController.getFacilityByType(legend.id, function (subFacilities) {
                        switch(legend.facilityTypeName){
                            case 'WD' :
                                subFacilities.forEach(function (subFacility) {
                                    subFacility.icon = './css/images/huawei-yj.png'
                                });
                                break;
                            case 'WP' :
                                subFacilities.forEach(function (subFacility) {
                                    subFacility.icon = './css/images/huawei-yld.png'
                                });
                                break;
                            case 'RTU' :
                                subFacilities.forEach(function (subFacility) {
                                    subFacility.icon = './css/images/huawei-ylz.png'
                                });
                                break;
                            default :
                                subFacilities.forEach(function (subFacility) {
                                    subFacility.icon = './css/images/huawei-yl.png'
                                });
                                break;
                        }
                        var graLayer = arcgisHelper.createPoints(subFacilities, legend);
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
            // console.log(point);
            map.centerAt([parseFloat(point.center[0]) + 0.001, point.center[1]]);
            this.$refs.rightPanel.open(point.item, point.facilityTypeName);
        }.bind(this));
        eventHelper.on('startPlan', function () {
            setTimeout(function () {
                this.dialogVisible = true;
                this.showWeatherReportPanel = true;
                var i = 1;
                this.radarCounter = setInterval(function () {
                    if (i > 47) {
                        i = 1;
                    }
                    this.radarImg = './img/radar/' + i + '.png';
                    i++;
                }.bind(this), 500);
            }.bind(this), 2000);
        }.bind(this));
        eventHelper.on('stopPlan', function () {
            this.showWeatherReportPanel = false;
            clearInterval(this.radarCounter);

        }.bind(this));
    },
    components: {
        'right-panel': rightPanel,
        'flex-map-legend': flexMapLegend,
        'info-window': infoWindow
    }
});
module.exports = comm;