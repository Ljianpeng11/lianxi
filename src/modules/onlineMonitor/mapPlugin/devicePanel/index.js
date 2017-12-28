var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var controller = require('controllers/rightPanelController');
var moment = require('moment');
var serviceHelper = require('services/serviceHelper');

//加载组件
var chartLib = require('modules/onlineMonitor/chartLib');

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
            showBigImg:false,
            currentPic:'',
            showTip:false,
            devicePics: [
                './img/mediaGallery/default.png'
            ],
            facilityTypeName: '',
            chartOptions: {
                type: 'YLChart',
                warningHeight:0,
                wellLidHeight:0,
                alarmHeight:0,
                xData: [],
                yData1: [],
                yData2: []
            },
            itemID:'',
            timeRangeObj:[],
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
        loadChart:function(itemID,timeRangeObj){
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
                self.$refs.deviceWaterChart.reloadChart(self.chartOptions);
            });

        },
        searchData:function(){
            if(!!this.timeRangeObj){
                var timeObj = {};
                timeObj.startDate = moment(this.timeRangeObj[0]).format('YYYY-MM-DD HH:ss:mm');
                timeObj.endDate = moment(this.timeRangeObj[1]).format('YYYY-MM-DD HH:ss:mm');
                this.loadChart(this.itemID,timeObj);
            }
        },
        closePanel: function () {
            if (!!this.timer) {
                clearInterval(this.timer);
            }
            this.isOpenPanel = false;
        },
        toggleBox:function(){
            this.isOpenBox = !this.isOpenBox;
            if(this.isOpenBox){
                $(".multiDeviceBox").css("bottom","calc(18em + 10px)");
            }else{
                $(".multiDeviceBox").removeAttr("style");
            }
        },
        scaleImg:function(ev,pic){
            if(pic.indexOf('default') != -1){
                var top = ev.offsetY;
                var left = ev.offsetX;
                $('.cesc-toolTip').css("top",top);
                $('.cesc-toolTip').css("left",left);
                this.showTip = true;
                setTimeout(function(){
                    this.showTip = false;
                }.bind(this),5000);
            }else{
                this.currentPic = pic;
                this.showBigImg = true;
            }
        }
    },
    mounted: function () {
        eventHelper.on('openDevicePanel', function (selectItem) {
            this.facilityTypeName = selectItem.facilityTypeName;
            if (!!selectItem.facilityDevice) {
                var self = this;
                var devices = selectItem.facilityDevice.devices;
                var endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
                var startDate = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
                var timeRangeObj = {
                    startDate:startDate,
                    endDate:endDate
                };
                self.timeRangeObj = [startDate,endDate];
                devices.forEach(function (device) {
                    var items = device.items;
                    items.forEach(function (item) {
                        if (item.itemID.indexOf('ultrasoundWaterLine') > 0) {
                            self.deviceInfo = {
                                sysUpdateTime: item.sysUpdateTime,
                                alarmHeight: item.alarmHeight,
                                warningHeight: item.warningHeight,
                                wellLidHeight: item.wellLidHeight,
                                waterLevel: item.dValue
                            }
                            if(!!item.alarmHeight){
                                self.chartOptions.alarmHeight = item.wellLidHeight;
                            }
                            if(!!item.warningHeight){
                                self.chartOptions.warningHeight = item.warningHeight;
                            }
                            // if(!!item.wellLidHeight){
                            //     self.chartOptions.wellLidHeight = item.wellLidHeight;
                            // }
                        } else if (item.itemID.indexOf('stressWaterLine') > 0) {
                            self.deviceInfo.stressWaterLine = item.dValue;
                        }
                        if (item.itemTypeName.indexOf('waterLevel') !== -1) {//todo 动态输入水位值（超声波、压力）
                            self.itemID = item.itemID;
                            self.loadChart(self.itemID,timeRangeObj);
                        }
                    })
                });
                if (selectItem.facilityDevice.pics && selectItem.facilityDevice.pics.length > 0) {
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
                if(screen.width < 1400){
                    this.isOpenBox = false;
                }
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