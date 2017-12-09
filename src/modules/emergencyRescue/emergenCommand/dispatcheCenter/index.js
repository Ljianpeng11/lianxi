var template = require('./dispatcheCenter.html');
var eventHelper = require('../../utils/eventHelper');
var echarts = require('echarts');
var moment = require('moment');
var swmmTimeData = require('../../services/mock/swmmTimeData');
var dataJXSS = require('../../services/mock/dataJXSS');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            logTableHeight:'',
            tableHeight:'',
            todayInfo:{
                'todayDate':'',
                'todayTime':'',
                'iconId':'',
                'todayDegree':'',
                'type':''
            },
            weatherData:[],
            logData:[],
            emergencyData:[{
                name:'黄文峰',
                department:'排涝抢险队',
                id:1
            },{
                name:'李旭',
                department:'环卫专业队',
                id:1
            },{
                name:'韦林庚',
                department:'管道清淤队',
                id:1
            },{
                name:'黄寒',
                department:'城管抢险队',
                id:1
            },{
                name:'李强',
                department:'市政排涝抢险队',
                id:1
            },{
                name:'陈海华',
                department:'突发事件应急队',
                id:1
            },{
                name:'曹晨',
                department:'老城所道路抢险队',
                id:1
            },{
                name:'彭剑',
                department:'城南道路抢险队',
                id:1
            },{
                name:'房军',
                department:'抢险突击队',
                id:1
            }]
        }
    },
    methods: {
        handleClick(row) {
            console.log(row);
        },
        setTodayDate:function(){
            var self = this;
            setInterval(function(){
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
                var second;
                if(today.second() < 10){
                    second = "0"+today.second();
                }else{
                    second = today.second();
                }
                var todayTime = today.year()+'-'+(today.month()+1)+'-'+today.date()+'  '+today.hour()+':'+today.minute()+':'+second;
                self.todayInfo.todayDate = newDate;
                self.todayInfo.todayTime = todayTime;
            },1000);
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
            url:"http://wthrcdn.etouch.cn/weather_mini?city=广州",
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
        //设置table高度
        this.logTableHeight = $(".erItemContent").eq(3).height();
        this.tableHeight = $(".erItemContent").eq(4).height();
        //雨量数据图表
        var xData = [],yData1 = [],yData2 = [];
        swmmTimeData.forEach(function(val,index){
           var data = val.dataMillisecond.toString();
           var time = moment.unix(data.substr(0,data.length-3));
           var year = time.year();
           var month = time.month();
           var date = time.date();
           var hour = time.hour();
           var minute = time.minute();
           var second = time.second();
           var newTime = year+'-'+month+'-'+date+'\n'+hour+':'+minute+':'+second;
            xData.push(newTime);
            yData1.push(val.value);
        });
        dataJXSS.forEach(function(val,index){
            yData2.push(val.value);
        });
        this.$nextTick(function(){
            var myChart = echarts.init($('.weatherRainChart')[0]);
            var option = {
                backgroundColor:'#fff',
                useUTC:true,
                title:{
                    text:'气象站雨量监测',
                    textStyle:{
                        color:'red'
                    },
                    x:'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid:{
                    left:'5%',
                    right:'8%',
                    bottom:'20%',
                    top:'15%'
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLine:{
                            onZeroAxisIndex:1
                        },
                        data: xData
                    }
                ],
                yAxis: [
                    {
                        name: '(降雨量mm)',
                        type: 'value',
                        max: 200,
                        inverse:true,
                        nameLocation:'start',
                        splitNumber:2,
                        axisLine:{
                            show:false
                        }
                    },
                    {
                        name: '(井下水位m)',
                        type: 'value',
                        max: 10,
                        splitNumber:2,
                        axisLine:{
                            show:false
                        }
                    }
                ],
                series: [
                    {
                        name: '(降雨量mm)',
                        type: 'line',
                        symbolSize:4,
                        tooltip: {
                            trigger: 'axis'
                        },
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: 'rgba(124,181,236, 1)',
                                lineStyle: {
                                    color: 'rgba(124,181,236, 0.8)'
                                },
                                areaStyle: {
                                    color: 'rgba(124,181,236, 0.8)'
                                }
                            }
                        },
                        data: yData1
                    },
                    {
                        name: '(井下水位m)',
                        type: 'line',
                        symbol:'diamond',
                        symbolSize:4,
                        tooltip: {
                            trigger: 'axis'
                        },
                        yAxisIndex: 1,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: 'rgba(67,67,72, 1)',
                                lineStyle: {
                                    color: 'rgba(67,67,72, 0.8)'
                                },
                                areaStyle: {
                                    color: 'rgba(67,67,72, 0.8)'
                                }
                            }
                        },
                        markLine:{
                            lineStyle:{
                                normal:{
                                    color:'red',
                                    width:2,
                                    type:'solid'
                                }
                            },
                            symbolSize:0,
                            data: [{
                                yAxis: 2.3,
                                label:{
                                    normal:{
                                        show:true,
                                        formatter: '超越管顶'
                                    }
                                }
                            }, {
                                yAxis: 7,
                                label:{
                                    normal:{
                                        show:true,
                                        formatter: '超越井盖'
                                    }
                                }
                            }],
                            label:{
                                normal:{
                                    formatter:'{b}:{d}'
                                }
                            }
                        },
                        data: yData2
                    }
                ]
            };
            myChart.setOption(option);
        }.bind(this));
    },
    components: {}
});
module.exports = comm;