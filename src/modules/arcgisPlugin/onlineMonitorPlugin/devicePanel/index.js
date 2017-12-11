var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var echarts = require('echarts');
var moment = require('moment');


//雨量数据
var xData = [],yData1 = [],yData2 = [];
var second = 1000;
var data1 = [Math.random() *130];
var data2 = [Math.random() *5];
var time,flag = true;
function addData(){
        xData.shift();
        yData1.shift();
        yData2.shift();
        xData.push(moment(xData[xData.length - 1]).add(1,'m').format('YYYY-MM-DD hh:ss'));
        yData1.push((Math.random() - 0.4) + data2[data2.length - 1]);
        yData2.push((Math.random() - 0.4) * 10 + data1[data1.length - 1]);
}
for(var i = 0;i<12;i++){
    time = moment(new Date()).subtract(i,'m');
    xData[(11 - i)] = time.format('YYYY-MM-DD hh:ss');
    yData1.push((Math.random() - 0.4) + data2[data2.length - 1]);
    yData2.push((Math.random() - 0.4) * 10 + data1[data1.length - 1]);
}

var option = {
    backgroundColor: '#fff',
    useUTC: true,
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '5%',
        right: '8%',
        bottom: '20%',
        top: '15%'
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZeroAxisIndex: 1
            },
            data: xData
        }
    ],
    yAxis: [
        {
            name: '井下水位(m)',
            type: 'value',
            max: 10,
            splitNumber: 2,
            axisLine: {
                show: false
            }
        },{
            name: '降雨量(mm)',
            type: 'value',
            max: 200,
            inverse: true,
            nameLocation: 'start',
            splitNumber: 2,
            axisLine: {
                show: false
            }
        }
    ],
    series: [
        {
            name: '井下水位(m)',
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
                    yAxis: 2.3,
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
                    yAxis: 7,
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
            data: yData1
        },{
            name: '降雨量(mm)',
            type: 'line',
            symbolSize: 4,
            tooltip: {
                trigger: 'axis'
            },
            yAxisIndex: 1,
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
            data: yData2
        }
    ]
};

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            myChart:null,
            timeIndex:null,
            isOpen:true
        }
    },
    methods: {
        loadYLChart:function(dom){
            this.$nextTick(function () {
                this.myChart = echarts.init($(dom)[0]);
                this.myChart.setOption(option);
                setInterval(function(){
                    addData();
                    option.series[0].data = yData1;
                    option.series[1].data = yData2;
                    this.myChart.setOption(option,true);
                }.bind(this),2000);
            }.bind(this));
        },
        closePanel:function(){
            this.isOpen = false;
        }
    },
    mounted: function () {
        //初始化图表
        this.loadYLChart('#deviceWaterChart');
    },
    components: {}
});
module.exports = comm;