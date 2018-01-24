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
            allData:[],
            devicePics: [
                './img/mediaGallery/default.png'
            ],
            facilityTypeName: '',
            chartOptions: {
                type: 'YLChart',
                warningHeight:0,
                wellLidHeight:0,
                alarmHeight:0,
                yMax:0,
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
            szDeviceInfo:{},
            szChartData:[],
            szLineChartOptions:{
                type:'szLineChart'
            },
            jgLineChartOptions:{
                type: 'categoryLineChart',
                color: ['#2f91e4'],
                xData: ['6:00', '10:00', '14:00', '18:00', '22:00', '2:00', '6:00'],
                seriesData: [
                    {
                        type: 'line',
                        symbol:'circle',
                        symbolSize:8,
                        markLine: {
                            symbolSize:0,
                            label:{
                                normal:{
                                    position:'start',
                                    color:'#333',
                                    formatter:function(params){
                                        if(params.value === 1){
                                            return '正常';
                                        }else if(params.value === 2){
                                            return '报警';
                                        }else if(params.value === 3){
                                            return '已溢流';
                                        }
                                    }
                                }
                            },
                            data: [{
                                yAxis: 1,
                                lineStyle:{
                                    normal:{
                                        type:'solid',
                                        color:'#55D1AC'
                                    }
                                },
                            },{
                                yAxis: 2,
                                lineStyle:{
                                    normal:{
                                        type:'solid',
                                        color:'#EFBE3D'
                                    }
                                },
                            }, {
                                yAxis: 3,
                                lineStyle:{
                                    normal:{
                                        type:'solid',
                                        color:'#FD0BEF'
                                    }
                                },
                            }]
                        },
                        data: [1, 2, 1, 3, 2, 1, 2],
                    }
                ]
            }
        }
    },
    computed:{
        arrowType:function(){
            if(this.devicePics.length === 1){
                return 'never';
            }else{
                return 'always';
            }
        }
    },
    created(){

    },
    methods: {
        openDeviceDetail: function () {
            eventHelper.emit('change-menu', {title: '监测设备管理', funUrl: 'statisticsPanel'});
            /*eventHelper.emit('openDeviceInfoPanel', this.allData);*/
            /*eventHelper.emit('openDeviceInfoPanel', this.deviceInfo);*/
            // eventHelper.emit('loadStatisticData',this.deviceInfo);
        },
        openStatisticsPanel:function(){
            eventHelper.emit('openDeviceInfoPanel', this.allData);
        },
        loadChart:function(itemID,timeRangeObj){
            var self = this;
            controller.getHistoricalDataByMonitor(itemID, timeRangeObj.startDate, timeRangeObj.endDate, function (result) {
                if(!!result && result.length > 0){
                    self.chartOptions.xData = [];
                    self.chartOptions.yData1 = [];
                    self.chartOptions.yData2 = [];
                    console.log(result)
                    result.forEach(function(value){
                        //设置y轴最大值，若水位值大于报警线则水位值+1，反之报警值+0.5;
                        if(parseFloat(value.dValue) > self.chartOptions.alarmHeight){
                            self.chartOptions.yMax =  Math.ceil(parseFloat(value.dValue) + 1);
                        }
                        //加载雨量图表x轴，水位y轴，雨量y轴数据
                        // self.chartOptions.xData.push(value.deviceUpdateTime);
                        self.chartOptions.yData1.push([value.deviceUpdateTime,parseFloat(value.dValue).toFixed(2)]);
                        self.chartOptions.yData2.push([0,0]);
                    });
                }
                self.$refs.deviceWaterChart.reloadChart(self.chartOptions);
            });

        },
        //查询历史数据并渲染到图表
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
        },
        loadSzChart:function(){
            this.$nextTick(function(){
                this.szChartData.forEach(function(val,index){
                    var refName = 'szChart'+index;
                    this.$refs[refName][0].reloadChart(val);
                }.bind(this));
                this.$refs.szLineChart.reloadChart(this.szLineChartOptions);
            }.bind(this));
        },
        /*loadJgChart:function(){
            this.$nextTick(function(){
                this.$refs.jgLineChart.reloadChart(this.jgLineChartOptions);
            }.bind(this));
        }*/
    },
    mounted: function () {
        eventHelper.on('openDevicePanel', function (selectItem) {
            this.facilityTypeName = selectItem.facilityTypeName;
            this.deviceInfo.name = selectItem.name;
            this.isOpenPanel = true;
            if (!!selectItem.facilityDevice) {
                //水位历史查询时间设置
                var self = this;
                var devices = selectItem.facilityDevice.devices;
                var endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
                var startDate = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
                var timeRangeObj = {
                    startDate:startDate,
                    endDate:endDate
                };
                self.timeRangeObj = [startDate,endDate];
                //水质监测值设置
                var chartColor = ['#21C393','#5A95ED','#7EC644','#09BCE3','#EBAF0F','#F46B07'];
                var szChartItem;
                self.szChartData = [];
                //遍历组装数据
                devices.forEach(function (device) {
                    var items = device.items;
                    self.szDeviceInfo.name = device.name;
                    items.forEach(function (item,index) {
                        if(self.facilityTypeName !== 'WQ' && self.facilityTypeName !== 'MHC'){
                            //设置父容器高度
                            self.$nextTick(function(){
                                $(".multiDeviceBox").css("top","155px");
                            });
                            //加载雨量图表各项数据
                            if (item.itemID.indexOf('ultrasoundWaterLine') > 0) {
                                self.deviceInfo = {
                                    sysUpdateTime: item.sysUpdateTime,
                                    alarmHeight: item.alarmHeight,
                                    warningHeight: item.warningHeight,
                                    wellLidHeight: item.wellLidHeight,
                                    waterLevel: item.dValue,
                                    itemName: item.name,
                                    name:selectItem.name,
                                    itemId:item.itemID
                                }
                                //设置报警值，预警值，最大值
                                if(!!item.wellLidHeight){
                                    self.chartOptions.alarmHeight = parseFloat(item.wellLidHeight);
                                }
                                if(!!item.warningHeight){
                                    self.chartOptions.warningHeight = item.warningHeight;
                                }
                                // if(!!item.wellLidHeight){
                                //     self.chartOptions.wellLidHeight = item.wellLidHeight;
                                // }
                                //y轴最大值
                                self.chartOptions.yMax = Math.ceil(parseFloat(self.chartOptions.alarmHeight) + 0.5);
                            } else if (item.itemID.indexOf('stressWaterLine') > 0) {
                                self.deviceInfo.stressWaterLine = item.dValue;
                            }
                            if (item.itemTypeName.indexOf('waterLevel') !== -1) {//todo 动态输入水位值（超声波、压力）
                                self.itemID = item.itemID;
                                self.loadChart(self.itemID,timeRangeObj);
                            }
                        }else{
                            if(self.facilityTypeName === 'WQ'){
                                self.$nextTick(function(){
                                    $(".multiDeviceBox").css("top","5px");
                                });
                                szChartItem={
                                    type:'gaugeChart',
                                    text:item.name,
                                    subtext:'{label|'+item.dValue+item.unit+'}',
                                    value:item.dValue,
                                    color:(function(){
                                        var i;
                                        if(index < chartColor.length){
                                            i = index;
                                        }else{
                                            i = index%chartColor.length;
                                        }
                                        return chartColor[i];
                                    })()
                                };
                                self.szChartData.push(szChartItem);
                            }else if(self.facilityTypeName === 'MHC'){
                                self.$nextTick(function(){
                                    $(".multiDeviceBox").css("top","155px");
                                });
                            }
                            self.szDeviceInfo.sysUpdateTime = item.sysUpdateTime;
                        }
                    })
                });
               self.allData = [selectItem,self.deviceInfo,self.timeRangeObj];
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
                if(self.facilityTypeName == 'WQ'){
                    self.loadSzChart();
                }
            }
            if(screen.width < 1400){
                this.isOpenBox = false;
            }
            if (!!this.timer) {
                clearInterval(this.timer);
            }
        }.bind(this));
        eventHelper.on('openStatistics',function () {
            eventHelper.emit('openDeviceInfoPanel', this.allData);
        }.bind(this));
    },
    components: {
        'chart-lib': chartLib
    }
});
module.exports = comm;