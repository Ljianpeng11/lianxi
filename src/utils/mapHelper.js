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
        /**
         * 超图WMTS
         **/
        initSuperMap: function (container, centerX, centerY, zoom, cb, clickCb) {
            if (this.apiVersion !== 'C') {
                console.error('天地图只支持arcgis 方式加载');
                return;
            }
            this.apiInstance.initSuperMapLayer(container, centerX, centerY, zoom, function (map, view) {
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
        createGraphicsLayer : function (map, id){
            return this.apiInstance.createGraphicsLayer(map, id);
        },
        drawArrowPolyline : function (polyline, layer, length, angleValue, graphicColor){
            this.apiInstance.drawArrowPolyline(polyline, layer, length, angleValue, graphicColor);
        },
        clearAnalysisInfo : function (currentMap){
            this.apiInstance.clearAnalysisInfo(currentMap);
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
        createTextSymbol:function(layer,x,y,textObj){
            return this.apiInstance.createTextSymbol(layer,x,y,textObj);
        },
        createSymbol: function (layer, x, y, styleObj) {
            return this.apiInstance.createSymbol(layer, x, y, styleObj);
        },
        createPictureMarkSymbol: function (layer, x, y, imgObj,attributes) {
            return this.apiInstance.createPictureMarkSymbol(layer, x, y, imgObj,attributes);
        },
        createPictureMarkSymbol: function (layer, x, y, imgObj,attributes) {
            return this.apiInstance.createPictureMarkSymbol(layer, x, y, imgObj,attributes);
        },
        createPolygon: function (layer, coords, styleObj) {
            return this.apiInstance.createPolygon(layer, coords, styleObj);
        },
        //获取caseMap
        // getArcGISTiledMap: function (leftID,centerX, centerY, zoom, cb) {
        //     var leftMap = this.initTDMap(leftID,centerX, centerY, zoom, cb);
        //     setTimeout(function () {
        //         cb(leftMap);
        //     },100);
        //     apiInstance.createMapImageLayer(leftMap, 'http://192.168.0.213:6080/arcgis/rest/services/gz1918pipe/gz1918Pip/MapServer', 'lineLayer');
        //     // var leftLayer = new ArcGISDynamicMapServiceLayer('http://192.168.0.213:6080/arcgis/rest/services/gz1918pipe/gz1918Pip/MapServer');
        //     // var leftMap = this.initArcGISTiledMap(leftID, 'http://10.194.148.18:6080/arcgis/rest/services/guangzhoumap_gz/MapServer', cb);
        //     // leftMap.addLayer(leftLayer);
        //     return leftMap
        // },
        //设置地图中心点和地图显示层
        setCenter: function (view, x, y, zoom) {
            this.apiInstance.setCenter(view, x, y, zoom);
        },
        createPoint: function ( x, y) {
            return this.apiInstance.createPoint( x, y);
        }
    }
});