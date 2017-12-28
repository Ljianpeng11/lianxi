var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');

//加载数据
var seeperRoad = ['大悦路齐商银行门口','齐林小区北门','青城路东','高苑路东','蒲台-黄河','芦湖路','芦湖-青城','齐东路东','营丘大道','丽居路','丽居-黄河',
'丽居-青城','高苑-丽居','高苑路西','中心路','扳倒井路','田镇街','文化路东','黄河路','青城路'];
var seeperArr = [];
var baseData = Math.random()*1.2;
var alarmData = Math.random()*15;

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
            isShowDetail:false,
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
            pondingArr:[
                {
                    name:'大悦路齐商银行门口',
                    src:'img/emegency/report01.jpg',
                    value1:'15公分',
                    value2:'5公分'
                },{
                    name:'齐林小区北门',
                    src:'img/emegency/report02.jpg',
                    value1:'17公分',
                    value2:'3公分'
                }
            ]
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
                // eventHelper.emit('openCommandDetail');
                this.showSmallDialog = true;
            }
        },
        endStep:function(){
            eventHelper.emit('openComandEndDetail');
        },
        toggleDetail:function(){
            this.showSmallDialog = false;
            this.isShowDetail = true;
        },
        saveImgFun:function(){
            eventHelper.emit("SDSSendMessageFile","提闸申请");
            this.$message({
                message: '短信已发送成功!!',
                type: 'success'
            });
        },
        closeReportModel:function(){
            this.showSmallDialog = false;
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
            seeperRoad.forEach(function(val,index){
                var item = {
                    title:val,
                    num:'',
                    status:null,
                    unit:''
                };
                var numData,num;
                if(index < 10){
                    numData = alarmData;
                    item.status = 2;
                    item.unit = 'cm';
                    item.name = '积水';
                    num = ((Math.random() - 0.4) * 10 + numData).toFixed(2);
                }else{
                    numData = baseData;
                    if(index >= 10 && index < 12){
                        item.status = 1;
                        num = ((Math.random() - 0.4) * 1 + numData + 0.8).toFixed(2);
                    }else{
                        item.status = 0;
                        num = ((Math.random() - 0.4) * 1 + numData).toFixed(2);
                    }
                    item.unit = 'm';
                    item.name = '井下水位';
                }
                item.num = (num < 0)?(0 - num):num + item.unit;
                seeperArr.push(item);
            });
            self.seeperArr = seeperArr;
        },10000);
    },
    components: {

    }
});
module.exports = comm;