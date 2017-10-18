var template = require('./date-control.html');
//var laydate = require('laydate');
var moment = require('moment');
var startDateOption = {
    elem: '#start',
    format: 'YYYY-MM-DD',
    max: moment().format('YYYY-MM-DD', new Date()),
    start: moment().format('YYYY-MM-DD', new Date()),
    istoday: false,
    isclear: false,
    issure: false
};
var endDateOption = {
    elem: '#end',
    format: 'YYYY-MM-DD',
    istoday: false,
    isclear: false,
    issure: false,
    max: moment().format('YYYY-MM-DD', new Date()),
    start: moment().format('YYYY-MM-DD', new Date())
};
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            message: '',
            currentPeroid: '',
            isDateInvalid:false,
            queryStartDate:moment().subtract(7, 'days').format('YYYY-MM-DD', new Date()),
            queryEndDate:moment().format('YYYY-MM-DD', new Date()),
            options: [{
                value: '天',
                label: '天'
            }, {
                value: '周',
                label: '周'
            }, {
                value: '月',
                label: '月'
            }, {
                value: '季度',
                label: '季度'
            }],
            value: ''
        }
    },
    mounted: function () {

    },
    methods: {
        checkStartDate:function (date) {
            this.queryStartDate = date;
            if (!!this.queryEndDate && !!this.queryStartDate && !moment(this.queryStartDate).isBefore(this.queryEndDate)) {
                   this.isDateInvalid = true;
            }
        },
        checkEndDate:function (date) {
            this.queryEndDate = date;
            if (!!this.queryEndDate && !!this.queryStartDate && !moment(this.queryStartDate).isBefore(this.queryEndDate)) {
                this.isDateInvalid = true;
            }
        },
        start: function () {
            startDateOption.choose = this.checkStartDate;
           // window.laydate(startDateOption);
        },
        end: function () {
            endDateOption.choose = this.checkEndDate;
          //  window.laydate(endDateOption);
        },
        reset: function () {
           // window.laydate.reset();
        },
        query: function () {
            var startDate, endDate;
            if (this.currentPeroid === 'day') {
                endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
                startDate = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
            }
            else if (this.currentPeroid === 'week') {
                endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
                startDate = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
            } else if (this.currentPeroid === 'month') {
                endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
                startDate = moment().subtract(31, 'days').format('YYYY-MM-DD HH:mm:ss');
            } else {
                endDate = moment().format('YYYY-MM-DD HH:mm:ss', new Date());
                startDate = moment().subtract(90, 'days').format('YYYY-MM-DD HH:mm:ss');

            }
            this.$parent.$emit('query-history', {
                startDate: startDate,
                endDate: endDate
            });
        },
        queryByDefaultDate: function () {
            this.currentPeroid = 'day';
            this.query();
        },
        changeValue:function(value){
            if(value === '天'){
                this.currentPeroid='day'
            }else if(value === '周'){
                this.currentPeroid='week'
            }else if(value === '月'){
                this.currentPeroid='month'
            }else if(value === '季度'){
                this.currentPeroid='quater'
            }
        }
    }
});
module.exports = comm;
