var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var iotController = require('controllers/iotController');
var moment = require('moment');

//加载数据
var seeperRoad = ['高苑路东','大悦路东','青城路东','桃园闸窨井','桃园闸观测井','芦湖-青城','高苑路（学府路）','齐东路东','营丘大道','利居路','利居-黄河',
    '利居-青城','高苑-利居','高苑路西','中心路','桃园闸对面小区','扳倒井路','田镇街','文化路东','黄河路'];
// var seeperRoad = ['大悦路齐商银行门口','齐林小区北门','青城路东','高苑路东','蒲台-黄河','芦湖路','芦湖-青城','齐东路东','营丘大道','利居路','利居-黄河',
// '利居-青城','高苑-利居','高苑路西','中心路','扳倒井路','田镇街','文化路东','黄河路','青城路'];
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
                todayDegree:4,
                fengli:"",
                fengxiang:"",
                type:""
            },
            weatherData:[],
            showSmallDialog:false,
            showEndDialog:false,
            isShowDetail:false,
            isMiddle:false,
            isEnd:false,
            seeperArr:seeperArr,
            newSeeperArr:[],
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
            ],
            dialogClass:'normalDialog appleyBox-sm',
            emergencyImgList:[
                {
                    src:'img/emegency/report01.jpg',
                    text:'高苑路东'
                },{
                    src:'img/emegency/report02.jpg',
                    text:'青城路西'
                },{
                    src:'img/emegency/report03.jpg',
                    text:'中心路'
                },{
                    src:'img/emegency/report04.jpg',
                    text:'丽居路'
                },{
                    src:'img/emegency/report05.jpg',
                    text:'芦湖路'
                }
            ],
            newemergencyImgList:[],
            reportList:[
                {
                    date:'2017年08月02日16时42分',
                    text:'高青县气象局发布暴雨红色预警信号'
                },{
                    date:'2017年08月02日16时57分',
                    text:'出动5位抢险人员'
                },{
                    date:'2017年08月02日17时20分',
                    text:'县防汛办提闸排涝'
                },{
                    date:'2017年08月02日18时20分',
                    text:'县防汛办关排涝闸'
                },{
                    date:'2017年08月02日19时46分',
                    text:'高青县气象局撤下暴雨红色预警信号'
                }
            ],
            newReportList:[]
        }
    },
    watch:{
        isShowDetail:function(val){
            if(val){
                this.dialogClass =  'normalDialog appleyBox-lg';
            }else{
                this.dialogClass =  'normalDialog appleyBox-sm';
            }
        }
    },
    methods: {
        init:function(){
            this.showCommandBox = true;
            this.isShowDetail = false;
            this.showEndDialog = false;
            this.isStart = false;
            this.setDialogHeight();
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
                var nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
                var smsContent = "高青县气象局"+ nowTime +"发布暴雨红色报警信号";
                eventHelper.emit("SDSSendMessageAll",smsContent);
                this.$message({
                    message: '短信已发送成功!!',
                    type: 'success'
                });
            }else{
                // eventHelper.emit('openCommandDetail');
                this.isShowDetail = false;
                this.showSmallDialog = true;
                this.isMiddle = false;
                this.setDialogHeight();
            }
        },
        endStep:function(state){
            // eventHelper.emit('openComandEndDetail');
            this.isEnd = state;
            var len = this.reportList.length;
            if(!state){
                this.isMiddle = true;
                this.newReportList = this.reportList.slice(0,len - 2);
                this.newemergencyImgList = this.emergencyImgList.slice(0,3);
            }else{
                this.isMiddle = false;
                this.newReportList = this.reportList;
                this.newemergencyImgList = this.emergencyImgList;
            }
            this.showSmallDialog = false;
            this.showEndDialog = true;
            this.setDialogHeight();
        },
        toggleDetail:function(){
            this.isShowDetail = !this.isShowDetail;
            this.setDialogHeight();
        },
        saveImgFun:function(){
            var msg;
            if(!this.isMiddle){
                msg = '提闸申请';
                eventHelper.emit("SDSSendMessageFile",msg);
            }else{
                msg = '事中报告';
                eventHelper.emit("SDSSendMessageFileEventing",msg);
            }
            this.$message({
                message: msg+'短信已发送成功!!',
                type: 'success'
            });
        },
        closeReportModel:function(){
            this.showSmallDialog = false;
        },
        closeEndModel:function(){
            this.showEndDialog = false;
            if(this.isEnd){
                this.toggleCommadBox();
            }
        },
        //设置弹出框最大高度
        setDialogHeight:function(){
            this.$nextTick(function(){
                var screenHeight = $(window).height();
                var maxHeight = screenHeight*0.9 - 95;
                $(".normalDialog").find(".el-dialog__body").css("max-height",maxHeight + 'px');
            }.bind(this));
        },
        gainTemperatureData:function(){
            /*var param = {
                citykey : "101120301"
            }
            iotController.gainTemperatureData(param,function(data){
                debugger;
            }.bind(this));*/
            $.ajax({
                url:"http://wthrcdn.etouch.cn/weather_mini?citykey=101120301",
                dataType:'jsonp',
                data:'',
                success:function(result) {
                    var weatherDatas = result.data;
                    this.todayInfo.todayDegree = weatherDatas.wendu;
                    this.todayInfo.fengxiang = weatherDatas.forecast[0].fengxiang;
                    this.todayInfo.type = weatherDatas.forecast[0].type;
                    var fengli = weatherDatas.forecast[0].fengli.replace("<![CDATA[","").replace("]]>","");
                    this.todayInfo.fengli = fengli;
                }.bind(this),
                // error:function(){
                //     alert('无法获取天气数据');
                // }
            });
        },
        loadRoadData:function(state){
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
                if(index===0){
                    item.status = 1;
                    num = 0.93;
                }else if(index===1){
                    item.status = 1;
                    num = 1.50;
                }else if(index===2){
                    item.status = 0;
                    num = 0.02;
                }else if(index===3){
                    item.status = 0;
                    num = 1.33;
                }else if(index===4){
                    item.status = 0;
                    num = 1.73;
                }else if(index >= 5){
                    item.status = 3;
                    num = '-';
                }
                item.unit = 'm';
                item.name = '井下水位';

                item.num = (num < 0)?(0 - num):num + item.unit;
                seeperArr.push(item);
            });
            if(!!state){
                this.seeperArr = seeperArr;
            }else{
                this.seeperArr = seeperArr;
                this.newSeeperArr = seeperArr.splice(0,8);
            }

        }
    },
    mounted: function () {
        //获取天气数据
        var weatherDatas;
        var self = this;
        //加载淄博温度信息
        this.gainTemperatureData();
        eventHelper.on('showCommandPanel',function(){
            this.showAlarmBox = true;
            this.isStart = false;
        }.bind(this));
        eventHelper.on('closeCommand',function(){
            this.toggleCommadBox();
        }.bind(this));
        this.loadRoadData();
        setInterval(function(){
            self.loadRoadData(true);
        },10000);
    },
    components: {

    }
});
module.exports = comm;