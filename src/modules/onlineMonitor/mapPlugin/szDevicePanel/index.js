var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var controller = require('controllers/rightPanelController');
var moment = require('moment');
var serviceHelper = require('services/serviceHelper');

//加载组件
var chartLib = require('modules/onlineMonitor/chartLib');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            myChart: null,
            isOpenPanel: false,
            isOpenBox: true,
            deviceInfo: {},
            facilityTypeName: '',
        }
    },
    created(){

    },
    methods: {
        openDeviceDetail: function () {
            eventHelper.emit('change-menu', {title: '监测设备管理', funUrl: 'statisticsPanel'});
            eventHelper.emit('openDeviceInfoPanel', this.deviceInfo);
            // eventHelper.emit('loadStatisticData',this.deviceInfo);
        },
        loadChart:function(){

        },
        closePanel: function () {
            if (!!this.timer) {
                clearInterval(this.timer);
            }
            this.isOpenPanel = false;
        },
        toggleBox:function(){
            this.isOpenBox = !this.isOpenBox;
            if(this.isOpenBox){
                $(".multiDeviceBox").css("bottom","calc(18em + 10px)");
            }else{
                $(".multiDeviceBox").removeAttr("style");
            }
        }
    },
    mounted: function () {
        eventHelper.on('openSzDevicePanel', function () {
            this.isOpenPanel = true;
        }.bind(this));
    },
    components: {
        'chart-lib': chartLib
    }
});
module.exports = comm;