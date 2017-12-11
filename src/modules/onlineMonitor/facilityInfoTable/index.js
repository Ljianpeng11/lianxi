var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            tableData:[]
        }
    },
    methods: {

    },
    mounted: function () {
    },
    components: {

    }
});
module.exports = comm;