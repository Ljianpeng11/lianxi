define(['echarts'], function (echarts) {
    return {
        initFloodStation: function (domClass, title, xArr, yArr, yMax, alarmHigh, warnHigh) {
            var myChart = echarts.init($(domClass)[0]);
            var checkHigh = [];
            if (!!warnHigh) {
                checkHigh = [{
                    yAxis: alarmHigh * 10,
                    label: {
                        normal: {
                            show: true,
                            position: 'start',
                            formatter: '井盖高度'
                        }
                    }
                }, {
                    yAxis: warnHigh * 10,
                    label: {
                        normal: {
                            show: true,
                            position: 'start',
                            formatter: '管顶高度'
                        }
                    }
                }]
            } else {
                checkHigh = [{
                    yAxis: alarmHigh,
                    label: {
                        normal: {
                            show: true,
                            position: 'start',
                            formatter: '警戒高度'
                        }
                    }
                }];
            }
            var option1 = {
                color: ['skyblue'],
                title: {
                    text: title,
                    x: 'center',
                    align: 'right',
                    top: 10
                },
                grid: {
                    left: '20%',
                    right: '4%',
                    bottom: 40
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765'
                        }
                    }
                },
                legend: {
                    data: ['流量', '降雨量'],
                    x: 'center',
                    y: 'bottom'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xArr,
                    }
                ],
                yAxis: [
                    {
                        name: '水位(m)',
                        max: (yMax * 2).toFixed(1),
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '水位',
                        type: 'line',
                        smooth: true,
                        animation: false,
                        areaStyle: {
                            normal: {}
                        },
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        },
                        markLine: {
                            lineStyle: {
                                normal: {
                                    color: "red"
                                }
                            },
                            data: checkHigh
                        },
                        markArea: {
                            silent: true,
                            data: [[{
                                xAxis: '2009/9/10\n7:00'
                            }, {
                                xAxis: '2009/9/20\n7:00'
                            }]]
                        },
                        data: yArr
                    }
                ]
            };
            myChart.setOption(option1);
            return {
                chart: myChart,
                option: option1
            }
        },
        initFloodStationCurrent: function (xArr, yArr, yMax, alarmHigh, warnHigh) {
            if(!!$('.statistics-view')){
                var myChart = echarts.init($('.statistics-view')[0]);
                var checkHigh = [];
                if (!!warnHigh) {
                    checkHigh = [{
                        yAxis: alarmHigh,
                        label: {
                            normal: {
                                show: true,
                                position: 'start',
                                formatter: '井盖'
                            }
                        }
                    }, {
                        yAxis: warnHigh,
                        label: {
                            normal: {
                                show: true,
                                position: 'start',
                                formatter: '管顶'
                            }
                        }
                    }]
                } else {
                    checkHigh = [{
                        yAxis: alarmHigh,
                        label: {
                            normal: {
                                show: true,
                                position: 'start',
                                formatter: '警戒'
                            }
                        }
                    }];
                }
                var optionView = {
                    color: ["#02adee"],
                    title: {
                        text: "当前水位示意图",
                        x: 'center',
                        top: 10
                    },
                    legend: {
                        data: ["降雨量", "流量"],
                        bottom: 20
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '12%',
                        right: '8%',
                        top: 70,
                        bottom: 20,
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: xArr,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            name: '水位(m)',
                            max: yMax,
                            type: 'value',
                        }
                    ],
                    series: [
                        {
                            name: '当前水位',
                            type: 'bar',
                            barWidth: '80%',
                            data: yArr,
                            markLine: {
                                textStyle: {
                                    fontSize: 12
                                },
                                lineStyle: {
                                    normal: {
                                        color: "red"
                                    }
                                },
                                data: checkHigh
                            },
                        }
                    ]
                };
                myChart.setOption(optionView);
                return {
                    chart: myChart,
                    option: optionView
                }
            }
        },
        initFloodStationCurrentAlarm: function (xArr, yArr, yMax, alarmHigh, warnHigh) {
            var myChart = echarts.init($('.statistics-view')[0]);
            var optionView = {
                title: {
                    text: "地表积水深度",
                    x: 'center',
                    y: 20
                },
                legend: {
                    data: ["降雨量", "流量"],
                    bottom: 20
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '18%',
                    right: '4%',
                    top: 20,
                    bottom: 50,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xArr,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        name: '水位(m)',
                        max: yMax,
                        type: 'value',
                    }
                ],
                series: [
                    {
                        name: '当前水位',
                        type: 'bar',
                        barWidth: '80%',
                        data: yArr
                    }
                ]
            };
            myChart.setOption(optionView);
            return {
                chart: myChart,
                option: optionView
            }
        },
        initRainStation: function (domClass, result) {
            var myChart = echarts.init($(domClass)[0]);
            /*雨量站开始*/
            //获取x、y轴随机数
            function randomData() {
                now = new Date(+now + oneDay);
                value = value + Math.random() * 20 - 10;
                if (value < 0) {
                    value = 1 - value;
                }
                return {
                    name: now.toString(),
                    value: [
                        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                        Math.round(value)
                    ]
                }
            }

            //获取随机数
            var data = [];
            var now = +new Date(1997, 9, 3);
            var oneDay = 24 * 3600 * 1000;
            var value;
            var off = 0;
            if (off === 0) {
                value = 0;
                off = 1;
            } else {
                value = Math.random() * 1000;
            }
            for (var i = 0; i < 1000; i++) {
                data.push(randomData());
            }
            var option3 = {
                title: {
                    text: '降雨量',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        console.log(params);
                        params = params[0];
                        return params.value[1] + '(mm)';
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    data: ['累计降雨量', '降雨量'],
                    x: 'center',
                    y: 'bottom'
                },
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: [{
                    type: 'value',
                    name: '累计降雨量(mm)',
                    min: 0
                }, {
                    type: 'value',
                    name: '降雨量(mm)',
                    nameLocation: 'start',
                    inverse: true,
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                }],
                series: [{
                    name: '累计降雨量',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: result.summary
                },
                    {
                        name: '降雨量',
                        yAxisIndex: 1,
                        type: 'bar',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: result.detail
                    }]
            };
            myChart.setOption(option3);
        },
        initPumpStation: function (domClass) {
            var myChart = echarts.init($(domClass)[0]);
            var option4 = {
                title: {
                    text: '泵站',
                    x: 'center',
                    top: 10
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['兰团水池水位', '驷马涌水位', '汲水井水位'],
                    bottom: '10'
                },
                grid: {
                    bottom: 80
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['2017/04/02', '2017/04/03', '2017/04/04', '2017/04/05', '2017/04/06', '2017/04/07', '2017/04/08']
                },
                yAxis: {
                    type: 'value',
                    name: '水位(m)'
                },
                series: [
                    {
                        name: '兰团水池水位',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '驷马涌水位',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '汲水井水位',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410]
                    }
                ]
            };
            myChart.setOption(option4);
        }
    }
});