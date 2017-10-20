define(function () {
    var generateNo = function () {
        var date = new Date();
        return ('PA' + date.getTime()).substring(5);
    }
    return {
        register: function (api, cb) {
            api.getInstance(function (type, currentInstance) {
                cb();
                this.apiVersion = type;
                this.apiInstance = currentInstance;
                console.log(this.apiInstance);
            }.bind(this));
        },
        getInstance: function () {
            return this.apiInstance;
        },
        initMap: function (container, centerX, centerY, zoom, cb) {
            this.apiInstance.initMap(container, centerX, centerY, zoom, function (map) {
                cb(map);
                console.log('地图加载完毕！');
            });
        },
        /**
         * 天地图WMTS
         **/
        initTDMap: function (container, centerX, centerY, zoom, cb, clickCb) {
            if (this.apiVersion !== 'C') {
                console.error('天地图只支持arcgis 方式加载');
                return;
            }
            this.apiInstance.initTDLayer(container, centerX, centerY, zoom, function (map, view) {
                cb(map, view);
                console.log('地图加载完毕！');
            }, clickCb);
        },
        nnTraceAnalysisByRecursive:function (event, traceAnalysisType, vue, cb) {
            this.apiInstance.nnTraceAnalysisByRecursive(event, traceAnalysisType, vue, cb);
        },
        getGraphicsLayer:function (LayerId, index, map) {
            return this.apiInstance.getGraphicsLayer(LayerId, index, map);
        },
        drawArrowPolyline : function (polyline, layer, length, angleValue, graphicColor){
            this.apiInstance.drawArrowPolyline(polyline, layer, length, angleValue, graphicColor);
        },
        clearAnalysisInfo : function (){
            this.apiInstance.clearAnalysisInfo();
        },
        getLayer: function (currentMap, id) {
            var layer = this.apiInstance.getLayer(currentMap, id);
            return layer;
        },
        addLayers: function (currentMap, layers) {
            this.apiInstance.addLayers(currentMap, layers)
        },
        removeLayers: function (currentMap, layers) {
            this.apiInstance.removeLayers(currentMap, layers);
        },
        changeLineSymbolStyle: function (graphic, newStyleObj) {
            this.apiInstance.changeLineSymbolStyle(graphic, newStyleObj);
        },
        changePolygonSymbolStyle: function (graphic, newStyleObj) {
            this.apiInstance.changePolygonSymbolStyle(graphic, newStyleObj);
        },
        changeMarkSymbolStyle: function (graphic, newStyleObj) {
            this.apiInstance.changeMarkSymbolStyle(graphic, newStyleObj);
        },
        changePictureMarkSymbolStyle: function (graphic, newStyleObj) {
            this.apiInstance.changePictureMarkSymbolStyle(graphic, newStyleObj);
        },
        //删除多个图解
        removeGraphics: function (layer, graphics) {
            this.apiInstance.removeGraphics(layer, graphics)
        },
        registerMapTool: function (view, buttonId, position, cb) {
            if (this.apiVersion == 'C') {
                this.apiInstance.registerMapTool(view, buttonId, position, cb);
            }
        },
        createPolyline: function (layer, paths, styleObj) {
            return this.apiInstance.createPolyline(layer, paths, styleObj);
        },
        createMakerSymbol: function (layer, x, y, styleObj) {
            this.apiInstance.createSymbol(layer, x, y, styleObj);
        },
        createPictureMarkSymbol: function (layer, x, y, imgObj) {
            return this.apiInstance.createPictureMarkSymbol(layer, x, y, imgObj);
        },
        addPictureMarkSymbol: function (layer, x, y, imgObj,attributes) {
            return this.apiInstance.addPictureMarkSymbol(layer, x, y, imgObj,attributes);
        },
        createPolygon: function (layer, coords, styleObj) {
            this.apiInstance.createPolygon(layer, coords, styleObj);
        },

        //设置地图中心点和地图显示层
        setCenter: function (view, x, y, zoom) {
            this.apiInstance.setCenter(view, x, y, zoom)
        }
    }
});