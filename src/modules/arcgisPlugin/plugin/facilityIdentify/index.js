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
            //this.leftMap.setMapCursor("default");
            this.showIdentifyResult = false;
            mapHelper.removeLocationIdentifyLayer();
        },
        handleCurrentChange: function (index) {
            //this.displayIdentifyInfo = this.identifyData[index - 1].prpos;
            //this.displayIdentifyInfoTitle = this.identifyData[index - 1].titleName;
            var style ={
                color: [226, 119, 40],
                width: 4
            };

            var facilityIdentifyLayer = this.baseView.map.findLayerById("facilityIdentify");
            facilityIdentifyLayer.removeAll();
            var location
            var geometry = this.identifyData[index].geometry;
            if(geometry.type=="LINE"){
                var paths= [];
                for(var i in geometry.points){
                    var path = [geometry.points[i].x,geometry.points[i].y];
                    paths.push(path);
                }
                location = mapHelper.createPolyline(facilityIdentifyLayer,[paths],style);
            } else {
                location = mapHelper.createPolyline(facilityIdentifyLayer,geometry.points,style);
            }
            mapHelper.setCenter(this.baseView,location.geometry.extent.center.x,location.geometry.extent.center.y,15);
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
                url:"http://11.0.204.11:8090/iserver/services/data-gqpsfacility/rest/data/featureResults.json?returnContent=true",
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
                var facilityIdentifyLayer = mapHelper.createGraphicsLayer(this.baseView.map,"facilityIdentify");
                this.identifyData = [];
                if (data.features && data.features.length > 0) {
                    for (var i in data.features) {
                        var feature = data.features[i];
                        feature.titleName = "";
                        feature.prpos =  this.allPrpos(feature);
                        this.identifyData.push(feature);
                    }
                    this.showIdentifyResult=true;
                    this.handleCurrentChange(1);
                }
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