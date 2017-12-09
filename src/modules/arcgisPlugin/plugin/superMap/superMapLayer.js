define(
    function () {
        var declare = cesc.require("dojo/_base/declare");
        // cese.require("esri/layers/tiled");
        return declare(esri.layers.TiledMapServiceLayer, {
            constructor: function () {
                this.spatialReference = new esri.SpatialReference({wkid: 4508});
                this.initialExtent = (this.fullExtent = new esri.geometry.Extent(117.49559106826783,35.85603904724121,118.56588850021362,37.349958419799805, this.spatialReference));
                this.tileInfo = new esri.layers.TileInfo({
                    "rows": 256,
                    "cols": 256,
                    "compressionQuality": 0,
                    "origin": {
                        "x": 118.03073978424072,
                        "y": 36.60299873352051
                    },
                    "spatialReference": {
                        "wkid": 4508
                    },
                    "lods": [
                        {"level": 2, "resolution": 0.3515625, "scale": 0.00022178184032436174},
                        {"level": 3, "resolution": 0.17578125, "scale": 0.00011089092016218087},
                        {"level": 4, "resolution": 0.087890625, "scale": 0.00005544546008109044},
                        {"level": 5, "resolution": 0.0439453125, "scale": 0.00002772273004054522},
                        {"level": 6, "resolution": 0.02197265625, "scale": 0.00001386136502027261},
                        {"level": 7, "resolution": 0.010986328125, "scale": 0.0000069306825101363},
                        {"level": 8, "resolution": 0.0054931640625, "scale": 0.00000346534125506815},
                        {"level": 9, "resolution": 0.00274658203125, "scale": 0.00000173267062753408},
                        {"level": 10, "resolution": 0.001373291015625, "scale": 0.00000086633531376704},
                        {"level": 11, "resolution": 0.0006866455078125, "scale": 0.00000043316765688352},
                        {"level": 12, "resolution": 0.00034332275390625, "scale": 0.00000021658382844176},
                        {"level": 13, "resolution": 0.000171661376953125, "scale": 0.00000010829191422088},
                        {"level": 14, "resolution": 8.58306884765625e-005, "scale": 0.00000005414595711044}
                    ]
                });
                this.loaded = true;
                this.onLoad(this);
            },
            getTileUrl: function (level, row, col) {
                return "http://223.99.169.187:20215/iserver/services/map-agscache-shiliang/rest/maps/shiliang/tileImage.png?transparent=false&cacheEnabled=true&width=256&height=256&x="+row+"&y="+col+"&scale=5.414595711043988e-8&redirect=false&overlapDisplayed=false";
            }
        });
    });
//"http://t" + col % 8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
//http://223.99.169.187:20215/iserver/services/map-agscache-shiliang/rest/maps/shiliang/tileImage.png?transparent=false&cacheEnabled=true&width=256&height=256&x=0&y=0&scale=5.414595711043988e-8&redirect=false&overlapDisplayed=false