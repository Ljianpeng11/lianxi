var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            showCommandBox:false,
            showToggle:false,
            isStart:false,
            todayInfo:{
                todayTime:moment().format('HH:mm:ss'),
                todayDate:(function(){
                    var week = moment().weekday();
                    switch(week){
                        case 1:week = '星期一';break;
                        case 2:week = '星期二';break;
                        case 3:week = '星期三';break;
                        case 4:week = '星期四';break;
                        case 5:week = '星期五';break;
                        case 6:week = '星期六';break;
                        case 7:week = '星期日';break;
                    }
                    return moment().format('YYYY/MM/DD ')+week;
                })(),
                todayDegree:''
            },
            weatherData:[],
            seeperArr:[
                {
                    title:'大悦路东',
                    num:'0.5m'
                },{
                    title:'黄河路东',
                    num:'0.5m'
                },{
                    title:'青城路东',
                    num:'0.5m'
                },{
                    title:'高苑路东',
                    num:'0.5m'
                },{
                    title:'蒲台-黄河',
                    num:'0.5m'
                },{
                    title:'芦湖路',
                    num:'0.5m'
                },{
                    title:'芦湖-青城',
                    num:'0.5m'
                },{
                    title:'齐东路东',
                    num:'0.5m'
                },{
                    title:'营丘大道',
                    num:'0.5m'
                },{
                    title:'丽居路',
                    num:'0.5m'
                },{
                    title:'丽居-黄河',
                    num:'0.5m'
                },{
                    title:'丽居-黄河',
                    num:'0.5m'
                },{
                    title:'丽居-青城',
                    num:'0.5m'
                },{
                    title:'高苑-丽居',
                    num:'0.5m'
                },{
                    title:'高苑路西',
                    num:'0.5m'
                },{
                    title:'中心路',
                    num:'0.5m'
                },{
                    title:'扳倒井路',
                    num:'0.5m'
                },{
                    title:'田镇街',
                    num:'0.5m'
                },{
                    title:'文化路东',
                    num:'0.5m'
                },{
                    title:'田镇街',
                    num:'0.5m'
                }
            ],
            emergencyData:[
            {
                name:'王福娥',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'撤防'
            },{
                name:'尹俊峰',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'支援'
            },{
                name:'王圣津',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'改派'
            },{
                name:'李拥军',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'撤防'
            },{
                name:'肖康生',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'撤防'
            },{
                name:'李俊杰',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'撤防'
            },{
                name:'阎恩会',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'撤防'
            },{
                name:'张中原',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'撤防'
            },{
                name:'马鹏飞',
                department:'综合行政执法局',
                team:'城市管理局',
                step:'撤防'
            }]
        }
    },
    methods: {
        init:function(){
            this.showCommandBox = true;
            this.isStart = false;
        },
        handleClick(row) {
            console.log(row);
        },
        toggleCommadBox:function(){
            this.showCommandBox = false;
        },
        startStep:function(){
            if(!this.isStart){
                this.isStart = true;
                var smsContent = "高青县气象局2017年12月26日10点37分发布暴雨红色报警信号";
                eventHelper.emit("SDSSendMessageAll",smsContent);
            }else{

            }
        },
        endStep:function(){

        }
    },
    mounted: function () {
        //获取天气数据
        var weatherDatas;
        var self = this;
        $.ajax({
            url:"http://wthrcdn.etouch.cn/weather_mini?city=济南",
            dataType:'jsonp',
            data:'',
            success:function(result) {
               weatherDatas = result.data;
               self.todayInfo.todayDegree = weatherDatas.wendu;
            },
            error:function(){
                alert('无法获取天气数据');
            }
        });
    },
    components: {}
});
module.exports = comm;