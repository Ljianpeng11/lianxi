var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var moment = require('moment');

//加载图表组件
var chartLib = require('modules/onlineMonitor/chartLib');

//雨量数据
var xData = [],yData1 = [],yData2 = [],tableData = [];
var data1 = [Math.random() *60];
var data2 = [Math.random() *2];
var time;
for(var i = 0;i<12;i++){
    time = moment().subtract(i,'h').format('YYYY-MM-DD hh:ss');
    xData[(11 - i)] = time;
    yData1.push(((Math.random() - 0.4) + data2[data2.length - 1]).toFixed(2));
    yData2.push(((Math.random() - 0.4) * 10 + data1[data1.length - 1]).toFixed(2));
}

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            districtOption:{
                value:'',
                options: [{
                    value: '芦湖街道',
                    label: '芦湖街道'
                }, {
                    value: '田镇街道',
                    label: '田镇街道'
                }]
            },
            YLDistrictOption:{
                value:'五华区雨量公众监测点',
                options: [{
                    value: '五华区雨量公众监测点',
                    label: '五华区雨量公众监测点'
                }, {
                    value: '市体育馆',
                    label: '市体育馆'
                }]
            },
            typeOption:{
                options: [{
                    value: '五华区雨量公众监测点',
                    label: '五华区雨量公众监测点'
                }, {
                    value: '市体育馆',
                    label: '市体育馆'
                }]
            },
            chartOptions1:{
                type:'pieChart',
                color:['#4f9b0c','#f5c761','#fe5240'],
                subtext:'设备运行情况',
                data: [
                    {value:65, name:'正常'},
                    {value:15, name:'预警'},
                    {value:20, name:'报警'}
                ]
            },
            chartOptions2:{
                type:'pieChart',
                color:['#2f91e4','#fe5240'],
                subtext:'设备在线情况',
                data: [
                    {value:80, name:'在线'},
                    {value:20, name:'断线'}
                ]
            },
            chartOptions3:{
                type:'YLChart',
                xData:xData,
                yData1:yData1,
                yData2:yData2
            },
            tableData:[
                {
                    district:'五华区雨量公众监测点',
                    measureNum:'0',
                    currentNum:'0',
                    alarmNum:'0',
                    date:moment(new Date()).subtract(Math.floor(Math.random()*10),'h').format("YYYY-MM-DD hh:ss")
                }
            ],
            alarmTableData:[
                {
                    name:'五华区雨量公众监测点',
                    status:0
                },{
                    name:'市体育馆',
                    status:1
                },{
                    name:'普吉路与小路沟交叉口',
                    status:2
                },{
                    name:'滇缅大道戛纳小镇旁',
                    status:0
                },{
                    name:'海源学院正门口',
                    status:0
                },{
                    name:'西二环春苑小区对面',
                    status:0
                }
            ],
            collectList:[
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
                },{
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
                }
            ]
        }
    },
    created:function(){

    },
    methods: {
        bindRowClass:function(row,index){
            if(row.status === 1){
                return 'warningStatus';
            }else if(row.status === 2){
                return 'alarmStatus';
            }
        },
        openDetail:function(index,item){

        },
        deleteCollectItem:function(index,item){

        }
    },
    mounted: function () {

    },
    components: {
        'chart-lib':chartLib
    }
});
module.exports = comm;