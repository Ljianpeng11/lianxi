//引用组件或视图

//此功能对应的视图（html）
var template = require('./mapDemo.html');
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
            pluginName: "mapDemo",
        }
    },
    methods: {
        mapWindowDemo: function () {
            //获取map（地图），然后可以通过map调用地图相关功能
            var map = this.map;
            map.on("click", function (evt) {
                var mapPoint = evt.mapPoint;

                mapHelper.addMapWindow(map, mapPoint.x, mapPoint.y);

                // var point = new Point(mapPoint.x, mapPoint.y, map.spatialReference.wkid);
                // var sms = new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5]));
                // // var attr = {"Xcoord": evt.mapPoint.x, "Ycoord": evt.mapPoint.y, "Plant": "Mesa Mint"};
                // var infoTemplate = new InfoTemplate("Vernal Pool Locations", "Latitude: ");
                // var graphic = new Graphic(point, sms, {}, infoTemplate);
                //
                // var graLayer = new GraphicsLayer({id: layerId});
                //
                // graLayer.add(graphic);

                // var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([160, 82, 45]), lineWidth);
                // var graphic = new Graphic(line, symbol);

                // var features = graphics;
                // features.forEach(function (feature) {
                //     var graphic = this.drawLines(feature, 3, feature.id);//直接feature转图形
                //     graLayer.add(graphic);
                // }.bind(this));

                // map.addLayer(graLayer);
            });
        }
    }
});

module.exports = comm;