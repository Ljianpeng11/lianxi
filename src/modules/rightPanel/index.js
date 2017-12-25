var template = require('./rightPanel.html');
var controller = require('controllers/rightPanelController');
var monitor = require('./monitor');
var statistics = require('./statistics');
var dateController = require('./dateControl');
var facilityController = require('controllers/facilityController');
var serviceHelper = require('services/serviceHelper');
var moment = require('moment');
var eventHelper = require('utils/eventHelper');
var realTimeUpdate = function (self, monitorObj) {
    controller.getMonitorItemCurrentValue(monitorObj, function (result) {
        self.lastUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
        self.$refs.monitorPlugin.$emit('update-monitor', result);
        self.$refs.statisticPlugin.$emit('update-statistic', {
            data: result,
            facility: self.facility
        });
    });
};
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
var refreshTime = 10000;
var currentThread;
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            rightPanelOpen: false,
            isRealTimeMode: true,
            realTimeName: '实时监测',
            historyName: '历史记录',
            reportType: '',
            reportSolution: '',
            reportAddress: '',
            reportDescription: '',
            lastUpdateTime: '',
            alarmStatus: 0,
            alertMessage: '',
            activeIndex: '1',
            facilityPic: '',
            facilityName: '',
            selectedMode: '',
            facilityType: '',
            tableHeight: '',
            waterGrade: 1,
            waterGradeTitle: '',
            tableData: [],
            devices: [],
            initData: [],
            showBack: false,
            deviceItem: {},
            reportImgs: []
        }
    },
    mounted: function () {
        eventHelper.on('updateData', function (data) {
            this.tableData.splice(0, this.tableData.length);
            this.tableData.push(...data);
        }.bind(this))
        eventHelper.on('monitor-status', function (status) {
            this.alarmStatus = status;
        }.bind(this));
        this.$on('query-history', function (date) {
            // controller.getHistoricalDataByMonitor(this.waterLevelID ,date.startDate,date.endDate,function(result){
            this.$refs.statisticPlugin.$emit('init-statistic-history', {
                facility: this.facility,
                date: date
            });
        });
        eventHelper.on('current-grade', function (grade) {
            this.waterGrade = grade.grade;
            this.waterGradeTitle = grade.title;
        }.bind(this));
        eventHelper.on('close-right-panel', function () {
            this.closePanel();
        }.bind(this));
    },
    methods: {
        queryHistoricalData: function (itemID) {
            var endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
            var startDate = moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
            controller.getHistoricalDataByMonitor(itemID, startDate, endDate, function (result) {
                this.tableData.splice(0);
                if (result.length > 10) {
                    this.tableData.push(...result);
                } else {
                    this.tableData.push(...result.slice(result.length - 10, result.length));
                }
                this.tableData.reverse();
            }.bind(this));
        },
        handleSelect: function () {
            console.log('select');
        },
        closePanel: function () {
            eventHelper.emit('right-panel-close');
            this.reset();
        },
        reset: function () {
            this.rightPanelOpen = false;
            this.isRealTimeMode = true;
            this.activeIndex = '1';
            this.tableData.splice(0);
            if (!!this.historicalCounter) {
                clearInterval(this.historicalCounter);
            }
        },
        open: function (facility, facilityTypeName) {
            if (!!this.historicalCounter) {
                clearInterval(this.historicalCounter);
            }
            this.tableHeight = $('.bottom-r').height();
            eventHelper.emit('isLoading');
            var self = this;
            clearInterval(currentThread);
            if (!this.isRealTimeMode) {
                $('#historicalMode').removeClass('is-active');
                setTimeout(function () {
                    $('#realTimeMode').addClass('is-active');
                }.bind(this), 100);
            }
            this.isRealTimeMode = true;
            this.rightPanelOpen = true;
            this.$nextTick(function () {
                this.activeIndex = '1';
                this.facility = facility;
                if (!!this.$refs.monitorPlugin) {
                    this.$refs.monitorPlugin.$emit('reset');
                }
                var facilityID = facility.id;
                if (facilityTypeName == 'WP') {
                    this.facilityType = 'yld';
                    this.facilityPic = './img/huawei-demo.jpg';
                } else if (facilityTypeName == 'WD') {
                    this.facilityType = 'yj';
                    this.facilityPic = './img/huawei-demo.jpg';
                } else if (facilityTypeName == 'RF') {
                    this.facilityPic = './img/ylj.png';
                    this.facilityType = facilityTypeName;
                } else if (facilityTypeName == 'DS') {
                    this.facilityPic = './img/ylj.png';
                    this.facilityType = facilityTypeName;

                } else if (facilityTypeName == 'CP') {
                    this.facilityType = facilityTypeName;
                    facilityController.getFacilityDetail(facilityID, function (data) {
                        this.reportDescription = data.TSDZ.split(':')[1];
                        this.reportAddress = data.TSDZ.split(':')[0];
                        this.reportType = data.facilityName;
                        this.reportSolution = data.TSLX;
                    }.bind(this));
                    facilityController.getDeviceDetailByFacility(facilityID, function (result) {
                        console.log(result);
                        if (!!result.pics && result.pics.length > 0) {
                            this.reportImgs.splice(0, this.reportImgs.length);
                            result.pics.forEach(function (picture) {
                                this.reportImgs.push(serviceHelper.getPicUrl(picture.id));
                            }.bind(this))
                        }
                    }.bind(this));
                    eventHelper.emit('closeLoading');
                    return;
                }
                else {
                    facilityTypeName = 'RV';
                    this.facilityPic = '...png';
                    this.facilityType = facilityTypeName;
                }
                this.facilityName = facility.name;
                facilityController.getDeviceDetailByFacility(facilityID, function (result) {
                    console.log(result);
                    if (!!result.pics && result.pics.length > 0) {
                        this.facilityPic = serviceHelper.getPicUrl(result.pics[0].id);
                    }
                    if (result.devices.length > 0) {
                        var monitorIDs = [];
                        var monitors = [];
                        result.devices.forEach(function (device) {
                            var i = 1;
                            var s, len;
                            if (device.items.indexOf('信号强度')) {
                                len = device.items.length - 1;
                            } else {
                                len = device.items.length;
                            }
                            if (len % 2 === 1) {
                                if (len == 1) {
                                    s = 12;
                                } else {
                                    s = 48 / (len + 1);
                                }
                            } else if (len % 2 === 0) {
                                if (len === 2) {
                                    s = 12;
                                } else {
                                    s = 48 / len;
                                }
                            }
                            device.monitorSpan = s;
                            device.items.forEach(function (monitor) {
                                if (monitor.itemTypeName === 'Precipitation') {
                                    monitorIDs.push(monitor.RainfalldurationID);
                                }
                                else if (monitor.itemTypeName === 'waterLevel') {
                                    self.waterLevelID = monitor.itemID;
                                }
                                monitorIDs.push(monitor.itemID);
                                monitors.push(monitor);
                                monitor.visiable = false;
                                if (!!device.deviceTypeName &&
                                    device.deviceTypeName.endsWith('_levelMeter') || !!device.deviceTypeName && device.deviceTypeName.endsWith('_flowmeter')) {
                                    monitor.type = i;
                                    i < 3 ? i++ : i = 1;
                                    if (monitor.itemTypeName.endsWith('_waterLevel')) {
                                        monitor.highWarning = !!monitor.pipeHeight ? monitor.pipeHeight : monitor.alarmHeight;
                                        monitor.highAlert = !!monitor.wellLidHeight ? monitor.wellLidHeight : monitor.alarmHeight;
                                        monitor.unit = 'm';
                                        monitor.visiable = true;
                                    }
                                    else if (monitor.itemTypeName.endsWith('voltage')) {
                                        monitor.lowAlert = !!monitor.lowAlarm ? monitor.lowAlarm : 220;
                                        monitor.unit = 'V';
                                        monitor.visiable = true;
                                    }
                                    else if (monitor.itemTypeName.endsWith('voltageRatio')) {
                                        monitor.lowAlert = !!monitor.lowAlarm ? monitor.lowAlarm : 0.2;
                                        monitor.unit = '%';
                                        monitor.visiable = true;
                                    }
                                    //monitorItems = monitorItems.concat(device.items);
                                } else if (device.deviceTypeName.endsWith('pump') || device.deviceTypeName.endsWith('gate')) {
                                    monitor.itemTypeName = monitor.itemTypeName;
                                    monitor.name = monitor.name;
                                    monitor.deviceTypeName = device.deviceTypeName;
                                } else if (device.deviceTypeName.endsWith('waterQualityMonitor')) {
                                    monitor.itemTypeName = monitor.itemTypeName;
                                    monitor.name = monitor.name;
                                    monitor.unit = monitor.unit;
                                    monitor.deviceTypeName = device.deviceTypeName;
                                    monitor.visiable = false;
                                }
                                if (!!monitor.visiable) {
                                    monitor.status = 0;
                                }
                                if (!monitor.status) {
                                    monitor.status = 0;
                                }
                                if (monitor.itemTypeName == 'RF_pluviometer_rainfall') {
                                    monitor.status = -1;
                                }
                            });
                        }.bind(this));
                        this.initData = result.devices.slice(0);
                        this.devices = result.devices.slice(0);
                        realTimeUpdate(this, monitorIDs);
                        currentThread = setInterval(function () {
                            realTimeUpdate(this, monitorIDs);
                        }.bind(this), refreshTime);
                    }
                    facility.facilityTypeName = facilityTypeName;
                    this.deviceItem = {
                        facility: facility,
                        devices: result.devices
                    };
                    this.$refs.monitorPlugin.$emit('init-monitor', this.deviceItem);
                    this.$refs.statisticPlugin.$emit('init-statistic', {
                        facility: facility,
                        devices: result.devices
                    });
                    var monitorItem = getMonitorItem('waterLevel', result.devices);
                    if (!facilityTypeName == 'RF') {
                        this.queryHistoricalData(monitorItem.itemID);
                        this.historicalCounter = setInterval(function () {
                            this.queryHistoricalData(monitorItem.itemID);
                        }.bind(this), 1000);
                    }
                    this.lastUpdateTime = result.currentDate;
                    eventHelper.emit('closeLoading');
                }.bind(this));

                facilityController.getAlarmInfoByFacility(facilityID, function (result) {
                    console.log(result);
                    if (!!result && result.length > 0) {
                        result.forEach(function (alarmItem) {
                            if (!!alarmItem.isAlarm) {
                                this.$refs.monitorPlugin.$emit('monitor-alarm', {
                                    facility: facility,
                                    alarmItem: alarmItem
                                });
                                this.alarmStatus = 2;
                                this.alertMessage = '正在报警';
                            }
                        }.bind(this));
                    }
                }.bind(this));
            }.bind(this));

        },
        switchMode: function (key, keyPath) {
            this.isRealTimeMode = key === '1';
            if (!this.isRealTimeMode) {
                eventHelper.emit('isLoading');
                $('#realTimeMode').removeClass('is-active');
                $('#historicalMode').addClass('is-active');
            }
            else {
                $('#historicalMode').removeClass('is-active');
                $('#realTimeMode').addClass('is-active');
            }
            this.$refs.monitorPlugin.$emit('switchMode', this.isRealTimeMode);
            this.$refs.statisticPlugin.$emit('switchMode', this.isRealTimeMode);
            if (!this.isRealTimeMode) {
                //query by default date
                this.$refs.dateController.queryByDefaultDate();
            }
            eventHelper.emit('closeLoading')
        },
        showMonitorInfo: function (item) {
            this.showBack = true;
            this.devices.splice(0);
            this.devices.push(item);
            this.deviceItem.devices.splice(0);
            this.deviceItem.devices.push(item);
            this.$refs.monitorPlugin.$emit('init-monitor', this.deviceItem);
        },
        showInit: function () {
            this.showBack = false;
            this.devices.splice(0);
            this.devices = this.initData.slice(0);
        }
    },
    components: {
        monitor: monitor,
        statistics: statistics,
        dateControl: dateController
    }
});
module.exports = comm;