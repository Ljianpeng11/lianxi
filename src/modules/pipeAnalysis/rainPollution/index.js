var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');

//加载组件
var chartLib = require('modules/onlineMonitor/chartLib');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            openRainPollution:false,
            showToggle:false,
            pageSize:100,
            currentPage:1,
            connectArr:[
                {
                    id:'GQYW01',
                    location:'芦湖路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW02',
                    location:'芦湖路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW03',
                    location:'芦湖路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW04',
                    location:'青城路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW05',
                    location:'青城路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW06',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW07',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW08',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW09',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW10',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'黄河路',
                    questionType:'雨污混接'
                }
            ],
            pieChartOptions:{
                type:'pieChart',
                color:['#4f9b0c','#f5c761','#fe5240'],
                text:'雨污混接改造分类统计',
                data: [
                    {value:1, name:'正常'},
                    {value:2, name:'预警'},
                    {value:3, name:'报警'}
                ]
            },
            lineChartOptions:{
                type:'normalBarChart',
                title:'问题分类统计',
                xData:['雨污混接','雨污合流','爆管'],
                yData:[10,4,6]
            }
        }
    },
    created:function(){

    },
    methods: {
        init:function(){
            this.openRainPollution = true;
        },
        togglePollutionBox:function(){
            this.openRainPollution = false;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }
    }
    ,
    mounted: function () {

    },
    components: {
        'chart-lib':chartLib
    }
});
module.exports = comm;