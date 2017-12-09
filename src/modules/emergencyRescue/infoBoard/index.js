var template = require('./infoBoard.html');
var myScrollUtil = require('lib/myScroll/myScroll.js');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            items:[{
                name:"蓝色暴雨预警",
                type:1,
                time:"2017-12-18 12:12:12"
            },{
                name:"橙色暴雨预警",
                type:1,
                time:"2017-12-18 13:13:13"
            },{
                name:"田镇镇抢险队伍已出动",
                type:2,
                time:"2017-12-18 14:14:14"
            },{
                name:"青城镇抢险队伍已出动",
                type:2,
                time:"2017-12-18 12:12:12"
            },{
                name:"高城镇抢险队伍已出动",
                type:2,
                time:"2017-12-18 12:12:12"
            },{
                name:"花沟镇抢险队伍已出动",
                type:2,
                time:"2017-12-18 12:12:12"
            },{
                name:"唐坊镇抢险队伍已出动",
                type:2,
                time:"2017-12-18 12:12:12"
            }]
        }
    },
    methods: {

    },
    mounted:function(){
        myScrollUtil.myScroll(".infoBoard #allItem",{
            speed:100, //数值越大，速度越慢
            rowHeight:20 //li的高度
        });
    },
    components: {}
});
module.exports = comm;