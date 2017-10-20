define(function () {
    //用于获取token，url头部等
    var serviceHelper = require('services/serviceHelper.js');
    var GraphicsLayer = cesc.require('esri/layers/GraphicsLayer');
    var SimpleLineSymbol = cesc.require("esri/symbols/SimpleLineSymbol");
    var SimpleMarkerSymbol = cesc.require("esri/symbols/SimpleMarkerSymbol");
    var SimpleFillSymbol = cesc.require("esri/symbols/SimpleFillSymbol");
    var Polyline = cesc.require('esri/geometry/Polyline');
    var Point = cesc.require('esri/geometry/Point');
    var Graphic = cesc.require('esri/graphic');
    var TextSymbol = cesc.require('esri/symbols/TextSymbol');
    var ScreenPoint = cesc.require('esri/geometry/ScreenPoint');
    var CartographicLineSymbol = cesc.require('esri/symbols/CartographicLineSymbol');
    var Color = cesc.require('esri/Color');
    var mapHelper = require('utils/mapHelper');
    var eventHelper = require('utils/eventHelper');
    var mapTran = require('../../../../../vendors/map-wkt/mapTranZM');
    var graphicsLayer;
    var slopeGraphicsLayer;
    var traceAnalysisExtent;
    var arrowIntervalHandle;
    var arrowLayer;
    var arrowLayerHideConfirm = false;
    var flashIntervalHandle;
    var currentMap;
    var currentVue;
    var hideConfirm = false;
    var locationGraphic;
    var screenLengthToMapLength = function (map, screenPixel) {
        var screenWidth = map.width;

        var mapWidth = map.extent.getWidth();

        return (mapWidth / screenWidth) * screenPixel;
    };

    //绘制箭头的函数
    //绘制箭头的函数
    // var addArrowToLayer = function (polyline, layer, length, angleValue) {
    //     // getMapGraphicsLayer("arrowSymbolLayer").clear();
    //     //线的坐标串
    //     var linePoint = polyline.paths
    //     var arrowCount = linePoint.length;
    //     var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
    //         new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#323753"), 2), new Color("#323753")
    //     );
    //     for (var i = 1; i < arrowCount; i++) { //在拐点处绘制箭头
    //         var line = linePoint[i - 1];
    //         var centerX = (line[0][0] + line[line.length - 1][0]) / 2;
    //         var centerY = (line[0][1] + line[line.length - 1][1]) / 2;
    //         var centerPoint = new Point([centerX, centerY], currentMap.spatialReference);
    //         var startPoint = new Point([linePoint[i - 1][0][0], linePoint[i - 1][0][1]], currentMap.spatialReference);
    //         var endPoint = new Point([linePoint[i - 1][linePoint[i - 1].length - 1][0], linePoint[i - 1][linePoint[i - 1].length - 1][1]], currentMap.spatialReference);
    //
    //         var pixelCenter = currentMap.toScreen(centerPoint);
    //         var pixelStart = currentMap.toScreen(startPoint);
    //         var pixelEnd = currentMap.toScreen(endPoint);
    //         var twoPointDistance = calcTwoPointDistance(pixelStart.x, pixelStart.y, pixelEnd.x, pixelEnd.y);
    //         if (twoPointDistance <= 80)
    //             continue;
    //         var angle = angleValue;//箭头和主线的夹角
    //         var r = length; // r/Math.sin(angle)代表箭头长度
    //         var delta = 0; //主线斜率，垂直时无斜率
    //         var offsetPoint = [];//箭头尾部偏移量
    //         var param = 0; //代码简洁考虑
    //         var pixelTemX, pixelTemY;//临时点坐标
    //         var pixelX, pixelY, pixelX1, pixelY1;//箭头两个点
    //
    //         if (pixelEnd.x - pixelStart.x == 0) {
    //             //斜率不存在是时
    //             pixelTemX = pixelEnd.x;
    //             offsetPoint[0] = pixelCenter.x - 3;
    //             if (pixelEnd.y > pixelStart.y) {
    //                 pixelTemY = pixelCenter.y - r;
    //                 offsetPoint[1] = pixelCenter.y - (r - 8);
    //             } else {
    //                 pixelTemY = pixelCenter.y + r;
    //                 offsetPoint[1] = pixelCenter.y + (r + 8);
    //             }
    //             //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
    //             pixelX = pixelTemX - r * Math.tan(angle);
    //             pixelX1 = pixelTemX + r * Math.tan(angle);
    //             pixelY = pixelY1 = pixelTemY;
    //         } else {
    //             //斜率存在时
    //             delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
    //             param = Math.sqrt(delta * delta + 1);
    //
    //             if ((pixelEnd.x - pixelStart.x) < 0) {
    //                 //第二、三象限
    //                 pixelTemX = pixelCenter.x + r / param;
    //                 pixelTemY = pixelCenter.y + delta * r / param;
    //                 if ((pixelEnd.y - pixelStart.y) < 0) {
    //                     //第三象限
    //                     offsetPoint[0] = pixelCenter.x + (r - 8) / param;
    //                     offsetPoint[1] = pixelCenter.y + delta * (r - 8) / param;
    //                 } else {
    //                     //第二象限
    //                     offsetPoint[0] = pixelCenter.x + (r - 8) / param;
    //                     offsetPoint[1] = pixelCenter.y + delta * (r - 8) / param;
    //                 }
    //             } else {
    //                 //第一、四象限
    //                 pixelTemX = pixelCenter.x - r / param;
    //                 pixelTemY = pixelCenter.y - delta * r / param;
    //                 if ((pixelEnd.y - pixelStart.y) < 0) {
    //                     //第四象限
    //                     offsetPoint[0] = pixelCenter.x - (r - 8) / param;
    //                     offsetPoint[1] = pixelCenter.y - delta * (r - 8) / param;
    //                 } else {
    //                     //第一象限
    //                     offsetPoint[0] = pixelCenter.x - (r - 8) / param;
    //                     offsetPoint[1] = pixelCenter.y - delta * (r - 8) / param;
    //                 }
    //             }
    //             //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
    //             pixelX = pixelTemX + Math.tan(angle) * r * delta / param;
    //             pixelY = pixelTemY - Math.tan(angle) * r / param;
    //
    //             pixelX1 = pixelTemX - Math.tan(angle) * r * delta / param;
    //             pixelY1 = pixelTemY + Math.tan(angle) * r / param;
    //         }
    //         var pointArrow = currentMap.toMap(new ScreenPoint(pixelX, pixelY));
    //         var pointArrow1 = currentMap.toMap(new ScreenPoint(pixelX1, pixelY1));
    //         var pointArrow2 = currentMap.toMap(new ScreenPoint(offsetPoint[0], offsetPoint[1]));
    //         var arrowPolygon = new Polyline(currentMap.spatialReference);
    //
    //         arrowPolygon.addPath([pointArrow, centerPoint, pointArrow1, pointArrow2]);
    //         var graphic = new Graphic(arrowPolygon, sfs);
    //         layer.add(graphic);
    //
    //         var arrowPoint = new Point(centerPoint.x, centerPoint.y);
    //         var graphic = new Graphic(arrowPoint, new TextSymbol(twoPointDistance));
    //         layer.add(graphic);
    //     }
    // }
    var calcTwoPointDistance = function (lat1, lng1, lat2, lng2) {
        var xdiff = lat2 - lat1;            // 计算两个点的横坐标之差
        var ydiff = lng2 - lng1;            // 计算两个点的纵坐标之差
        return Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
    };
    //绘制追溯分析查询的管网信息
    // var drawPolyline = function (item) {
    //     currentVue.tableData = [];
    //     if (!graphicsLayer)
    //         graphicsLayer = getMapGraphicsLayer("traceAbilityAnalysis");
    //     graphicsLayer.clear();
    //     if (!flashIntervalHandle) {
    //         clearTimeout(flashIntervalHandle);
    //         flashIntervalHandle = setInterval(function () {
    //             if (graphicsLayer.visible && hideConfirm) {
    //                 graphicsLayer.hide();
    //                 hideConfirm = true;
    //             } else if (!graphicsLayer.visible && hideConfirm) {
    //                 graphicsLayer.show();
    //                 hideConfirm = false;
    //             } else if (!hideConfirm) {
    //                 hideConfirm = true;
    //             }
    //         }, 600);
    //     }
    //     if (item.wkt) {
    //         var pipeGeometry = mapTran.WkbToPolyline(item.wkt, currentMap.spatialReference);
    //         traceAnalysisExtent = pipeGeometry.getExtent();
    //
    //         var symbol = new CartographicLineSymbol();
    //         symbol.setWidth(4);
    //         symbol.setJoin(CartographicLineSymbol.JOIN_ROUND);
    //         symbol.setCap(CartographicLineSymbol.CAP_ROUND);
    //         if (item.sort == "雨水")
    //             symbol.setColor(new Color([0, 255, 197]));
    //         else if (item.sort == "污水")
    //             symbol.setColor(new Color([230, 0, 169]));
    //         else
    //             symbol.setColor(new Color([230, 152, 0]));
    //
    //         var graphic = new Graphic(pipeGeometry, symbol);
    //         graphicsLayer.add(graphic);
    //
    //         addResultToTable(item);
    //         currentVue.showFacilityTraceResult = true;
    //         if (item.childPipe)
    //             drawChildGraphic(item.childPipe);
    //         if (item.parentPipe)
    //             drawParentGraphic(item.parentPipe);
    //
    //         currentMap.setExtent(traceAnalysisExtent.expand(2), true);
    //     } else {
    //         currentVue.$message({
    //             message: '追溯分析无结果',
    //             type: 'warning'
    //         });
    //     }
    // };
    //绘制Recursive查询的要素图层
    // var drawRecursivePolyline = function (items) {
    //     currentVue.tableData = [];
    //     if (!graphicsLayer)
    //         graphicsLayer = getMapGraphicsLayer("traceAbilityAnalysis");
    //     graphicsLayer.clear();
    //     if (!flashIntervalHandle) {
    //         clearTimeout(flashIntervalHandle);
    //         flashIntervalHandle = setInterval(function () {
    //             if (graphicsLayer.visible && hideConfirm) {
    //                 graphicsLayer.hide();
    //                 hideConfirm = true;
    //             } else if (!graphicsLayer.visible && hideConfirm) {
    //                 graphicsLayer.show();
    //                 hideConfirm = false;
    //             } else if (!hideConfirm) {
    //                 hideConfirm = true;
    //             }
    //         }, 600);
    //     }
    //     if (items.length > 0) {
    //         var pipeGeometry = mapTran.WkbToPolyline(items[0].wkt, currentMap.spatialReference);
    //         traceAnalysisExtent = pipeGeometry.getExtent();
    //
    //         var symbol = new CartographicLineSymbol(
    //             CartographicLineSymbol.STYLE_SOLID,
    //             new Color("#323753"),
    //             4,
    //             CartographicLineSymbol.JOIN_ROUND,
    //             CartographicLineSymbol.CAP_ROUND);
    //
    //         items.forEach(function (item) {
    //             if (item.wkt) {
    //                 var pipeGeometry = mapTran.WkbToPolyline(item.wkt, currentMap.spatialReference);
    //                 updateTraceAnalysisExtent(traceAnalysisExtent, pipeGeometry.getExtent());
    //                 var graphic = new Graphic(pipeGeometry, symbol);
    //                 graphicsLayer.add(graphic);
    //                 addResultToTable(item);
    //             }
    //         }.bind(this));
    //
    //         currentVue.showFacilityTraceResult = true;
    //         currentMap.setExtent(traceAnalysisExtent.expand(2), true);
    //     } else {
    //         currentVue.$message({
    //             message: '追溯分析无结果',
    //             type: 'warning'
    //         });
    //     }
    // };
    //绘制子节点的管网要素
    // var drawChildGraphic = function (pipeArray) {
    //     pipeArray.forEach(function (item) {
    //         if (item.wkt) {
    //             var pipeGeometry = mapTran.WkbToPolyline(item.wkt, currentMap.spatialReference);
    //             updateTraceAnalysisExtent(traceAnalysisExtent, pipeGeometry.getExtent());
    //
    //             var symbol = new CartographicLineSymbol();
    //             symbol.setWidth(4);
    //             symbol.setJoin(CartographicLineSymbol.JOIN_ROUND);
    //             symbol.setCap(CartographicLineSymbol.CAP_ROUND);
    //             if (item.sort == "雨水")
    //                 symbol.setColor(new Color([0, 255, 197]));
    //             else if (item.sort == "污水")
    //                 symbol.setColor(new Color([230, 0, 169]));
    //             else
    //                 symbol.setColor(new Color([230, 152, 0]));
    //
    //             var graphic = new Graphic(pipeGeometry, symbol);
    //             graphicsLayer.add(graphic);
    //
    //             addResultToTable(item);
    //             if (item.childPipe)
    //                 drawChildGraphic(item.childPipe);
    //         }
    //     });
    // };
    //绘制父节点的管网要素
    // var drawParentGraphic = function (pipeArray) {
    //     pipeArray.forEach(function (item) {
    //         var pipeGeometry = mapTran.WkbToPolyline(item.wkt, currentMap.spatialReference);
    //         updateTraceAnalysisExtent(traceAnalysisExtent, pipeGeometry.getExtent());
    //
    //         var symbol = new CartographicLineSymbol();
    //         symbol.setWidth(4);
    //         symbol.setJoin(CartographicLineSymbol.JOIN_ROUND);
    //         symbol.setCap(CartographicLineSymbol.CAP_ROUND);
    //         if (item.sort == "雨水")
    //             symbol.setColor(new Color([0, 255, 197]));
    //         else if (item.sort == "污水")
    //             symbol.setColor(new Color([230, 0, 169]));
    //         else
    //             symbol.setColor(new Color([230, 152, 0]));
    //
    //         var graphic = new Graphic(pipeGeometry, symbol);
    //         graphicsLayer.add(graphic);
    //         addResultToTable(item);
    //         if (item.parentPipe)
    //             drawParentGraphic(item.parentPipe);
    //     });
    // };
    //更新追溯图像的区间
    // var updateTraceAnalysisExtent = function (traceAnalysisExtent, pipeGeometryExtent) {
    //     if (traceAnalysisExtent.xmin > pipeGeometryExtent.xmin)
    //         traceAnalysisExtent.xmin = pipeGeometryExtent.xmin;
    //
    //     if (traceAnalysisExtent.xmax < pipeGeometryExtent.xmax)
    //         traceAnalysisExtent.xmax = pipeGeometryExtent.xmax;
    //
    //     if (traceAnalysisExtent.ymin > pipeGeometryExtent.ymin)
    //         traceAnalysisExtent.ymin = pipeGeometryExtent.ymin;
    //
    //     if (traceAnalysisExtent.ymax < pipeGeometryExtent.ymax)
    //         traceAnalysisExtent.ymax = pipeGeometryExtent.ymax;
    // };
    //获取图层根据Id
    var getMapGraphicsLayer = function (LayerId, index) {
        var graphicsLayer = null;
        if (currentMap.getLayer(LayerId)) {
            graphicsLayer = currentMap.getLayer(LayerId);
        } else {
            graphicsLayer = new GraphicsLayer({id: LayerId});
            if (index)
                currentMap.addLayers([graphicsLayer], index);
            else
                currentMap.addLayers([graphicsLayer]);
        }
        return graphicsLayer;
    };
    //将追溯结果更新到表格对象中
    // var addResultToTable = function (item) {
    //     currentVue.tableData.push(item);
    //     var kilometerLenght = item.length / 1000;
    //     currentVue.facilityTraceLength = Math.round((currentVue.facilityTraceLength + kilometerLenght) * 100000) / 100000;
    // };
    return {
        //绘制南宁追溯分析查询的管网信息
        drawNNPolyline: function (result, currentMap) {
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
                mapHelper.drawLine(currentMap, [pipeLineObj.startX, pipeLineObj.startY], [pipeLineObj.endX, pipeLineObj.endY], 4, lineColor, graphicsLayer);
                var line = Polyline({
                    "paths": [[[pipeLineObj.startX, pipeLineObj.startY], [pipeLineObj.endX, pipeLineObj.endY]]],
                    "spatialReference": currentMap.spatialReference
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
        },
        drawArrowPolyline: function (polyline, layer, length, angleValue, graphicColor) {
            //线的坐标串
            var linePoint = polyline.paths;
            var arrowCount = linePoint.length;
            var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(graphicColor), 2), new Color(graphicColor)
            );
            for (var i = 0; i < arrowCount; i++) { //在拐点处绘制箭头
                var line = linePoint[i];
                var centerX = (line[0][0] + line[line.length - 1][0]) / 2;
                var centerY = (line[0][1] + line[line.length - 1][1]) / 2;
                var centerPoint = new Point([centerX, centerY], currentMap.spatialReference);
                var startPoint = new Point([line[0][0], line[0][1]], currentMap.spatialReference);
                var endPoint = new Point([line[line.length - 1][0], line[line.length - 1][1]], currentMap.spatialReference);

                var pixelCenter = currentMap.toScreen(centerPoint);
                var pixelStart = currentMap.toScreen(startPoint);
                var pixelEnd = currentMap.toScreen(endPoint);
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

                var pointArrow = currentMap.toMap(new ScreenPoint(pixelX, pixelY));
                var pointArrow1 = currentMap.toMap(new ScreenPoint(pixelX1, pixelY1));
                var pointArrow2 = currentMap.toMap(new ScreenPoint(offsetPoint[0], offsetPoint[1]));

                var arrowPolygon = new Polyline(currentMap.spatialReference);
                arrowPolygon.addPath([pointArrow, centerPoint, pointArrow1, pointArrow2]);
                var graphic = new Graphic(arrowPolygon, sfs);
                layer.add(graphic);

                // var arrowPoint = new Point(centerPoint.x,centerPoint.y);
                // var graphic = new Graphic(arrowPoint,new TextSymbol(twoPointDistance));
                // layer.add(graphic);
            }
        },
        getGraphicsLayer: function (LayerId, index, map) {
            if (!!map) {
                currentMap = map;
            }
            var graphicsLayer = null;
            if (currentMap.getLayer(LayerId)) {
                graphicsLayer = currentMap.getLayer(LayerId);
            } else {
                graphicsLayer = new GraphicsLayer({id: LayerId});
                if (index)
                    currentMap.addLayers([graphicsLayer], index);
                else
                    currentMap.addLayers([graphicsLayer]);
            }
            return graphicsLayer;
        },
        // traceAbilityAnalysis: function (event, traceAnalysisType, vue) {
        //     currentVue = vue;
        //     currentMap = vue.leftMap;
        //
        //     currentVue.showFacilityTraceLoading = true;
        //     currentVue.facilityTraceLength = 0;
        //
        //     var formData = {};
        //     formData.pointWkt = "POINT (" + event.mapPoint.x + " " + event.mapPoint.y + ")";
        //     formData.token = serviceHelper.getToken();
        //     formData.r = Math.random();
        //     var queryUrl = traceAnalysisType ? "/upTraceabilityAnalysis" : "/downTraceabilityAnalysis";
        //     $.ajax({
        //         type: "get",
        //         dataType: "json",
        //         data: formData,
        //         url: serviceHelper.getBasicPath() + "/pipeAnalyze" + queryUrl,
        //         success: function (ajaxResult) {
        //             if (ajaxResult) {
        //                 if (ajaxResult.success == true) {
        //                     var result = JSON.parse(ajaxResult.data);
        //                     drawPolyline(result);
        //                 } else {
        //                     //后台操作失败的代码
        //                     alert(ajaxResult.msg);
        //                 }
        //                 currentVue.showFacilityTraceLoading = false;
        //             }
        //         }.bind(this),
        //         error: function () {
        //             currentVue.showFacilityTraceLoading = false;
        //         }.bind(this)
        //     });
        // },
        // traceAnalysisByRecursive: function (event, traceAnalysisType, vue) {
        //     currentVue = vue;
        //     currentMap = vue.leftMap;
        //
        //     currentVue.showFacilityTraceLoading = true;
        //     currentVue.facilityTraceLength = 0;
        //
        //     var formData = {};
        //     formData.pointWkt = "POINT (" + event.mapPoint.x + " " + event.mapPoint.y + ")";
        //     formData.traceType = traceAnalysisType;
        //     formData.token = serviceHelper.getToken();
        //     formData.r = Math.random();
        //     $.ajax({
        //         type: "get",
        //         dataType: "json",
        //         data: formData,
        //         url: serviceHelper.getBasicPath() + "/pipeAnalyze/traceAnalysisByRecursive",
        //         success: function (ajaxResult) {
        //             if (ajaxResult) {
        //                 if (ajaxResult.success == true) {
        //                     var result = JSON.parse(ajaxResult.data);
        //                     drawRecursivePolyline(result);
        //                 } else {
        //                     //后台操作失败的代码
        //                     alert(ajaxResult.msg);
        //                 }
        //                 currentVue.showFacilityTraceLoading = false;
        //             }
        //         }.bind(this),
        //         error: function () {
        //             currentVue.showFacilityTraceLoading = false;
        //         }.bind(this)
        //     });
        // },

        nnTraceAnalysisByRecursive: function (event, traceAnalysisType, vue, cb) {
            eventHelper.emit('isLoading');
            var result;
            var self = this;
            currentVue = vue;
            currentMap = vue.leftMap;
            currentVue.showFacilityTraceLoading = true;
            currentVue.facilityTraceLength = 0;
            var pointBufferDistance = screenLengthToMapLength(currentMap, 5);
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
                                    graphicsLayer.clear();
                                }
                                if (!!arrowLayer) {
                                    arrowLayer.clear();
                                }
                                vue.$message.error(result.msg);
                                eventHelper.emit('closeLoading');
                                cb(false);
                                return;
                            }
                            self.drawNNPolyline(result, currentMap);
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

        },
        // gzTraceAnalysisByRecursive: function (event, traceAnalysisType, vue, cb) {
        //     eventHelper.emit('isLoading');
        //     var result;
        //     var self = this;
        //     currentVue = vue;
        //     currentMap = vue.leftMap;
        //     currentVue.showFacilityTraceLoading = true;
        //     currentVue.facilityTraceLength = 0;
        //     var pointBufferDistance = screenLengthToMapLength(currentMap, 5);
        //     var formData = {};
        //     formData.token = serviceHelper.getToken();
        //     formData.r = Math.random();
        //     formData.x = event.mapPoint.x;
        //     formData.y = event.mapPoint.y;
        //     formData.pointBufferDistance = pointBufferDistance;
        //     if (traceAnalysisType === '上下') {
        //         formData.connectUp = "1";
        //         formData.connectDown = "1";
        //     } else if (traceAnalysisType === '向下') {
        //         formData.connectUp = "0";
        //         formData.connectDown = "1";
        //     } else {
        //         formData.connectUp = "1";
        //         formData.connectDown = "0";
        //     }
        //     //mapHelper.setCenter(formData.x,formData.y,currentMap,18);
        //     $.ajax({
        //         type: "get",
        //         dataType: "json",
        //         url: serviceHelper.getBasicPath() + "/pipeAnalyze/flowConnectAnalysis",
        //         data: formData,
        //         success: function (ajaxResult) {
        //             if (ajaxResult) {
        //                 if (ajaxResult.success == true) {
        //                     result = ajaxResult.data;
        //                     if (!result.success) {
        //                         if (!!graphicsLayer) {
        //                             graphicsLayer.clear();
        //                         }
        //                         if (!!arrowLayer) {
        //                             arrowLayer.clear();
        //                         }
        //                         vue.$message.error(result.msg);
        //                         return;
        //                     }
        //                     drawNNPolyline(result, currentMap);
        //                     cb();
        //                     // this.leftMap.addLayer(graphicsLayer);
        //                 } else {
        //                     //后台操作失败的代码
        //                     vue.$message.error(ajaxResult.msg);
        //                 }
        //                 currentVue.showFacilityTraceLoading = false;
        //             }
        //             eventHelper.emit('closeLoading');
        //         }.bind(this),
        //         error: function () {
        //             currentVue.showFacilityTraceLoading = false;
        //             eventHelper.emit('closeLoading');
        //         }.bind(this)
        //     });
        //
        // },
        clearAnalysisInfo: function () {
            if (!flashIntervalHandle)
                clearTimeout(flashIntervalHandle);
            if (!graphicsLayer)
                graphicsLayer = getMapGraphicsLayer("traceAbilityAnalysis");
            graphicsLayer.clear();
        },
        // locationByWkt: function (item) {
        //     if (item.wkt) {
        //         var pipeGeometry = mapTran.WkbToPolyline(item.wkt, currentMap.spatialReference);
        //         if (!graphicsLayer)
        //             graphicsLayer = getMapGraphicsLayer("traceAbilityAnalysis");
        //         if (locationGraphic)
        //             graphicsLayer.remove(locationGraphic);
        //         var symbol;
        //         if (pipeGeometry.type == "point")
        //             symbol = new SimpleMarkerSymbol(
        //                 SimpleMarkerSymbol.STYLE_CROSS, 20,
        //                 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 4),
        //                 new Color([255, 255, 255]));
        //         else
        //             symbol = new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 4, CartographicLineSymbol.CAP_ROUND, CartographicLineSymbol.JOIN_ROUND);
        //
        //         locationGraphic = new Graphic(pipeGeometry, symbol);
        //         graphicsLayer.add(locationGraphic);
        //         var pipeExtent = pipeGeometry.getExtent();
        //         currentMap.setExtent(pipeExtent.expand(2), true);
        //     }
        // }
    }
});