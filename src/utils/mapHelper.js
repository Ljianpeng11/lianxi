define(function () {
    var Map = cesc.require("esri/map"),
        eventHelper = require('utils/eventHelper'),
        ArcGISTiledMapServiceLayer = cesc.require('esri/layers/ArcGISTiledMapServiceLayer'),
        ArcGISDynamicMapServiceLayer = cesc.require('esri/layers/ArcGISDynamicMapServiceLayer'),
        Point = cesc.require('esri/geometry/Point'),
        SpatialReference = cesc.require('esri/SpatialReference'),
        Polygon = cesc.require("esri/geometry/Polygon"),
        Polyline = cesc.require("esri/geometry/Polyline"),
        Graphic = cesc.require("esri/graphic"),
        Color = cesc.require("esri/Color"),
        GraphicsLayer = cesc.require("esri/layers/GraphicsLayer"),
        TextSymbol = cesc.require("esri/symbols/TextSymbol"),
        SimpleMarkerSymbol = cesc.require("esri/symbols/SimpleMarkerSymbol"),
        SimpleLineSymbol = cesc.require("esri/symbols/SimpleLineSymbol"),
        SimpleFillSymbol = cesc.require("esri/symbols/SimpleFillSymbol"),
        PictureMarkerSymbol = cesc.require("esri/symbols/PictureMarkerSymbol");
    var newColor = new Color([0, 191, 255, 0.25]);
    var oldColor = new Color([181, 119, 196, 0.25]);
    var highLightColor = new Color([229, 14, 14, 0.7]);
    var generateNo = function () {
        var date = new Date();
        return ('PA' + date.getTime()).substring(5);
    }
    return {
        revertSymbol: function (graphic) {
            var color = newColor;
            if (graphic.attributes.building.status == 1) {
                color = oldColor;
            }
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([160, 82, 45]), 2), color);
            graphic.setSymbol(symbol);
        },
        changeSymbol: function (graphic) {
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([160, 82, 45]), 2), new Color([243, 49, 76, 0.8]));
            graphic.setSymbol(symbol);
        },
        changeLineSymbol: function (graphic) {
            var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([243, 49, 76, 0.8]), 5);
            graphic.setSymbol(symbol);
        },
        revertLineSymbol: function (graphic) {
            var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([241, 104, 15, 0.8]), 2);
            graphic.setSymbol(symbol);
        },
        drawMap: function (map, cb) {
            var Draw = cesc.dojo.require("esri/toolbars/draw");
            this.drawPen = new Draw(map, {
                showTooltips: true
            });
            this.drawPen.activate(Draw.POLYGON);
            this.drawPen.on('draw-end', function (evtObj) {
                if (this.isSave) {
                    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([160, 82, 45]), 2), new Color([0, 191, 255, 0.25]));
                    var graphic = new Graphic(evtObj.geometry, symbol);
                    var no = generateNo();
                    graphic.attributes = {facilityType: 'building', no: no};
                    cb(graphic, no);
                    map.graphics.add(graphic);
                }
            }.bind(this));
        },
        finishDraw: function (isSave) {
            this.isSave = isSave;
            this.drawPen.finishDrawing();
            this.drawPen.deactivate();
        },
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
        },
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
        },
        drawLine: function (map, start, end,lineWidth) {
            var no = generateNo();
            var line = Polyline({
                "paths": [[start, end]],
                "spatialReference": {"wkid": no}
            });
            var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([241, 104, 15]), lineWidth);
            var graphic = new Graphic(line, symbol);
            map.graphics.add(graphic);
            return graphic;
        },
        drawAnalyzeLine: function (map, start, end, type) {
            var no = generateNo();
            var line = Polyline({
                "paths": [[start, end]],
                "spatialReference": {"wkid": no}
            });
            var color = new Color([241, 104, 15]);
            if (type == '污水') {
                color = new Color([236, 7, 229]);
            } else if (type == '雨水') {
                color = new Color([7, 109, 236]);
            }
            var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, color, 5);
            var graphic = new Graphic(line, symbol);
            map.graphics.add(graphic);
            return graphic;
        },
        createPolyon: function (map, points, isHighLight) {
            var graphic = this.drawPolygon(points, isHighLight);
            map.graphics.add(graphic);
            return graphic;
        },
        drawPolygonWithData: function (map, building, isNew) {
            var graphic = this.drawPolygon(JSON.parse(building.coord), isNew);
            graphic.attributes = {building: building, facilityType: 'building'};
            map.graphics.add(graphic);
            return graphic;
        },
        drawPolygon: function (points, isNew) {
            var no = generateNo();
            var polygonJson = {
                "rings": [points], "spatialReference": {"wkid": no}
            };
            var color = newColor;
            if (!!isNew) {
                color = highLightColor;
            }
            var polygon = new Polygon(polygonJson);
            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([160, 82, 45]), 2), color);
            var graphic = new Graphic(polygon, symbol);
            return graphic;
        },
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
        },
        disableBind: function (map) {
            this.bindOther = false;
        },
        enableBind: function (map) {
            this.bindOther = true;
        },
        //把地图定位到某个点
        locateMap: function (map, x, y) {
            // debugger;
            //wkid代表坐标系，通常地图，图层，几何对象（例如点）都各自有自己的坐标系
            //当定位时，涉及到点和地图，如果这两者坐标系不一致，有时正常，有时会出错，总之一般来说最好一样
            //下面创建点的代码，点的坐标系使用了地图的坐标系，这样就做到两者坐标系统一
            //其实创建点也可以不传入坐标系（使用默认的），但是定位无效，f12有错误信息，你可以试试
            var point = new Point(x, y, new SpatialReference({wkid: map.spatialReference.wkid}));
            map.centerAt(point);
        },
        initArcGISTiledMap: function (containerID, url) {
            var map = new Map(containerID, {
                // center: [50667.15003870383, 28048.900874448493],
                zoom: 4
            });
            var leftLayer = new ArcGISTiledMapServiceLayer(url);
            map.addLayer(leftLayer);
            return map;
        },
        setCenter: function (x, y, map, zoom) {
            var point = new Point(x, y, new SpatialReference({wkid: map.spatialReference.wkid}));
            if (!!zoom) {
                map.centerAndZoom(point, zoom);
            }
            else {
                map.centerAt(point, 15);
            }
        },
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
        },
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