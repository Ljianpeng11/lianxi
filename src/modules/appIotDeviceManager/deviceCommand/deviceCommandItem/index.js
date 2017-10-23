//此功能对应的视图（html）
var template = require('./deviceCommandItem.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var comm = container.extend({
    template: template,

    data: function () {
        return {
            //列表id，同一页面如果有多个实体列表需要修改
            tableId: "tableDeviceCommandItem",
            //表单（弹窗）id，同一页面如果有多个实体列表需要修改
            formId: "formDeviceCommandItem",
            //当前deviceCommand的id
            currentDeviceCommandId: 0,
            //控制列表是否显示（此属性在容器基类），子表默认不显示
            showList: false,
            //上一级列表的容器（用于返回）
            lastContainer: null,
            //是否能编辑（影响编辑功能，例如双击编辑功能）
            canEdit: false,
            commandAddressItem:[],
            deviceCommandName : "",
            deviceCommandimsi : "",
            //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
            addDefaultOperateColumn: false,
        }
    },
    methods: {
        getCustomQueryParam: function () {
            var formData = {};
            //查询前把当前主表id传到后台，列表查询用到
            formData.deviceCommandId = this.currentDeviceCommandId;

            return formData;
        },
        getCustomSaveValue: function () {
            var formData = {};
            //保存前把当前主表id传到后台，保存时用到
            formData.deviceCommandId = this.currentDeviceCommandId;

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

            //获取所有的数据字典
            var formData = {};
            formData.token = serviceHelper.getToken();
            formData.r = Math.random();

            $.ajax({
                type: "get",
                dataType: "json",
                url: serviceHelper.getBasicPath() + "/deviceCommandItem/getAllDictItem",
                data: formData,
                success: function (ajaxResult) {
                    if (ajaxResult) {
                        if (ajaxResult.success == true) {
                            var result = ajaxResult.data;

                            this.commandAddressItem = result.commandAddressItem;
                        } else {
                            //后台操作失败的代码
                            alert(ajaxResult.msg);
                        }
                    }
                }.bind(this)
            });

            this.init(vm, "/deviceCommandItem", [{
                //checkbox列，用于勾选多选行
                field: 'state',
                checkbox: 'true'
            },{
                field: 'name',
                title: '命令'
            }, {
                field: 'value',
                title: '值'
            }]);
        },
        //显示上传窗口
        showFormUploadFromProfile: function () {

        },

        closeNRefresh: function () {
            this.refreshList();
        },

    }
})

module.exports = comm;