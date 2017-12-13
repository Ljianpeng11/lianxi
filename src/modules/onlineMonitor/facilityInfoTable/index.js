var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

var iotController = require('controllers/iocController.js');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            tableData:[]
        }
    },
    methods: {
        waterTrafficFormat:function(row, column, cellValue){
            if(row.waterTraffic){
                return row.waterTraffic;
            } else {
                return "-";
            }
        },
        waterSpeedFormat:function(row, column, cellValue){
            if(row.waterSpeed){
                return row.waterSpeed;
            } else {
                return "-";
            }
        },
        solidsFormat:function(row, column, cellValue){
            if(row.solids){
                return row.solids;
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
        dValueFormat:function(row, column, cellValue){
            var className = this.checkOutdValueCss(row);
            return this.$createElement('div', {class:className},row.dValue);
        },
        checkOutdValueCss:function(row){
            if(row.isAlarm&&row.isOffLine)
                return "redFont";
            else if (row.isAlarm==true||row.isOffLine==true)
                return "yellowFont";
            else if (row.isAlarm==false||row.isOffLine==false)
                return "greenFont";
            return "";
        },
        statusFormat:function(row, column, cellValue){
            //var className = this.checkOutWaterLevelCss(row);
            var contentText = this.checkOutStatusText(row);
            return this.$createElement('div', {class:"yellowFont"},contentText);
        },
        checkOutStatusText:function(row){
            var statusArry = [];
            if (row.isAlarm==true)
                statusArry.push("液位预警");
            if (row.isOffLine==true)
                statusArry.push("通讯中断");
            return statusArry.join("-");
        },
    },
    mounted: function () {
        iotController.geIotFacilityInfo(function (data) {
            this.tableData = data.records;
        }.bind(this));
    },
    components: {

    }
});
module.exports = comm;