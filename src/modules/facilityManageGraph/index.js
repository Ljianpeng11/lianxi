var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var serviceHelper = require('services/serviceHelper.js');
var jsPlumb = require('jsplumb');
var nodeTypeArray = ['VM', 'DEVICE', 'APP'];
var rootPosition = [460, 1040];
var facilityCtrl = require('controllers/facilityController');
var facilityManagePanel = require('./facilityManagePanel');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            dialogVisible: false,
            newFacility: '',
            imei: '',
            topoData: {
                type: 'VM', text: 'IOT平台', key: '0', img: 'img/flowChart/IOT.png',
                rel: [
                    {
                        type: 'APP',
                        text: '接收器',
                        key: '04',
                        img: 'img/flowChart/reciever.png',
                        labelClass: 'labelStyle label-connect'
                    }
                ]
            }
        }
    },
    methods: {
        resetGraph: function () {
            $('#topoRegion').empty();
            window.jsPlumb.reset();
            drawTopo(this.topoData, rootPosition, nodeTypeArray);
            this.showCloseBtn();
        },
        createNewFacility: function () {
            var newRel = {};
            var keyCode = new Date().getTime().toString();
            if (this.newFacility == 'yjswy') {
                newRel = {
                    type: 'DEVICE',
                    text: '窨井水位仪',
                    key: keyCode,
                    img: 'img/flowChart/swj1.png',
                    labelClass: 'labelStyle label-on',
                    imei: this.imei
                }
            } else {
                newRel = {
                    type: 'DEVICE',
                    text: '电子水位尺',
                    key: keyCode,
                    img: 'img/flowChart/dzsc1.png',
                    labelClass: 'labelStyle label-on',
                    imei: this.imei
                }
            }
            var newTopoData = {
                type: 'VM', text: 'IOT平台', key: '0',
                rel: [
                    newRel
                ]
            };
            var mergedTopoData = mergeNewTopo(this.topoData, newTopoData);
            this.resetGraph();
            this.saveMessage(newTopoData.rel[0]);
        },
        showCloseBtn: function () {
            var _this = this;
            $('.node').hover(function () {
                $(this).find(".closeNode").show();
            }, function () {
                $(this).find(".closeNode").hide();
            });
            $(document).on("click", ".closeNode", function () {
                var parentId = $(this).parent()[0].id;
                var keyIndex = parentId.slice(parentId.indexOf("-") + 1, parentId.length);
                _this.$confirm('是否删除该设备信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    $.each(_this.topoData.rel, function (index, val) {
                        if (val.key === keyIndex) {
                            _this.topoData.rel.splice(index, 1);
                        }
                    });
                    window.jsPlumb.removeAllEndpoints(parentId);
                    window.jsPlumb.remove(parentId);
                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            })
        },
        openCreateFacilityPanel: function () {
            this.dialogVisible = true;
            /*  var newTopoData = {
             type: 'VM', text: 'IOT平台', key: '0',
             rel: [
             {
             type: 'DEVICE',
             text: '液位仪123',
             key: '7567',
             img: 'img/flowChart/dzsc1.png',
             labelClass: 'labelStyle label-on'

             }
             ]
             };
             var mergedTopoData = mergeNewTopo(this.topoData, newTopoData);
             //  console.log(mergedTopoData);
             this.resetGraph();*/
        },
        getIotDeviceService: function () {

        },
        saveMessage: function (newNode) {
            var formData = {
                ifOnline: '',
                imei: '',
                iotDeviceId: '',
                iotDeviceTypeId: '',
                name: ''
            };
            formData.name = newNode.text;
            formData.imei = newNode.imei;
            facilityCtrl.saveIotDeviceInfo(formData, function (data) {
                console.log(data);
            }.bind(this));
        }
    },
    mounted: function () {
        this.deviceArr = [];
        facilityCtrl.getDeviceList(function (data) {
            this.deviceArr = {};
            console.log(data);
            var records = data.records;
            records.forEach(function (device) {
                var imgURL = 'img/flowChart/dzsc1.png';
                if (device.name == '窨井水位仪') {
                    imgURL = 'img/flowChart/swj1.png';
                }
                var newDevice = {
                    type: 'DEVICE',
                    id: device.id,
                    text: device.name,
                    imei: device.imei,
                    iotDeviceId: device.iotDeviceId,
                    key: device.iotDeviceId,
                    img: imgURL,
                    labelClass: 'labelStyle label-on'
                };

                this.topoData.rel.push(newDevice);
                this.deviceArr[device.iotDeviceId] = newDevice;
            }.bind(this));
            window.jsPlumb.ready(function () {
                //拓扑数据结构根节点位置设置
                drawTopo(this.topoData, rootPosition, nodeTypeArray);
                this.showCloseBtn();
            }.bind(this));

        }.bind(this));
        console.log(jsPlumb);
        eventHelper.on('facilityNodeClick', function (nodeID) {
            console.log(nodeID);
            var idFix = nodeID.substring(nodeID.indexOf('-') + 1);
            if (!!this.deviceArr[idFix].iotDeviceId) {
                this.$refs.facilityManagePanel.open(this.deviceArr[idFix]);
            } else {
                this.$message({
                    showClose: true,
                    message: '设备异常，请稍后再尝试',
                    type: 'error'
                });
            }
            this.showCloseBtn();
        }.bind(this));
    },
    components: {
        facilityManagePanel: facilityManagePanel
    }
});
module.exports = comm;