/****
 * 设施监控新增点
 * @param combId 设施ID
 * @param featureLayreId 要素图层ID
 * @param title 弹出框title
 * @param estType 设施类型
 * @param x 设施经度
 * @param y 设施纬度
 * @param content 弹出框html内容
 * @param iconUrl 设施logo
 * @param iconW 设施logo宽度
 * @param iconH 设施logo高度
 */
define(['utils/eventHelper'], function (eventHelper) {
    return {
        createTextSymbol: function (Graphic,
                                    Point,
                                    TextSymbol,
                                    Color,
                                    geometry,
                                    name,
                                    layer) {
            var textSymbol = new TextSymbol();
            textSymbol.setText(name);
            textSymbol.setColor(new Color([255, 0, 0, 1]));
            textSymbol.setFont("8pt");
            textSymbol.setOffset(0, -20);
            var graphic1 = new Graphic(geometry, textSymbol);
            layer.add(graphic1);
        },
        createSymbol: function (Color, PictureMarkerSymbol, Point, Graphic, TextSymbol, graLayer, x, y, iconUrl, item, legend, hideName) {
            var pictureMarkerSymbol = new PictureMarkerSymbol(iconUrl, 20, 20);
            var geometry = new Point(x, y);
            var graphic = new Graphic(geometry, pictureMarkerSymbol);
            var textSymbol = new TextSymbol();
            textSymbol.setText(item.name);
            textSymbol.setColor(new Color([255, 0, 0, 1]));
            textSymbol.setFont("8pt");
            textSymbol.setOffset(0, -20);
            if (!hideName) {
                var graphic1 = new Graphic(geometry, textSymbol);
                graLayer.add(graphic1);
                graphic1.attributes = {facilityTypeName: legend.facilityTypeName, item: item};
            }
            graLayer.add(graphic);
            graphic.attributes = {facilityTypeName: legend.facilityTypeName, title: legend.title, item: item};
            return graLayer;
        }
        ,
        ssjkCreatePoint: function (map, combId, featureLayreId, title, estType, x, y, content, iconUrl, iconW, iconH, facilityTypeName, item) {
            cesc.require([
                "esri/geometry/Point",
                "esri/layers/FeatureLayer",
                "esri/graphic",
                "esri/InfoTemplate",
                "esri/dijit/PopupTemplate",
                "esri/symbols/TextSymbol",
                "esri/renderers/SimpleRenderer",
                "esri/layers/LabelClass",
                "dojo/_base/connect",
                "esri/Color",
                "esri/symbols/Font",
                "esri/symbols/PictureMarkerSymbol",
                "esri/layers/GraphicsLayer"
            ], function (Point,
                         FeatureLayer,
                         Graphic,
                         InfoTemplate,
                         PopupTemplate,
                         TextSymbol,
                         SimpleRenderer,
                         LabelClass,
                         connect,
                         Color,
                         Font,
                         PictureMarkerSymbol,
                         GraphicsLayer) {

                iconW = (iconW == null) ? iconW = 15 : iconW = iconW;
                iconH = (iconH == null) ? iconH = 15 : iconH = iconH;

                var featureCollection = {
                    "layerDefinition": null,
                    "featureSet": {
                        "features": [],
                        "geometryType": "esriGeometryPoint"
                    }
                };
                featureCollection.layerDefinition = {
                    "geometryType": "esriGeometryPoint",
                    "objectIdField": "ObjectID",
                    "drawingInfo": {
                        "renderer": {
                            "type": "simple",
                            "symbol": {
                                "type": "esriPMS",
                                "url": iconUrl,
                                "contentType": "image/png",
                                "width": iconW,
                                "height": iconH
                            }
                        }
                    },
                    "fields": [
                        {
                            "name": "ObjectID",
                            "alias": "ObjectID",
                            "type": "esriFieldTypeOID"
                        }, {
                            "name": "description",
                            "alias": "Description",
                            "type": "esriFieldTypeString"
                        }, {
                            "name": "title",
                            "alias": "Title",
                            "type": "esriFieldTypeString"
                        }, {
                            "name": "mapValue",
                            "alias": "mapValue",
                            "type": "esriFieldTypeString"
                        }, {
                            "name": "combId",
                            "alias": "combId",
                            "type": "esriFieldTypeString"
                        }, {
                            "name": "estType",
                            "alias": "estType",
                            "type": "esriFieldTypeString"
                        }, {
                            "name": "content",
                            "alias": "content",
                            "type": "esriFieldTypeString"
                        }
                    ]
                };
                /*      var infoTitle = "<span class='infoWindow-title'>岭南蓄水池</span><span class='infoWindow-tips'>正常</span><br>" +
                 "<span class='infoW-txt-l'>当前水位:<span class='small-tips-blue'>0.32m</span></span>" +
                 "<span class='infoW-txt-r'>电量:<span class='small-tips-orange'>80%</span></span>";
                 var infoTemplate = new InfoTemplate(null, infoTitle);
                 connect.connect(infoTemplate, "onLoad", function (evt) {
                 //var attributes=evt.graphic.attributes;
                 //var combId=attributes.combId;
                 // getMonitorStationByCombId(combId);
                 });
                 var popupTemplate = new PopupTemplate({
                 // title: "{title}",
                 // description: "{description}"
                 });
                 popupTemplate.setContent(content);

                 */
                var featureLayer = null;
                var labelSymbol = null;
                featureLayer = new FeatureLayer(featureCollection, {
                    id: featureLayreId,
                    //infoTemplate: popupTemplate
                    //infoTemplate:infoTemplate
                });
                featureLayer.id = featureLayreId;
                map.addLayers([featureLayer]);
                //	featureLayreOnClickHandler(featureLayer);

                labelSymbol = new TextSymbol();
                labelSymbol.setColor(new Color([255, 0, 0, 1]));
                var font = new Font();
                font.setSize("12pt");
                font.setWeight(Font.WEIGHT_BOLD);
                labelSymbol.setFont(font);
                //textSymbol.setOffset(50,-35);

                //var labelRenderer = new SimpleRenderer(labelSymbol);

                var json = {
                    "labelExpressionInfo": {"value": "{mapValue}"}
                };

                //create instance of LabelClass
                var lc = new LabelClass(json);
                lc.symbol = labelSymbol; // symbol also can be set in LabelClass' json
                featureLayer.setLabelingInfo([lc]);

                //featureLayer.setInfoTemplate(popupTemplate);
                // featureLayer.setInfoTemplate(infoTemplate);
                var pictureMarkerSymbol = new PictureMarkerSymbol(iconUrl, iconW, iconH);

                var textSymbol = new esri.symbol.TextSymbol();
                textSymbol.setText(title);
                textSymbol.setColor(new Color([13, 67, 179, 1]));
                textSymbol.setFont("12pt");
                textSymbol.setOffset(30, -25);

                var features = [];
                var attr = {combId: combId, title: title, mapValue: title, content: content, estType: estType};
                var geometry = new Point(x, y);
                var graphic = new Graphic(geometry, textSymbol);
                var graphic1 = new Graphic(geometry, pictureMarkerSymbol);
                graphic.attributes = {facilityTypeName: facilityTypeName, item: item};
                features.push(graphic);
                features.push(graphic1);
                featureLayer.add(graphic);
                featureLayer.add(graphic1);
                featureLayer.on('mouse-over',function (evt) {
                    console.log('over',evt);
                    map.infoWindow.setTitle('车辆基本信息');
                    var content = '<p><span>'+ '驾驶员：'+'</span>'+item.driver +'</p>'+
                                  '<p><span>'+ '公司：'+'</span>'+item.company +'</p>'+
                                  '<p><span>'+ '车牌号：'+'</span>'+item.truckNum +'</p>';
                    map.infoWindow.setContent(content);
                    map.infoWindow.show(evt.screenPoint);
                    console.log(evt.screenPoint);
                });
                featureLayer.on('mouse-out',function (evt) {
                    map.infoWindow.hide();
                });
                featureLayer.on('click', function (event) {
                    console.log(item);

                    eventHelper.emit('carDetail-clicked', {
                        id: 'f' + item.fid,
                        item: item,
                        facilityTypeName: facilityTypeName,
                        center: [event.graphic.geometry.x, event.graphic.geometry.y]
                    });
                    //event.graphic.getLayer().id
                });
                return featureLayer;
            });
        }
    }


})
;