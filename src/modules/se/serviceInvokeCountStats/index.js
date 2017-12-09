var template = require('./serviceInvokeCountStats.html');
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
            //全部服务对象
            services: [],
            //查询条件，服务
            queryService: null,
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

            serviceHelper.getJson(serviceHelper.getBasicPath() + "/seService/getAllSeServices", formData, function (result) {
                //获取所有服务
                this.services = result;
            }.bind(this));
        },
        //统计
        submit: function () {
            if (!this.queryOperDate || !this.queryOperDate[0] || !this.queryOperDate[1]) {
                layer.msg('请选择时间');
                return;
            }

            if (!this.queryService || this.queryService.length === 0) {
                layer.msg('请选择服务');
                return;
            }

            //echart控件初始化
            if (!this.chart) {
                this.chart = echarts.init($('#chart1', $("#" + this.mainContentDivId))[0]);
            }

            var formData = serviceHelper.getDefaultAjaxParam();
            formData.dateStart = moment(this.queryOperDate[0]).format("YYYY-MM-DD");
            formData.dateEnd = moment(this.queryOperDate[1]).format("YYYY-MM-DD");
            formData.serviceIds = JSON.stringify(this.queryService);

            serviceHelper.getJson(serviceHelper.getBasicPath() + "/seService/getServiceInvokeCountStats", formData, function (result) {
                //x轴数据
                var xValues = [];
                //y轴数据
                var yValues = [];
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    //服务名称
                    xValues.push(row.serviceName);
                    //调用次数
                    yValues.push(row.count);
                }

                // 指定图表的配置项和数据
                var option = {
                    /*  title: {
                     text: 'ECharts 入门示例'
                     },*/
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    legend: {
                        data: ['调用次数']
                    },
                    xAxis: {
                        data: xValues,
                        //鼠标移到图表内容每条x轴的效果
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    yAxis: [{
                        type: 'value',
                        name: '调用次数',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }],
                    series: [{
                        name: '调用次数',
                        type: 'bar',
                        data: yValues
                    }]
                };

                //刷新图表数据
                this.chart.setOption(option);
            }.bind(this));
        }
    }
});
