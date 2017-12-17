var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var controller = require('controllers/rightPanelController');
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
        this.$nextTick(function(){
            eventHelper.on('openDevicePanel',function(selectItem){
                this.isOpenPanel = true;
                this.deviceInfo = {
                    title:selectItem.name
                }
                if(!!this.timer){
                    clearInterval(this.timer);
                }

            }.bind(this));
        }.bind(this));
    },
    methods: {
        openDeviceDetail:function(){
            eventHelper.emit('change-menu',{title:'监测设备管理',funUrl:'statisticsPanel'});
            eventHelper.emit('openDeviceInfoPanel',this.deviceInfo);
            // eventHelper.emit('loadStatisticData',this.deviceInfo);
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
        eventHelper.on('openDevicePanel',function(selectItem){
            this.isOpenPanel = true;
            this.deviceInfo = {
                title:selectItem.name
            };
            if(!!this.timer){
                clearInterval(this.timer);
            };
            var endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
            var startDate = moment().subtract(6, 'hours').format('YYYY-MM-DD HH:mm:ss');
            var self = this;
            selectItem.facilityDevice.devices.forEach(function (val) {
                val.items.forEach(function(item){
                    if(item.itemTypeName.indexOf('waterLevel') !== -1){
                        var itemID = item.itemID;
                        controller.getHistoricalDataByMonitor(itemID, startDate, endDate, function (result) {
                            if(!!result){
                                self.chartOptions.xData = [];
                                self.chartOptions.yData1 = [];
                                self.chartOptions.yData2 = [];
                                result.forEach(function(value){
                                    self.chartOptions.xData.push(value.deviceUpdateTime);
                                    self.chartOptions.yData1.push(value.dValue);
                                    self.chartOptions.yData2.push(0);
                                });
                                console.log(self.chartOptions);
                                self.$refs.deviceWaterChart.reloadChart(self.chartOptions);
                            }
                        });
                    };
                })
            })
        }.bind(this));
    },
    components: {
        'chart-lib':chartLib
    }
});
module.exports = comm;