var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var echarts = require('echarts');
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
                            // visualMap: {
                            //     top: 10,
                            //     right: 10,
                            //     seriesIndex:0,
                            //     showLabel:false,
                            //     show:false,
                            //     pieces: [{
                            //         gt: 0,
                            //         lte: 0.5,
                            //         color: '#2f91e4'
                            //     }, {
                            //         gt: 0.5,
                            //         lte: 0.8,
                            //         color: '#f2b817'
                            //     }, {
                            //         gt: 0.8,
                            //         color: '#fe5240'
                            //     }],
                            //     outOfRange: {
                            //         color: '#999'
                            //     }
                            // },
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
                                    itemStyle: {
                                        normal: {
                                            color: '#2f91e4',
                                            lineStyle: {
                                                color: '#2f91e4'
                                            },
                                            // areaStyle: {
                                            //     color: 'rgba(67,67,72, 0.8)'
                                            // }
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
                    default:break;
                }
                this.myChart.setOption(this.options);
                eventHelper.on('toggle-menu', function () {
                    setTimeout(function () {
                        this.myChart.resize();
                    }.bind(this), 1000)
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