var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');
var moment = require('moment');

//加载组件
var chartLib = require('modules/onlineMonitor/chartLib');

// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            openRainPollution:false,
            showToggle:false,
            pageSize:100,
            currentPage:1,
            connectArr:[
                {
                    id:'GQYW11',
                    location:'高苑路',
                    questionType:'排放不明'
                },{
                    id:'GQYW11',
                    location:'高苑路',
                    questionType:'流向混乱'
                },{
                    id:'GQYW11',
                    location:'高苑路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'高苑路',
                    questionType:'污水直排'
                },{
                    id:'GQYW11',
                    location:'高苑路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'高苑路',
                    questionType:'数据不全'
                },{
                    id:'GQYW01',
                    location:'邦德路',
                    questionType:'排放不明'
                },{
                    id:'GQYW02',
                    location:'邦德路',
                    questionType:'流向混乱'
                },{
                    id:'GQYW03',
                    location:'邦德路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW04',
                    location:'邦德路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW05',
                    location:'邦德路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW06',
                    location:'北一路',
                    questionType:'排放不明'
                },{
                    id:'GQYW07',
                    location:'北一路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW08',
                    location:'北一路',
                    questionType:'污水直排'
                },{
                    id:'GQYW09',
                    location:'东环路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW10',
                    location:'东环路',
                    questionType:'流向混乱'
                },{
                    id:'GQYW11',
                    location:'东环路',
                    questionType:'污水直排'
                },{
                    id:'GQYW11',
                    location:'东环路',
                    questionType:'污水直排'
                },{
                    id:'GQYW11',
                    location:'东环路',
                    questionType:'雨污混接'
                },{
                    id:'GQYW11',
                    location:'东环路',
                    questionType:'数据不全'
                }
            ],
            pieChartOptions: {
                type: 'pieChart',
                color: ['#4f9b0c', '#f5c761', '#fe5240'],
                text: '雨污混接改造分类统计',
                data: [
                    {value: 55.17, name: '雨污分流'},
                    {value: 3.32, name: '雨污合流但具备分流条件'},
                    {value: 41.51, name: '不具备分流条件'}
                ]
            },
            barChartOptions: {
                    type: 'categoryBarChart',
                    title: '问题分类统计',
                    color: [
                        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                    ],
                    xData: ['高苑路', '北一路', '东环路', '邦德路'],
                    seriesData: [
                        {
                            name: '排放不明',
                            data: [1, 1, 0, 2]
                        },
                        {
                            name: '流向混乱',
                            data: [1, 0, 1, 1]
                        },
                        {
                            name: '雨污混接',
                            data: [1, 0, 0, 1]
                        },
                        {
                            name: '污水直排',
                            data: [0, 1, 2, 1]
                        },
                        {
                            name: '数据不全',
                            data: [2, 1, 3, 1]
                        },
                    ]
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
        openMonitorPipe:function(){
            var point = mapHelper.createPoint(117.8683719917964,37.167425970805766);
            this.baseView.popup.location = point;
            this.baseView.popup.content = "<div style=\"text-align: left;\"><p>问题类型：【排放不明】</p><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>";
            this.baseView.popup.visible = true;
            mapHelper.setCenter(this.baseView,117.87014423725806,37.16757634314801,16);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        formatter(row, column) {
            return row.id;
        },
        filterTag(value, row) {
            if(!!row.location){
                return row.location === value;
            }else{
                return row.questionType === value;
            }

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