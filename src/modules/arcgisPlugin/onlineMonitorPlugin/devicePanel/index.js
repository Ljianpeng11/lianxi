var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var echarts = require('echarts');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {

        }
    },
    methods: {},
    mounted: function () {
        var myChart = echarts.init($("#deviceWaterChart")[0]);
        var option = {

        };
        myChart.setOption(option);
    },
    components: {}
});
module.exports = comm;