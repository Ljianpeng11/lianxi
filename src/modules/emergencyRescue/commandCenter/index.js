var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            showCommandBox:false,
            todayInfo:{
                'todayDate':'',
                'todayTime':'',
                'iconId':'',
                'todayDegree':'',
                'type':''
            },
            weatherData:[],
            logData:[],
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
        handleClick(row) {
            console.log(row);
        },
        setTodayDate:function(){
            var self = this;
            var today = moment(new Date());
            var todayDate = today.weekday();
            var newDate;
            switch(todayDate){
                case 1:newDate = '星期一';break;
                case 2:newDate = '星期二';break;
                case 3:newDate = '星期三';break;
                case 4:newDate = '星期四';break;
                case 5:newDate = '星期五';break;
                case 6:newDate = '星期六';break;
                case 7:newDate = '星期日';break;
                default:break;
            }
            var todayTime = today.format('HH:mm:ss');
            self.todayInfo.todayDate = today.format('YYYY/MM/DD') + newDate;
            self.todayInfo.todayTime = todayTime;
        },
        loadWeatherData:function(data){
            var yesterday = data.yesterday;
            var forecastArr = data.forecast;
            this.dealArr(yesterday,0);
            forecastArr.forEach(function(val,index){
                this.dealArr(val,index+1);
            }.bind(this));
        },
        dealArr:function(val,index){
            var date = val.date.slice(val.date.length -3,val.date.length);
            var degree = val.low.split(' ')[1].substr(0,2)+'~'+val.high.split(' ')[1];
            var r = /^.+?\[(.+?\[(.+?)\])\].*$/;
            if(!!val.fengli){
                var fengli = val.fengli.match(r)[2];
            }else{
                var fengli = val.fl.match(r)[2];
            }
            var arr = {
                iconId:'icon_'+index,
                date:date,
                degree:degree,
                fengli:fengli,
                type:val.type
            };
            this.weatherData.push(arr);
            this.$nextTick(function(){
                this.setIcon(arr);
            }.bind(this));
        },
        chooseWeatherIcon:function(degree){

        },
        setIcon:function(iconItem){
            //天气图标
            var icons = new Skycons();
            if(iconItem.type === '晴'){
                icons.set(iconItem.iconId, "partly-cloudy-day");
            }else if(iconItem.type === '雨'){
                icons.set(iconItem.iconId,"rain");
            }else if(iconItem.type === '阴'){
                icons.set(iconItem.iconId,"fog");
            }else if(iconItem.type === '多云'){
                icons.set(iconItem.iconId,"cloudy");
            }else if(iconItem.type === '雪'){
                icons.set(iconItem.iconId,"snow");
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
               self.todayInfo.iconId = 'todayIcon';
               self.todayInfo.type = '雨';
               self.setTodayDate();
               self.loadWeatherData(weatherDatas);
               self.$nextTick(function(){
                   self.setIcon(self.todayInfo);
               },200);
            },
            error:function(){
                alert('无法获取天气数据');
            }
        });
    },
    components: {}
});
module.exports = comm;