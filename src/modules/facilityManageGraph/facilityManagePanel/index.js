var template = require('./facilityManagePanel.html');
var facilityController = require('controllers/facilityController');
var serviceHelper = require('services/serviceHelper');
var moment = require('moment');
var eventHelper = require('utils/eventHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            activeName: 'first',
            cmdType: '',
            formatCommandValue: '60 s',
            readCommandValue: 0,
            showMappingTable: false,
            isNew: false,
            device: {
                type: 'DEVICE',
                text: '',
                imei: '',
                iotDeviceId: '',
                key: '',
                img: ''
            },
            monitorInfo: {
                facility: '',
                device: '',
                monitor: ''
            },
            test: '',
            options: [{
                label: 123,
                id: 1233,
                value: 45
            }],
            facilities: [],
            devices: [],
            monitors: [],
            iotMonitors: [],
            commandValue: 30,
            editAble: true,
            showCommandPanel: false,
            deviceInfo: {
                manufacturerId: '',
                model: '',
                protocolType: '',
                deviceType: '',
                manufacturerName: ''
            },
            rightPanelOpen: false,
            isRealTimeMode: true
        }
    },
    mounted: function () {
        eventHelper.on('close-right-panel', function () {
            this.closePanel();
        }.bind(this));
        facilityController.getAllFacilities(function (data) {
            console.log(data);
            this.facilities.push(...data);
        }.bind(this));
        this.$refs.facilitySelector.$on('change', function (facility) {
            if (!!facility) {
                this.devices.splice(0);
                this.monitorInfo.device = '';
                this.showMappingTable = false;
                facilityController.getDevicesByFacility(facility.id, function (devices) {
                    this.devices.push(...devices.records);
                    this.monitors.splice(0);
                }.bind(this));
            }
        }.bind(this));
        this.$refs.deviceSelector.$on('change', function (device) {
            if (!!device) {
                this.monitors.splice(0);
                this.monitorInfo.monitor = '';
                facilityController.getMonitorsByDevice(device.id, function (devices) {
                    this.monitors.push(...devices.records);
                    this.showMappingTable = true;
                }.bind(this));
            }

        }.bind(this));
    },
    methods: {
        sendCommand: function () {
            this.showCommandPanel = false;
            facilityController.sendDataCommand(this.device.iotDeviceId, this.cmdType, this.readCommandValue, function (data) {
                this.$notify({
                    title: '操作成功',
                    message: '设备采集频率已设置为' + this.formatCommandValue,
                    type: 'success'
                });
            }.bind(this));
        },
        formatValue:function (value) {
            var self = this;
            switch (value) {
                case 10:
                    self.formatCommandValue = '10 s';
                    self.commandValue = 0;
                    break;
                case 20:
                    self.formatCommandValue = '20 s';
                    self.commandValue = 10;
                    break;
                case 30:
                    self.formatCommandValue = '30 s';
                    self.commandValue = 30;
                    break;
                case 60:
                    self.formatCommandValue = '60 s';
                    self.commandValue = 30;
                    break;
                case 120:
                    self.formatCommandValue = '2 min';
                    self.commandValue = 40;
                    break;
                case 180:
                    self.formatCommandValue = '3 min';
                    self.commandValue = 50;
                    break;
                case 300:
                    self.formatCommandValue = '5 min';
                    self.commandValue = 60;
                    break;
                case 600:
                    self.formatCommandValue = '10 min';
                    self.readCommandValue = 70;
                    break;
                case 900:
                    self.formatCommandValue = '15 min';
                    self.readCommandValue = 80;
                    break;
                case 1200:
                    self.formatCommandValue = '20 min';
                    self.readCommandValue = 90;
                    break;
                case 1800:
                    self.formatCommandValue = '30 min';
                    self.readCommandValue = 100;
                    break;
            }
        },
        formatTooltip: function (value) {
            var self = this;
            switch (value) {
                case 0:
                    self.formatCommandValue = '10 s';
                    self.readCommandValue = 10;
                    break;
                case 10:
                    self.formatCommandValue = '20 s';
                    self.readCommandValue = 20;
                    break;
                case 20:
                    self.formatCommandValue = '30 s';
                    self.readCommandValue = 30;
                    break;
                case 30:
                    self.formatCommandValue = '60 s';
                    self.readCommandValue = 60;
                    break;
                case 40:
                    self.formatCommandValue = '2 min';
                    self.readCommandValue = 120;
                    break;
                case 50:
                    self.formatCommandValue = '3 min';
                    self.readCommandValue = 180;
                    break;
                case 60:
                    self.formatCommandValue = '5 min';
                    self.readCommandValue = 300;
                    break;
                case 70:
                    self.formatCommandValue = '10 min';
                    self.readCommandValue = 600;
                    break;
                case 80:
                    self.formatCommandValue = '15 min';
                    self.readCommandValue = 900;
                    break;
                case 90:
                    self.formatCommandValue = '20 min';
                    self.readCommandValue = 1200;
                    break;
                case 100:
                    self.formatCommandValue = '30 min';
                    self.readCommandValue = 1800;
                    break;
            }
        },
        saveMapping: function () {
            var self = this;
            this.iotMonitors.forEach(function (iotMonitor) {
                if (!!iotMonitor.monitorItem) {
                    facilityController.getMonitorDetailByDevice(iotMonitor.monitorItem.id, function (itemDetail) {
                        facilityController.getItemFieldByItemTypeId(itemDetail.itemTypeId, iotMonitor.monitorItem.id, function (data) {
                            var formObj = {};
                            var fields = data.fields;
                            fields.forEach(function (field) {
                                formObj[field.name] = field.fieldValue;
                            });
                            formObj.itemID = iotMonitor.iotID;
                            facilityController.saveMonitor(formObj, function (result) {
                                console.log(result);
                                var h = self.$createElement;
                                self.$notify({
                                    title: '操作结果',
                                    message: h('i', {style: 'color: teal'}, formObj.itemID + '保存成功')
                                });
                                self.reset();
                            })
                        })
                    });
                    /* facilityController.getItemFieldByItemTypeId(iotMonitor.monitorItem.itemTypeId, iotMonitor.monitorItem.id, function (data) {
                     console.log(data);
                     })*/
                }
            })
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                    this.$refs[formName].resetFields();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        closePanel: function () {
            eventHelper.emit('right-panel-close');
            this.reset();
        },
        reset: function () {
            //this.stopJJVideo();
            this.rightPanelOpen = false;
            this.isRealTimeMode = true;
            this.activeIndex = '1';
        },
        open: function (device) {
            eventHelper.emit('isLoading');
            this.iotMonitors.splice(0);
            var self = this;


            facilityController.getDeviceInfo(device.iotDeviceId, function (info) {
                var facilityInfo = JSON.parse(info);
                this.deviceInfo = facilityInfo.deviceInfo;
                facilityInfo.services.forEach(function (item) {
                    for (var key in item.data) {
                        self.iotMonitors.push(
                            {iotID: device.imei + '_' + key, monitorItem: ''});
                    }
                }.bind(this));
            }.bind(this));
            facilityController.getDeviceObject(device.id, function (data) {
                this.device.sequence = data.sendFreq;
                this.formatValue(data.sendFreq);
            }.bind(this));
            this.rightPanelOpen = true;
            this.device = device;
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
            // this.$refs.monitorPlugin.$emit('switchMode', this.isRealTimeMode);
            // this.$refs.statisticPlugin.$emit('switchMode', this.isRealTimeMode);
            // if (!this.isRealTimeMode) {
            //     //query by default date
            //     // this.$refs.dateController.queryByDefaultDate();
            // }
        }
    },
    components: {
        // monitor: monitor,
        // statistics: statistics,
        // dateControl: dateController
    }
});
module.exports = comm;