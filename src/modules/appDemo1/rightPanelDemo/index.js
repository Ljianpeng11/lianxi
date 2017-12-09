//引用组件或视图

//此功能对应的视图（html）
var template = require('./rightPanelDemo.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//全局事件类
var eventHelper = require('utils/eventHelper');
//地图操作类
var mapHelper = require('utils/mapHelper.js');
//右侧面板基类
var rightPanelBase = require('modules/common/rightPanelBase');

var comm = rightPanelBase.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            //右侧面板插件名称，必填，且全局唯一不能重复
            pluginName: "rightPanelDemo",
        }
    },
    methods: {}
});

module.exports = comm;