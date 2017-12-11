var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            tableData:[{
                facilityId:17020117,
                name:"普吉路与小路沟交叉口",
                newDataTime:"2017-12-07 13:49",
                newCommTime:"刚刚",
                batteryRemain:99,
                workDays:175,
                waterLevel:0,
                overflowRisk:"0%"
            },{
                facilityId:17020133,
                name:"小路沟溢流堰",
                newDataTime:"2017-12-07 13:49",
                newCommTime:"刚刚",
                batteryRemain:99,
                workDays:177,
                waterLevel:0.092,
                overflowRisk:"3%"
            }]
        }
    },
    methods: {
        flowVolFormat:function(row, column, cellValue){
            if(row.flowVol){
                return row.flowVol;
            } else {
                return "-";
            }
        },
        flowSpeedFormat:function(row, column, cellValue){
            if(row.flowSpeed){
                return row.flowSpeed;
            } else {
                return "-";
            }
        },
        suspendMatterFormat:function(row, column, cellValue){
            if(row.suspendMatter){
                return row.suspendMatter;
            } else {
                return "-";
            }
        },
        doFormat:function(row, column, cellValue){
            if(row.do){
                return row.do;
            } else {
                return "-";
            }
        },
        temperatureFormat:function(row, column, cellValue){
            if(row.temperature){
                return row.temperature;
            } else {
                return "-";
            }
        },
        humidityFormat:function(row, column, cellValue){
            if(row.humidity){
                return row.humidity;
            } else {
                return "-";
            }
        },
        waterLevelFormat:function(row, column, cellValue){
            debugger;
            this.$createElement('div', [
            ])
            return "<br/>"+row.waterLevel;
        },
    },
    mounted: function () {
    },
    components: {

    }
});
module.exports = comm;