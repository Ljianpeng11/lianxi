var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var echarts = require('echarts');
var moment = require('moment');


//雨量数据
var xData = [],timeData = [],yData1 = [],yData2 = [];
var second = 1000;
var data1 = [Math.random() *130];
var data2 = [Math.random() *3];
var time,flag = true;
function addData(){
        xData.shift();
        yData1.shift();
        yData2.shift();
        xData.push(moment(timeData.pop()).add(1,'h').format('YYYY-MM-DD hh:ss'));
        yData1.push((Math.random() - 0.4) * 10 + data1[data1.length - 1]);
        yData2.push((Math.random() - 0.4) + data2[data2.length - 1]);
}
for(var i = 0;i<12;i++){
    time = moment().subtract(i,'h');
    timeData[(11 - i)] = time;
    xData[(11 - i)] = time.format('YYYY-MM-DD hh:ss');
    yData1.push((Math.random() - 0.4) * 10 + data1[data1.length - 1]);
    yData2.push((Math.random() - 0.4) + data2[data2.length - 1]);
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
            name: '降雨量(mm)',
            type: 'value',
            max: 200,
            inverse: true,
            nameLocation: 'start',
            splitNumber: 2,
            axisLine: {
                show: false
            }
        },
        {
            name: '井下水位(m)',
            type: 'value',
            max: 10,
            splitNumber: 2,
            axisLine: {
                show: false
            }
        }
    ],
    series: [
        {
            name: '降雨量(mm)',
            type: 'line',
            symbolSize: 4,
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
            name: '井下水位(m)',
            type: 'line',
            symbol: 'diamond',
            symbolSize: 4,
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
            markLine: {
                lineStyle: {
                    normal: {
                        color: 'red',
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
                            formatter: '超越\n井盖'
                        }
                    }
                }, {
                    yAxis: 7,
                    label: {
                        normal: {
                            show: true,
                            formatter: '超越\n管顶'
                        }
                    }
                }],
                label: {
                    normal: {
                        formatter: '{b}:{d}'
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
            timeIndex:null
        }
    },
    created:function(){

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
                    // this.myChart.setOption({
                    //     xAxis: {
                    //         data: xData
                    //     },
                    //     series: [{
                    //         name: '降雨量(mm)',
                    //         data: yData1
                    //     },{
                    //         name: '井下水位(m)',
                    //         data: yData2
                    //     }]
                    // })
                }.bind(this),2000);
            }.bind(this));
        }
    },
    mounted: function () {
        //初始化图表
        this.loadYLChart('#deviceWaterChart');
    },
    components: {}
});
module.exports = comm;