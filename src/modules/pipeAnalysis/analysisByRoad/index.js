var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');
var moment = require('moment');

//加载组件
var chartLib = require('modules/onlineMonitor/chartLib');

//组装数据
var road = ['邦德路','北一路','东环路','东外环','高青县长江路','高苑路','黄河路','老北环路','六号路','芦湖路','蒲台路','七号路','齐东路'];
var randomNum =  Math.random().toFixed(2)*1250;
var pipeLineArr = [],yData = [];
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
       length:((Math.random() - 0.2) * 100 + randomNum).toFixed(2)
   };
    yData.push(item.length);
    pipeLineArr.push(item);
});
var pipeLineChartOptions = {
    type:'categoryBarChart',
    title:'高水位运行管线比例统计',
    color:[
        '#2f91e4',
    ],
    xData:road,
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
            openAnalysisRoad:false,
            showToggle:false,
            pageSize:100,
            currentPage:1,
            pipeInfo:{
                totalLength:'157.75',
                currentLength:'42.33',
                highLevelLength:'29.40',
                rate:(function(){
                    var num = (this.totalLength/this.highLevelLength).toFixed(2)*100 + '%';
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
            this.openAnalysisRoad = true;
        },
        openMonitorPipe:function(){
            mapHelper.setCenter(this.baseView,117.8124871849,37.1604873613,15);
        },
        togglePipeLineBox:function(){
            this.openAnalysisRoad = false;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        formatter(row, column) {
            return row.id;
        },
        filterTag(value, row) {
            if(!!row.location){
                return row.location === value;
            }else{
                return row.questionType === value;
            }

        }
    }
    ,
    mounted: function () {

    },
    components: {
        'chart-lib':chartLib
    }
});
module.exports = comm;