var template = require('./statusBar.html');
var controller = require('controllers/rightPanelController');
var alertBackground = ';background:#EC3D3D';
var warningBackground = ';background:rgb(255, 193, 80)';
var eventHelper = require('utils/eventHelper');
var mockvoltageRatio = {
    deviceType: "RV_levelMeter_voltageRatio",
    lowAlert:0.2,
    itemID:'mock',
    type:2,
    unit:'%',
    name:'电量',
    visiable:true
};

var updateStatus = function (self, result) {
    console.log('get real time value', result);
    var realTimeValues = {};
    var realTimeValuesBar = {};
    result.forEach(function (newValue) {
        var realTimeValue = newValue.dValue.toFixed(2);
        console.log('realTimeval', realTimeValue);
        realTimeValues[newValue.itemId] = realTimeValue;
        self.monitors.forEach(function (monitor) {
            if (monitor.itemID === newValue.itemId) {
                if (!!monitor.highAlert) {
                    var newWidth = realTimeValue / monitor.highAlert;
                    newWidth = newWidth * 80;
                    if (newWidth < 80 && !!monitor.highWarning && newWidth > monitor.highWarning / monitor.highAlert * 80) {
                        realTimeValuesBar[newValue.itemId] = 'height:' + newWidth + '%' + warningBackground;
                        monitor.status = 1;
                    }
                    else if (newWidth > 80 || newWidth === 80) {
                        if (newWidth > 96) {
                            newWidth = 96;
                        }
                        realTimeValuesBar[newValue.itemId] = 'height:' + newWidth + '%' + alertBackground;
                        monitor.status = 2;
                    } else {
                        realTimeValuesBar[newValue.itemId] = 'height:' + newWidth + '%';
                        monitor.status = 0;
                    }
                }
                else if (!!monitor.lowAlert) {
                    var newWidth = newValue.dValue / monitor.lowAlert;
                    newWidth = newWidth * 15;
                    if (newWidth > 97.3) {
                        newWidth = 97.3;
                    }
                    if (newWidth > 15 && !!monitor.lowWarning && newWidth < monitor.lowWarning / monitor.lowAlert * 15) {
                        realTimeValuesBar[newValue.itemId] = 'height:' + newWidth + '%' + warningBackground;
                        monitor.status = 1;
                    }
                    else if (newWidth < 15 || newWidth === 15) {
                        if (newWidth < 1) {
                            newWidth = 0;
                        }
                        realTimeValuesBar[newValue.itemId] = 'height:' + newWidth + '%' + alertBackground;
                        monitor.status = 2;
                    } else {
                        realTimeValuesBar[newValue.itemId] = 'height:' + newWidth + '%';
                        monitor.status = 0;
                    }
                }
                if(monitor.itemID.indexOf('_waterLevel')!==-1){
                    eventHelper.emit('monitor-status', monitor.status);
                }
            }
        })
    });
    self.realTimeValueList = realTimeValues;
    self.realTimeValueListBar = realTimeValuesBar;
};
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            rightPanelOpen: true,
            monitors: [],
            realTimeValueList: [],
            realTimeValueListBar: [],
            highWarnStyles: [],
            lowWarnStyles: [],
            monitorIDs: []
        }
    },
    mounted: function () {
        this.$on('init-status-bar', function (monitors) {
            this.reset();
            var self = this;
            monitors.forEach(function (item) {
                if (!!item.visiable) {
                    item.status = 0;
                    this.monitorIDs.push(item.itemID);
                    if (!!item.highWarning) {
                        var newWidth = item.highWarning / item.highAlert * 80;
                        self.highWarnStyles[item.itemID] = 'bottom:' + newWidth + '%';
                    }
                    if (!!item.lowWarning) {
                        var newWidth = item.lowWarning / item.lowAlert * 15;
                        self.lowWarnStyles[item.itemID] = 'bottom:' + newWidth + '%';
                    }
                    this.monitors.push(item);
                    this.realTimeValueList[item.itemID] =0;
                }
            }.bind(this));
            this.$on('update-status-bar', function (result) {
                updateStatus(this, result);
            }.bind(this));
        }.bind(this));
    },
    methods: {
        open: function (id) {
            this.rightPanelOpen = true;
            console.log(id);
        },
        reset: function () {
            this.monitors = [];
            this.realTimeValueList = [];
            this.realTimeValueListBar = [];
            this.highWarnStyles = [];
            this.lowWarnStyles = [];
            this.monitorIDs = [];
        }

    }
});
module.exports = comm;