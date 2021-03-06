var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

var iotController = require('controllers/iotController.js');
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
            if(row.deviceState==0)
                return "greenFont";
            else if (row.deviceState==1)
                return "yellowFont";
            else if (row.deviceState==2)
                return "redFont";
            else if (row.deviceState==3)
                return "purpleFont";
            return "";
        },
        deviceStateStrFormat:function(row, column, cellValue){
            //var className = this.checkOutWaterLevelCss(row);
            return this.$createElement('div', {class:"yellowFont"},row.deviceStateStr);
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