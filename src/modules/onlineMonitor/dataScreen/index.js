var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');
//请求数据
var iotController = require('controllers/iotController.js');
var facilityController = require('controllers/facilityController');
var controller = require('controllers/rightPanelController');
//加载图表组件
var chartLib = require('modules/onlineMonitor/chartLib');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            currentTimeIndex:0,
            facilityId:null,
            timeRangeArr:[
                {
                    num:8,
                    uint:'hour'
                },{
                    num:12,
                    uint:'hour'
                },{
                    num:24,
                    uint:'hour'
                }
            ],
            weather:{
                date:moment(new Date()).format('YYYY-MM-DD'),
                week:(function(){
                    var week = moment(new Date()).format('e');
                    var s;
                    switch(week){
                        case '1': s = '星期一';break;
                        case '2': s = '星期二';break;
                        case '3': s = '星期三';break;
                        case '4': s = '星期四';break;
                        case '5': s = '星期五';break;
                        case '6': s = '星期六';break;
                        case '7': s = '星期日';break;
                        default:break;
                    }
                    return s;
                })(),
                icon:'',
                wendu:''
            },
            districtOption:{
                value:'',
                options: [{
                    value: '芦湖街道',
                    label: '芦湖街道'
                }, {
                    value: '田镇街道',
                    label: '田镇街道'
                }]
            },
            YLDistrictOption:{
                value:'',
                options: []
            },
            typeOption:{
                options: [{
                    value: '五华区雨量公众监测点',
                    label: '五华区雨量公众监测点'
                }, {
                    value: '市体育馆',
                    label: '市体育馆'
                }]
            },
            chartOptions1:{
                type:'pieChart',
                color:['#4f9b0c','#f5c761','#fe5240'],
                subtext:'设备运行情况',
                data: [
                    {value:1, name:'正常'},
                    {value:2, name:'预警'},
                    {value:3, name:'报警'}
                ]
            },
            chartOptions2:{
                type:'pieChart',
                color:['#2f91e4','#fe5240'],
                subtext:'设备在线情况',
                data: [
                    {value:80, name:'在线'},
                    {value:20, name:'断线'}
                ]
            },
            chartOptions3:{
                type:'YLChart',
                xData:[],
                yData1:[],
                yData2:[]
            },
            tableData:[
                {
                    district:'五华区雨量公众监测点',
                    measureNum:'0',
                    currentNum:'0',
                    alarmNum:'0',
                    date:moment(new Date()).subtract(Math.floor(Math.random()*10),'h').format("YYYY-MM-DD hh:ss")
                }
            ],
            alarmTableData:[
                {
                    name:'五华区雨量公众监测点',
                    status:0
                },{
                    name:'市体育馆',
                    status:1
                },{
                    name:'普吉路与小路沟交叉口',
                    status:2
                },{
                    name:'滇缅大道戛纳小镇旁',
                    status:0
                },{
                    name:'海源学院正门口',
                    status:0
                },{
                    name:'西二环春苑小区对面',
                    status:0
                }
            ],
            offlineTableData:[
                {
                    name:'五华区雨量公众监测点',
                    status:0
                },{
                    name:'市体育馆',
                    status:1
                },{
                    name:'普吉路与小路沟交叉口',
                    status:2
                },{
                    name:'滇缅大道戛纳小镇旁',
                    status:0
                },{
                    name:'海源学院正门口',
                    status:0
                },{
                    name:'西二环春苑小区对面',
                    status:0
                }
            ],
            collectList:[
                {
                    title:'五华区公众雨量监测点',
                    status:0,
                    voltage:'low',
                    signal:'on',
                    type:'RF',
                    deviceCode:'17120011',
                    deviceNum:0,
                    onlineTime:'2',
                    collect:0,
                    x:117.8216341936,
                    y:37.1701173675
                },{
                    title:'市体育馆',
                    status:1,
                    voltage:'middle',
                    signal:'off',
                    type:'WD',
                    deviceCode:'16310128',
                    deviceNum:'2.506',
                    onlineTime:'2',
                    collect:0,
                    x:117.8563419346,
                    y:37.1701172675
                }
            ]
        }
    },
    created:function(){
        //获取雨量数据
        iotController.getRainFacility(function(result){
            this.YLDistrictOption.value = result[0].facilityName;
            this.facilityId = result[0].facilityId;
            this.loadChart(result[0].facilityId,{num:8,timeUnit:'hours'});
            result.forEach(function(val){
                this.YLDistrictOption.options.push({
                    value:val.facilityId,
                    label:val.facilityName
                })
            }.bind(this));
        }.bind(this));
        //获取设备运行状态数据
        iotController.getIotDeviceRunningState(function(data){
            data.alarmIotDeviceList.push(...data.warningIotDeviceList);
            this.alarmTableData = data.alarmIotDeviceList;
            this.chartOptions1.data = [
                {value:data.healthCount, name:'正常'},
                {value:data.warningCount, name:'预警'},
                {value:data.alarmCount, name:'报警'}
            ];
            this.$refs.pieChart1.reloadChart(this.chartOptions1);
        }.bind(this));
        //获取设备在线状态数据
        iotController.getIotDeviceOnlineState(function(data) {
            this.offlineTableData = data.illIotDeviceList;
            this.chartOptions2.data = [
                {value: data.illCount, name: '断线'},
                {value: data.healthCount, name: '在线'},
            ];
            this.$refs.pieChart2.reloadChart(this.chartOptions2);
        }.bind(this));
    },
    methods: {
        bindRowClass:function(row,index){
            if(row.iotDeviceState === 1){
                return 'warningItem';
            }else if(row.iotDeviceState === 2){
                return 'dangerItem';
            }
        },
        setIcon: function (iconItem) {
            //天气图标
            var icons = new Skycons({color:'#2f91e4'});
            if (iconItem.type === '晴') {
                icons.set(iconItem.iconId, "partly-cloudy-day");
            } else if (iconItem.type === '小雨' || iconItem.type === '中雨') {
                icons.set(iconItem.iconId, "rain");
            } else if (iconItem.type === '阴') {
                icons.set(iconItem.iconId, "fog");
            } else if (iconItem.type === '多云') {
                icons.set(iconItem.iconId, "cloudy");
            } else if (iconItem.type === '雪') {
                icons.set(iconItem.iconId, "snow");
            }
            icons.play();
            // list  = [
            //     "clear-day", "clear-night", "partly-cloudy-day",
            //     "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            //     "fog"
            // ]

        },
        setTimeRange:function(timeRange){
            var endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
            var startDate = moment().subtract(timeRange.num, timeRange.timeUnit).format('YYYY-MM-DD HH:mm:ss');
            var time = {
                startDate:startDate,
                endDate:endDate
            }
            return time;
        },
        loadChart:function(facilityId,time){
            var self = this;
            var timeRange = this.setTimeRange(time);
            facilityController.getCurrentUserFacilitysMonitor(function (data) {
                data.forEach(function(val){
                    if(val.facilityId === facilityId){
                        var arr = val.facilityDevice.devices;
                        for(var i = 0;i<arr.length;i++){
                            arr[i].items.forEach(function(item){
                                if(item.itemTypeName.indexOf('rainfall') !== -1){
                                    controller.getHistoricalDataByMonitor(item.itemID, timeRange.startDate, timeRange.endDate, function (result) {
                                        if(!!result && result.length > 0){
                                            self.chartOptions3.xData = [];
                                            self.chartOptions3.yData1 = [];
                                            self.chartOptions3.yData2 = [];
                                            result.forEach(function(value){
                                                self.chartOptions3.xData.push(value.deviceUpdateTime);
                                                self.chartOptions3.yData1.push(0);
                                                self.chartOptions3.yData2.push(parseFloat(value.dValue).toFixed(2));
                                            });
                                        }
                                        self.$refs.lineChart.reloadChart(self.chartOptions3);
                                    });
                                }
                            })
                        }
                    }
                })
            }.bind(this));
        },
        changeTimeRange:function(index,item){
            this.currentTimeIndex = index;
            this.loadChart(this.facilityId,item);
        },
        changeYLopts:function(val){
            this.loadChart(val,this.timeRangeArr[this.currentTimeIndex]);
        },
        openDetail:function(index,item){

        },
        deleteCollectItem:function(index,item){

        }
    },
    mounted: function () {
        //获取天气数据
        var self = this;
        $.ajax({
            url: "http://wthrcdn.etouch.cn/weather_mini?city=济南",
            dataType: 'jsonp',
            data: '',
            success: function (result) {
                var data = result.data;
                self.weather.wendu = data.wendu;
                self.weather.iconId = 'todayIcon';
                data.forecast.forEach(function(val,index,array){
                    self.weather.type = array[0].type;
                });
                self.$nextTick(function () {
                    self.setIcon(self.weather);
                }, 200);
            },
            error: function () {
                alert('无法获取天气数据');
            }
        });
    },
    components: {
        'chart-lib':chartLib
    }
});
module.exports = comm;