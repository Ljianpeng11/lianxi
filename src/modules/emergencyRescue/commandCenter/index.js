var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');

//加载数据
var seeperRoad = ['大悦路齐商银行门口','齐林小区北门','青城路东','高苑路东','蒲台-黄河','芦湖路','芦湖-青城','齐东路东','营丘大道','丽居路','丽居-黄河',
'丽居-青城','高苑-丽居','高苑路西','中心路','扳倒井路','田镇街','文化路东','黄河路','青城路'];
var seeperArr = [];
var baseData = Math.random()*2;

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            showCommandBox:false,
            showToggle:false,
            isStart:false,
            showAlarmBox:false,
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
                todayDegree:4
            },
            weatherData:[],
            showSmallDialog:false,
            seeperArr:seeperArr,
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
            }],
            gridData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
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
            this.showAlarmBox = false;
        },
        startStep:function(){
            if(!this.isStart){
                this.isStart = true;
                this.showCommandBox = true;
                var smsContent = "高青县气象局2017年12月26日10点37分发布暴雨红色报警信号";
                eventHelper.emit("SDSSendMessageAll",smsContent);
            }else{
                eventHelper.emit('openCommandDetail');
                // this.showSmallDialog = true;
            }
        },
        endStep:function(){
            eventHelper.emit('openComandEndDetail');
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
            // error:function(){
            //     alert('无法获取天气数据');
            // }
        });
        eventHelper.on('showCommandPanel',function(){
            this.showAlarmBox = true;
            this.isStart = false;
        }.bind(this));
        eventHelper.on('closeCommand',function(){
            this.toggleCommadBox();
        }.bind(this));
        setInterval(function(){
            if(seeperArr.length > 0){
                seeperArr = [];
            }
            seeperRoad.forEach(function(val){
                var item = {
                    title:val,
                    num:(function(){
                        var num = ((Math.random() - 0.4) * 1 + baseData).toFixed(2);
                        if(num < 0){
                            return (0-num)+'m';
                        }else{
                            return num+'m';
                        }
                    })()
                };
                seeperArr.push(item);
            });
            self.seeperArr = seeperArr;
        },10000);
    },
    components: {

    }
});
module.exports = comm;