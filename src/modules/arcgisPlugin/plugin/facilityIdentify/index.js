var template = require('./content.html');
var mapHelper = require('utils/mapHelper');
var eventHelper = require('utils/eventHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            currentPage: 1,
            idenfityInfoArr: [],
            isQueryFacility: false,
            showIdentifyResult: false,
            isAddEvent:false,
            identifyData:[],
            displayIdentifyInfoTitle:""
        }
    },
    methods: {
        closeIdentityQuery: function () {
            this.$message('关闭管网点查询功能');
            this.isQueryFacility = false;
            this.leftMap.setMapCursor("default");
            this.showIdentifyResult = false;
            mapHelper.removeLocationIdentifyLayer();
        },
        handleCurrentChange: function (index) {
            //this.displayIdentifyInfo = this.identifyData[index - 1].prpos;
            //this.displayIdentifyInfoTitle = this.identifyData[index - 1].titleName;
            //mapHelper.locationIdentifyLayerByGeometry(this.identifyData[index - 1].geometry);
        },
        onCompleteFunction: function (results) {
            this.identifyData = [];
            if (results && results.length > 0) {
                for (var i in results) {
                    var feature = results[i];
                    var titleName = "";
                    feature.titleName = titleName;
                    var prpos = this.allPrpos(feature);
                    feature.prpos = prpos;
                    this.identifyData.push(feature);
                }
                this.showIdentifyResult=true;
                this.handleCurrentChange(1);
            }
        },
        allPrpos : function(feature){
            var props = [];
            for(var i in feature.fieldNames){
                props.push({title:feature.fieldNames[i],value:feature.fieldValues[i]});
            }
            return props;
        },
        querySearch:function(x,y) {
            var queryParam = {
                'datasetNames':["gqpsfacilitygh:PS_CANAL_ZY_GLX","gqpsfacilitygh:PS_PIPE_ZY_GLX"],
                'getFeatureMode':"BUFFER",
                'bufferDistance':5,
                'geometry':{
                    'id':0,
                    'style':null,
                    'parts':[1],
                    'points':[{
                        'id':"SuperMap.Geometry.Point_105",
                        'x':x,
                        'y':y,
                        'type':"NONE",
                        'tag':null,
                        'bounds':null,
                        'SRID':null
                    }],
                    'type':"POINT"
                }
            };
            $.ajax({
                type:"POST",
                url:"http://223.99.169.187:20070/iserver/services/data-gqpsfacility/rest/data/featureResults.json?returnContent=true",
                data:JSON.stringify(queryParam),
                dataType:"json",
                success:this.handleSearchSuccess,
                error:this.handleSearchError
            })
        },
        handleSearchError:function(erro,info,obj){
            this.$message.error('地名地址查询失败！');
        },
        handleSearchSuccess:function(data){
            if(data.features.length>0){
                debugger;
                this.onCompleteFunction(data.features);
                var style = {
                    color: [227, 139, 79, 0.8],
                    outline: {
                        color: [255, 255, 255],
                        width: 1
                    }
                };
                var facilityIdentifyLayer = mapHelper.createVideoGraphicsLayer(this.baseView.map,"facilityIdentify");
                var location
                if(data.features[0].geometry.type=="LINE"){
                    var paths= [];
                    for(var i in data.features[0].geometry.points){
                        var path = [data.features[0].geometry.points[i].x,data.features[0].geometry.points[i].y];
                        paths.push(path);
                    }
                    location = mapHelper.createPolyline(facilityIdentifyLayer,paths,style);
                } else {
                    location = mapHelper.createPolyline(facilityIdentifyLayer,data.features[0].geometry.points,style);
                }
                mapHelper.setCenter(this.baseView,location.geometry.extent.center.x,location.geometry.extent.center.y,13);
            } else {
                this.$message.info('点查询无数据！');
            }
        },
    },
    mounted: function () {
        eventHelper.on('facility-identify', function () {
            if (this.isQueryFacility == false) {
                this.isQueryFacility = true;
                this.$message('开启管网点查询功能');
                if(this.isAddEvent==false){
                    this.baseView.on('click', function (event) {
                        if (this.isQueryFacility){
                            this.querySearch(event.mapPoint.x,event.mapPoint.y);
                        }
                    }.bind(this));
                }
            } else {
                this.$message({
                    message: '管网点查询功能已开启',
                    type: 'warning'
                });
            }
        }.bind(this));
    },
    components: {
    }
});
module.exports = comm;