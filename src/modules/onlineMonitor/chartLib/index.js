var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
// var echarts = require('echarts');
var moment = require('moment');


//产生雨量随机数
var data1 = [Math.random() *2];
var data2 = [Math.random() *60];
// 定义组件
var comm = Vue.extend({
    template: template,
    props:['chartId','chartOptions'],
    data: function () {
        return {
            myChart:null,
            timeIndex:null,
            timer:null,
            isOpenPanel:false,
            isOpenBox:true,
            deviceInfo:{},
            options:{}
        }
    },
    watch:{
        chartOptions:function(val){
            this.loadChart('#' + this.chartId,val);
        }
    },
    created(){

    },
    methods: {
        loadChart:function(dom,data){
            this.$nextTick(function () {
                this.myChart = echarts.init($(dom)[0]);
                var self = this;
                switch(data.type){
                    case 'YLChart':
                        this.options = {
                            backgroundColor: '#fff',
                            tooltip: {
                                trigger: 'axis'
                            },
                            grid: {
                                left: '8%',
                                right: '8%',
                                bottom: '15%',
                                top: '20%'
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    boundaryGap: false,
                                    axisLine: {
                                        onZeroAxisIndex: 1
                                    },
                                    data: data.xData
                                }
                            ],
                            yAxis: [
                                {
                                    name: '测量液位(m)',
                                    type: 'value',
                                    max: (function(){
                                        if(!!data.alarmHeight){
                                            return Math.ceil(parseFloat(data.alarmHeight) + 1);
                                        }
                                    })(),
                                    splitNumber: 4,
                                    axisLine: {
                                        show: false
                                    }
                                },{
                                    name: '降雨量(mm)',
                                    type: 'value',
                                    // max: 120,
                                    inverse: true,
                                    nameLocation: 'start',
                                    splitNumber: 4,
                                    axisLine: {
                                        show: false
                                    }
                                }
                            ],
                            visualMap: {
                                top: 10,
                                right: 10,
                                seriesIndex:0,
                                showLabel:false,
                                show:false,
                                pieces: [{
                                    gt: 0,
                                    lte: (function(){
                                        if(!!data.warningHeight){
                                            return parseFloat(data.warningHeight);
                                        }
                                    })(),
                                    color: '#2f91e4'
                                }, {
                                    gt: (function(){
                                        if(!!data.warningHeight){
                                            return parseFloat(data.warningHeight);
                                        }
                                    })(),
                                    lte: (function(){
                                        if(!!data.alarmHeight){
                                            return parseFloat(data.alarmHeight);
                                        }
                                    })(),
                                    color: '#f2b817'
                                }, {
                                    gt: (function(){
                                        if(!!data.alarmHeight){
                                            return parseFloat(data.alarmHeight);
                                        }
                                    })(),
                                    color: '#fe5240'
                                }],
                                outOfRange: {
                                    color: '#999'
                                }
                            },
                            series: [
                                {
                                    name: '测量液位(m)',
                                    type: 'line',
                                    symbol: 'diamond',
                                    symbolSize: 4,
                                    tooltip: {
                                        trigger: 'axis'
                                    },
                                    smooth: true,
                                    // itemStyle: {
                                    //     normal: {
                                    //         color: '#2f91e4',
                                    //         lineStyle: {
                                    //             color: '#2f91e4'
                                    //         },
                                    //         // areaStyle: {
                                    //         //     color: 'rgba(67,67,72, 0.8)'
                                    //         // }
                                    //     }
                                    // },
                                    areaStyle:{
                                        normal:{
                                            color:'#59C3E4'
                                        }
                                    },
                                    label:{
                                        normal:{
                                            fontSize:'24'
                                        }
                                    },
                                    markLine:{
                                        symbolSize: 0
                                    },
                                    data: data.yData1
                                },{
                                    name: '降雨量(mm)',
                                    type: 'bar',
                                    barWidth:'10%',
                                    // symbolSize: 4,
                                    tooltip: {
                                        trigger: 'axis'
                                    },
                                    yAxisIndex: 1,
                                    // smooth: true,
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
                                    data: data.yData2
                                }
                            ]
                        };
                        this.options.series[0].markLine.data = [];
                        if(!!data.warningHeight){
                            this.options.series[0].markLine.data.push({
                                yAxis: data.warningHeight,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter: '预警',
                                        position:'start'
                                    }
                                },
                                lineStyle:{
                                    normal:{
                                        color:'#f2b817',
                                        width: 2,
                                        // type: 'solid'
                                    }
                                }
                            });
                        }
                        if(!!data.alarmHeight){
                            this.options.series[0].markLine.data.push({
                                yAxis: data.alarmHeight,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter: '报警',
                                        position:'start'
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: '#fe5240',
                                        width: 2,
                                        // type: 'solid'
                                    }
                                }
                            })
                        }
                        // if(!!data.wellLidHeight){
                        //     this.options.series[0].markLine.data.push({
                        //         yAxis: data.wellLidHeight,
                        //         label: {
                        //             normal: {
                        //                 show: true,
                        //                 formatter: '溢流',
                        //                 position:'start'
                        //             }
                        //         },
                        //         lineStyle:{
                        //             normal:{
                        //                 color:'#FF00FF'
                        //             }
                        //         }
                        //     })
                        // }
                        break;
                    case 'pieChart':
                        this.options = {
                            color:data.color,
                            title : {
                                text:(function(){
                                    if(!!data.text){
                                        return data.text;
                                    }
                                })(),
                                subtext:(function(){
                                    if(!!data.subtext){
                                        return data.subtext;
                                    }
                                })(),
                                left:'10px',
                                top:(function(){
                                    if(!data.text){
                                        return '-20px'
                                    }
                                })(),
                                subtextStyle:{
                                    color:'#333'
                                }
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                left: '2%',
                                y:'20%',
                                data: (function(){
                                    var arr=[];
                                    data.data.forEach(function(val){
                                        arr.push(val.name);
                                    });
                                    return arr;
                                })()
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '45%',
                                    center: ['60%', '70%'],
                                    data:data.data,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        };
                        break;
                    case 'categoryBarChart':
                        this.options = {
                            color:data.color,
                            title: {
                                text: data.title,
                                x:'5px',
                                y:'0px'
                            },
                            tooltip : {
                                trigger: 'axis',
                                axisPointer : {
                                    type : 'shadow'
                                }
                            },
                            legend: {
                                right:'5px',
                                top:'5px',
                                data:(function(){
                                    var arr = [];
                                    data.seriesData.forEach(function(val){
                                        arr.push(val.name);
                                    });
                                    return arr;
                                })()
                            },
                            grid: {
                                left: '8%',
                                right: '8%',
                                bottom: '15%',
                                top: '25%'
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : data.xData
                                }
                            ],
                            yAxis: [
                                {
                                    type : 'value',
                                    minInterval : 1,
                                    name:data.yAxisName
                                }
                            ],
                            series: (function(){
                                var arr = [];
                                data.seriesData.forEach(function(val){
                                    var item = {
                                        name:val.name,
                                        type:'bar',
                                        data:val.data,
                                        itemStyle: {
                                            normal: {
                                                label: {
                                                    show: true,
                                                    position: 'top',
                                                    formatter: '{c}'
                                                }
                                            }
                                        }
                                    }
                                    arr.push(item);
                                })
                                return arr;
                            })()
                        };
                        break;
                    case 'normalBarChart':
                        this.options = {
                            color:data.color,
                            title: {
                                text: data.title,
                                x:'5px',
                                y:'0px'
                            },
                            tooltip: {},
                            grid: {
                                left: '8%',
                                right: '8%',
                                bottom: '15%',
                                top: '25%'
                            },
                            xAxis: {
                                data: data.xData
                            },
                            yAxis: {},
                            series: [{
                                name: '销量',
                                type: 'bar',
                                data: data.yData
                            }]
                        };
                        break;
                    case 'pieInnerChart':
                        this.options = {
                            color:data.color,
                            title : {
                                text:(function(){
                                    if(!!data.text){
                                        return data.text;
                                    }
                                })(),
                                subtext:(function(){
                                    if(!!data.subtext){
                                        return data.subtext;
                                    }
                                })(),
                                left:'10px',
                                top:(function(){
                                    if(!data.text){
                                        return '-20px'
                                    }
                                })(),
                                subtextStyle:{
                                    color:'#333'
                                }
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                left: '2%',
                                y:'20%',
                                data: (function(){
                                    var arr=[];
                                    data.data.forEach(function(val){
                                        arr.push(val.name);
                                    });
                                    return arr;
                                })()
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '45%',
                                    center: ['60%', '70%'],
                                    data:data.data,
                                    itemStyle : {
                                        normal : {
                                            label : {
                                                position : 'inner',
                                                formatter : function (params) {
                                                    return (params.percent - 0).toFixed(0) + '%'
                                                }
                                            },
                                            labelLine : {
                                                show : false
                                            }
                                        },
                                        emphasis : {
                                            label : {
                                                show : true,
                                                formatter : "{b}\n{d}%",
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }

                                    },
                                }
                            ]


                        };
                        break;
                    case 'gaugeChart':
                        this.options = {
                            title: {
                                text:data.text,
                                subtext:data.subtext,
                                x: '48%',
                                y: '45%',
                                textAlign: "center",
                                textStyle: {
                                    fontWeight: 'normal',
                                    "fontSize": 16
                                },
                                subtextStyle: {
                                    color: '#fff',
                                    rich: {
                                        label: {
                                            backgroundColor: data.color,
                                            padding:[5,15],
                                            borderRadius:50,
                                            fontSize:14
                                        }
                                    }
                                }
                            },
                            grid:{
                                x:'center',
                                y:'center',
                                width:'80%'
                            },
                            series: [{
                                name: '外围刻度',
                                type: 'gauge',
                                title:{
                                    show:false
                                },
                                radius: '130%',
                                center: ['50%', '90%'],
                                startAngle: 180,
                                endAngle: 0,
                                axisLine: {
                                    lineStyle: {
                                        width:1,
                                        color:[[1,data.color]]
                                    },
                                },
                                splitLine: {
                                    length: -10,
                                    lineStyle:{
                                        color:data.color,
                                        width:1,
                                    }
                                },
                                axisLabel: {
                                    distance: 12,
                                    color:data.color,
                                    fontSize:12,
                                    formatter:function(param){
                                        if ((param % 50)==0) {
                                            return param
                                        }
                                    }
                                },
                                detail: {
                                    show: false,
                                },
                                axisTick:{
                                    splitNumber:1,
                                    lineStyle:{
                                        opacity:0,
                                    }
                                },
                                pointer:{
                                    show:false
                                },
                                data: [{
                                    value:'',
                                    name:'水温'
                                }]
                            },{
                                    name: 'pie',
                                    type: 'pie',
                                    clockWise: true,
                                    startAngle:180,
                                    color:['transparent'],
                                    radius: '80%',
                                    center: ['50%', '90%'],
                                    hoverAnimation: false,
                                    labelLine:{
                                        normal:{
                                            show:false
                                        }
                                    },
                                    data: [
                                        {
                                            name:'水温',
                                            value:data.value*360/100,
                                            label: {
                                                normal: {
                                                    formatter: [
                                                        '\n\n\n{dot|}'
                                                    ].join('\n'),
                                                    rich: {
                                                        dot: {
                                                            backgroundColor: data.color,
                                                            height: 10,
                                                            width:10,
                                                            borderRadius:10
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            name:'',
                                            value:(100 - data.value)*360/100
                                        }
                                    ]
                                }
                            ]
                        };
                        break;
                    case 'szLineChart':
                        this.options = {
                            // title: {
                            //     text: '水质监测'
                            // },
                            tooltip: {
                                trigger: 'axis'
                            },
                            color: ["#FF0000", "#00BFFF", "#FF00FF", "#1ce322", "#000000", '#EE7942','red','pink'],
                            legend: {
                                data:['水温','PH值','溶解氧','高锰酸盐指数','化学需氧量','五日生化需氧量','氨氮','总磷']
                            },
                            grid: {
                                left: '3%',
                                top:'10%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                offset:'40',
                                boundaryGap: false,
                                data: ['2017/1/24','2017/1/25','2017/1/26','2017/2/3','2017/2/6','2017/2/7','2017/2/8']
                            },
                            yAxis: [{
                                type: 'value',
                                // offset:'20',
                                axisLabel: {
                                    formatter: '{value} '
                                },
                                min: 0,
                                max: 6
                            }],
                            series: [
                            //     {
                            //     "name": "1级",
                            //     "type": "bar",
                            //     "stack": "总量",
                            //     "barMaxWidth": 35,
                            //     "itemStyle": {
                            //         "normal": {
                            //             "color": "#11c5fa"
                            //         }
                            //     },
                            //     "data": [
                            //         1
                            //     ],
                            // },
                            //     {
                            //         "name": "2级",
                            //         "type": "bar",
                            //         "stack": "总量",
                            //         "itemStyle": {
                            //             "normal": {
                            //                 "color": "#13a9f0",
                            //                 "barBorderRadius": 0
                            //             }
                            //         },
                            //         "data": [
                            //             1,
                            //         ]
                            //     },{
                            //         "name": "3级",
                            //         "type": "bar",
                            //         "stack": "总量",
                            //         "itemStyle": {
                            //             "normal": {
                            //                 "color": "#60d41c",
                            //                 "barBorderRadius": 0,
                            //             }
                            //         },
                            //         "data": [
                            //             1,
                            //         ]
                            //     },{
                            //         "name": "4级",
                            //         "type": "bar",
                            //         "stack": "总量",
                            //         "itemStyle": {
                            //             "normal": {
                            //                 "color": "#20b660",
                            //                 "barBorderRadius": 0
                            //             }
                            //         },
                            //         "data": [
                            //             1,
                            //         ]
                            //     },{
                            //         "name": "5级",
                            //         "type": "bar",
                            //         "stack": "总量",
                            //         "itemStyle": {
                            //             "normal": {
                            //                 "color": "#fec109",
                            //                 "barBorderRadius": 0,
                            //             }
                            //         },
                            //         "data": [
                            //             1,
                            //         ]
                            //     },{
                            //         "name": "6级",
                            //         "type": "bar",
                            //         "stack": "总量",
                            //         "itemStyle": {
                            //             "normal": {
                            //                 "color": "#fc5304",
                            //                 "barBorderRadius": 0,
                            //             }
                            //         },
                            //         "data": [
                            //             1,
                            //         ]
                            //     },
                                {
                                    name: '水温',
                                    type: 'line',
                                    lineStyle: {
                                        normal: {
                                            width: 2,
                                        }
                                    },
                                    data:[1, 2, 1, 3, 5, 3, 2]
                                }, {
                                    name: 'PH值',
                                    type: 'line',
                                    lineStyle: {
                                        normal: {
                                            width: 2,
                                        }
                                    },
                                    data:[1, 3, 2, 3, 4, 3, 1]
                                }, {
                                    name: '溶解氧',
                                    type: 'line',
                                    lineStyle: {
                                        normal: {
                                            width: 2,
                                        }
                                    },
                                    data:[3, 2, 4, 3, 5, 6, 2]
                                }, {
                                    name: '高锰酸盐指数',
                                    type: 'line',
                                    lineStyle: {
                                        normal: {
                                            width: 2,
                                        }
                                    },
                                    data:[6, 2, 3, 4, 5, 1, 4]
                                }, {
                                    name: '化学需氧量',
                                    type: 'line',
                                    lineStyle: {
                                        normal: {
                                            width: 2,
                                        }
                                    },
                                    data:[3, 2, 4, 1, 5, 2, 2]
                                }, {
                                    name: '五日生化需氧量',
                                    type: 'line',
                                    lineStyle: {
                                        normal: {
                                            width: 2,
                                        }
                                    },
                                    data:[4, 5, 3, 1, 5, 4, 2]
                                }, {
                                    name: '氨氮',
                                    type: 'line',
                                    lineStyle: {
                                        normal: {
                                            width: 2,
                                        }
                                    },
                                    data:[2, 3, 3, 4, 5, 1, 2]
                                }, {
                                    name: '总磷',
                                    type: 'line',
                                    lineStyle: {
                                        normal: {
                                            width: 2,
                                        }
                                    },
                                    data:[5, 3, 1, 2, 3, 4, 2]
                                }]
                        };
                        break;
                    case 'categoryLineChart':
                        this.options = {
                            color:data.color,
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                right: '5px',
                                top: '5px',
                                data: (function () {
                                    var arr = [];
                                    data.seriesData.forEach(function (val) {
                                        arr.push(val.name);
                                    });
                                    return arr;
                                })()
                            },
                            grid: {
                                left: '8%',
                                right: '8%',
                                bottom: '15%',
                                top: '20%'
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: data.xData
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    axisTick:{
                                        show:false
                                    },
                                    axisLabel: {
                                        show:false
                                    }
                                }
                            ],
                            series: (function () {
                                var arr = [];
                                data.seriesData.forEach(function (val) {
                                    arr.push(val);
                                })
                                return arr;
                            })()
                        };
                        break;
                    default:break;
                }
                this.myChart.setOption(this.options);
                eventHelper.on('toggle-menu', function () {
                    setTimeout(function () {
                        this.myChart.resize();
                    }.bind(this), 1000);
                }.bind(this));
                // if(data.type === 'YLChart'){
                //     this.refreshYLChart();
                // }
            }.bind(this));
        },
        addData:function(){
            this.chartOptions.xData.shift();
            this.chartOptions.yData1.shift();
            this.chartOptions.yData2.shift();
            this.chartOptions.xData.push(moment(this.chartOptions.xData[this.chartOptions.xData.length - 1]).add(1,'h').format('YYYY-MM-DD hh:ss'));
            this.chartOptions.yData1.push(((Math.random() - 0.4) + data1[data1.length - 1]).toFixed(2));
            this.chartOptions.yData2.push(((Math.random() - 0.4) * 10 + data2[data2.length - 1]).toFixed(2));
        },
        refreshYLChart:function(){
            this.timer = setInterval(function(){
                this.addData();
                this.options.series[0].data = this.chartOptions.yData1;
                this.options.series[1].data = this.chartOptions.yData2;
                this.myChart.setOption(this.options,true);
            }.bind(this),2000);
        },
        reloadChart:function(data){
            this.loadChart('#' + this.chartId,data);
        }
    },
    mounted: function () {
        //初始化图表
        this.loadChart('#' + this.chartId,this.chartOptions);
    },
    components: {}
});
module.exports = comm;