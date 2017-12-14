var template = require('./infoWindow.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');
var facilityController = require('controllers/facilityController');
// 定义组件
var comm = Vue.extend({
    template: template,
    props: ["baseView"],
    data: function () {
        return {
            infoBoxes: [],
            fcEvents: [],
            showInput: false,
            registerEvents: []
        }
    },
    methods: {
        relocate: function (items) {
            for (var i = 0; i < items.length; i++) {
                var boxID = '#infoBox-' + items[i].facilityId;
                if (this.isNumber(items[i].x) && this.isNumber(items[i].y)) {
                    var screenPoint = this.baseView.toScreen(items[i]);
                    var x = screenPoint.x - 150;
                    var y = screenPoint.y - 205;
                    $(boxID).css('top', y);
                    $(boxID).css('left', x);
                    if (x > 0 && y > 0) {
                        items[i].show = true;
                    }
                } else {
                    items[i].show = false;
                }
            }
        },
        highLight: function (infoID) {
            $('#' + infoID).css('z-index', 9999);
        },
        normalize: function (infoID) {
            $('#' + infoID).css('z-index', 1);
        },
        registerToView: function () {
            if (this.registerEvents.length == 0) {
                var instance = mapHelper.getInstance();
                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView, "resize", instance.dojoHitct(this, function () {
                            this.relocate(this.infoBoxes);
                        })
                    )
                );

                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView, "mouse-wheel", instance.dojoHitct(this, function () {
                            this.relocate(this.infoBoxes);
                        })
                    )
                );
                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView, "pan-end", instance.dojoHitct(this, function () {
                            this.relocate(this.infoBoxes);
                        })
                    )
                );

                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView.root, "mousemove", instance.dojoHitct(this, function () {
                            this.relocate(this.infoBoxes);
                        })
                    )
                );
                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView.root, "mouseup", instance.dojoHitct(this, function () {
                            this.relocate(this.infoBoxes);
                        })
                    )
                );
            }
        },
        isNumber: function (value) {
            var patrn = /^(-)?\d+(\.\d+)?$/;
            if (patrn.exec(value) == null || value == "") {
                return false;
            } else {
                return true;
            }
        },
        closePopup: function (index) {
            this.infoBoxes[index].show = false;
        },
        detailView: function (index) {
            this.infoBoxes[index].show = true;
        },
        showDevicePanel:function(selectItem){
            eventHelper.emit('openDevicePanel',selectItem);
        },
        renderList:function(list){
            for(var i=0,len=list.length;i<len;i++){
                var item = list[i];
                item.status = 0;
                item.signal = 'on';
                item.show = true;
                if(item.facilityDevice.devices){
                    for(var j=0,devicelen=item.facilityDevice.devices.length;j<devicelen;j++){
                        var deviceItem = item.facilityDevice.devices[j];
                        if(deviceItem.items) {
                            for (var k = 0, jianceItemLen = deviceItem.items.length; k < jianceItemLen; k++) {
                                var monitorData = deviceItem.items[k];
                                switch (monitorData.name) {
                                    case '电压':
                                        monitorData.dValue = monitorData.dValue ?  monitorData.dValue + 'V' :"-";
                                        if (monitorData.dValue < monitorData.lowAlarm) {
                                            item.voltage = 'low'
                                        }
                                        else if (monitorData > monitorData.highAlarm) {
                                            item.voltage = 'high'
                                        }
                                        else {
                                            item.voltage = 'middle'
                                        }
                                        deviceItem.sysUpdateTime = monitorData.sysUpdateTime;
                                        break;
                                    case '电压比':
                                        monitorData.dValue = monitorData.dValue ? monitorData.dValue * 100 + '%':"-";
                                        deviceItem.sysUpdateTime = monitorData.sysUpdateTime;
                                        break;
                                    case '水位':
                                        monitorData.dValue = monitorData.dValue ? monitorData.dValue.toFixed(2) + '(m)' : '-';
                                        deviceItem.sysUpdateTime = monitorData.sysUpdateTime;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            this.infoBoxes = list;
            this.relocate(this.infoBoxes);
            this.registerToView();
        },
        loadData:function(){
            facilityController.getCurrentUserFacilitysMonitor(function (list) {
                //设备列表加载测站数据
                this.renderList(list);
            }.bind(this));
        }
    },
    mounted: function () {
        eventHelper.on('alert-point', function (points, isReplace) {
            if (!!isReplace) {
                this.infoBoxes = points;
            } else {
                this.infoBoxes.push(...points.slice(0));
            }
        }.bind(this));
        eventHelper.on('alert-point-close', function (points, isAll) {
            if (!!isAll) {
                this.infoBoxes = [];
            }
            else {
                points.forEach(function (point) {
                    for (var i = 0; i < this.infoBoxes.length; i++) {
                        var item = this.infoBoxes[i];
                        if (item.x == point.x && item.y == point.y) {
                            this.infoBoxes.splice(i, 1);
                        }
                    }
                }.bind(this));
            }
        }.bind(this));
    },
    components: {}
});
module.exports = comm;