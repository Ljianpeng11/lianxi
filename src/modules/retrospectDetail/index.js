var template = require('./content.html');
var controller = require('controllers/rightPanelController');
// var monitor = require('./monitor');
// var statistics = require('./statistics');
// var dateController = require('./dateControl');
// var facilityController = require('controllers/facilityController');
// var serviceHelper = require('services/serviceHelper');
var moment = require('moment');
var eventHelper = require('utils/eventHelper');
var echarts = require('echarts');
var waterCacheData = require('services/mock/deviceDetail').rows;
var mapHelper = require('utils/mapHelper');
// var jsonData = require('services/mock/pipeTraceJSON.json');
// var Polyline = cesc.require('esri/geometry/Polyline');
// var traceAbilityAnalysis = require('../arcgisPlugin/plugin/arcgisExpand/traceAbilityAnalysis');
var refreshTime = 1000;
var dustColor = '#8b6829';
var pipeColor = '#d4c9b6';
var mapHelper = require('utils/mapHelper');

var topFormat = {
    name: '管线剖面',
    type: 'line',
    smooth: false,
    z: 8,
    showSymbol: false,
    symbol: 'circle',
    symbolSize: 6,
    areaStyle: {
        normal: {
            color: '#f3f3f3'
        }
    },
    itemStyle: {
        normal: {
            color: '#8B9CB0'
        }
    },
    lineStyle: {
        normal: {
            width: 1
        }
    }
};
var bottomFormat = {
    name: '管底高度',
    isBottom: true,
    z: 10,
    type: 'line',
    smooth: false,
    showSymbol: false,
    symbol: 'circle',
    symbolSize: 6,
    areaStyle: {
        normal: {
            color: dustColor,
            opacity: 1
        }
    },
    itemStyle: {
        normal: {
            color: '#5E6369'
        }
    },
    lineStyle: {
        normal: {
            width: 1
        }
    }
};

function copyArr(length, index, arr) {
    var result = []
    length = length + 1;
    for (var i = 0; i < length; i++) {
        if (i == index + 1) {
            // return;
        }
        else if (i == index) {
            result.push(...arr);
        } else {
            result.push('-');
        }
    }
    return result;
}
function formatArr(pipeArr, format) {
    var result = [];
    for (var i = 0; i < pipeArr.length; i++) {
        var obj = $.extend({}, format);
        var start = parseFloat(pipeArr[i][0]);
        var end = parseFloat(pipeArr[i][1]);
        var areaStyle = {
            normal: {
                color: dustColor,
                opacity: 1
            }
        };
        if (!!format.isBottom) {
            if (start < 0 || end < 0) {
                areaStyle = {
                    normal: {
                        color: pipeColor,
                        opacity: 1
                    }
                }
            }
            obj.areaStyle = areaStyle;
        }
        var arr = copyArr(pipeArr.length, i, pipeArr[i]);
        obj.data = arr;
        result.push(obj);
    }
    return result;
}
function formatData(result) {
    var topResult = [];
    var bottomResult = [];
    topResult.push(...formatArr(result.pipeTopArr, topFormat));
    bottomResult.push(...formatArr(result.pipeButtomArr, bottomFormat));
    return [bottomResult, topResult]
}
function formatLineData(result) {
    var topLineFormat = {
        name: '管线剖面',
        type: 'line',
        stack: '管线剖面',
    }
    var bottomLineFormat = {
        name: '管底高度',
        type: 'line',
        stack: '管底高度',
    }
    var topResult = [];
    var bottomResult = [];
    /*  topResult.push(...formatArr(result.pipeTopArr, topLineFormat));
     bottomResult.push(...formatArr(result.pipeButtomArr, bottomLineFormat));*/

    for (var i = 0; i < result.pipeTopArr.length; i++) {
        topResult.push(result.pipeTopArr[i][0]);
        bottomResult.push(result.pipeButtomArr[i][0]);
    }
    topResult.push(result.pipeTopArr[result.pipeTopArr.length - 1][1]);
    bottomResult.push(result.pipeButtomArr[result.pipeTopArr.length - 1][1]);
    topLineFormat.data = topResult;
    bottomLineFormat.data = bottomResult;

    return [bottomLineFormat, topLineFormat]
}
var intervalHandleController;
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            pipeLineTableData: [],
            pipeBigSmalls: '',
            slopesCount: '',
            startDate: '',
            endDate: '',
            dialogVisible: false,
            pickerOptions1: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            rainMixCount: '',
            smallRightPanelOpen: false,
            showQueryResult: false,
            linePipeLong: 0,
            bigSmalls: true,
            slopes: true,
            value4: false,
            crossSectionCharts: false,
            lineCharts: false,
            leftMap: '',
            isQueryTrace: false,
            traceAnalysisType: '上下',
            activeName: 'first',
            pipeDownHeight: [''],
            pipeUpHeight: [],
            pipeFacilities: [],
            preview: true,
            ysw: true,
            openTraceType: false,
            checked: '2',
            traceSwitch: true,
            currentPage4: 1,
            pageSize: 50,
            displayData: [],
            totalPage: 0,
            form: {
                name: '',
                date: moment().format('YYYY-MM-DD HH:mm'),
                owner: '广州市净水有限公司',
                address: '',
                handler: '',
                coord: '',
                usID: '',
                downSize: '',
                upSize: ''
            },
            pipeObj: [],
            controlPreview: true,
            // pipeLength:0
            analyzeResultStyle: {
                width: '100%'
            },
        }
    },
    computed: {},
    mounted: function () {
        var self = this;
        eventHelper.on('get-trace-data', function (result) {
            this.crossSectionCharts = this.lineCharts = false;
            self.result = result;
            //初始化管线长度
            self.linePipeLong = 0;
            var lenData = [];
            self.pipeLineTableData.splice(0);
            var lenDataArr = result.mapAnalyzeResult.pipeLineResult;
            for (var i = 0; i < lenDataArr.length; i++) {
                var pipeLineLongAcount = 0;
                var pipeObj = [];
                pipeObj.splice(0);
                for (var j = 0; j < lenDataArr[i].length; j++) {
                    pipeLineLongAcount += parseInt(lenDataArr[i][j].length);
                    pipeObj.push(lenDataArr[i][j]);
                }
                self.pipeLineTableData.push({
                    pipeLineId: i + 1,
                    pipeLineLong: pipeLineLongAcount + '米',
                    pipeObject: pipeObj
                })
            }
            for (var i = 0; i < lenDataArr.length; i++) {
                var lenDataNewArr = lenDataArr[i];
                lenData.push(...lenDataNewArr);
            }
            lenData.forEach(function (len) {
                var pipeLongs = parseInt(len.length);
                self.linePipeLong += pipeLongs;
            })
            self.slopeGraphicsLayer = result.slopeGraphicsLayer;
            self.slopesArr = result.mapAnalyzeResult.slopes;
            self.bigSmallsGraphicsLayer = result.bigSmallsGraphicsLayer;
            self.bigSmallsArr = result.mapAnalyzeResult.bigSmalls;
            self.ywsGraphicsLayer = result.ywsGraphicsLayer;
            self.arrowSymbolLayer = result.arrowSymbolLayer;
            self.yswArr = result.mapAnalyzeResult.yws;
            // this.showLineCharts();
            this.smallRightPanelOpen = true;
            var dustColor = '#8b6829';
            this.initEcharts = function () {
                var resultCharts = this.formatAnalyzeResult();
                this.$nextTick(function () {
                    clearInterval(this.updateWaterHeight);
                    this.restrospectChartOption = {//剖面图
                        tooltip: {
                            trigger: 'asix',
                            axisPointer: {
                                lineStyle: {
                                    color: '#ddd'
                                }
                            },
                            backgroundColor: 'rgba(255,255,255,1)',
                            padding: [5, 10],
                            textStyle: {
                                color: '#7588E4',
                            },
                            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                        },
                        toolbox: {
                            top: '8%',
                            left: 'left',
                            feature: {
                                dataZoom: {
                                    yAxisIndex: false
                                },
                                brush: {
                                    type: ['lineX', 'clear']
                                }
                            }
                        },
                        brush: {
                            throttleType: 'debounce',
                            throttleDelay: 300,
                            xAxisIndex: 'all',
                            brushLink: 'all',
                            outOfBrush: {
                                colorAlpha: 0.1
                            }
                        },
                        grid: {
                            left: '60px'
                        },
                        legend: {
                            bottom: 10,
                            orient: 'horizontal',
                            data: ['管线剖面', '坡降']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: resultCharts.pipeLengthArr,
                                boundaryGap: false,
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    margin: 10,

                                    textStyle: {
                                        fontSize: 14,
                                        color: '#333'
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#333'
                                    }
                                }
                            }, {
                                type: 'category',
                                data: resultCharts.facilityArr,
                                boundaryGap: false,
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    interval: 0,
                                    margin: 10,
                                    textStyle: {
                                        fontSize: 14,
                                        color: '#333'
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#333'
                                    }
                                }
                            }],
                        yAxis: {
                            type: 'value',
                            min: resultCharts.minHeight.toFixed(1),
                            max: resultCharts.maxHeight.toFixed(1),
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                margin: 10,
                                textStyle: {
                                    fontSize: 14,
                                    color: '#333'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#333'
                                }
                            }
                        },
                        series: [
                            {
                                name: '水位',
                                type: 'line',
                                z: 9,
                                smooth: false,
                                symbol: 'circle',
                                symbolSize: 9,
                                showSymbol: false,
                                lineStyle: {
                                    normal: {
                                        color: 'skyblue',
                                        width: 1
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: 'rgba(0, 136, 212, 1)'
                                        }, {
                                            offset: 0.8,
                                            color: 'rgba(0, 136, 212, 1)'
                                        }], false)
                                    }
                                },
                                data: [],//水位

                            }, {
                                name: '地底',
                                z: 1,
                                type: 'line',
                                smooth: false,
                                showSymbol: false,
                                symbolSize: 1,
                                data: resultCharts.underGround,//管底高度
                                areaStyle: {
                                    normal: {
                                        color: dustColor,
                                        opacity: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#5E6369'
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                }
                            }, {
                                name: '海平面',
                                type: 'line',
                                z: 99,
                                smooth: true,
                                symbol: 'circle',
                                symbolSize: 1,
                                showSymbol: false,
                                data: resultCharts.seaLevel,

                            },
                            {
                                name: '坡降',
                                type: 'line',
                                z: 99,
                                smooth: true,
                                symbol: 'circle',
                                symbolSize: 9,
                                showSymbol: false,
                                data: resultCharts.poJiang,

                            },
                            {
                                type: 'bar',
                                name: 'topPipe',
                                z: 99,
                                tooltip: {
                                    show: false
                                },
                                barGap: '-100%',
                                animation: false,
                                barWidth: 10,
                                hoverAnimation: false,
                                data: resultCharts.topPipe,
                                itemStyle: {
                                    normal: {
                                        borderColor: 'black',
                                        color: 'gray',
                                        opacity: 1,
                                        label: {
                                            show: false
                                        }
                                    }
                                }
                            },
                            {
                                type: 'line',
                                smooth: false,
                                z: 6,
                                animation: false,
                                lineWidth: 1.2,
                                hoverAnimation: false,
                                data: resultCharts.groundHeight,
                                symbol: 'circle',
                                symbolSize: '0',
                                itemStyle: {
                                    normal: {
                                        color: '#3398DB',
                                        label: {
                                            show: false,
                                        }
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        type: 'dashed'
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: dustColor,
                                        opacity: 1
                                    }
                                },
                            },
                            {
                                type: 'bar',
                                name: 'bottomPipe',
                                z: 99,
                                barGap: '-100%',
                                tooltip: {
                                    show: false
                                },
                                animation: false,
                                barWidth: 10,
                                hoverAnimation: false,
                                data: resultCharts.bottomPipe,
                                itemStyle: {
                                    normal: {
                                        borderColor: 'black',
                                        color: 'gray',
                                        opacity: 0.6,
                                        label: {
                                            show: false
                                        }
                                    }
                                },
                                markPoint: {
                                    symbol: 'image://http://127.0.0.1:9000/src/img/icon/bigsmall.png',
                                    symbolSize: [20, 20],
                                    symbolOffset: [0, -20],
                                    data: resultCharts.bigSmallsMarkPoint,
                                    label: {
                                        normal: {show: false}
                                    }
                                },
                            }]
                    };
                    var formatResult = formatData(resultCharts);
                    this.restrospectChartOption.series.push(...formatResult[0]);
                    this.restrospectChartOption.series.push(...formatResult[1]);
                    var topArr = [];
                    var bottomArr = [];
                    resultCharts.pipeTopArr.forEach(function (pipeArr) {
                        topArr.push(...pipeArr);
                    });
                    resultCharts.pipeButtomArr.forEach(function (pipeArr) {
                        bottomArr.push(...pipeArr);
                    });
                    var self = this;
                    this.lineChartsOption = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['管顶高度', '管底高度', '坡降'],
                            bottom: 10,
                            orient: 'horizontal',
                        },
                        grid: {},
                        xAxis: {
                            type: 'category',
                            show: true,
                            boundaryGap: true,
                            data: resultCharts.pipeLengthArr,
                        },
                        yAxis: {
                            type: 'value',
                            min: resultCharts.minHeight.toFixed(1),
                            max: resultCharts.maxHeight.toFixed(1),
                            tickInterval: 1,
                        },
                        series: [
                            {
                                name: '坡降',
                                type: 'line',
                                stack: '坡降',
                                data: resultCharts.poJiang,
                                markPoint: {
                                    symbol: 'image://http://127.0.0.1:9000/src/img/icon/bigsmall.png',
                                    symbolSize: [20, 20],
                                    symbolOffset: [0, -20],
                                    data: resultCharts.bigSmallsMarkPoint,
                                    label: {
                                        normal: {show: false}
                                    }
                                },
                            },
                        ]
                    };
                    var formatLineResult = formatLineData(resultCharts);
                    this.lineChartsOption.series.push(formatLineResult[0]);
                    this.lineChartsOption.series.push(formatLineResult[1]);
                    // 创建剖面图
                    if (this.lineCharts == false) {
                        if ($('#restrospectChart').length) {
                            this.restrospectChart = echarts.init($('#restrospectChart')[0]);
                            this.restrospectChart.on('brushselected', function (param) {
                                if (param.batch[0].areas.length > 0) {
                                    self.mapPointerCounter = setTimeout(function () {
                                        clearTimeout(self.mapPointerCounter);
                                        self.pointToMap(param);
                                    }, 100);
                                } else {
                                    if (!!self.selectedPipeLineLayer) {
                                        self.selectedPipeLineLayer.removeAll();
                                    }
                                }
                            });


                            this.restrospectChart.setOption(this.restrospectChartOption);
                            this.restrospectChart.resize();

                        }
                    }
                    //创建折线图
                    if (this.lineCharts == true) {
                        if ($('#restrospectLineChart').length) {
                            this.restrospectLineChart = echarts.init($('#restrospectLineChart')[0]);
                            this.restrospectLineChart.setOption(this.lineChartsOption);
                            this.restrospectLineChart.resize();
                        }
                    }
                }.bind(this));
            }
            // this.initEcharts();
        }.bind(this));
        eventHelper.on('open-facilityInfo-dialog',function (attributes) {
            this.createCase(attributes);
        }.bind(this));
        eventHelper.on('get-map', function (map) {
            // map.view.on('click',function () {
            //     console.log(123);
            // });
            this.map = map;
            this.currentmap = map.map;
            this.leftMap = map.view;
            this.resetLayer();
            this.selectedPipeLineLayer = mapHelper.getGraphicsLayer('selectedPipeLine', 99999, this.map);
            // this.selectedPipeLineLayer.on('click', function () {
            //     console.log(1);
            // });
            this.leftMap.on('click', function (evt) {
                if (!!evt.graphic && !!evt.graphic.attributes && evt.graphic.attributes.facilityType == 'video') {
                    this.showVideo(evt.graphic.attributes);
                    return;
                }
                if (!!evt.graphic && !!evt.graphic.attributes && evt.graphic.attributes.facilityType == 'pipeLine') {
                    this.showPipeLine(evt.graphic.attributes);
                    return;
                }
                if (!!evt.graphic && !!evt.graphic.attributes && evt.graphic.attributes.facilityType == 'IP') {
                    this.createCase(evt.graphic.attributes);
                    return;
                }

                console.log('click left', evt);

                this.currentPoint = evt.mapPoint;
                // if (this.isQueryFacility)
                //     mapHelper.executeIdentifyTask(evt, this);
                //初始化switch

                this.pipeBigSmalls = '';
                this.slopesCount = '';
                this.rainMixCount = '';
                this.controlPreview = false;
                this.preview = true;
                if (!!this.smallRightPanelOpen) {
                    if (!!this.traceSwitch) {
                        this.resetLayer();
                        mapHelper.nnTraceAnalysisByRecursive(evt, this.traceAnalysisType, this, function (flag) {
                            if (!flag) {
                                this.crossSectionCharts = this.lineCharts = false;
                                this.pipeBigSmalls = '';
                                this.slopesCount = '';
                                this.rainMixCount = '';
                                this.linePipeLong = 0;
                            }
                            if (!!this.bigSmalls) {
                                this.getBigSmalls(true);
                            }
                            if (!!this.slopes) {
                                this.getSlope(true);
                            }
                            if (!!this.ysw) {
                                this.getYsw(true);
                            }
                        }.bind(this));
                    }
                }

            }.bind(this));
        }.bind(this));
        eventHelper.on('open-small-right-panel', function () {
            if (this.smallRightPanelOpen == false) {
                this.smallRightPanelOpen = true;
                //初始化状态
                this.crossSectionCharts = false;
                this.lineCharts = false;
                this.$message('开启管网追溯分析功能');
              //  this.leftMap.setMapCursor("url(img/cur/pwsnorm.cur),auto");
            } else {
                this.$message({
                    message: '管网追溯分析功能已开启',
                    type: 'warning'
                });
            }
        }.bind(this));
        // self.$refs.chartControl.$on('change', function (value) {
        //     self.preview = value == 1 ? true : false;
        //     if (self.crossSectionCharts || self.lineCharts)
        //         self.previewChange();
        // }.bind(this));

    },
    methods: {
        chartController:function (value) {
            this.preview = value == 1 ? true : false;
                if (this.crossSectionCharts || this.lineCharts)
                    this.previewChange();
        },
        initCaseMap: function (x,y,imgObj,issue) {
            var self = this;
            var apiInstance = mapHelper.getInstance();
            var centerX = x;
            var centerY = y;
            self.caseMap = mapHelper.initTDMap('caseMap', centerX, centerY, 18, function (map, view) {
                var apiInstance = mapHelper.getInstance();
                apiInstance.createGraphicsLayer(map,'graphicLayersmall');
                var currentMap = map;
                var currentView = view;
                apiInstance.createMapImageLayer(currentMap, 'http://192.168.0.213:6080/arcgis/rest/services/gz1918pipe/gz1918Pip/MapServer', 'lineLayer');
                mapHelper.registerMapTool(view, 'draw-line', 'top-right', function () {
                    var graphiceLayer = apiInstance.createGraphicsLayer(currentMap, 'testLayer');
                    mapHelper.createPolyline(graphiceLayer, [[113.32397997379353, 23.107584714889605], [113.32745611667683, 23.107584714889605]], {
                        color: [226, 119, 40],
                        width: 4
                    })
                    self.caseMarkPointLayer = mapHelper.getGraphicsLayer('caseMarkPointLayer', 10, currentMap);
                    mapHelper.createPictureMarkSymbol(self.caseMarkPointLayer, issue.x, issue.y, imgObj,issue);
                });
            });
            // this.caseMap = mapHelper.getArcGISTiledMap('caseMap', x,y,18,function () {
            //
            //     // mapHelper.addVideoPoint(this.caseMap);
            //     // mapHelper.addFacilityLayer(this.caseMap);
            //     // mapHelper.addLieDeMaskLayer(this.caseMap);
            //     // this.caseMap.disableScrollWheelZoom();
            //     // this.caseMap.hideZoomSlider();
            //     cb()
            // }.bind(this));
        },
        submitCase: function () {
            this.$message({
                message: '工单派发成功',
                type: 'success'
            });
        },
        createCase: function (issue) {

            this.form.usID = '';
            this.form.coord = '';
            this.form.upSize = '';
            this.form.downSize = '';
            this.form.handler = '';
            this.dialogVisible = true;
            // var icon = './img/icon/bigsmall.png';
            var imgObj = {
                url: "./img/icon/bigsmall.png",
                width: "20px",
                height: "20px"
            };
            if (issue.type == 'YW') {
                this.form.name = '雨污混接';
                // icon = './img/icon/mix.png';
                imgObj = {
                    url: "./img/icon/mix.png",
                    width: "20px",
                    height: "20px"
                };
            } else {
                this.form.name = '大管接小管';
            }
            this.$nextTick(function () {
                if (!this.caseMap) {
                    this.initCaseMap(issue.x,issue.y,imgObj,issue);
                } else {
                    this.caseMarkPointLayer.removeAll();
                    mapHelper.locationAndZoom(issue.x, issue.y, 16, this.caseMap);
                    mapHelper.createSymbol(false, issue.x, issue.y, icon, false, false, this.caseMarkPointLayer);
                }
            }.bind(this));
            this.form.usID = issue.usID;
            this.form.coord = issue.x + ',' + issue.y;
            this.form.upSize = !!issue.pipeLine1.ds2 ? issue.pipeLine1.ds2 : issue.pipeLine1.ds1;
            this.form.downSize = !!issue.pipeLine2.ds2 ? issue.pipeLine2.ds2 : issue.pipeLine2.ds1;
        },
        showPipeLine: function (pipeLineObj) {
            var h = this.$createElement;
            var pipeLine = pipeLineObj.pipeLine;
            this.$msgbox({
                title: '管点详情',
                message: h('p', null, [
                    h('div', null, '管点编号 ：' + pipeLineObj.id),
                    h('div', null, '起点高程 ：' + pipeLine.startHeight + '米'),
                    h('div', null, '终点高程 ：' + pipeLine.endHeight + '米'),
                    h('div', null, '管径尺寸 ：' + (!!pipeLine.ds2 ? parseFloat(pipeLine.ds2.toFixed(1)) : parseFloat(pipeLine.ds1.toFixed(1)))),
                ])
            });
        },
        pointToMap: function (param) {
            var result = param.batch[0];
            var selectedPipes = {};
            if (result.selected[2].dataIndex.length > 0) {
                var selectedArr = result.selected[2].dataIndex;
                selectedArr.forEach(function (selected) {
                    if (selected == 0) {
                        selectedPipes[0] = 'pipe';
                    } else {
                        selectedPipes[selected] = 'pipe';
                        selectedPipes[selected - 1] = 'pipe';

                    }
                })
            } else {
                var index = result.areas[0].coordRange[1];
                if (index > 0) {
                    index--;
                }
                selectedPipes[index] = 'pipeLine';
            }
            var pipeLines = [];
            if (!!this.selectedPipeLineLayer) {
                this.selectedPipeLineLayer.removeAll();
            }
            var cachePipeLines = [];
            for (var i = 0; i < this.displayData.length; i++) {
                if (!!selectedPipes[i]) {
                    var pipeLine = this.displayData[i];
                    cachePipeLines.push(pipeLine);
                    mapHelper.createPictureMarkSymbol( this.selectedPipeLineLayer,pipeLine.startX, pipeLine.startY,{url:'./img/markPoint.png',width:'20px',height:'20px'}, {
                        id: pipeLine.startUsid,
                        pipeLine: pipeLine,
                        facilityType: 'pipeLine'
                    } );
                    mapHelper.createPictureMarkSymbol( this.selectedPipeLineLayer,pipeLine.endX, pipeLine.endY,{url:'./img/markPoint.png',width:'20px',height:'20px'}, {
                        id: pipeLine.endUsid,
                        pipeLine: pipeLine,
                        facilityType: 'pipeLine'
                    });
                }
            }
            mapHelper.setCenter(this.leftMap,cachePipeLines[parseInt(cachePipeLines.length / 2)].endX, cachePipeLines[parseInt(cachePipeLines.length / 2)].endY);
        },
        showPipeRow: function (index, rows) {
            if (!!this.restrospectChart)
                this.restrospectChart.dispatchAction({
                    type: 'restore'
                });
            var hideConfirm = false;
            var lineColor;
            if (!!this.graphicsLayer) {
                mapHelper.removeLayers(this.currentmap, this.graphicsLayer);
            }
            if (!!this.arrowGraphicLayer) {
                mapHelper.removeLayers(this.currentmap, this.arrowGraphicLayer);
            }
            this.graphicsLayer = mapHelper.getGraphicsLayer('singleTrace',99999, this.map);
            this.arrowGraphicLayer = mapHelper.getGraphicsLayer('arrowLayer',99999, this.map);
            // this.graphicsLayer.removeAll();
            // this.arrowGraphicLayer.removeAll();
            if (!intervalHandleController) {
                clearInterval(intervalHandleController);
                intervalHandleController = setInterval(function () {
                    if (this.graphicsLayer.visible && hideConfirm) {
                        this.graphicsLayer.opacity = 0;
                        this.arrowGraphicLayer.opacity = 0;
                        hideConfirm = true;
                    } else if (!this.graphicsLayer.visible && hideConfirm) {
                        this.graphicsLayer.opacity = 1;
                        this.arrowGraphicLayer.opacity = 1;
                        hideConfirm = false;
                    } else if (!hideConfirm) {
                        hideConfirm = true;
                    }
                }.bind(this), 600);
            }
            var pipeLineObject = rows[index].pipeObject;
            this.chartsResults = rows[index].pipeObject;
            for (var i = 0; i < pipeLineObject.length; i++) {
                if (pipeLineObject[i].sort == "雨水")
                    lineColor = [0, 255, 197];
                else if (pipeLineObject[i].sort == "污水")
                    lineColor = [230, 0, 169];
                else
                    lineColor = [230, 152, 0];
                // var redArrowLine = Polyline({
                //     "paths": [[[pipeLineObject[i].startX, pipeLineObject[i].startY], [pipeLineObject[i].endX, pipeLineObject[i].endY]]],
                //     "spatialReference": this.leftMap.spatialReference
                // });
                var paths= [[[pipeLineObject[i].startX, pipeLineObject[i].startY], [pipeLineObject[i].endX, pipeLineObject[i].endY]]];
                var styleObj ={color:lineColor,width:4}
                var redArrowLine = mapHelper.createPolyline(this.arrowGraphicLayer,paths,styleObj).geometry;
                mapHelper.drawArrowPolyline(redArrowLine, this.arrowGraphicLayer, 15, 50, "#110fff");
                var paths1 =[[[pipeLineObject[i].startX, pipeLineObject[i].startY], [pipeLineObject[i].endX, pipeLineObject[i].endY]]];
                var styleObj1 ={color:lineColor,width:8}
                mapHelper.createPolyline( this.graphicsLayer,paths1,styleObj1);
                // mapHelper.drawLine(this.leftMap, [pipeLineObject[i].startX, pipeLineObject[i].startY], [pipeLineObject[i].endX, pipeLineObject[i].endY], 8, lineColor, this.graphicsLayer);
            }

            // console.log(this.line);
            mapHelper.setCenter(this.leftMap,pipeLineObject[0].startX, pipeLineObject[0].startY);
            this.showLineCharts();
            this.checked = '2';
            this.initEcharts();
        },
        //改变页码进行选择，用slice方法对table数据进行对应截取数据
        handleCurrentPageChange: function (currentPage) {
            this.currentPage4 = currentPage;
            this.initEcharts();
        },
        handleClick: function () {

        },
        queryMonitorData: function () {
            clearInterval(this.updateWaterHeight);
            if (this.pipeFacilities && this.waterHeights) {
                var pointer = 0;
                this.updateWaterHeight = setInterval(function () {
                    var newHeights = [];
                    if (pointer > waterCacheData.length - 1) {
                        pointer = 0
                    }
                    var cacheValue = waterCacheData[pointer++].d_value;
                    var waterHeights = this.waterHeights;
                    for (var i = 0; i < waterHeights.length; i++) {
                        if (result.waterHeights[i].height > 0) {
                            var newHeight = waterHeights[i].height + cacheValue;
                            if (newHeight < waterHeights[i].endHeight && newHeight < waterHeights[i].startHeight) {
                                newHeights.push(newHeight);
                                newHeights.push(newHeight);
                            }
                            else {
                                newHeights.push(waterHeights[i].startHeight - 0.05);
                                newHeights.push(waterHeights[i].endHeight);
                            }
                        }
                        else {
                            newHeights.push(0);
                        }
                    }
                    this.restrospectChartOption.series[0].data = newHeights;
                    this.restrospectChart.setOption(this.restrospectChartOption);
                }.bind(this), 100);
            }
        },
        openOrCloseTrace: function () {

        },
        //切换预览模式
        previewChange: function () {
            if (!this.preview == true) {
                this.showLineCharts();
                this.initEcharts();
                this.$nextTick(function () {
                    this.restrospectLineChart.resize();
                }.bind(this));

            } else {
                this.showCrossSectionCharts();
                this.initEcharts();
                this.$nextTick(function () {
                    this.restrospectChart.resize();
                }.bind(this));
            }
        },
        getYsw: function (newValue) {
            this.ysw = newValue;
            console.log(newValue);
            if (this.yswArr) {//判断是否有数据返回
                if (this.yswArr.length > 0) {
                    this.rainMixCount = this.yswArr.length + '个';
                    if (newValue) {
                        for (var i = 0; i < this.yswArr.length; i++) {
                            var ysw = this.yswArr[i];
                            mapHelper.createPictureMarkSymbol( this.ywsGraphicsLayer,ysw.pipeLine1.endX, ysw.pipeLine1.endY,{url:'./img/icon/bigmix.png',width:'20px',height:'20px'}, {
                                usID: ysw.pipeLine1.endUsid,
                                x: ysw.pipeLine1.endX,
                                y: ysw.pipeLine1.endY,
                                pipeLine1: ysw.pipeLine1,
                                pipeLine2: ysw.pipeLine2,
                                facilityType: 'IP',
                                type: 'YW'
                            } );
                            // mapHelper.drawLine(this.leftMap, [ysw.pipeLine1.startX, ysw.pipeLine1.startY], [ysw.pipeLine1.endX, ysw.pipeLine1.endY], 5, [0,0,205], this.ywsGraphicsLayer);
                            // mapHelper.drawLine(this.leftMap, [ysw.pipeLine2.startX, ysw.pipeLine2.startY], [ysw.pipeLine2.endX, ysw.pipeLine2.endY], 5, [160,82,45], this.ywsGraphicsLayer);
                        }
                    } else {
                        this.rainMixCount = '';
                        this.ywsGraphicsLayer.removeAll();
                    }
                } else {
                    this.rainMixCount = 0 + '个';
                    if (newValue)
                        this.$message('没有雨污混接数据');
                }
            } else {
                this.$message('请先点击管线获取信息');
            }
        },
        formatAnalyzeResult: function () {
            // var jsonData = this.result;
            // // console.log(jsonData);
            // var size = jsonData.mapAnalyzeResult.pipeLineResult.length;
            // this.chartsResults = jsonData.mapAnalyzeResult.pipeLineResult;
            // this.initPaginationCharts();
            if (this.lineCharts == true) {
                this.totalPage = 1;
                this.displayData.splice(0);
                this.displayData.push(...this.chartsResults.slice(0, this.chartsResults.length));
            } else {
                this.displayData.splice(0);
                this.totalPage = this.chartsResults.length;
                this.displayData.push(...this.chartsResults.slice((this.currentPage4 - 1) * this.pageSize, (this.currentPage4) * this.pageSize));
            }
            // var result = jsonData.mapAnalyzeResult.pipeLineResult.slice(0, 50);
            // this.displayData = this.chartsResults.slice(0, 50);
            var analyzedResult = {};
            analyzedResult.pipeLengthArr = [0];
            var maxHeight = 0;
            var minHeight = 0;
            var pipeLength = 0;
            analyzedResult.pipeButtomArr = [];
            analyzedResult.pipeTopArr = [];
            analyzedResult.topPipe = [];
            analyzedResult.seaLevel = [];
            analyzedResult.bottomPipe = [];
            analyzedResult.groundHeight = [];
            analyzedResult.facilityArr = [''];
            var length = this.displayData.length * 15;
            if (length > 200) {
                //  this.analyzeResultStyle.marginLeft = '-20%';
                this.analyzeResultStyle.width = length + '%';
            } else if (length > 100) {
                // this.analyzeResultStyle.marginLeft = '-8%';
                this.analyzeResultStyle.width = length + '%';
            }
            else {
                this.analyzeResultStyle.marginLeft = '0';
                this.analyzeResultStyle.width = '100%';
            }
            minHeight = this.displayData[0].startHeight.toFixed(1);
            var coords = [];
            var outputSTR = '';
            analyzedResult.waterHeights = [];
            analyzedResult.bigSmallsMarkPoint = [];
            for (var i = 0; i < this.displayData.length; i++) {

                var pipe = this.displayData[i];
                outputSTR += pipe.oid + ',';
                coords.push([pipe.startX, pipe.startY]);
                coords.push([pipe.endX, pipe.endY]);
                pipeLength += parseInt(pipe.length);
                analyzedResult.pipeLengthArr.push(pipeLength);
                var startHeight = parseFloat(pipe.startHeight.toFixed(1)) + (!!pipe.ds2 ? parseFloat(pipe.ds2.toFixed(1)) : parseFloat(pipe.ds1.toFixed(1)));
                var endHeight = parseFloat(pipe.endHeight.toFixed(1)) + (!!pipe.ds2 ? parseFloat(pipe.ds2.toFixed(1)) : parseFloat(pipe.ds1.toFixed(1)));
                var bottomStartHeight = parseFloat(pipe.startHeight.toFixed(1));
                var bottomEndHeight = parseFloat(pipe.endHeight.toFixed(1));

                maxHeight = maxHeight > startHeight ? maxHeight : startHeight;
                maxHeight = maxHeight > endHeight ? maxHeight : endHeight;
                minHeight = minHeight < bottomStartHeight ? minHeight : bottomStartHeight;
                minHeight = minHeight < bottomEndHeight ? minHeight : bottomEndHeight;
                analyzedResult.pipeButtomArr.push([bottomStartHeight.toFixed(1), bottomEndHeight.toFixed(1)]);
                analyzedResult.pipeTopArr.push([startHeight.toFixed(1), endHeight.toFixed(1)]);
                var facility = !!pipe.endLayerId ? pipe.endLayerId : '';
                if (!!pipe.endMntid) {
                    facility = '监测点';
                    if (pipe.endMntid == 159) {
                        this.pipeFacilities.push('L_16020173');
                    }
                    var height = bottomStartHeight > bottomEndHeight ? bottomEndHeight : bottomStartHeight;
                    analyzedResult.waterHeights.push({
                        height: height,
                        endHeight: endHeight,
                        startHeight: startHeight
                    });
                }
                else {
                    analyzedResult.waterHeights.push(0);
                }
                analyzedResult.facilityArr.push(facility);
                //判断是否大管接小管
                if (this.checkIsBigSmall(pipe, this.bigSmallsArr)) {
                    var coord = {"coord": ["" + pipeLength, 0]};
                    analyzedResult.bigSmallsMarkPoint.push(coord);
                }
            }
            console.warn('追溯ID：', outputSTR.substring(0, outputSTR.length - 1));
            analyzedResult.maxHeight = parseFloat(maxHeight) + 0.5;

            //更新bigSmallsMarkPoint 的高度
            for (var i in analyzedResult.bigSmallsMarkPoint) {
                analyzedResult.bigSmallsMarkPoint[i].coord[1] = analyzedResult.maxHeight.toFixed(1);
            }
            analyzedResult.poJiang = [];
            analyzedResult.underGround = [];
            analyzedResult.minHeight = minHeight - 0.5;
            var startPoint = parseFloat(this.displayData[0].endHeight.toFixed(1));
            var endPoint = parseFloat(this.displayData[this.displayData.length - 1].endHeight.toFixed(1));
            var poStart = startPoint;
            var gap = (poStart - endPoint) / this.displayData.length;
            for (var i = 0; i < this.displayData.length + 1; i++) {
                analyzedResult.topPipe.push(analyzedResult.maxHeight.toFixed(1));
                if (analyzedResult.minHeight < 0) {
                    analyzedResult.bottomPipe.push(analyzedResult.minHeight.toFixed(1));
                    analyzedResult.seaLevel.push(0);
                }
                analyzedResult.groundHeight.push(analyzedResult.maxHeight.toFixed(1));
                analyzedResult.underGround.push(analyzedResult.minHeight.toFixed(1));
                poStart = poStart - gap;
                analyzedResult.poJiang.push(poStart.toFixed(1));
            }
            console.log(analyzedResult);
            return analyzedResult;
        },
        getBigSmalls: function (newValue) {
            this.bigSmalls = newValue;
            if (this.bigSmallsArr) {//判断是否有数据返回
                if (this.bigSmallsArr.length > 0) {
                    this.pipeBigSmalls = this.bigSmallsArr.length + '个';
                    if (newValue) {
                        for (var i = 0; i < this.bigSmallsArr.length; i++) {
                            var bigSmalls = this.bigSmallsArr[i];
                            var bigSmallGraphics = mapHelper.createPictureMarkSymbol( this.bigSmallsGraphicsLayer,bigSmalls.pipeLine1.endX, bigSmalls.pipeLine1.endY,{url:'./img/icon/bigsmall.png',width:'20px',height:'20px'}, {
                                usID: bigSmalls.pipeLine1.endUsid,
                                x: bigSmalls.pipeLine1.endX,
                                y: bigSmalls.pipeLine1.endY,
                                pipeLine1: bigSmalls.pipeLine1,
                                pipeLine2: bigSmalls.pipeLine2,
                                facilityType: 'IP',
                                type: 'BS'
                            }, );
                            // this.bigSmallsGraphicsLayer.on('layerview-create',function(evt){
                            //     var view = evt.view;
                            //     view.on('click',function(event){
                            //         view.hitTest(event).then(function(response){
                            //             var graphic = response.result[0].graphic;
                            //             this.createCase(graphic.attributes);
                            //         }.bind(this));
                            //     }.bind(this));
                            // }.bind(this));
                        }

                    } else {
                        this.pipeBigSmalls = '';
                        this.bigSmallsGraphicsLayer.removeAll();
                    }
                } else {
                    this.pipeBigSmalls = 0 + '个';
                }

            } else {
                this.$message('请先点击管线获取信息');
            }
        },
        getSlope: function (newValue) {
            this.slopes = newValue;
            if (!!this.slopesArr) {
                if (this.slopesArr.length > 0) {
                    this.slopesCount = this.slopesArr.length + '个';
                    if (newValue) {
                        for (var i = 0; i < this.slopesArr.length; i++) {
                            var slope = this.slopesArr[i];
                            var paths =[[[slope.startX, slope.startY], [slope.endX, slope.endY]]];
                            var styleObj ={color:[0, 0, 0],width:5}
                            mapHelper.createPolyline( this.slopeGraphicsLayer,paths,styleObj);
                            // var pt = new Point(xloc,yloc,map.spatialReference);
                            // var graphic = new Graphic(pt,sms,attr,infoTemplate);
                        }
                    } else {
                        this.slopesCount = '';
                        this.slopeGraphicsLayer.removeAll();
                    }
                } else {
                    this.slopesCount = 0 + '个';
                    this.$message('没有逆坡数据');
                }

            } else {
                this.$message('请先点击管线获取信息');
            }

        },
        showVideo: function () {
            this.showQueryResult = !this.showQueryResult;
        },
        showLineCharts: function () {
            this.lineCharts = true;
            this.crossSectionCharts = false;
        },
        showCrossSectionCharts: function () {
            this.lineCharts = false;
            this.crossSectionCharts = true;
        },
        closePanel: function () {
            this.controlPreview = true;
            this.bigSmalls = false;
            this.slopes = false;
            this.ysw = false;
            this.preview = true;
            this.traceSwitch = true;
            this.pipeBigSmalls = '';
            this.slopesCount = '';
            this.rainMixCount = '';
            this.linePipeLong = 0;
            this.pipeLineTableData.splice(0);
            this.resetLayer();
            this.smallRightPanelOpen = false;
            this.$message('关闭管网追溯分析功能');
            this.isQueryTrace = false;
            // this.currentmap.setMapCursor("default");
            mapHelper.clearAnalysisInfo(this.currentmap);
            this.tableData = [];
            this.showFacilityTraceResult = false;
        },
        resetLayer: function () {
            if (this.bigSmallsGraphicsLayer) {
                this.bigSmallsGraphicsLayer.removeAll();
            }
            if (this.slopeGraphicsLayer) {
                this.slopeGraphicsLayer.removeAll();
            }
            if (this.ywsGraphicsLayer) {
                this.ywsGraphicsLayer.removeAll();
            }
            if (this.arrowSymbolLayer) {
                this.arrowSymbolLayer.removeAll();
            }
            if (this.selectedPipeLineLayer) {
                this.selectedPipeLineLayer.removeAll();
            }
            if (!!this.graphicsLayer) {
                mapHelper.removeLayers(this.currentmap, this.graphicsLayer);
            }
            if (!!this.arrowGraphicLayer) {
                mapHelper.removeLayers(this.currentmap, this.arrowGraphicLayer);
            }
        },
        checkIsBigSmall: function (checkPipe, pipeList) {
            for (var i in pipeList) {
                var pipe = pipeList[i].pipeLine1;
                if (checkPipe.startUsid == pipe.startUsid && checkPipe.endUsid == pipe.endUsid)
                    return true;
            }
            return false;
        }
    },
    components: {}
});
module.exports = comm;