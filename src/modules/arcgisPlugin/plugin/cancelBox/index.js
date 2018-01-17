var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var iotController = require('controllers/iotController');
var mapHelper = require('utils/mapHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            showCancelBox:false,
            msg:''
        }
    },
    methods: {
        closeCancelBox:function(){
            this.showCancelBox = false;
        }
    },
    mounted: function () {
        eventHelper.on('openCancelBox',function(){
            this.showCancelBox = true;
        }.bind(this));
    },
    components: {
    }
});
module.exports = comm;