var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var echarts = require('echarts');
var moment = require('moment');
var controller = require('controllers/rightPanelController');

//加载组件
var deviceList = require('modules/onlineMonitor/mapPlugin/deviceList');
var chartLib = require('modules/onlineMonitor/chartLib');

//雨量数据
var xData = [],yData1 = [],yData2 = [],tableData = [];
/*var data1 = [Math.random() *60];
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
        status:Math.floor(Math.random()*3)
    }
    tableData.push(item);
}*/

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
            times:'',
            waterValue:'-',
            electricityValue:'-',
            deviceList:[],
            queryList:[],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
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
        /*eventHelper.on('openDeviceInfoPanel',function(item){
            this.deviceInfo ={
                title:item.name,
                deviceCode:item.deviceCode
            };
        }.bind(this))*/;
    },
    methods: {
        toggleDataView:function(){
            this.isShowChart = !this.isShowChart;
        },
        closePanel:function(){
            this.isOpen = false;
        },
        /*loadCharts:function(itemID,timeRangeObj){
            var self = this;
            controller.getHistoricalDataByMonitor(itemID, timeRangeObj.startDate, timeRangeObj.endDate, function (result) {
                if(!!result && result.length > 0){
                    self.chartOptions.xData = [];
                    self.chartOptions.yData1 = [];
                    self.chartOptions.yData2 = [];
                    result.forEach(function(value){
                        self.chartOptions.xData.push(value.deviceUpdateTime);
                        self.chartOptions.yData1.push(parseFloat(value.dValue).toFixed(2));
                        self.chartOptions.yData2.push(0);
                    });
                }
                console.log(self.chartOptions);
                self.$refs.waterChart.reloadChart(self.chartOptions);
            });

        },*/
    },
    mounted: function () {
        eventHelper.on('openDeviceInfoPanel',function(item){
            var self = this;
            self.deviceInfo ={
                title:item[1].itemName,
                deviceCode:item[1].deviceCode,
                sysUpdateTime:item[1].sysUpdateTime,
                name:item[1].name,
                dValue:item[1].waterLevel,
                itemId:item[1].itemId
            };
            debugger
            console.log(self.chartOptions);
            /*self.loadCharts(this.deviceInfo.itemId,item[2]);*/
            var nowDate=moment().format("YYYY-MM-DD HH:mm:ss");
            var startTime = new Date(this.deviceInfo.sysUpdateTime);
            var endTime = new Date(nowDate);
            self.times = ((endTime-startTime)/1000/60).toFixed(0);
            switch(this.deviceInfo.name){
                case '水位':
                    self.waterValue = this.deviceInfo.dValue;
                    break;
                case '电量':
                    self.electricityValue = this.deviceInfo.dValue
                    break
            }
        }.bind(this));
        this.$refs.deviceList.openStatisticsPanel();
    },
    components: {
        'device-list':deviceList,
        'chart-lib':chartLib
    }
});
module.exports = comm;