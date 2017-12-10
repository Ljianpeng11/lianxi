var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
//左侧设备详情面板
var deviceList = require('./deviceList');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {

        }
    },
    methods: {},
    mounted: function () {
    },
    components: {
        'device-list':deviceList
    }
});
module.exports = comm;