var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isShowDetail:false,
            isShowAll:false,
            isShowEndDetail:false
        }
    },
    methods: {
        init:function(){
            this.isShowAll = true;
        },
        closeDetail:function(){
            this.isShowAll = false;
        },
        toggleDetail:function(){
            this.isShowDetail = false;
        }
    },
    mounted: function () {
        eventHelper.on('openCommandDetail',function(){
            this.init();
            this.isShowDetail = true;
            if(!!this.isShowEndDetail){
                this.isShowEndDetail = false;
            }
        }.bind(this));
        eventHelper.on('openComandEndDetail',function(){
            this.init();
            this.isShowEndDetail = true;
        }.bind(this));
    },
    components: {}
});
module.exports = comm;