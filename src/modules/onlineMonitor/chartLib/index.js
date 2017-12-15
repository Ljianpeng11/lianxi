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
    props:['chartId','type','chartOptions'],
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
    created(){
        var self = this;
        switch(this.chartOptions.type){
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
                            data: this.chartOptions.xData
                        }
                    ],
                    yAxis: [
                        {
                            name: '测量液位(m)',
                            type: 'value',
                            max: 4,
                            splitNumber: 4,
                            axisLine: {
                                show: false
                            }
                        },{
                            name: '降雨量(mm)',
                            type: 'value',
                            max: 120,
                            inverse: true,
                            nameLocation: 'start',
                            splitNumber: 4,
                            axisLine: {
                                show: false
                            }
                        }
                    ],
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
                                    color: 'rgba(67,67,72, 1)',
                                    lineStyle: {
                                        color: 'rgba(67,67,72, 0.8)'
                                    },
                                    areaStyle: {
                                        color: 'rgba(67,67,72, 0.8)'
                                    }
                                }
                            },
                            markLine: {
                                lineStyle: {
                                    normal: {
                                        color: '#fe5240',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                symbolSize: 0,
                                data: [{
                                    yAxis: 0.5,
                                    label: {
                                        normal: {
                                            show: true,
                                            formatter: '预警',
                                            position:'start'
                                        }
                                    },
                                    lineStyle:{
                                        normal:{
                                            color:'#f2b817'
                                        }
                                    }
                                }, {
                                    yAxis: 0.8,
                                    label: {
                                        normal: {
                                            show: true,
                                            formatter: '报警',
                                            position:'start'
                                        }
                                    }
                                }],
                                label: {
                                    normal: {
                                        formatter: '{b}:{d}'
                                    }
                                }
                            },
                            data: this.chartOptions.yData1
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
                            data: this.chartOptions.yData2
                        }
                    ]
                };
                break;
            case 'pieChart':
                this.options = {
                    color:this.chartOptions.color,
                    title : {
                        subtext: this.chartOptions.subtext,
                        left:'10px',
                        top:'-20px'
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
                            self.chartOptions.data.forEach(function(val){
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
                            data:self.chartOptions.data,
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
            default:break;
        }
        //初始化图表
        this.loadYLChart('#' + this.chartId);
    },
    methods: {
        loadYLChart:function(dom){
            this.$nextTick(function () {
                this.myChart = echarts.init($(dom)[0]);
                this.myChart.setOption(this.options);
                eventHelper.on('toggle-menu', function () {
                    setTimeout(function () {
                        this.myChart.resize();
                    }.bind(this), 1000)
                }.bind(this));
                if(this.chartOptions.type === 'YLChart'){
                    this.refreshChart();
                }
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
        refreshChart:function(){
            this.timer = setInterval(function(){
                this.addData();
                this.options.series[0].data = this.chartOptions.yData1;
                this.options.series[1].data = this.chartOptions.yData2;
                this.myChart.setOption(this.options,true);
            }.bind(this),2000);
        },
    },
    mounted: function () {

    },
    components: {}
});
module.exports = comm;