var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
//左侧设备详情面板
var deviceList = require('./deviceList');
var statusTools = require('./statusTools');
var devicePanel = require('./devicePanel');
var statisticsPanel = require('./statisticsPanel');

// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {

        }
    },
    methods: {},
    mounted: function () {
    },
    components: {
        'device-list':deviceList,
        'status-tools':statusTools,
        'device-panel':devicePanel,
        'statistics-panel':statisticsPanel
    }
});
module.exports = comm;