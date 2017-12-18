var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var controller = require('controllers/rightPanelController');
var moment = require('moment');
var serviceHelper = require('services/serviceHelper');

//加载组件
var chartLib = require('modules/onlineMonitor/chartLib');


//雨量数据
var xData = [], yData1 = [], yData2 = [];
var data1 = [Math.random() * 60];
var data2 = [Math.random() * 1.2];
var time;

for (var i = 0; i < 12; i++) {
    time = moment().subtract(i, 'h');
    xData[(11 - i)] = time.format('YYYY-MM-DD hh:ss');
    yData1.push(((Math.random() - 0.4) + data2[data2.length - 1]).toFixed(2));
    yData2.push(((Math.random() - 0.4) * 10 + data1[data1.length - 1]).toFixed(2));
}

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            myChart: null,
            timeIndex: null,
            timer: null,
            isOpenPanel: false,
            isOpenBox: true,
            deviceInfo: {},
            devicePics: [
                './img/mediaGallery/default.png'
            ],
            facilityTypeName: '',
            chartOptions: {
                type: 'YLChart',
                xData: xData,
                yData1: yData1,
                yData2: yData2
            }
        }
    },
    created(){
        /* this.$nextTick(function () {
         eventHelper.on('openDevicePanel', function (selectItem) {
         this.isOpenPanel = true;
         this.deviceInfo = {
         title: selectItem.name
         }
         if (!!this.timer) {
         clearInterval(this.timer);
         }
         }.bind(this));
         }.bind(this));*/
    },
    methods: {
        openDeviceDetail: function () {
            eventHelper.emit('change-menu', {title: '监测设备管理', funUrl: 'statisticsPanel'});
            eventHelper.emit('openDeviceInfoPanel', this.deviceInfo);
            // eventHelper.emit('loadStatisticData',this.deviceInfo);
        },
        closePanel: function () {
            if (!!this.timer) {
                clearInterval(this.timer);
            }
            this.isOpenPanel = false;
        }
    },
    mounted: function () {
        eventHelper.on('openDevicePanel', function (selectItem) {
            this.facilityTypeName = selectItem.facilityTypeName;
            if (!!selectItem.facilityDevice) {
                var self = this;
                var devices = selectItem.facilityDevice.devices;
                var endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
                var startDate = moment().subtract(6, 'hours').format('YYYY-MM-DD HH:mm:ss');
                console.log(selectItem)
                devices.forEach(function (device) {
                    var items = device.items;
                    items.forEach(function (item) {
                        if (item.itemID.indexOf('ultrasoundWaterLine') > 0) {
                            self.deviceInfo = {
                                sysUpdateTime: device.sysUpdateTime,
                                alarmHeight: item.alarmHeight,
                                warningHeight: item.warningHeight,
                                pipeHeight: item.wellLidHeight,
                                waterLevel: item.dValue
                            }
                        } else if (item.itemID.indexOf('stressWaterLine') > 0) {
                            self.deviceInfo.stressWaterLine = item.dValue;
                        }
                        if (item.itemTypeName.indexOf('waterLevel') !== -1) {//todo 动态输入水位值（超声波、压力）
                            var itemID = item.itemID;
                            controller.getHistoricalDataByMonitor(itemID, startDate, endDate, function (result) {
                                if(!!result){
                                    self.chartOptions.xData = [];
                                    self.chartOptions.yData1 = [];
                                    self.chartOptions.yData2 = [];
                                    result.forEach(function(value){
                                        self.chartOptions.xData.push(value.deviceUpdateTime);
                                        self.chartOptions.yData1.push(value.dValue.toFixed(2));
                                        self.chartOptions.yData2.push(0);
                                    });
                                    console.log(self.chartOptions);
                                    self.$refs.deviceWaterChart.reloadChart(self.chartOptions);
                                }
                            });
                        }
                    })
                });
                if (selectItem.facilityDevice.pics && selectItem.facilityDevice.pics > 0) {
                    var pics = selectItem.facilityDevice.pics;
                    self.devicePics.splice(0, self.devicePics.length);
                    pics.forEach(function (pic) {
                        self.devicePics.push(serviceHelper.getPicUrl(pic.id));
                    })
                } else {
                    self.devicePics = [
                        './img/mediaGallery/default.png'
                    ]
                }
                this.deviceInfo.title = selectItem.name;
                this.isOpenPanel = true;
                if (!!this.timer) {
                    clearInterval(this.timer);
                }
            }
        }.bind(this));
    },
    components: {
        'chart-lib': chartLib
    }
});
module.exports = comm;