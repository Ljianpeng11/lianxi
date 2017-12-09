var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isExpand:false,
            indexId:-1,
            mapTypeList:[
                {
                    name:'影像图',
                    class:'earth'
                },{
                    name:'地图',
                    class:'normal'
                }
            ]
        }
    },
    methods: {
        toggleClass:function(status){
            this.isExpand = status;
        },
        highLight:function (index) {
            this.indexId = index;
        },
        switchVectorLayer:function(){

        }
    },
    mounted: function () {
    },
    components: {}
});
module.exports = comm;