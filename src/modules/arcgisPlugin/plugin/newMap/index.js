var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isExpand:false
        }
    },
    methods: {
        toggleClass:function(status){
            this.isExpand = status;
        },
        switchVectorLayer:function(){

        }

    },
    mounted: function () {
    },
    components: {}
});
module.exports = comm;