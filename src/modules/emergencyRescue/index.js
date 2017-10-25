var template = require('./content.html');
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
        }
    },
    mounted: function () {
        //天气图标
        var icons = new Skycons(),
            list  = [
                "clear-day", "clear-night", "partly-cloudy-day",
                "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
                "fog"
            ],
            i;

        for(i = list.length; i--; )
            icons.set(list[i], list[i]);

        icons.play();
        this.logTableHeight = $(".erItemContent").eq(3).height();
        this.tableHeight = $(".erItemContent").eq(4).height();
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
                    right:'5%',
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
                            trigger: 'axis',
                            formatter: '{a} <br/>{b}日: {c}元'
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
                            trigger: 'axis',
                            formatter: '{a} <br/>{b}日: {c}元'
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