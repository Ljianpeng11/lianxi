//右侧面板基类

//全局事件类
var eventHelper = require('utils/eventHelper');
//默认（最简）功能基类
var defaultBase = require('modules/common/defaultBase');

module.exports = defaultBase.extend({
    data: function () {
        return {
            //右侧面板插件名称，必填，且全局唯一不能重复
            pluginName: "",
            //右侧面板是否显示
            showPanel: false,
            //地图对象
            map: null,
        }
    },
    mounted: function () {
        //监听mapCreated（地图创建）事件
        eventHelper.on('mapCreated', function (map) {
            //获取到map对象
            this.map = map;
        }.bind(this));
        //监听与插件名称的同名事件，实现点击菜单弹出右侧面板
        eventHelper.on(this.pluginName, function () {
            this.showPanel = true;
        }.bind(this));
    },
    methods: {
        //关闭右侧面板
        closePanel: function () {
            this.showPanel = false;
        },
    }
});