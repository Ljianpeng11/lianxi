var template = require('./userServiceInvokeCountStats.html');
var serviceHelper = require('services/serviceHelper.js');
//默认（最简）功能基类
var defaultBase = require('modules/common/defaultBase');

var echarts = require('echarts');
var moment = require('moment');

module.exports = defaultBase.extend({
    template: template,
    data: function () {
        return {
            //查询条件，发生时间
            queryOperDate: "",
            //全部用户对象
            users: [],
            //查询条件，用户
            queryUser: null,
            //echart控件
            chart: null,
        }
    },
    mounted: function () {
        //初始化
        this.initForm();
    },
    methods: {
        //初始化
        initForm: function () {
            //初始化查询条件的时间范围，设为当前月1号至最后一天
            var dateStart = moment();
            dateStart.set('date', 1);

            var dateEnd = moment();
            dateEnd = dateEnd.set('date', 1).add(1, 'months').add(-1, 'days');

            this.queryOperDate = [
                dateStart.toDate(),
                dateEnd.toDate()
            ];

            var formData = serviceHelper.getDefaultAjaxParam();

            serviceHelper.getJson(serviceHelper.getBasicPath() + "/sysUser/getAllEntites", formData, function (result) {
                //获取所有用户
                this.users = result;
            }.bind(this));
        },
        //统计
        submit: function () {
            if (!this.queryOperDate || !this.queryOperDate[0] || !this.queryOperDate[1]) {
                layer.msg('请选择时间');
                return;
            }

            if (!this.queryUser || this.queryUser.length === 0) {
                layer.msg('请选择用户');
                return;
            }

            //echart控件初始化
            if (!this.chart) {
                this.chart = echarts.init($('#chart1', $("#" + this.mainContentDivId))[0]);
            }

            var formData = serviceHelper.getDefaultAjaxParam();
            formData.dateStart = moment(this.queryOperDate[0]).format("YYYY-MM-DD");
            formData.dateEnd = moment(this.queryOperDate[1]).format("YYYY-MM-DD");
            formData.userIds = JSON.stringify(this.queryUser);

            serviceHelper.getJson(serviceHelper.getBasicPath() + "/seService/userServiceInvokeCountStats", formData, function (result) {
                //服务名称
                var serviceNames = result.serviceNames;
                //按用户分组统计信息
                var users = result.users;

                var userNames = [];
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    userNames.push(user.name);

                    //series补充type属性
                    user.type = "bar";
                }

                // 指定图表的配置项和数据
                var option = {
                    /*  title: {
                     text: 'ECharts 入门示例'
                     },*/
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: userNames
                    },
                    xAxis: [{
                        type: 'category',
                        data: serviceNames
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '调用次数',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }],
                    series: users
                };

                //刷新图表数据
                this.chart.setOption(option);
            }.bind(this));
        }
    }
});
