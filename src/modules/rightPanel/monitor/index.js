var template = require('./monitor.html');
var statusBar = require('modules/statusBar');
var historyPanel = require('modules/historyPanel');
var pumpStationBar = require('modules/rightPanel/pumpStations/pumpStationBar');
var eventHelper = require('utils/eventHelper');


// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isRealTimeMode: true,
            alarmItem: {},
            facility: {}
        }
    },
    mounted: function () {
        eventHelper.on('right-panel-close',function(){
            this.isRealTimeMode = true;
            this.alarmItem= {};
            this.facility= {};
        }.bind(this));
        this.$on('reset', function () {
            this.isRealTimeMode = true;
            this.alarmItem= {};
            this.facility= {};
        }.bind(this));
        this.$on('switchMode', function (isRealTime) {
            this.isRealTimeMode = isRealTime;
            setTimeout(function () {
                this.$refs.historyPanel.$emit('switchMode', this.facility);
            }.bind(this), 1);
        }.bind(this));
        this.$on('init-monitor', function (paramater) {
            this.facility = paramater.facility;
            this.devices = paramater.devices;
            this.init();
        }.bind(this));
        this.$on('monitor-alarm', function (paramater) {
            this.facility = paramater.facility;
            this.alarmItem = paramater.alarmItem;
            this.$refs.statusBar.$emit('alarm-status-bar', this.alarmItem);
        }.bind(this));
        this.$on('update-monitor', function (paramater) {
            if (this.facility.facilityTypeName == "PP" || this.facility.facilityTypeName == "SG") {
                this.$refs.pumpStationBar.$emit('update-pump-station-bar',paramater);
            }
            else {
                this.$refs.statusBar.$emit('update-status-bar', paramater);
            }
        }.bind(this));
    },
    methods: {
        init: function () {
            if (!!this.devices && this.devices.length > 0) {
                var monitorItems = [];
                this.devices.forEach(function (device) {
                    if (!!device.items && device.items.length > 0) {
                        var i = 1;
                        device.items.forEach(function (item) {
                            //highWarning,lowWarning,highAlert,lowAlert
                            var mointorItem = {};
                            mointorItem.itemID = item.itemID;
                            mointorItem.name = item.name;
                            mointorItem.visiable = false;
                            mointorItem.deviceType = item.itemTypeName;
                            if (!!device.deviceTypeName &&
                                device.deviceTypeName.endsWith('_levelMeter') || !!device.deviceTypeName && device.deviceTypeName.endsWith('_flowmeter')) {
                                mointorItem.type = i;
                                i < 3 ? i++ : i = 1;
                                if (item.itemTypeName.endsWith('_waterLevel')) {
                                    mointorItem.highWarning = !!item.pipeHeight ? item.pipeHeight : item.alarmHeight;
                                    mointorItem.highAlert = !!item.wellLidHeight ? item.wellLidHeight : item.alarmHeight;
                                    mointorItem.unit = 'm';
                                    mointorItem.visiable = true;
                                }
                                else if (item.itemTypeName.endsWith('voltage')) {
                                    mointorItem.lowAlert = !!item.lowAlarm ? item.lowAlarm : 220;
                                    mointorItem.unit = 'V';
                                    mointorItem.visiable = true;
                                }
                                else if (item.itemTypeName.endsWith('voltageRatio')) {
                                    mointorItem.lowAlert = !!item.lowAlarm ? item.lowAlarm : 0.2;
                                    mointorItem.unit = '%';
                                    mointorItem.visiable = true;
                                }
                                //monitorItems = monitorItems.concat(device.items);
                            } else if (device.deviceTypeName.endsWith('pump') || device.deviceTypeName.endsWith('gate')) {
                                mointorItem.itemTypeName = item.itemTypeName;
                                mointorItem.name = item.name;
                                mointorItem.deviceTypeName = device.deviceTypeName;
                            } else if (device.deviceTypeName.endsWith('waterQualityMonitor')) {
                                mointorItem.itemTypeName = item.itemTypeName;
                                mointorItem.name = item.name;
                                mointorItem.unit = item.unit;
                                mointorItem.deviceTypeName = device.deviceTypeName;
                                mointorItem.visiable = false;
                            }
                            monitorItems.push(mointorItem);
                        });
                    }
                });
                if (this.facility.facilityTypeName == "PP" || this.facility.facilityTypeName == "SG") {
                    this.$refs.pumpStationBar.$emit('init-pump-station-bar', monitorItems, this.devices,this.facility);
                }
                else {
                    this.$refs.statusBar.$emit('init-status-bar', monitorItems, this.facility);
                }
            }
        }
    },
    components: {
        'statusBar': statusBar,
        'historyPanel': historyPanel,
        'pumpStationBar': pumpStationBar
    }
});
module.exports = comm;