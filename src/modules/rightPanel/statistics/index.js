var template = require('./statistics.html');
var controller = require('controllers/rightPanelController');
var echarts = require('echarts');
var moment = require('moment');
var statisticsHelper = require('./model/floodStationStatistic');
var pumpStationHelper = require('./model/pumpStationStatisticeHelper');
var pumpStations = require('modules/rightPanel/pumpStations');
var reservoir = require('modules/rightPanel/reservoir');
var reservoirHistory = require('modules/rightPanel/reservoir/reservoirHistory');
var statisticsController = require('controllers/statisticsController');
var eventHelper = require('utils/eventHelper');
var mockResult = {
    data: [
        {
            itemId: 'RC_WQM_waterTemperature',
            dValue: 15
        },
        {
            itemId: 'RC_WQM_ph',
            dValue: 5.3
        }, {
            itemId: 'RC_WQM_dissolvedOxygen',
            dValue: 3.1
        }, {
            itemId: 'RC_WQM_permanganateIndex',
            dValue: 10.2
        }, {
            itemId: 'RC_WQM_fiveDayOxygenDemand',
            dValue: 5.3
        }, {
            itemId: 'RC_WQM_ammoniaNitrogen',
            dValue: 1.45
        }, {
            itemId: 'RC_WQM_totalPhosphorus',
            dValue: 1.22
        }, {
            itemId: 'RC_total',
            dValue: 5
        },

    ]
};
var mockItems = [
    {
        "itemID": "RC_WQM_waterTemperature",
        "name": "水温",
        "itemTypeName": "RC_WQM_waterTemperature",
        "unit": "°C"
    },
    {
        "itemID": "RC_WQM_ph",
        "name": "PH值",
        "itemTypeName": "RC_WQM_ph",
        "unit": ""
    },
    {
        "itemID": "RC_WQM_dissolvedOxygen",
        "name": "溶解氧",
        "itemTypeName": "RC_WQM_dissolvedOxygen",
        "unit": "mg/L"
    },
    {
        "itemID": "RC_WQM_permanganateIndex",
        "name": "高锰酸盐指数",
        "itemTypeName": "RC_WQM_permanganateIndex",
        "unit": "mg/L"
    },
    {
        "itemID": "RC_WQM_chemicalOxygenDemand",
        "name": "化学需氧量",
        "itemTypeName": "RC_WQM_permanganateIndex",
        "unit": "mg/L"
    },
    {
        "itemID": "RC_WQM_fiveDayOxygenDemand",
        "name": "五日生化需氧量",
        "itemTypeName": "RC_WQM_fiveDayOxygenDemand",
        "unit": "mg/L"
    },
    {
        "itemID": "RC_WQM_ammoniaNitrogen",
        "name": "氨氮",
        "itemTypeName": "RC_WQM_ammoniaNitrogen",
        "unit": "mg/L"
    },
    {
        "itemID": "RC_WQM_totalPhosphorus",
        "name": "总磷",
        "itemTypeName": "RC_WQM_totalPhosphorus",
        "unit": "mg/L"
    },
    {
        "itemID": "RC_total",
        "name": "综合指标",
        "itemTypeName": "RC_total",
        "unit": "水质等级"
    }
];
//itemTypeName "waterLevel"
var getMonitorItem = function (monitorType, devices) {
    var result = {};
    devices.forEach(function (device) {
        device.items.forEach(function (item) {
            if (item.itemTypeName.indexOf(monitorType) !== -1) {
                result = item;
                return item;
            }
        });
    });
    return result;
}
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            rightPanelOpen: true,
            showStatisticsView: false,
            showHistoricalStatisticsView: false,
            showLockStationView: false,
            facility: {},
            isPumpStation: false,
            isPumpStationStatisticsActive: true,
            isReservoir: false,
            facilityCurrentGraphArr: {},
            facilityHistoryGraphArr: {}
        }
    },
    mounted: function () {
        // 基于准备好的dom，初始化echarts实例
        this.currentGraph = {};
        this.$on('init-statistic', function (parameter) {
            if (!!this.currentGraph && !!this.currentGraph.chart) {
                this.currentGraph.chart.clear();
            }
            this.devices = parameter.devices;
            this.isPumpStation = false;
            this.isReservoir = false;
            this.facility = parameter.facility;
            this.showHistoricalStatisticsView = false;
            var time = [moment().format('YYYY-MM-DD hh:mm', new Date())];
            var endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
            var startDate = moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
            console.log(startDate, endDate);
            this.monitorItem = getMonitorItem('waterLevel', parameter.devices);
            // setInterval(function(){
            if (parameter.facility.facilityTypeName === 'WP' || parameter.facility.facilityTypeName === 'WD') {
                this.showStatisticsView = true;
                controller.getHistoricalDataByMonitor(this.monitorItem.itemID, startDate, endDate, function (result) {
                    var xArr = [];
                    var yArr = [];
                    var max = 0;
                    result.forEach(function (historic) {
                        xArr.push(historic.deviceUpdateTime);
                        yArr.push(historic.dValue);
                        if (historic.dValue > max) {
                            max = historic.dValue;
                        }
                    });
                    this.$nextTick(function () {
                        if (parameter.facility.facilityTypeName === 'WP') {
                            this.facilityHistoryGraphArr[parameter.facility.facilityTypeName] = statisticsHelper.initFloodStation('.statistics-main', '河道水位实时监控', xArr, yArr, max, parseFloat(this.monitorItem.alarmHeight));
                        } else {
                            this.facilityHistoryGraphArr[parameter.facility.facilityTypeName] = statisticsHelper.initFloodStation('.statistics-main', '井下水深实时监控', xArr, yArr, max, parseFloat(this.monitorItem.alarmHeight), parseFloat(this.monitorItem.warningHeight));
                        }
                        this.currentGraph = this.facilityHistoryGraphArr[parameter.facility.facilityTypeName];
                        this.currentGraph.chart.resize();
                    }.bind(this));
                }.bind(this));
            } else if (parameter.facility.facilityTypeName === 'RF') {
                this.showStatisticsView = false;
                this.$nextTick(function () {
                    this.currentGraph = statisticsHelper.initRainStation('#statistics-main', {
                        summary: [],
                        detail: []
                    });
                    this.currentGraph.chart.resize();
                }.bind(this));

                eventHelper.emit('closeLoading');
            }
            else if (parameter.facility.facilityTypeName === 'PP') {
                this.isPumpStation = true;
                this.showStatisticsView = false;
                this.isPumpStationStatisticsActive = true;
                var xArr = ['2016-12-1', '2016-12-2', '2016-12-3'];
                var yArr1 = [1, 2, 3];
                var yArr2 = [4, 1, 2];
                var i = 4;

                var obj = {};
                Vue.nextTick(function () {
                    obj = pumpStationHelper.initPumpStation('.statistics-main', '', ['泵前水位', '泵后水位'], xArr, [yArr1, yArr2]);
                    var today = moment();
                    setInterval(function () {
                        today = today.add(1, 'days');

                        xArr.push(today.format('L'));
                        yArr1.push((Math.random() * 10).toFixed(0));
                        yArr2.push((Math.random() * 10).toFixed(0));
                        obj.chart.setOption({
                            series: [{
                                name: '泵前水位',
                                data: yArr1
                            }, {
                                name: '泵后水位',
                                data: yArr2
                            }],
                            xAxis: {
                                data: xArr
                            }
                        });
                        i++;
                    }, 1000);
                });
            } else if (parameter.facility.facilityTypeName === 'SG') {
                this.isPumpStation = true;
                this.showStatisticsView = false;
                this.isPumpStationStatisticsActive = false;
            } else if (parameter.facility.facilityTypeName === 'RV') {
                var self = this;
                self.$refs.reservoir.init(mockItems);
                this.isReservoir = true;
                eventHelper.emit('isLoading');
                setTimeout(function () {
                    this.$refs.reservoir.update(mockResult);
                }.bind(this), 1000);
            } else if (parameter.facility.facilityTypeName === 'RC') {
                var self = this;
                self.$refs.reservoir.init(device.items);
                this.isReservoir = true;
                eventHelper.emit('isLoading');
            }
        }.bind(this));
        this.$on('update-statistic', function (result) {
            result.data.forEach(function (monitor) {
                if (!!this.monitorItem && this.monitorItem.itemID === monitor.itemId) {
                    if (result.facility.facilityTypeName === 'WP') {
                        if (!!this.facilityHistoryGraphArr[result.facility.facilityTypeName]) {
                            var timeLength = this.facilityHistoryGraphArr[result.facility.facilityTypeName].option.xAxis[0].data.length;
                            if (this.facilityHistoryGraphArr[result.facility.facilityTypeName].option.xAxis[0].data[timeLength - 1] !== monitor.deviceUpdateTime) {
                                this.facilityHistoryGraphArr[result.facility.facilityTypeName].option.series[0].data.push(monitor.dValue.toFixed(2));
                                this.facilityHistoryGraphArr[result.facility.facilityTypeName].option.xAxis[0].data.push(monitor.deviceUpdateTime);
                                this.facilityHistoryGraphArr[result.facility.facilityTypeName].chart.setOption(this.facilityHistoryGraphArr[result.facility.facilityTypeName].option);
                            }
                        }
                    } else if (result.facility.facilityTypeName === 'WD') {
                        if (!!this.facilityHistoryGraphArr[result.facility.facilityTypeName]) {
                            var timeLength = this.facilityHistoryGraphArr[result.facility.facilityTypeName].option.xAxis[0].data.length;
                            if (this.facilityHistoryGraphArr[result.facility.facilityTypeName].option.xAxis[0].data[timeLength - 1] !== monitor.deviceUpdateTime) {
                                this.facilityHistoryGraphArr[result.facility.facilityTypeName].option.series[0].data.push(monitor.dValue.toFixed(2));
                                this.facilityHistoryGraphArr[result.facility.facilityTypeName].option.xAxis[0].data.push(monitor.deviceUpdateTime);
                                this.facilityHistoryGraphArr[result.facility.facilityTypeName].chart.setOption(this.facilityHistoryGraphArr[result.facility.facilityTypeName].option);

                            }
                        }
                    } else if (result.facility.facilityTypeName === 'PP' || result.facility.facilityTypeName === 'SG') {
                        pumpStationHelper.initPumpStation('泵站实时监测', ['泵前水位', '泵后水位'], ['2016-12-1', '2016-12-2', '2016-12-3'], [[1, 2, 3], [3, 4, 1]]);
                    } else if (result.facility.facilityTypeName === 'RF') {

                    }
                    else if (result.facility.facilityTypeName === 'RV' || result.facility.facilityTypeName === 'RC') {
                        this.$refs.reservoir.update(result);
                    }
                }
                else if (monitor.itemId.indexOf('stressWaterLine') > -1) {
                    if (!!this.facilityCurrentGraphArr[result.facility.facilityTypeName]) {
                        this.facilityCurrentGraphArr[result.facility.facilityTypeName].option.series[0].data = [monitor.dValue.toFixed(2)];
                        this.facilityCurrentGraphArr[result.facility.facilityTypeName].option.xAxis[0].data = [monitor.deviceUpdateTime];
                        this.facilityCurrentGraphArr[result.facility.facilityTypeName].chart.setOption(this.facilityCurrentGraphArr[result.facility.facilityTypeName].option);
                    }
                    else {
                        if (monitor.itemId.indexOf('stressWaterLine') > -1) {
                            this.facilityCurrentGraphArr[result.facility.facilityTypeName] = statisticsHelper.initFloodStationCurrent([monitor.deviceUpdateTime], [monitor.dValue.toFixed(2)], (monitor.dValue * 1.2).toFixed(2), this.monitorItem.alarmHeight);
                        }
                    }
                }
            }.bind(this));
        }.bind(this));
        this.$on('init-statistic-history', function (parameter) {
            this.isPumpStation = false;
            var startDate = parameter.date.startDate;
            var endDate = parameter.date.endDate;
            if (parameter.facility.facilityTypeName === 'WP' || parameter.facility.facilityTypeName === 'WD') {
                controller.getHistoricalDataByMonitor(this.monitorItem.itemID, startDate, endDate, function (result) {
                    var xArr = [];
                    var yArr = [];
                    var max = 0;
                    result.forEach(function (historic) {
                        xArr.push(historic.deviceUpdateTime);
                        yArr.push(historic.dValue);
                        if (historic.dValue > max) {
                            max = historic.dValue;
                        }
                    });
                    if (parameter.facility.facilityTypeName === 'WP') {
                        statisticsHelper.initFloodStation('.statistics-main-history', '易涝点水深历史记录', xArr, yArr, max, this.monitorItem.alarmHeight);
                    } else {
                        statisticsHelper.initFloodStation('.statistics-main-history', '井下水深历史记录', xArr, yArr, max, this.monitorItem.alarmHeight, this.monitorItem.warnHeight);

                    }
                }.bind(this));
            } else if (parameter.facility.facilityTypeName === 'PP') {
                this.isPumpStation = true;
                pumpStationHelper.initPumpStation('.statistics-main-history', '泵站历史监测', ['泵前水位', '泵后水位'], ['2016-12-1', '2016-12-2', '2016-12-3'], [[1, 2, 3], [3, 4, 1]]);
            }
            else if (parameter.facility.facilityTypeName === 'SG') {
                this.isPumpStation = true;
                pumpStationHelper.initPumpStation('.statistics-main-history', '闸站历史监测', ['闸前水位', '闸后水位'], ['2016-12-1', '2016-12-2', '2016-12-3'], [[1, 2, 3], [3, 4, 1]]);
            }
            else if (parameter.facility.facilityTypeName === 'RF') {
                this.$nextTick(function () {
                    this.monitorItem = getMonitorItem('pluviometer', this.devices);
                    statisticsController.getRainDetail(this.monitorItem.itemID, function (result) {
                        statisticsHelper.initRainStation('.statistics-main-history', result);
                    });
                }.bind(this));
            } else if (parameter.facility.facilityTypeName === 'RC' || parameter.facility.facilityTypeName === 'RV') {
                this.$nextTick(function () {
                    this.devices.forEach(function (device) {
                        if (device.deviceTypeName.indexOf('waterQualityMonitor') !== -1) {
                            this.$refs.reservoirHistory.init(device);
                            return;
                        }
                    }.bind(this));
                }.bind(this));
            }
        })
        this.$on('switchMode', function (isRealTimeModel) {
            this.showHistoricalStatisticsView = !isRealTimeModel;
        }.bind(this));
        this.$on('show-lock-station', function (flag) {
            this.showLockStationView = flag;
        }.bind(this));
    },
    methods: {
        open: function (id) {
            this.rightPanelOpen = true;
            console.log(id);
        }
    },
    components: {
        'pumpStations': pumpStations,
        'reservoir': reservoir,
        'reservoirHistory': reservoirHistory
    }
});
module.exports = comm;