define(['services/serviceHelper', 'echarts', 'services/pipeService'], function (serviceHelper, echarts, pipeService) {
    return {
        initPipeChart: function (dom, type, dirtyLine, rainLine, mixinLine) {
            var title = ['雨水沟', '污水沟', '雨污合流沟'];
            if (type == 'pipe') {
                title = ['雨水管', '污水管', '雨污合流管']
            }
            var chart = echarts.init(dom);
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c}米 ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: title
                },
                color: ['#ff00cc', '#ff6600', '#00ffff'],
                series: [
                    {
                        name: '管线长度',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            {value: dirtyLine, name: title[1]},
                            {value: mixinLine, name: title[2]},
                            {value: rainLine, name: title[0]}
                        ],
                        labelLine: {
                            normal: {
                                length: 0.5
                            }
                        },
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
            chart.setOption(option);
        }
        ,
        initRadarChart: function (dom, totalPipeLength, totalCanalLength, rainPipe, dirtyPipe, mixinPipe, rainCanal, dirtyCanal, mixinCanal) {
            var chart = echarts.init(dom);
            var option = {
                tooltip: {},
                radar: {
                    // shape: 'circle',
                    indicator: [
                        {name: '雨污合流管', max: totalPipeLength},
                        {name: '雨水管', max: totalPipeLength},
                        {name: '雨水沟', max: totalCanalLength},
                        {name: '雨污合流沟', max: totalCanalLength},
                        {name: '污水沟', max: totalCanalLength},
                        {name: '污水管', max: totalPipeLength}
                    ],
                    name: {
                        textStyle: {
                            color: 'black',
                            fontWeight: 'bold'
                        }
                    }
                },
                series: [{
                    name: '排水管渠综合分析(单位：米)',
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    data: [
                        {
                            value: [mixinPipe, rainPipe, rainCanal, mixinCanal, dirtyCanal, dirtyPipe],
                            name: '排水管渠综合分析(单位：米)'
                        }
                    ]
                }]
            };
            chart.setOption(option);
        }
        ,
        getPipeList: function (code, cb) {
            var result = {
                totalDir:0,
                totalWell:0,
                totalRoadLength: 0,
                totalRainLength: 0,
                totalDirtyLength: 0,
                totalMixinLength: 0,
                totalPipeCanalLength: 0,
                totalPipeLength: 0,
                totalCanalLength: 0,
                totalRainPipeLength: 0,
                totalDirtyPipeLength: 0,
                totalMixinPipeLength: 0,
                totalRainCanalLength: 0,
                totalDirtyCanalLength: 0,
                totalMixinCanalLength: 0,
                area: 0,
                rows: []
            };
            if (code.length > 0 && code[0].value == '370322') {
                code[0].district.forEach(function (region) {
                    var data = pipeService.getPipeList(region);
                    if (!!data) {
                        result.totalDir += data.totalDir;
                        result.totalWell += data.totalWell;
                        result.totalRoadLength += data.totalRoadLength;
                        result.totalRainLength += data.totalRainLength;
                        result.totalDirtyLength += data.totalDirtyLength;
                        result.totalMixinLength += data.totalMixinLength;
                        result.totalPipeCanalLength += data.totalPipeCanalLength;
                        result.totalPipeLength += data.totalPipeLength;
                        result.totalCanalLength += data.totalCanalLength;
                        result.totalRainPipeLength += data.totalRainPipeLength;
                        result.totalDirtyPipeLength += data.totalDirtyPipeLength;
                        result.totalMixinPipeLength += data.totalMixinPipeLength;
                        result.totalRainCanalLength += data.totalRainCanalLength;
                        result.totalDirtyCanalLength += data.totalDirtyCanalLength;
                        result.totalMixinCanalLength += data.totalMixinCanalLength;
                        result.area += data.area;
                        result.rows.push(...data.rows);
                    }
                })
            } else {
                code.forEach(function (region) {
                    var data = pipeService.getPipeList(region.value);
                    if (!!data) {
                        result.totalDir += data.totalDir;
                        result.totalWell += data.totalWell;
                        result.totalRoadLength += data.totalRoadLength;
                        result.totalRainLength += data.totalRainLength;
                        result.totalDirtyLength += data.totalDirtyLength;
                        result.totalMixinLength += data.totalMixinLength;
                        result.totalPipeCanalLength += data.totalPipeCanalLength;
                        result.totalPipeLength += data.totalPipeLength;
                        result.totalCanalLength += data.totalCanalLength;
                        result.totalRainPipeLength += data.totalRainPipeLength;
                        result.totalDirtyPipeLength += data.totalDirtyPipeLength;
                        result.totalMixinPipeLength += data.totalMixinPipeLength;
                        result.totalRainCanalLength += data.totalRainCanalLength;
                        result.totalDirtyCanalLength += data.totalDirtyCanalLength;
                        result.totalMixinCanalLength += data.totalMixinCanalLength;
                        result.area += data.area;
                        result.rows.push(...data.rows);
                    }
                });
            }

            return result;
        }

    }
});