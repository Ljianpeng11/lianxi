var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var echarts = require('echarts');
var moment = require('moment');

//加载组件
var deviceList = require('modules/onlineMonitor/mapPlugin/deviceList');
var chartLib = require('modules/onlineMonitor/chartLib');

//雨量数据
var xData = [],yData1 = [],yData2 = [],tableData = [];
var data1 = [Math.random() *60];
var data2 = [Math.random() *2];
var time;
for(var i = 0;i<12;i++){
    time = moment().subtract(i,'h').format('YYYY-MM-DD hh:ss');
    xData[(11 - i)] = time;
    yData1.push(((Math.random() - 0.4) + data2[data2.length - 1]).toFixed(2));
    yData2.push(((Math.random() - 0.4) * 10 + data1[data1.length - 1]).toFixed(2));
    var item = {
        date:time,
        waterData:((Math.random() - 0.4) + data2[data2.length - 1]).toFixed(2),
        rainData:((Math.random() - 0.4) * 10 + data1[data1.length - 1]).toFixed(2),
        status:0
    }
    tableData.push(item);
}

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            myChart: null,
            timeIndex: null,
            detailView: 'detailView',
            isShowChart: true,
            deviceInfo: {},
            radioValue: '曲线',
            viewTypeOption: {
                value: '设备地图',
                options: [{
                    value: 'deviceMap',
                    label: '设备地图'
                }, {
                    value: 'detailInfo',
                    label: '数据详情'
                }]
            },
            tableData: tableData,
            chartOptions:{
                type:'YLChart',
                xData:xData,
                yData1:yData1,
                yData2:yData2
            }
        }
    },
    created:function(){
        eventHelper.on('openDeviceInfoPanel',function(item){
            this.deviceInfo ={
                title:item.name,
                deviceCode:item.deviceCode
            };
        }.bind(this));
    },
    methods: {
        toggleDataView:function(){
            this.isShowChart = !this.isShowChart;
        },
        closePanel:function(){
            this.isOpen = false;
        }
    },
    mounted: function () {
        this.$refs.deviceList.openMapWindow(0,this.$refs.deviceList.deviceList[0]);
    },
    components: {
        'device-list':deviceList,
        'chart-lib':chartLib
    }
});
module.exports = comm;