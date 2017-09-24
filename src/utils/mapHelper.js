define(function () {
    var apiInstance = {};
    var apiVersion = '';
    /*    var Map = cesc.require("esri/map"),
     eventHelper = require('utils/eventHelper'),
     ArcGISTiledMapServiceLayer = cesc.require('esri/layers/ArcGISTiledMapServiceLayer'),
     ArcGISDynamicMapServiceLayer = cesc.require('esri/layers/ArcGISDynamicMapServiceLayer'),
     TDTAnnoLayer = require('modules/arcgisPlugin/plugin/arcgisExpand/TDTAnnoLayer'),
     TDTLayer = require('modules/arcgisPlugin/plugin/arcgisExpand/TDTLayer'),
     Point = cesc.require('esri/geometry/Point'),
     Extent = cesc.require("esri/geometry/Extent"),
     SpatialReference = cesc.require('esri/SpatialReference'),
     Polygon = cesc.require("esri/geometry/Polygon"),
     Polyline = cesc.require("esri/geometry/Polyline"),
     Graphic = cesc.require("esri/graphic"),
     Color = cesc.require("esri/Color"),
     Font = cesc.require("esri/symbols/Font"),
     GraphicsLayer = cesc.require("esri/layers/GraphicsLayer"),
     TextSymbol = cesc.require("esri/symbols/TextSymbol"),
     CartographicLineSymbol = cesc.require('esri/symbols/CartographicLineSymbol'),
     SimpleMarkerSymbol = cesc.require("esri/symbols/SimpleMarkerSymbol"),
     SimpleLineSymbol = cesc.require("esri/symbols/SimpleLineSymbol"),
     SimpleFillSymbol = cesc.require("esri/symbols/SimpleFillSymbol"),
     PictureMarkerSymbol = cesc.require("esri/symbols/PictureMarkerSymbol");
     var newColor = new Color([0, 191, 255, 0.25]);
     var oldColor = new Color([181, 119, 196, 0.25]);
     var highLightColor = new Color([229, 14, 14, 0.7]);
     var map;*/
    var generateNo = function () {
        var date = new Date();
        return ('PA' + date.getTime()).substring(5);
    }
    return {
        register: function (api, cb) {
            api.getInstance(function (type, currentInstance) {
                cb();
                apiVersion = type;
                apiInstance = currentInstance;
                console.log(apiInstance);
            }.bind(this));
        },
        /**
         * 天地图WMTS
         **/
        initTDMap: function (centerX, centerY, zoom) {
            var map = apiInstance.initTDLayer();
            return map;
        },
        initTDWmtsServer: function (layerURL, centerX, centerY, zoom) {//传入地图图层服务路径以及中心点位置
            map = new Map("mapDiv", {
                center: [centerX, centerY],
                zoom: zoom
            });
            window.cesc.map = map;
            var basemap = new TDTLayer();//基本地图图层
            //var tomcatLayer = new TomcatLayer({url:'http://172.17.5.150:8080/shenzhen/ArcgisServerTiles/_alllayers'});
            //console.log(tomcatLayer);
            //map.addLayer(tomcatLayer);
            //console.log(basemap);
            map.addLayer(basemap);
            var annolayer = new TDTAnnoLayer();//文字注解图层
            map.addLayer(annolayer);
            var labels = new ArcGISDynamicMapServiceLayer(layerURL, {opacity: 0.6, id: '1234'});
            map.addLayer(labels);
            map.on('click', function (event) {
                console.log(event);
            });
            map.on('update-end', function () {
                console.log('地图加载完毕！');
            });
            labels.on('update-end', function () {
                console.log('地图图层加载完毕！');
            });
            return map;
        }
        ,
        //刷新地图图层
        refreshLayerById: function (currentMap, LayerId) {
            var graphicsLayer = currentMap.getLayer(LayerId);
            if (!!graphicsLayer) {
                graphicsLayer.refresh();
            }
        }
        ,
        //根据状态改变点的填充颜色
        revertSymbol: function (graphic) {
            var color = newColor;
            if (graphic.attributes.building.status == 1) {
                color = oldColor;
            }
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([160, 82, 45]), 2), color);
            graphic.setSymbol(symbol);
        }
        ,
        //重新设置symbol的线和填充颜色
        changeSymbol: function (graphic, lineColor, lineWidth, fillColor) {
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color(lineColor), lineWidth), new Color(fillColor));
            graphic.setSymbol(symbol);
        }
        ,
        //改变线的样式
        changeLineSymbol: function (graphic, lineColor, lineWidth) {
            var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(lineColor), lineWidth);
            graphic.setSymbol(symbol);
        }
        ,
        // revertLineSymbol: function (graphic) {
        //     var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([241, 104, 15, 0.8]), 2);
        //     graphic.setSymbol(symbol);
        // },
        //地图编辑画面
        drawPolygonInMap: function (map, lineColor, lineWidth, fillColor, cb, attributes) {
            var DrawPolygonInMap = cesc.dojo.require("esri/toolbars/draw");
            this.drawPolygonPen = new DrawPolygonInMap(map, {
                showTooltips: true
            });
            this.isDrawing = true;
            this.drawPolygonPen.activate(DrawPolygonInMap.POLYGON);
            this.drawPolygonPen.on('draw-end', function (evtObj) {
                if (this.isDrawing) {
                    this.isDrawing = false;
                    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(lineColor), lineWidth), new Color(fillColor));
                    var graphic = new Graphic(evtObj.geometry, symbol);
                    var no = generateNo();
                    graphic.attributes = attributes;
                    cb(graphic, no);
                    map.graphics.add(graphic);
                    map.graphics.on('click', function (event) {
                        console.log(event.graphic.attributes);
                    });
                }
            }.bind(this));
        }
        ,
        //画点
        drawPointInMap: function (map, iconUrl, pictureWidth, pictureHeight, cb, attributes) {
            var DrawPointInMap = cesc.dojo.require("esri/toolbars/draw");
            this.drawPointPen = new DrawPointInMap(map, {
                showTooltips: true
            });
            this.isDrawing = true;
            this.drawPointPen.activate(DrawPointInMap.POINT);
            this.drawPointPen.on('draw-end', function (evtObj) {
                if (this.isDrawing) {
                    this.isDrawing = false;
                    var pictureMarkerSymbol = new PictureMarkerSymbol(iconUrl, pictureWidth, pictureHeight);
                    var graphic = new Graphic(evtObj.geometry, pictureMarkerSymbol);
                    var no = generateNo();
                    if (!!attributes) {
                        graphic.attributes = attributes;
                    }
                    cb(graphic, no);
                    map.graphics.add(graphic);
                    map.graphics.on('click', function (event) {
                        console.log(event.graphic.attributes);
                    });
                }
            }.bind(this));
        }
        ,
        //画线
        drawLineInMap: function (map, lineColor, lineWidth, cb, attributes) {
            var DrawLineInMap = cesc.dojo.require("esri/toolbars/draw");
            this.drawLinePen = new DrawLineInMap(map, {
                showTooltips: true
            });
            this.isDrawing = true;
            this.drawLinePen.activate(DrawLineInMap.POLYLINE);
            this.drawLinePen.on('draw-end', function (evtObj) {
                if (this.isDrawing) {
                    this.isDrawing = false;
                    var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(lineColor), lineWidth);
                    var graphic = new Graphic(evtObj.geometry, lineSymbol);
                    var no = generateNo();
                    if (!!attributes) {
                        graphic.attributes = attributes;
                    }
                    cb(graphic, no);
                    map.graphics.add(graphic);
                    map.graphics.on('click', function (event) {
                        console.log(event.graphic.attributes);
                    });
                }
            }.bind(this));
        }
        ,
        //停止polygon绘制
        stopDraw: function () {
            this.drawPolygonPen.finishDrawing();
            this.drawPolygonPen.deactivate();
        }
        ,
        //结束画图
        finishDraw: function (isSave, type) {
            this.isSave = isSave;
            if (type === 'point') {
                this.drawPointPen.finishDrawing();
                this.drawPointPen.deactivate();
            } else if (type === 'line') {
                this.drawLinePen.finishDrawing();
                this.drawLinePen.deactivate();
            } else if (type === 'polygon') {
                this.drawPolygonPen.finishDrawing();
                this.drawPolygonPen.deactivate();
            }

        }
        ,
        //创建一个新的图层，并创建图例符号(传入icon，根据属性判断是否需要文字描述)
        createSymbolNew: function (baseMap, x, y, iconUrl, pictureWidth, pictureHeight, attributes) {
            var pictureMarkerSymbol = new PictureMarkerSymbol(iconUrl, pictureWidth, pictureHeight);
            var geometry = new Point(x, y);
            var graphic = new Graphic(geometry, pictureMarkerSymbol);
            graphic.attributes = attributes;
            var graLayer = new GraphicsLayer();
            if (!!attributes) {
                var textSymbol = new TextSymbol();
                textSymbol.setText(attributes.id);
                textSymbol.setColor(new Color([255, 0, 0, 1]));
                textSymbol.setFont("12pt");
                textSymbol.setOffset(0, -20);
                var graphic1 = new Graphic(geometry, textSymbol);
                graLayer.add(graphic1);
            }
            graLayer.add(graphic);
            graLayer.on('click', function (evt) {
                console.log(123);
                console.log(evt.graphic.attributes);
            })
            baseMap.addLayer(graLayer);
            return graLayer;
        }
        ,
        //删除单个图层
        removeLayer: function (map, layer) {
            map.removeLayer(layer);
        }
        ,
        //删除多个图层
        removeLayers: function (map, layers) {
            layers.forEach(function (layer) {
                this.removeLayer(map, layer);
            }.bind(this));
        }
        ,
        createSymbol: function (baseMap, x, y, iconUrl, name, height, width, angel) {
            var pictureMarkerSymbol = new PictureMarkerSymbol(iconUrl, width, height);
            console.log(angel);
            pictureMarkerSymbol.setAngle(Math.abs(360 - 90 - angel));
            var geometry = new Point(x, y);
            var graphic = new Graphic(geometry, pictureMarkerSymbol);
            var graLayer = new GraphicsLayer();
            var textSymbol = new TextSymbol();
            textSymbol.setText(name);
            textSymbol.setColor(new Color([255, 0, 0, 1]));
            textSymbol.setFont("8pt");
            textSymbol.setOffset(0, -20);
            var graphic1 = new Graphic(geometry, textSymbol);
            graLayer.add(graphic1);
            graLayer.add(graphic);
            baseMap.addLayer(graLayer);
            return graLayer;
        }
        ,
        drawPolygons: function (baseMap, map) {
            var graLayer = new GraphicsLayer();
            var features = map.features;
            features.forEach(function (feature) {
                var points = JSON.parse(feature.coord);
                var graphic = this.drawPolygon(points);

                graphic.attributes = {facilityType: 'building', id: feature.id, gridId: map.id};
                graLayer.add(graphic);
            }.bind(this));
            baseMap.addLayer(graLayer);
        }
        ,
        //根据两点坐标进行画线（直接生成）
        drawLine: function (map, start, end, lineWidth, lineColor, attributes) {
            var no = generateNo();
            var line = Polyline({
                "paths": [[start, end]],
                "spatialReference": {"wkid": no}
            });
            var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(lineColor), lineWidth);
            var graphic = new Graphic(line, symbol);
            if (!!attributes) {
                graphic.attributes = attributes;
            }
            var graLayer = new GraphicsLayer();
            graLayer.add(graphic);
            graLayer.on('click', function (event) {
                console.log(event.graphic.attributes);
            });
            // map.graphics.add(graphic);
            map.addLayer(graLayer);
            return graLayer;
        }
        ,
        // drawAnalyzeLine: function (map, start, end, type) {
        //     var no = generateNo();
        //     var line = Polyline({
        //         "paths": [[start, end]],
        //         "spatialReference": {"wkid": no}
        //     });
        //     var color = new Color([241, 104, 15]);
        //     if (type == '污水') {
        //         color = new Color([236, 7, 229]);
        //     } else if (type == '雨水') {
        //         color = new Color([7, 109, 236]);
        //     }
        //     var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, color, 5);
        //     var graphic = new Graphic(line, symbol);
        //     map.graphics.add(graphic);
        //     return graphic;
        // },
        // createPolyon: function (map, points, isHighLight) {
        //     var graphic = this.drawPolygon(points, isHighLight);
        //     map.graphics.add(graphic);
        //     return graphic;
        // },
        // drawPolygonWithData: function (map, building, isNew) {
        //     var graphic = this.drawPolygon(JSON.parse(building.coord), isNew);
        //     graphic.attributes = {building: building, facilityType: 'building'};
        //     map.graphics.add(graphic);
        //     return graphic;
        // },
        //根据点画图
        drawPolygon: function (map, points, isNew, lineColor, lineWidth, attributes) {
            var no = generateNo();
            var polygonJson = {
                "rings": [points], "spatialReference": {"wkid": 4326}
            };
            var color = newColor;
            if (!!isNew) {
                color = highLightColor;
            }
            var polygon = new Polygon(polygonJson);
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(lineColor), lineWidth), color);
            var graphic = new Graphic(polygon, symbol);
            if (!!attributes) {
                graphic.attributes = attributes;
            }
            var graLayer = new GraphicsLayer();
            map.graphics.add(graphic);
            // graLayer.on("graphic-draw",function (graphic) {
            //     cesc.dojo.connect(graphic.node, "onclick",{graphic:graphic.graphic}, function(e){
            //         console.log(this.graphic.attributes);
            //     });
            // });
            map.graphics.on('click', function (event) {
                console.log(event.graphic.attributes);
            });
            return graphic;
        }
        ,
        //删除图解
        removeGraphic: function (map, graphic) {
            map.graphics.remove(graphic);
        }
        ,
        //删除多个图解
        removeGraphics: function (map, graphics) {
            graphics.forEach(function (graphic) {
                map.graphics.remove(graphic);
            }.bind(this));
        }
        ,
        bindMaps: function (leftMap, rightMap) {
            var self = this;
            this.enableBind();
            leftMap.on("zoom-end", function (evt) {
                console.log('leftMap-zoom', evt);
                if (self.bindOther) {
                    rightMap.setExtent(leftMap.extent);
                }
            });
            leftMap.on("zoom-start", function (evt) {
                if (self.bindOther) {
                    self.fromZoom = true;
                    console.log('leftMap-zoom-start', evt);
                }
            });
            rightMap.on("zoom-end", function (evt) {
                if (self.bindOther) {
                    leftMap.setExtent(rightMap.extent);
                }
                console.log('rightMap-zoom', evt);

            });
            rightMap.on("zoom-start", function (evt) {
                if (self.bindOther) {
                    self.fromZoom = true;
                    console.log('rightMap-zoom-start', evt);
                }

            });
            leftMap.on("pan-start", function (evt) {

                console.log('leftMap-pan-start', evt);

            });
            rightMap.on("pan-start", function (evt) {
                console.log('rightMap-pan-start', evt);

            });
            /*    leftMap.on("pan-end", function (evt) {
             if (self.bindOther) {
             if (self.fromZoom) {
             self.fromZoom = false;
             } else {
             if (leftMap.extent.xmax == rightMap.extent.xmax) {
             return;
             }
             console.log('leftMap-pan', evt);
             rightMap.setExtent(leftMap.extent);
             }
             }
             });*/
            rightMap.on("pan-end", function (evt) {
                if (self.bindOther) {
                    if (self.fromZoom) {
                        self.fromZoom = false;
                    } else {
                        if (leftMap.extent.xmax == rightMap.extent.xmax) {
                            return;
                        }
                        console.log('rightMap-pan', evt);
                        leftMap.setExtent(rightMap.extent);
                    }
                }
            });
        }
        ,
        disableBind: function (map) {
            this.bindOther = false;
        }
        ,
        enableBind: function (map) {
            this.bindOther = true;
        }
        ,
        //把地图定位到某个点
        locateMap: function (map, x, y) {
            // debugger;
            //wkid代表坐标系，通常地图，图层，几何对象（例如点）都各自有自己的坐标系
            //当定位时，涉及到点和地图，如果这两者坐标系不一致，有时正常，有时会出错，总之一般来说最好一样
            //下面创建点的代码，点的坐标系使用了地图的坐标系，这样就做到两者坐标系统一
            //其实创建点也可以不传入坐标系（使用默认的），但是定位无效，f12有错误信息，你可以试试
            var point = new Point(x, y, new SpatialReference({wkid: map.spatialReference.wkid}));
            map.centerAt(point);
        }
        ,
        initArcGISTiledMap: function (containerID, url) {
            var map = new Map(containerID, {
                // center: [50667.15003870383, 28048.900874448493],
                zoom: 4
            });
            var leftLayer = new ArcGISTiledMapServiceLayer(url);
            map.addLayer(leftLayer);
            return map;
        }
        ,
        //设置地图中心点和地图显示层
        setCenter: function (x, y, map, zoom) {
            var point = new Point(x, y, new SpatialReference({wkid: map.spatialReference.wkid}));
            if (!!zoom) {
                map.centerAndZoom(point, zoom);
            }
            else {
                map.centerAt(point, 15);
            }
        }
        ,
        getArcGISTiledMap: function (leftID, rightID, leftUrl, rightUrl) {

            var leftMap = this.initArcGISTiledMap(leftID, leftUrl);
            var rightMap = this.initArcGISTiledMap(rightID, rightUrl);
            var pipeUrl = "http://121.8.226.107:8399/arcgis/rest/services/gzpsfacility/MapServer";
            var pipeLayer = new ArcGISDynamicMapServiceLayer(pipeUrl);

            var pipeLineUrl = "http://112.74.51.12:6080/arcgis/rest/services/201705hcjzw/gzhcjzw_gx_20170629/MapServer";
            var pipeLineLayer = new ArcGISDynamicMapServiceLayer(pipeLineUrl);

            var houseUrl = "http://112.74.51.12:6080/arcgis/rest/services/201705hcjzw/gzhcjzw_fwm_20170629/MapServer";
            var houseLayer = new ArcGISDynamicMapServiceLayer(houseUrl);


            leftMap.addLayer(houseLayer);
            leftMap.addLayer(pipeLayer);
            leftMap.addLayer(pipeLineLayer);
            leftMap.on('load', function () {
                //  this.setCenter(50739.47246461394, 27957.80609813794, rightMap);
                console.log('load');
                setTimeout(function () {
                    this.setCenter(44765.005, 24337.384, leftMap, 15);
                }.bind(this), 1000);
            }.bind(this));
            return {
                leftMap: leftMap,
                rightMap: rightMap
            }
        }
        ,
        splitMap: function () {
            var lineDepartPolygon = function () {
                map.setStatus({dragEnable: false});
                map.setStatus({zoomEnable: false});
                var polyline,
                    arr = [];
                var touchstartListener = AMap.event.addListener(map, 'touchstart', function (e) {
                    polyline = new AMap.Polyline({
                        map: map,
                        path: []
                    });
                });

                var touchmoveListener = AMap.event.addListener(map, 'touchmove', function (e) {
                    if (arr.length <= 1) {
                        arr.push(e.lnglat);
                    }
                    var len = arr.length, obj = arr[len - 1];
                    if (len >= 1 && (obj.lng !== e.lnglat.lng || obj.lat !== e.lnglat.lat)) {
                        arr.push(e.lnglat);
                    }
                    polyline.setPath(arr);
                });

                var touchendListener = AMap.event.addListener(map, 'touchend', function (e) {
                    //alert("ss");
                    arr.push(e.lnglat);
                    polyline.setPath(arr);

                    var polyline2 = new AMap.Polyline({
                        map: map,
                        path: [arr[0], arr[arr.length - 1]]
                    });

                    arr = [];
                    departPolygon(polyline2, polygon);
                    map.setStatus({dragEnable: true});
                    map.setStatus({zoomEnable: true});
                    AMap.event.removeListener(touchstartListener);
                    AMap.event.removeListener(touchmoveListener);
                    AMap.event.removeListener(touchendListener);
                });

            }
            return lineDepartPolygon;
        }
    }
});