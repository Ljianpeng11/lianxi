var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');
var moment = require('moment');

//加载组件
var chartLib = require('modules/onlineMonitor/chartLib');

//组装数据
var road = ['青城路','高苑路','东环路','东外环','高青县长江路','高苑路','黄河路','老北环路','六号路','芦湖路','蒲台路','七号路','齐东路'];
//var randomNum =  [434,748,379,528,0,0,0,0,0,0,0,0,0];
var randomNum =  Math.random()*1250;
var pipeLineItem = [434,448,379,528,0,0,0,0,0,0,0,0,0],yData = [434,748,379,528,0,0,0,0,0,0,0,0,0];
var pipeLineArr = [];
road.forEach(function(val,index){
   var item = {
       id:(function(){
           if(index < 9){
               return 'GQGSW0'+index;
           }else{
               return 'GQGSW'+index;
           }
       })(),
       location:val,
       length:pipeLineItem[index]
   };
    // yData.push(item.length);
    pipeLineArr.push(item);
});
var pipeLineChartOptions = {
    type:'categoryBarChart',
    title:'高水位运行管线统计',
    color:[
        '#f00',
    ],
    xData:road,
    yAxisName:'单位：米',
    seriesData:[
        {
            name:'',
            data:yData
        }
    ]
};
// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            openAnalysisRoadBox:false,
            showToggle:false,
            showData:true,
            pageSize:100,
            currentPage:1,
            pipeInfo:{
                totalLength:157.75,
                currentLength:42.33,
                highLevelLength:29.40,
                rate:(function(){
                    var num = (29.40/42.33).toFixed(2)*100;
                    return num;
                }.bind(this))()
            },
            barChartOptions:pipeLineChartOptions,
            pipeLineArr:pipeLineArr
        }
    },
    created:function(){

    },
    methods: {
        init:function(){
            this.openAnalysisRoadBox = true;
            this.showData = true;
        },
        openMonitorPipe:function(){
            mapHelper.setCenter(this.baseView,117.8490172157689,37.16923962553807,16);
        },
        togglePipeLineBox:function(){
            this.$parent.hightWaterLineLayer.visible=false;
            this.openAnalysisRoadBox = false;
            clearInterval(this.$parent.hightWaterLineLayerHandle);
            this.$parent.hightWaterLineLayerHandle=null;
        },
        handleSizeChange:function(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange:function(val) {
            console.log(`当前页: ${val}`);
        },
        formatter:function(row, column) {
            return row.id;
        },
        filterTag:function(value, row) {
            if(!!row.location){
                return row.location === value;
            }else{
                return row.questionType === value;
            }

        }
    }
    ,
    mounted: function () {
        eventHelper.on('togglePipeChart',function () {
            this.showData = false;
            $(".pollutionBox").css('height','calc(100% - 18em - 10px');
            // $(".pollutionBox").animate({'height':'calc(100% - 18em - 10px)'},1000);
        }.bind(this));
    },
    components: {
        'chart-lib':chartLib
    }
});
module.exports = comm;