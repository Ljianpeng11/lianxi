var template = require('./dispatcheCenter.html');
var eventHelper = require('utils/eventHelper');
var arcgisMap = require('./arcgisMap');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {

        }
    },
    methods: {
    },
    mounted: function () {

    },
    components: {
        'arcgis-map':arcgisMap
    }
});
module.exports = comm;