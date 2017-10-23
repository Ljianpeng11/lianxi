//引用组件或视图

//此功能对应的视图（html）
var template = require('./iotPlatformDevice.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var comm = crudBase.extend({
    //设置模板
    template: template,
    // data: function () {
    //     return {}
    // },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                    //是否分页
                    // pagination: false,
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                }
            },
            methods: {
                //刷新列表
                refreshList: function (pageNumber, pageSize) {
                    //获取分页信息（分为外部传入和使用当前分页信息）
                    //获取分页信息（分为外部传入和使用当前分页信息）
                    pageNumber = pageNumber || $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getOptions").pageNumber;
                    pageSize = pageSize || $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getOptions").pageSize;

                    //查询条件
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    //分页
                    formData.pageNumber = pageNumber;
                    formData.pageSize = pageSize;
                    formData.r = Math.random();

                    //加上工具条（界面）查询条件
                    if (this.toolbarQueryParam)
                        $.extend(formData, this.toolbarQueryParam);

                    //加上自定义查询条件
                    var queryParam = this.getCustomQueryParam();
                    if (queryParam)
                        $.extend(formData, queryParam);

                    //往后台查询数据
                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + "/iotDevice/getRegisterDevices",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;
                                    //填充数据到grid

                                    //按bootstrap table要求的格式组织数据，并加载数据到table
                                    var tableData = {};
                                    tableData.total = result.totalRecord;
                                    tableData.rows = result.records;

                                    $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("load", tableData);

                                    //触发刷新列表后的回调
                                    if (this.afterRefreshListHandler)
                                        this.afterRefreshListHandler();
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                deleteRegisterDevice: function (e, value, row, index) {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();
                    formData.iotDeviceId = row.deviceId;

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/deleteRegisterDevice",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;
                                    //取消注册后重新刷新列表
                                    this.refreshList();
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                }
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/iotDevice", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'deviceId',
            title: 'deviceId'
        }, {
            field: 'gatewayId',
            title: 'gatewayId'
        }, {
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                //事件字符串格式：click .+a的class名称
                'click .deleteRegisterDevice': function (e, value, row, index) {
                    //编辑
                    this.deleteRegisterDevice(e, value, row, index);
                }.bind(this.containerMain),
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    //格式：一个功能是一个a，class必填因为跟点击事件有关
                    '<a class="deleteRegisterDevice" href="javascript:;" title="">',
                    '取消注册',
                    '</a>  ',
                ].join('');
            }
        }]);

        //刷新列表
        this.containerMain.refreshList();
    },
    methods: {}
});

module.exports = comm;