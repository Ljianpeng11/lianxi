define(['./arcgisExpand/TDTLayer'], function (TDTLayer) {
    var instance = {};
    instance.initTDLayer = function () {
        /*  var sr = new instance.SpatialReference({wkid:4490});
         var fullextent = new instance.Extent({
         xmax:1000.0,xmin:0.0,ymax:1000,ymin:0.0,spatialReference:sr
         });
         var initialextent = new instance.Extent({
         xmax:108.13817851680021,xmin:105.3831598117314,ymax:30.46728535770415,ymin:28.897172489811304,spatialReference:sr
         })

         var tileBaseLayer = new instance.TileLayer({
         url: "http://www.digitalcq.com/RemoteRest/services/CQMap_VEC/MapServer",
         spatialReference:sr,
         fullExtent:fullextent
         })

         var cq_map = new instance.Basemap({
         baseLayers: [tileBaseLayer],
         title: "arcgis",
         id: "arcgis",
         });

         var map = new instance.Map({
         basemap: cq_map
         });

         var view = new instance.MapView({
         container: "mapDiv",
         map: map,
         extent:initialextent,
         spatialReference:sr,
         });*/
        /*     var layer = TDTLayer.getTDTLayer();

         var spatialReference = new instance.SpatialReference({wkid: 4326});
         var mylayer = new instance.WebTileLayer(
         {
         urlTemplate: "http://{subDomain}.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}",
         subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
         copyright: "天地图影像",
         spatialReference: spatialReference
         });*/
        /*     var cq_map = new instance.Basemap({
         baseLayers: [mylayer],
         title: "arcgis",
         id: "arcgis",
         });*/
        /*      var map = new instance.Map({
         basemap: cq_map
         });
         var initialextent = new instance.Extent(-180.0, -90.0, 180.0, 90.0, spatialReference);
         var view = new instance.SceneView({
         container: "mapDiv",
         map: map,
         scale: 123456789
         });*/

        instance.erisConfig.request.corsEnabledServers
            .push("t0.tianditu.com", "t1.tianditu.com", "t2.tianditu.com",
                "t3.tianditu.com",
                "t4.tianditu.com",
                "t5.tianditu.com",
                "t7.tianditu.com",
                "t6.tianditu.com",
                "t8.tianditu.com",
                "t9.tianditu.com",
                "t10.tianditu.com",
                "t11.tianditu.com",
                "t12.tianditu.com",
            );

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
            urlTemplate: "http://{subDomain}.tianditu.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles",
            subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            copyright: "",
            spatialReference: spatialReference,
            fullExtent: fullExtent,
            tileInfo: tileInfo,
        });
        var map = new instance.Map({
            layers: [tiledLayer, tiledMarkLayer]
        });
        var view = new instance.MapView({
            container: "mapDiv",
            map: map,
            center: [110.06034851074236, 30.834846496582045],
            zoom: 10
        });
        view.on('click', function (evt) {
            console.log(evt)
        });
    }
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
                'esri/graphic',
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
                         TileInfo) {
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
                cb('C', instance);
            });
        }

    };
});