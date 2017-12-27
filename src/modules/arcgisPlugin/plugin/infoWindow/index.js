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
            registerEvents: [],
            waterLevel:null
        }
    },
    methods: {
        relocate: function (items) {
            for (var i = 0; i < items.length; i++) {
                if (this.isNumber(items[i].x) && this.isNumber(items[i].y)) {
                    var boxID = '#infoBox-' + items[i].facilityId;
                    var screenPoint = this.baseView.toScreen(items[i]);
                    var x = screenPoint.x - 102;
                    var y = screenPoint.y - 30 -$(boxID).height();
                    items[i].style.top = y+"px";
                    items[i].style.left = x+"px";
                    items[i].showBigBox = false;
                } else {
                    items[i].style.display = "none";
                }
            }
        },
        highLight: function (item) {
            item.style.zIndex=2;
            item.showBigBox = true;
        },
        normalize: function (item) {
            item.style.zIndex=1;
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
            this.infoBoxes[index].style.display = "none";
        },
        detailView: function (index) {
            this.relocate(this.infoBoxes);
            var item = this.infoBoxes[index];
            if (this.isNumber(item.x) && this.isNumber(item.y)) {
                var boxID = '#infoBox-' + item.facilityId;
                var screenPoint = this.baseView.toScreen(item);
                var x = screenPoint.x - 150;
                var y = screenPoint.y - 54 -$(boxID).height();
                item.style.top = y+"px";
                item.style.left = x+"px";
                item.style.display  = "block";
            }
        },
        showDevicePanel:function(selectItem){
            if(this.$parent.$refs.commandCenter.showCommandBox){
                this.$parent.$refs.commandCenter.showCommandBox = false;
            }
            if(this.$parent.$refs.rainPollution.openRainPollution){
                this.$parent.$refs.rainPollution.openRainPollution = false;
            }
            if(this.$parent.$refs.analysisRoad.openAnalysisRoadBox){
                this.$parent.$refs.analysisRoad.openAnalysisRoadBox = false;
            }
            eventHelper.emit('openDevicePanel',selectItem);
            if(this.$parent.$refs.analysisRoad.showData){
                eventHelper.emit('togglePipeChart');
            }
        },
        renderList:function(list){
            for(var i=0,len=list.length;i<len;i++){
                var item = list[i];
                item.style={
                    zIndex: 1,
                    display:"block",
                    top:"0px",
                    left:"0px"
                }
                if(item.facilityDevice.devices){
                    for(var j=0,devicelen=item.facilityDevice.devices.length;j<devicelen;j++){
                        var deviceItem = item.facilityDevice.devices[j];
                        if(deviceItem.items) {
                            for (var k = 0, jianceItemLen = deviceItem.items.length; k < jianceItemLen; k++,jianceItemLen = deviceItem.items.length) {
                                var monitorData = deviceItem.items[k];
                                switch (monitorData.name) {
                                    case '电压':
                                        deviceItem.items.splice(k, 1);k--;
                                        break;
                                    case '电量':
                                        deviceItem.items.splice(k, 1);k--;
                                        break;
                                    case '信号强度':
                                        deviceItem.items.splice(k, 1);k--;
                                        break;
                                    case '电压比':
                                        monitorData.dValue = monitorData.dValue ? monitorData.dValue * 100 + '%':"-";
                                        deviceItem.sysUpdateTime = monitorData.sysUpdateTime;
                                        break;
                                    case '水位':
                                        monitorData.dValue = monitorData.dValue ? monitorData.dValue.toFixed(2) + '(m)' : '-';
                                        deviceItem.sysUpdateTime = monitorData.sysUpdateTime;
                                        item.state = monitorData.state;
                                        item.waterLevel = monitorData.dValue;
                                        break;
                                    case '积水深度':
                                        monitorData.dValue = monitorData.dValue ? monitorData.dValue.toFixed(2) + '(m)' : '-';
                                        deviceItem.sysUpdateTime = monitorData.sysUpdateTime;
                                        item.state = monitorData.state;
                                        item.waterLevel = monitorData.dValue;
                                        break;
                                    case '雨量':
                                        monitorData.dValue = monitorData.dValue ? monitorData.dValue.toFixed(2) + '(mm)':'-';
                                        item.state = monitorData.state;
                                        item.waterLevel = monitorData.dValue;
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