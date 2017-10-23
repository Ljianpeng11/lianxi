//此功能对应的视图（html）
var template = require('./containerDeviceCommands.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var comm = container.extend({
    template: template,

    data: function () {
        return {
            vm: null,
            //列表id，同一页面如果有多个实体列表需要修改
            tableId: "tableDeviceCommands",
            //当前iot监测项类型id
            currentIotDeviceId: 0,
            //控制列表是否显示（此属性在容器基类），子表默认不显示
            showList: false,
            //上一级列表的容器（用于返回）
            lastContainer: null,
            //屏蔽默认操作列
            addDefaultOperateColumn: false,
        }
    },
    methods: {
        getCustomQueryParam: function () {
            var formData = {};
            //查询前把当前主表id传到后台，列表查询用到
            formData.iotDeviceId = this.currentIotDeviceId;

            return formData;
        },
        getCustomSaveValue: function () {
            var formData = {};
            //保存前把当前主表id传到后台，保存时用到
            formData.iotDeviceId = this.currentIotDeviceId;

            return formData;
        },
        //返回上一列表
        backToLastList: function () {
            //把上一列表显示
            this.lastContainer.showList = true;
            //隐藏当前列表
            this.showList = false;
        },
        //初始化容器
        initContainer: function (vm) {
            this.init(vm, "/iotDevice", [{
                field: 'commandId',
                title: '设备命令ID'
            }, {
                field: 'status',
                title: '设备命令状态'
            }, {
                field: 'serviceId',
                title: '命令服务ID',
            }, {
                field: 'method',
                title: '具体命令名称/服务属性',
            }, {
                field: 'paras',
                title: '命令参数',
            }, {
                field: 'creationTime',
                title: '设备命令创建时间',
            }, {
                field: 'callbackUrl',
                title: '命令状态变化通知地址',
            }]);
        },
        refreshList: function (vm, pageSize) {
            if (this.vm == null) this.vm = vm;

            //获取分页信息（使用当前分页信息）
            //获取分页信息（使用当前分页信息）
            pageNumber = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getOptions").pageNumber;
            pageSize = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getOptions").pageSize;

            //查询条件
            var formData = {};
            formData.token = serviceHelper.getToken();
            //分页
            formData.pageNumber = pageNumber;
            formData.pageSize = pageSize;
            formData.r = Math.random();
            formData.iotDeviceId = this.currentIotDeviceId;

            //加上自定义查询条件
            var queryParam = this.getCustomQueryParam();
            if (queryParam)
                $.extend(formData, queryParam);

            $.ajax({
                type: "get",
                dataType: "json",
                url: serviceHelper.getBasicPath() + this.controllerUrl + "/getDeviceCommands",
                data: formData,
                success: function (ajaxResult) {
                    if (ajaxResult) {
                        if (ajaxResult.success == true) {
                            var result = ajaxResult.data;
                            // //消息太长，输出到console方便看
                            //
                            // console.log(result);

                            var tableData = {};
                            tableData.total = result.totalRecord;
                            tableData.rows = result.records;

                        } else {
                            //后台操作失败的代码
                            var tableData = {};
                            tableData.total = 0;
                            tableData.rows = {};
                            alert(ajaxResult.msg);
                        }
                        $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("load", tableData);
                        this.showList = true;
                    }
                }.bind(this)
            });
        }
    }
})

module.exports = comm;

