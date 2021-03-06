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
                    id:'GQYW1',
                    location:'高苑路',
                    questionType:'排放不明',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW2',
                    location:'高苑路',
                    questionType:'流向混乱',
                    x:117.84033321300572,
                    y:37.165335315080874,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW3',
                    location:'高苑路',
                    questionType:'雨污混接',
                    x:117.8187655227783,
                    y:37.16387992562512,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW4',
                    location:'高苑路',
                    questionType:'污水直排',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：污水直排。</p><p>解决建议：需核查污水去向；核查井：WS8013023803927</p></div>"
                },{
                    id:'GQYW5',
                    location:'高苑路',
                    questionType:'雨污混接',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW6',
                    location:'高苑路',
                    questionType:'数据不全',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW7',
                    location:'邦德路',
                    questionType:'排放不明',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW8',
                    location:'邦德路',
                    questionType:'流向混乱',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW9',
                    location:'邦德路',
                    questionType:'雨污混接',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW10',
                    location:'邦德路',
                    questionType:'雨污混接',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW11',
                    location:'邦德路',
                    questionType:'雨污混接',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW12',
                    location:'北一路',
                    questionType:'排放不明',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW13',
                    location:'北一路',
                    questionType:'雨污混接',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW14',
                    location:'北一路',
                    questionType:'污水直排',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW15',
                    location:'东环路',
                    questionType:'雨污混接',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW16',
                    location:'东环路',
                    questionType:'流向混乱',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW17',
                    location:'东环路',
                    questionType:'污水直排',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW18',
                    location:'东环路',
                    questionType:'污水直排',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW19',
                    location:'东环路',
                    questionType:'雨污混接',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                },{
                    id:'GQYW20',
                    location:'东环路',
                    questionType:'数据不全',
                    x:117.8683719917964,
                    y:37.167425970805766,
                    popupContent : "<div style=\"text-align: left;\"><p>问题详情：不知污水排放去向。</p><p>解决建议：需核查污水去向；补充污水管线。核查井：WS8013023803925</p></div>"
                }
            ],
            pieChartOptions: {
                type: 'pieInnerChart',
                color: ['#4f9b0c', '#FFA500', '#fe5240'],
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

            this.$parent.rainSewageLayer.visible = false;
            this.openRainPollution = false;
        },
        openMonitorPipe:function(row, event, column){
            var point = mapHelper.createPoint(row.x,row.y);
            this.baseView.popup.class="gaoqingPopup2";
            this.baseView.popup.location = point;
            this.baseView.popup.title= "问题类型:【"+row.questionType+"】";
            this.baseView.popup.content = row.popupContent;
            this.baseView.popup.visible = true;
            mapHelper.setCenter(this.baseView,row.x,row.y,18);
        },
        handleSizeChange:function(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange:function(val) {
            console.log(`当前页: ${val}`);
        },
        formatter:function(row, column) {
            return row.id;
        },
        filterTag:function(value, row) {
            if(!!row.location){
                return row.location === value;
            }else{
                return row.questionType === value;
            }

        }
    },
    mounted: function () {
    },
    components: {
        'chart-lib':chartLib
    }
});
module.exports = comm;