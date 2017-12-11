var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            isOpenList:false,
            deviceList:[
                {
                    title:'五华区公众雨量监测点',
                    status:0,
                    voltage:'low',
                    signal:'on',
                    type:'RF',
                    deviceCode:'17120011',
                    deviceNum:0,
                    onlineTime:'2',
                    collect:0,
                    x:117.8216341936,
                    y:37.1701173675
                },
                {
                    title:'市体育馆',
                    status:1,
                    voltage:'middle',
                    signal:'off',
                    type:'WD',
                    deviceCode:'16310128',
                    deviceNum:'2.506',
                    onlineTime:'2',
                    collect:0,
                    x:117.8563419346,
                    y:37.1701172675
                },
                {
                    title:'普吉路与小路沟交叉口',
                    status:2,
                    voltage:'high',
                    signal:'on',
                    type:'WD',
                    deviceCode:'17120011',
                    deviceNum:'4.582',
                    onlineTime:'2',
                    collect:1,
                    x:117.8143419346,
                    y:37.1603759513
                },
                {
                    title:'滇缅大道戛纳小镇旁',
                    status:3,
                    voltage:'middle',
                    signal:'off',
                    type:'WD',
                    deviceCode:'16310128',
                    deviceNum:'1.964',
                    onlineTime:'2',
                    collect:1,
                    x:117.8200419346,
                    y:37.1706172675
                },
                {
                    title:'海源学院正门口',
                    status:3,
                    voltage:'middle',
                    signal:'off',
                    type:'WD',
                    deviceCode:'16310128',
                    deviceNum:'1.964',
                    onlineTime:'2',
                    collect:0,
                    x:1,
                    y:2
                },
                {
                    title:'西二环春苑小区对面',
                    status:3,
                    voltage:'middle',
                    signal:'off',
                    type:'WD',
                    deviceCode:'16310128',
                    deviceNum:'1.964',
                    onlineTime:'2',
                    collect:0,
                    x:1,
                    y:2
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
        },
        openMapWindow:function(facilityItem){
            /*var content = item.fieldNames[10]+":"+item.fieldValues[10]+"<br/>"+item.fieldNames[11]+":"+item.fieldValues[11]+"<br/>"+item.fieldNames[10]+":"+item.fieldValues[11];
            this.baseView.popup.open({
                location: mapPoint,
                title: item.value,
                content: content
            });*/
            debugger;
            mapHelper.setCenter(this.baseView,facilityItem.x,facilityItem.y,16);
        }
    },
    mounted: function () {
    },
    components: {}
});
module.exports = comm;