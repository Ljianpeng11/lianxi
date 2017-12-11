var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isOpenList:false,
            deviceList:[
                {
                    title:'五华区公众雨量监测点',
                    status:0,
                    voltage:'low',
                    signal:'on',
                    type:'yuliang',
                    deviceCode:'17120011',
                    deviceNum:0,
                    onlineTime:'2',
                    collect:0
                },
                {
                    title:'市体育馆',
                    status:1,
                    voltage:'middle',
                    signal:'off',
                    type:'yewei',
                    deviceCode:'16310128',
                    deviceNum:'2.506',
                    onlineTime:'2',
                    collect:0
                },
                {
                    title:'普吉路与小路沟交叉口',
                    status:2,
                    voltage:'high',
                    signal:'on',
                    type:'yewei',
                    deviceCode:'17120011',
                    deviceNum:'4.582',
                    onlineTime:'2',
                    collect:1
                },
                {
                    title:'滇缅大道戛纳小镇旁',
                    status:3,
                    voltage:'middle',
                    signal:'off',
                    type:'yewei',
                    deviceCode:'16310128',
                    deviceNum:'1.964',
                    onlineTime:'2',
                    collect:1
                },
                {
                    title:'海源学院正门口',
                    status:3,
                    voltage:'middle',
                    signal:'off',
                    type:'yewei',
                    deviceCode:'16310128',
                    deviceNum:'1.964',
                    onlineTime:'2',
                    collect:0
                },
                {
                    title:'西二环春苑小区对面',
                    status:3,
                    voltage:'middle',
                    signal:'off',
                    type:'yewei',
                    deviceCode:'16310128',
                    deviceNum:'1.964',
                    onlineTime:'2',
                    collect:0
                }
            ]
        }
    },
    methods: {
        toggleList:function(){
            this.isOpenList = !this.isOpenList;
            if(!!this.isOpenList){
                var parentHeight = $('.mapContainer').height();
                $(".deviceListBox").animate({'height':(parentHeight - 20) +'px'},1000);
            }else{
                $(".deviceListBox").animate({'height':'8em'},1000);
            }
        }
    },
    mounted: function () {
    },
    components: {}
});
module.exports = comm;