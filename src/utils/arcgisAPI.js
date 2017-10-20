define(function () {
    //用于获取token，url头部等
    var serviceHelper = require('services/serviceHelper');
    var instance = {};
    var graphicsLayer;
    var slopeGraphicsLayer;
    var traceAnalysisExtent;
    var arrowIntervalHandle;
    var arrowLayer;
    var arrowLayerHideConfirm = false;
    var flashIntervalHandle;
    var currentMap;
    var currentVue;
    var currentMapView;
    var hideConfirm = false;
    var locationGraphic;
    instance.initTDLayer = function (container, x, y, zoom, success, click) {
        var tileInfo = new instance.TileInfo({

            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
                {"level": 2, "resolution": 0.3515625, "scale": 147748796.52937502},
                {"level": 3, "resolution": 0.17578125, "scale": 73874398.264687508},
                {"level": 4, "resolution": 0.087890625, "scale": 36937199.132343754},
                {"level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877},
                {"level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385},
                {"level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693},
                {"level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846},
                {"level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423},
                {"level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116},
                {"level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558},
                {"level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779},
                {"level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895},
                {"level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447},
                {"level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724},
                {"level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619},
                {"level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309},
                {"level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655}
            ]
        });
        var spatialReference = new instance.SpatialReference({wkid: 4326});
        var fullExtent = new instance.Extent(-180.0, -90.0, 180.0, 90.0, spatialReference);
        var tiledLayer = new instance.WebTileLayer({
            //urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}",
            urlTemplate: "http://{subDomain}.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            copyright: "",
            spatialReference: spatialReference,
            fullExtent: fullExtent,
            tileInfo: tileInfo,
        });
        var tiledMarkLayer = new instance.WebTileLayer({
            urlTemplate: "http://{subDomain}.tianditu.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            copyright: "",
            spatialReference: spatialReference,
            fullExtent: fullExtent,
            tileInfo: tileInfo,
        });
        // var lineLayer = new instance.MapImageLayer({
        //     url: "http://112.74.51.12:6080/arcgis/rest/services/gzpsfacilityGH/MapServer"
        // });
        var map = new instance.Map({
            layers: [tiledLayer, tiledMarkLayer]
        });
        var view = new instance.MapView({
            container: "mapDiv",
            map: map,
            center: [117.81853454943274, 37.16799099829924],
            zoom: 18
        });
        tiledLayer.load().then(function () {
            success(map, view);
        });
        view.then(function () {
            var drawButton = $("#draw-button");
            if (!!drawButton) {
                drawButton[0].addEventListener("click", function () {
                    var pen = instance.initDrawPen(view, function (drawResult) {
                        console.log(drawResult);
                    });
                    if (!instance.drawConfig.isDrawActive) {
                        pen.startDraw();
                        $("#draw-button")[0].classList.toggle("esri-draw-button-selected");
                    } else {
                        pen.endDraw();
                    }
                });
            }
        });
        view.on('click', function (evt) {
            console.log(evt);
            evt.stopPropagation();
            if (!!click)
                click(evt);
        });
        view.ui.add("draw-button", "top-left");
    };
    instance.removeGraphics = function (layer, graphics) {
        layer.removeMany(graphics);
    };
    instance.setCenter = function (view, x, y, zoom) {
        var newView = {}
        if (!!zoom) {
            newView.zoom = zoom;
        }
        if (!!x && !!y) {
            newView.target = [x, y]
        }
        view.goTo(newView);
    };
    instance.registerMapTool = function (view, buttonId, position, cb) {
        view.ui.add(buttonId, position);
        $("#" + buttonId)[0].addEventListener('click', function () {
            cb();
        });
    };
    instance.initDrawPen = function (view, drawComplete) {
        var searchArea;

        function createPoint(event) {
            return view.toMap(event);
        }

        function addVertex(point, isFinal) {

            var polygon = instance.drawConfig.activePolygon;
            var ringLength;

            if (!polygon) {
                polygon = new instance.Polygon({
                    spatialReference: {
                        wkid: 4326
                    }
                });
                polygon.addRing([point, point]);
            } else {
                ringLength = polygon.rings[0].length;
                polygon.insertPoint(0, ringLength - 1, point);
            }

            instance.drawConfig.activePolygon = polygon;
            return redrawPolygon(polygon, isFinal);
        }

        /**
         * Clears polygon(s) from the view and adds the
         * given polygon to the view.
         */
        function redrawPolygon(polygon, finished) {

            // simplify the geometry so it can be drawn accross
            // the dateline and accepted as input to other services
            var geometry = finished ? instance.geometryEngine.simplify(polygon) :
                polygon;

            if (!geometry && finished) {
                console.log(
                    "Cannot finish polygon. It must be a triangle at minimum. Resume drawing..."
                );
                return null;
            }

            clearPolygon();

            var polygonGraphic = new instance.Graphic({
                geometry: geometry,
                symbol: finished ? instance.drawConfig.finishedSymbol : instance.drawConfig.drawingSymbol
            });
            view.graphics.addMany([polygonGraphic]);
            return geometry;
        }

        /**
         * Executes on each pointer-move event. Updates the
         * final vertex of the activePolygon to the given
         * point.
         */
        function updateFinalVertex(point) {
            var polygon = instance.drawConfig.activePolygon.clone();

            var ringLength = polygon.rings[0].length;
            polygon.insertPoint(0, ringLength - 1, point);
            redrawPolygon(polygon);
        }

        /**
         * Cleares the drawn polygon in the view. Only one
         * polygon may be drawn at a time.
         */
        function clearPolygon() {
            var polygonGraphic = view.graphics.find(function (graphic) {
                return graphic.geometry.type === "polygon";
            });

            if (polygonGraphic) {
                view.graphics.remove(polygonGraphic);
            }
        }

        instance.pointerDownListener, instance.pointerMoveListener, instance.doubleClickListener;

        function deactivateDraw() {
            instance.drawConfig.isDrawActive = false;
            $("#draw-button")[0].classList.toggle("esri-draw-button-selected");
            instance.pointerDownListener.remove();
            instance.pointerMoveListener.remove();
            instance.doubleClickListener.remove();
            instance.drawConfig.activePolygon = null;
        }

        function activateDraw() {
            instance.drawConfig.isDrawActive = true;
            // remove the previous popup and polygon if they already exist
            clearPolygon();
            view.popup.close();

            instance.pointerDownListener = view.on("pointer-down", function (event) {
                event.stopPropagation();
                var point = createPoint(event);
                addVertex(point);
            });
            instance.pointerMoveListener = view.on("pointer-move", function (event) {
                if (instance.drawConfig.activePolygon) {
                    event.stopPropagation();

                    var point = createPoint(event);
                    updateFinalVertex(point);
                }
            });
            instance.doubleClickListener = view.on("double-click", function (event) {
                event.stopPropagation();

                searchArea = addVertex(event.mapPoint, true);

                // If an invalid search area is entered, then drawing
                // continues and the query is not executed
                if (!searchArea) {
                    return null;
                }

                deactivateDraw();
                drawComplete(searchArea);
            });
        }

        return {
            startDraw: activateDraw,
            endDraw: function () {
                deactivateDraw();
                clearPolygon();
                view.popup.close();
                return searchArea;
            }
        }
    };
    instance.createMapImageLayer = function (map, url, id) {
        // points to the states layer in a service storing U.S. census data
        var layer = new instance.MapImageLayer({
            url: url,
            id: id
        });
        map.add(layer);  // adds the layer to the map
        return layer;
    };
    instance.initMap = function (container, x, y, zoom, success, click) {
        var map = new instance.Map({});
        var view = new instance.MapView({
            container: container,
            map: map,
            center: [x, y],
            zoom: zoom
        });
        view.on('click', function (evt) {
            console.log(evt);
            evt.stopPropagation();
            if (!!click)
                click(evt);
        });
        success(map, view);
    };
    instance.createPolyline = function (layer, paths, styleObj) {
        var line = new instance.Polyline({
            paths: paths
        });
        var markerSymbol = new instance.SimpleLineSymbol(
            styleObj
            /*{
             color: [226, 119, 40],
             width: 4
             }*/);

        // Create a graphic and add the geometry and symbol to it
        var polyLine = new instance.Graphic({
            geometry: line,
            symbol: markerSymbol
        });
        layer.add(polyLine);
        return polyLine;
    };
    instance.createPolygon = function (layer, coords, styleObj) {
        var polygon = new instance.Polygon({
            rings: coords
        });
        var fillSymbol = new instance.SimpleFillSymbol(
            styleObj
            /*{
             color: [227, 139, 79, 0.8],
             outline: { // autocasts as new SimpleLineSymbol()
             color: [255, 255, 255],
             width: 1
             }
             }*/);
        var polygonGraphic = new instance.Graphic({
            geometry: polygon,
            symbol: fillSymbol
        });
        layer.add(polygonGraphic);
        return polygonGraphic;

    };
    instance.createMarkerSymbol = function (layer, x, y, styleObj) {
        var point = new instance.Point({
            longitude: x,
            latitude: y
        });
        var markerSymbol = new instance.SimpleMarkerSymbol(
            styleObj
            /*
             {
             color: [226, 119, 40],
             outline: { // autocasts as new SimpleLineSymbol()
             color: [255, 255, 255],
             width: 2
             }}*/
        );

        // Create a graphic and add the geometry and symbol to it
        var markPoint = new instance.Graphic({
            geometry: point,
            symbol: markerSymbol
        });
        layer.add(markPoint);
        return markPoint;
    };
    instance.createPictureMarkSymbol = function (layer, x, y, imgObj) {
        var point = new instance.Point({
            longitude: x,
            latitude: y
        });
        var markerSymbol = new instance.PictureMarkerSymbol(
            imgObj
            /*{
             url: "https://webapps-cdn.esri.com/Apps/MegaMenu/img/logo.jpg",
             width: "8px",
             height: "8px"
             }*/);

        // Create a graphic and add the geometry and symbol to it
        var markPoint = new instance.Graphic({
            geometry: point,
            symbol: markerSymbol
        });
        layer.add(markPoint);
        return markPoint;
    };
    instance.addPictureMarkSymbol = function (layer, x, y, imgObj,attributes) {
        var point = new instance.Point({
            longitude: x,
            latitude: y
        });
        var markerSymbol = new instance.PictureMarkerSymbol(
            imgObj
            /*{
             url: "https://webapps-cdn.esri.com/Apps/MegaMenu/img/logo.jpg",
             width: "8px",
             height: "8px"
             }*/);

        // Create a graphic and add the geometry and symbol to it
        var markPoint = new instance.Graphic({
            geometry: point,
            symbol: markerSymbol,
            attributes:attributes
        });
        layer.add(markPoint);
        return markPoint;
    };
    instance.changeLineSymbolStyle = function (graphic, newStyleObj) {
        var markerSymbol = new instance.SimpleLineSymbol(
            newStyleObj
            /*{
             color: [226, 119, 40],
             width: 4
             }*/);
        graphic.symbol = markerSymbol;
    };
    instance.changePolygonSymbolStyle = function (graphic, newStyleObj) {
        var fillSymbol = new instance.SimpleFillSymbol(
            newStyleObj
            /*{
             color: [227, 139, 79, 0.8],
             outline: { // autocasts as new SimpleLineSymbol()
             color: [255, 255, 255],
             width: 1
             }
             }*/);
        graphic.symbol = fillSymbol;
    };
    instance.changeMarkSymbolStyle = function (graphic, newStyleObj) {
        var markerSymbol = new instance.SimpleMarkerSymbol(
            newStyleObj
            /*
             {
             color: [226, 119, 40],
             outline: { // autocasts as new SimpleLineSymbol()
             color: [255, 255, 255],
             width: 2
             }}*/
        );
        graphic.symbol = markerSymbol;
    };
    instance.changePictureMarkSymbolStyle = function (graphic, newStyleObj) {
        var markerSymbol = new instance.PictureMarkerSymbol(
            newStyleObj
            /*{
             url: "https://webapps-cdn.esri.com/Apps/MegaMenu/img/logo.jpg",
             width: "8px",
             height: "8px"
             }*/);
        graphic.symbol = markerSymbol;
    };
    instance.createGraphicsLayer = function (map, id) {
        var layer = new instance.GraphicsLayer({
            id: id
        });
        if (!!map) {
            map.add(layer);
        }
        return layer;
    };
    instance.getLayer = function (map, layerId) {
        return map.findLayerById(layerId);
    };
    instance.addLayers = function (map, layers) {
        map.addMany(layers);
    };
    instance.removeLayers = function (map, layers) {
        map.removeMany(layers);
    };
    //10.17增加追溯分析
    //绘制南宁追溯分析查询的管网信息
    instance.drawNNPolyline = function (result, currentMap) {
        var lineColor;
        var that = this;
        if (!graphicsLayer) {
            graphicsLayer = getMapGraphicsLayer("nnTraceAbilityAnalysis");
        }
        if (!arrowLayer) {
            arrowLayer = getMapGraphicsLayer("arrowSymbolLayer");
        }

        var pipeLineResult = result.mapAnalyzeResult.pipeLineResult;
        var pipeLineArr = [];
        var pipeStr = '';
        var cancalStr = '';
        for (var i = 0; i < pipeLineResult.length; i++) {
            var pipeLine = pipeLineResult[i];


            pipeLineArr.push(...pipeLine);
            // var line = Polyline({
            //     "paths": [[[pipeLine.startX, pipeLine.startY], [pipeLine.endX, pipeLine.endY]]],
            //     "spatialReference": currentMap.spatialReference
            // });
            // addArrowToLayer(line, getMapGraphicsLayer("arrowSymbolLayer"), 15, 60);
        }

        for (var i = 0; i < pipeLineArr.length; i++) {
            var pipeLineObj = pipeLineArr[i];
            if (pipeLineObj.ds2 > 0) {
                cancalStr += pipeLineObj.oid + ',';
            } else {
                pipeStr += pipeLineObj.oid + ',';
            }
            if (pipeLineObj.sort == "雨水")
                lineColor = [0, 255, 197];
            else if (pipeLineObj.sort == "污水")
                lineColor = [230, 0, 169];
            else
                lineColor = [230, 152, 0];
            var paths =[[[pipeLineObj.startX, pipeLineObj.startY], [pipeLineObj.endX, pipeLineObj.endY]]];
            var styleObj ={color:lineColor,width:4}
            that.createPolyline(graphicsLayer, paths,styleObj );
            var line = new instance.Polyline({
                "paths": [[[pipeLineObj.startX, pipeLineObj.startY], [pipeLineObj.endX, pipeLineObj.endY]]],
                "spatialReference": currentMapView.spatialReference
            });
            that.drawArrowPolyline(line, getMapGraphicsLayer("arrowSymbolLayer"), 15, 50, "#2F4F4F");
        }
        if (pipeStr.length > 0) {
            console.warn('pipe(' + pipeStr.substring(0, pipeStr.length - 1) + ')');
        }
        if (cancalStr.length > 0) {
            console.warn('canal(' + cancalStr.substring(0, cancalStr.length - 1) + ')');
        }

        var slopeGraphicsLayer = getMapGraphicsLayer("nnSlopeGraphicsLayer");
        var bigSmallsGraphicsLayer = getMapGraphicsLayer("nnBigSmallsGraphicsLayer");
        var ywsGraphicsLayer = getMapGraphicsLayer("nnywsGraphicsLayer");
        var arrowSymbolLayer = getMapGraphicsLayer("arrowSymbolLayer");
        result.slopeGraphicsLayer = slopeGraphicsLayer;
        result.bigSmallsGraphicsLayer = bigSmallsGraphicsLayer;
        result.ywsGraphicsLayer = ywsGraphicsLayer;
        result.arrowSymbolLayer = arrowSymbolLayer;
        eventHelper.emit('get-trace-data', result);
    };
    instance.drawArrowPolyline = function (polyline, layer, length, angleValue, graphicColor) {
        //线的坐标串
        var linePoint = polyline.paths;
        var arrowCount = linePoint.length;
        // var sfs = new instance.SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        //     new instance.SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new instance.Color(graphicColor), 2), new instance.Color(graphicColor)
        // );
        var symbol = {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: "#000",
            style: "solid",
            outline: {  // autocasts as new SimpleLineSymbol()
                color: "red",
                width: 60
            }
        };
        var sfs = new instance.SimpleFillSymbol(symbol);
        for (var i = 0; i < arrowCount; i++) { //在拐点处绘制箭头
            var line = linePoint[i];
            var centerX = (line[0][0] + line[line.length - 1][0]) / 2;
            var centerY = (line[0][1] + line[line.length - 1][1]) / 2;
            var centerPoint = new instance.Point([centerX, centerY], currentMapView.spatialReference);
            var startPoint = new instance.Point([line[0][0], line[0][1]], currentMapView.spatialReference);
            var endPoint = new instance.Point([line[line.length - 1][0], line[line.length - 1][1]], currentMapView.spatialReference);

            var pixelCenter = currentMapView.toScreen(centerPoint);
            var pixelStart = currentMapView.toScreen(startPoint);
            var pixelEnd = currentMapView.toScreen(endPoint);
            var twoPointDistance = calcTwoPointDistance(pixelStart.x, pixelStart.y, pixelEnd.x, pixelEnd.y);
            if (twoPointDistance <= 20)
                continue;
            var angle = angleValue;//箭头和主线的夹角
            var r = length; // r/Math.sin(angle)代表箭头长度
            var delta = 0; //主线斜率，垂直时无斜率
            var offsetPoint = [];//箭头尾部偏移量
            var param = 0; //代码简洁考虑
            var pixelTemX, pixelTemY;//临时点坐标
            var pixelX, pixelY, pixelX1, pixelY1;//箭头两个点

            if (pixelEnd.x - pixelStart.x == 0) {
                //斜率不存在是时
                pixelTemX = pixelEnd.x;
                offsetPoint[0] = pixelCenter.x - 3;
                if (pixelEnd.y > pixelStart.y) {
                    pixelTemY = pixelCenter.y - r;
                    offsetPoint[1] = pixelCenter.y - (r - 2);
                } else {
                    pixelTemY = pixelCenter.y + r;
                    offsetPoint[1] = pixelCenter.y + (r + 2);
                }
                //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
                pixelX = pixelTemX - r * Math.tan(angle);
                pixelX1 = pixelTemX + r * Math.tan(angle);
                pixelY = pixelY1 = pixelTemY;
            } else {
                //斜率存在时
                delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
                param = Math.sqrt(delta * delta + 1);

                if ((pixelEnd.x - pixelStart.x) < 0) {
                    //第二、三象限
                    pixelTemX = pixelCenter.x + r / param;
                    pixelTemY = pixelCenter.y + delta * r / param;
                    if ((pixelEnd.y - pixelStart.y) < 0) {
                        //第三象限
                        offsetPoint[0] = pixelCenter.x + (r - 2) / param;
                        offsetPoint[1] = pixelCenter.y + delta * (r - 2) / param;
                    } else {
                        //第二象限
                        offsetPoint[0] = pixelCenter.x + (r - 2) / param;
                        offsetPoint[1] = pixelCenter.y + delta * (r - 2) / param;
                    }
                } else {
                    //第一、四象限
                    pixelTemX = pixelCenter.x - r / param;
                    pixelTemY = pixelCenter.y - delta * r / param;
                    if ((pixelEnd.y - pixelStart.y) < 0) {
                        //第四象限
                        offsetPoint[0] = pixelCenter.x - (r - 2) / param;
                        offsetPoint[1] = pixelCenter.y - delta * (r - 2) / param;
                    } else {
                        //第一象限
                        offsetPoint[0] = pixelCenter.x - (r - 2) / param;
                        offsetPoint[1] = pixelCenter.y - delta * (r - 2) / param;
                    }
                }
                //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
                pixelX = pixelTemX + Math.tan(angle) * r * delta / param;
                pixelY = pixelTemY - Math.tan(angle) * r / param;

                pixelX1 = pixelTemX - Math.tan(angle) * r * delta / param;
                pixelY1 = pixelTemY + Math.tan(angle) * r / param;
            }
            var pointArrow = currentMapView.toMap(new instance.ScreenPoint(pixelX, pixelY));
            var pointArrow1 = currentMapView.toMap(new instance.ScreenPoint(pixelX1, pixelY1));
            var pointArrow2 = currentMapView.toMap(new instance.ScreenPoint(offsetPoint[0], offsetPoint[1]));

            var arrowPolygon = new instance.Polyline(currentMapView.spatialReference);
            arrowPolygon.addPath([pointArrow, centerPoint, pointArrow1, pointArrow2]);
            var graphic = new instance.Graphic({
                geometry: arrowPolygon,
                symbol: sfs,
            });
            layer.addMany(graphic);
            // var arrowPoint = new Point(centerPoint.x,centerPoint.y);
            // var graphic = new Graphic(arrowPoint,new TextSymbol(twoPointDistance));
            // layer.add(graphic);
        }
    };
    instance.getGraphicsLayer = function (LayerId, index,map) {
        if (!!map) {
            currentMap = map.map;
        }
        var graphicsLayer = null;
        if (currentMap.findLayerById(LayerId)) {
            graphicsLayer = currentMap.findLayerById(LayerId);
        } else {
            graphicsLayer = new instance.GraphicsLayer({id: LayerId});
            if (index)
                currentMap.addMany([graphicsLayer], index);
            else
                currentMap.addMany([graphicsLayer]);
        }
        return graphicsLayer;
    };
    instance.nnTraceAnalysisByRecursive = function (event, traceAnalysisType, vue, cb) {
        eventHelper.emit('isLoading');
        var result;
        var self = this;
        currentVue = vue;
        currentMap = vue.map.map;
        currentMapView = vue.leftMap;
        currentVue.showFacilityTraceLoading = true;
        currentVue.facilityTraceLength = 0;
        var pointBufferDistance = screenLengthToMapLength(currentMapView, 5);
        var formData = {};
        formData.token = serviceHelper.getToken();
        formData.r = Math.random();
        formData.x = event.mapPoint.x;
        formData.y = event.mapPoint.y;
        formData.pointBufferDistance = pointBufferDistance;
        if (traceAnalysisType === '上下') {
            formData.connectUp = "1";
            formData.connectDown = "1";
        } else if (traceAnalysisType === '向下') {
            formData.connectUp = "0";
            formData.connectDown = "1";
        } else {
            formData.connectUp = "1";
            formData.connectDown = "0";
        }
        //mapHelper.setCenter(formData.x,formData.y,currentMap,18);
        this.clearAnalysisInfo();
        $.ajax({
            type: "get",
            dataType: "json",
            url: serviceHelper.getBasicPath() + "/pipeAnalyze/flowConnectAnalysis",
            data: formData,
            success: function (ajaxResult) {
                if (ajaxResult) {
                    if (ajaxResult.success == true) {
                        result = ajaxResult.data;
                        if (!result.success) {
                            if (!!graphicsLayer) {
                                graphicsLayer.removeAll();
                            }
                            if (!!arrowLayer) {
                                arrowLayer.removeAll();
                            }
                            vue.$message.error(result.msg);
                            eventHelper.emit('closeLoading');
                            cb(false);
                            return;
                        }
                        self.drawNNPolyline(result, currentMapView);
                        cb(true);
                    } else {
                        //后台操作失败的代码
                        vue.$message.error(ajaxResult.msg);
                    }
                    currentVue.showFacilityTraceLoading = false;
                }
                eventHelper.emit('closeLoading');
            }.bind(this),
            error: function () {
                currentVue.showFacilityTraceLoading = false;
                eventHelper.emit('closeLoading');
            }.bind(this)
        });

    };
    instance.clearAnalysisInfo = function () {
        if (!flashIntervalHandle)
            clearTimeout(flashIntervalHandle);
        if (!graphicsLayer)
            graphicsLayer = getMapGraphicsLayer("traceAbilityAnalysis");
        graphicsLayer.removeAll();
    };
    var screenLengthToMapLength = function (map, screenPixel) {
        var screenWidth = map.width;

        var mapWidth = map.extent.width;

        return (mapWidth / screenWidth) * screenPixel;
    };
    var calcTwoPointDistance = function (lat1, lng1, lat2, lng2) {
        var xdiff = lat2 - lat1;            // 计算两个点的横坐标之差
        var ydiff = lng2 - lng1;            // 计算两个点的纵坐标之差
        return Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
    };
    //获取图层根据Id
    var getMapGraphicsLayer = function (LayerId, index) {
        var graphicsLayer = null;
        if (currentMap.findLayerById(LayerId)) {
            graphicsLayer = currentMap.findLayerById(LayerId);
        } else {
            graphicsLayer = new instance.GraphicsLayer({id: LayerId});
            if (index)
                currentMap.addMany([graphicsLayer], index);
            else
                currentMap.addMany([graphicsLayer]);
        }
        return graphicsLayer;
    };
    return {
        getInstance: function (cb) {
            if (!!instance.Map) {
                cb('C', instance);
                return;
            }
            cesc.require([
                'esri/map',
                'esri/geometry/Point',
                'esri/geometry/Extent',
                'esri/geometry/Polygon',
                'esri/geometry/Polyline',
                'esri/Graphic',
                'esri/Color',
                'esri/symbols/Font',
                'esri/layers/GraphicsLayer',
                'esri/symbols/TextSymbol',
                'esri/symbols/SimpleMarkerSymbol',
                'esri/symbols/SimpleLineSymbol',
                'esri/symbols/SimpleFillSymbol',
                'esri/symbols/PictureMarkerSymbol',
                'esri/layers/WebTileLayer',
                'esri/views/MapView',
                'esri/Basemap',
                'esri/layers/TileLayer',
                'esri/geometry/SpatialReference',
                'esri/views/SceneView',
                "esri/config",
                'esri/layers/support/TileInfo',
                "esri/geometry/geometryEngine",
                "esri/layers/MapImageLayer",
                "esri/geometry/ScreenPoint",
            ], function (arcgisMap,
                         arcgisPoint,
                         arcgisExtent,
                         arcgisPolygon,
                         arcgisPolyline,
                         arcgisGraphic,
                         arcgisColor,
                         arcgisFont,
                         arcgisGraphicsLayer,
                         arcgisTextSymbol,
                         arcgisSimpleMarkerSymbol,
                         arcgisSimpleLineSymbol,
                         arcgisSimpleFillSymbol,
                         arcgisPictureMarkerSymbol,
                         arcgisWebTileLayer,
                         MapView,
                         Basemap,
                         TileLayer,
                         SpatialReference,
                         SceneView,
                         config,
                         TileInfo,
                         geometryEngine,
                         MapImageLayer,
                         ScreenPoint) {
                instance.Map = arcgisMap;
                instance.Point = arcgisPoint;
                instance.Extent = arcgisExtent;
                instance.Polygon = arcgisPolygon;
                instance.Polyline = arcgisPolyline;
                instance.Graphic = arcgisGraphic;
                instance.Color = arcgisColor;
                instance.Font = arcgisFont;
                instance.GraphicsLayer = arcgisGraphicsLayer;
                instance.TextSymbol = arcgisTextSymbol;
                instance.SimpleMarkerSymbol = arcgisSimpleMarkerSymbol;
                instance.SimpleLineSymbol = arcgisSimpleLineSymbol;
                instance.SimpleFillSymbol = arcgisSimpleFillSymbol;
                instance.PictureMarkerSymbol = arcgisPictureMarkerSymbol;
                instance.WebTileLayer = arcgisWebTileLayer;
                instance.MapView = MapView;
                instance.Basemap = Basemap;
                instance.TileLayer = TileLayer;
                instance.SpatialReference = SpatialReference;
                instance.SceneView = SceneView;
                instance.erisConfig = config;
                instance.TileInfo = TileInfo;
                instance.MapImageLayer = MapImageLayer;
                instance.ScreenPoint = ScreenPoint;
                instance.geometryEngine = geometryEngine;
                instance.drawConfig = {
                    drawingSymbol: new arcgisSimpleFillSymbol({
                        color: [102, 0, 255, 0.15],
                        outline: {
                            color: "#6600FF",
                            width: 2
                        }
                    }),
                    finishedSymbol: new arcgisSimpleFillSymbol({
                        color: [102, 0, 255, 0.45],
                        outline: {
                            color: "#6600FF",
                            width: 2
                        }
                    }),
                    activePolygon: null,
                    isDrawActive: false
                };
                instance.erisConfig.request.corsEnabledServers.push("t0.tianditu.com", "t1.tianditu.com", "t2.tianditu.com",
                    "t3.tianditu.com",
                    "t4.tianditu.com",
                    "t5.tianditu.com",
                    "t7.tianditu.com",
                    "t6.tianditu.com",
                    "t8.tianditu.com",
                    "t9.tianditu.com",
                    "t10.tianditu.com",
                    "t11.tianditu.com",
                    "t12.tianditu.com"
                );
                cb('C', instance);
            });
        }

    };
});