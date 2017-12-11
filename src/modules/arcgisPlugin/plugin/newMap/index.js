var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            isExpand:false,
            indexId:1,
            mapTypeList:[
                {
                    name:'影像图',
                    class:'earth',
                    layerId:"imgSuperMapLayer"
                },{
                    name:'地图',
                    class:'normal',
                    layerId:"vectorSuperMapLayer"
                }
            ]
        }
    },
    methods: {
        toggleClass:function(status){
            this.isExpand = status;
        },
        highLight:function (index) {
            for(var i in this.mapTypeList){
                if(i==index){
                    this.baseView.map.findLayerById(this.mapTypeList[i].layerId).visible=true;
                } else {
                    this.baseView.map.findLayerById(this.mapTypeList[i].layerId).visible=false;
                }
            }
            this.indexId = index;
        }
    },
    mounted: function () {
    },
    components: {}
});
module.exports = comm;