var template = require('./map.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {

        }
    },
    methods: {
        //初始化地图
        initBaseMap: function () {
            var centerX = 117.80633295234286;
            var centerY = 37.18682244869559;
            var zoom = 12;
            var self = this;
            var apiInstance = mapHelper.getInstance();
            var map = mapHelper.initSuperMap("dispatcheCenterNapDiv", centerX, centerY, zoom, function (map, view) {
                    self.baseMap = map;
                }
            );
            return map;
        }
    },
    mounted: function () {
        this.initBaseMap();
    },
    components: {
    }
});
module.exports = comm;