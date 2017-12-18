var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');
//请求数据
var iotController = require('controllers/iotController.js');
//加载图表组件
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
    // yData2.push(((Math.random() - 0.4) * 10 + data1[data1.length - 1]).toFixed(2));
    yData2.push(0);
}

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
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
                value:'五华区雨量公众监测点',
                options: [{
                    value: '五华区雨量公众监测点',
                    label: '五华区雨量公众监测点'
                }, {
                    value: '市体育馆',
                    label: '市体育馆'
                }]
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
                xData:xData,
                yData1:yData1,
                yData2:yData2
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
        iotController.getIotDeviceRunningState(function(data){
            this.alarmTableData = data.alarmIotDeviceList;
            this.chartOptions1.data = [
                {value:data.healthCount, name:'正常'},
                {value:data.warningCount, name:'预警'},
                {value:data.alarmCount, name:'报警'}
            ];
            this.$refs.pieChart1.reloadChart(this.chartOptions1);
        }.bind(this));
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
            if(row.status === 1){
                return 'warningItem';
            }else if(row.status === 2){
                return 'dangerItem';
            }
        },
        openDetail:function(index,item){

        },
        deleteCollectItem:function(index,item){

        },
        setIcon: function (iconItem) {
            //天气图标
            var icons = new Skycons();
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

        }
    },
    mounted: function () {
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