var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var echarts = require('echarts');
var moment = require('moment');

//加载组件
var chartLib = require('modules/onlineMonitor/chartLib');


//雨量数据
var xData = [],yData1 = [],yData2 = [];
var data1 = [Math.random() *60];
var data2 = [Math.random() *1.2];
var time;

for(var i = 0;i<12;i++){
    time = moment().subtract(i,'h');
    xData[(11 - i)] = time.format('YYYY-MM-DD hh:ss');
    yData1.push(((Math.random() - 0.4) + data2[data2.length - 1]).toFixed(2));
    yData2.push(((Math.random() - 0.4) * 10 + data1[data1.length - 1]).toFixed(2));
}

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            myChart:null,
            timeIndex:null,
            timer:null,
            isOpenPanel:false,
            isOpenBox:true,
            deviceInfo:{},
            chartOptions:{
                type:'YLChart',
                xData:xData,
                yData1:yData1,
                yData2:yData2
            }
        }
    },
    created(){
        eventHelper.on('openDevicePanel',function(selectItem){
            this.isOpenPanel = true;
            this.deviceInfo = {
                title:selectItem.title
            }
            if(!!this.timer){
                clearInterval(this.timer);
            }
        }.bind(this));
    },
    methods: {
        openDeviceDetail:function(){
            eventHelper.emit('change-menu',{title:'监测设备管理',funUrl:'statisticsPanel'});
            eventHelper.emit('loadStatisticData',this.deviceInfo);
        },
        closePanel:function(){
            if(!!this.timer){
                clearInterval(this.timer);
            }
            this.isOpenPanel = false;
        },
        closeBox(){
            this.isOpenBox = false;
        }
    },
    mounted: function () {

    },
    components: {
        'chart-lib':chartLib
    }
});
module.exports = comm;