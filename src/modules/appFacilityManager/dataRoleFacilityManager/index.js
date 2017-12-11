//引用组件或视图

//此功能对应的视图（html）
var template = require('./dataRoleFacilityManager.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var comm = crudBase.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            containerFacility: null,
        }
    },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                    //所有数据角色
                    dataRoles: [],
                    //所有设备类型
                    facilityTypes: [],
                    //数据角色
                    dataRole: [],
                    //设备类型
                    facilityType: [],
                }
            },
            methods: {
                //初始化表单
                initForm: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/dataRoleFacilityRlt/getInitFormValue", formData, function (result) {
                        //动态select项demo
                        this.dataRoles = result.dataRoles;
                        this.facilityTypes = result.facilityTypes;
                    }.bind(this));
                },
                //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
                initToolbarQueryParam: function () {
                    this.toolbarQueryParam = {};
                    this.dataRole = "";
                    this.facilityType = "";
                },
                //获取自定义查询条件
                getCustomQueryParam: function () {
                    //返回结果的类型是object
                    var formData = {};
                    formData.dataRole = this.dataRole;
                    formData.facilityType = this.facilityType;
                    return formData;
                },
                //新增
                add: function () {
                    this.vm.showFacilityList();
                },
            }
        });

        this.containerFacility = new container({
            data: function () {
                return {
                    //测站类型下拉框所有值
                    facilityTypeIds: [],
                    //选择的测站类型
                    lstFacilityTypeId: [],
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                    showList: false,
                    //列表id，同一页面如果有多个实体列表需要修改
                    tableId: "tableFacility",
                    //数据角色
                    dataRole: [],
                }
            },
            methods: {
                //初始化表单
                initForm: function () {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/getInitFormValue",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;
                                    //测站类型下拉框所有值
                                    this.facilityTypeIds = result.facilityTypeIds;

                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
                initToolbarQueryParam: function () {
                    this.toolbarQueryParam = {};
                    this.lstFacilityTypeId = [];
                },
                //刷新录入表单后的回调
                afterRefreshFormHandler: function () {
                    // this.refreshFileUpload("inputUploadPic", "Facility");
                    //触发测站类型下拉框change事件
                    // this.facilityTypeIdChange();
                },
                //获取自定义查询条件
                getCustomQueryParam: function () {
                    //返回结果的类型是object
                    var formData = {};
                    //可以通过如下方式添加任意值
                    formData.lstFacilityTypeId = this.lstFacilityTypeId ? this.lstFacilityTypeId.toString() : "";

                    return formData;
                },
                //选择测站
                selectFacility: function () {
                    if (!this.dataRole) {
                        layer.msg("请选择数据角色");
                        return;
                    }

                    var rows = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getSelections");
                    //测站id
                    var ids = rows.map(t => t.id);
                    //测站类型id
                    var facilityTypeIds = rows.map(t => t.facilityTypeIdValue);

                    var formData = serviceHelper.getDefaultAjaxParam();
                    formData.dataRoleId = this.dataRole;
                    formData.facilityIds = window.JSON.stringify(ids);
                    formData.facilityTypeIds = window.JSON.stringify(facilityTypeIds);

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/dataRoleFacilityRlt/selectFacility", formData, function (result) {
                        this.vm.backFacilityList();
                        this.vm.containerMain.refreshList();
                    }.bind(this));
                }
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/dataRoleFacilityRlt", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'dataRoleName',
            title: '数据角色名称'
        }, {
            field: 'facilityName',
            title: '测站名称'
        }, {
            field: 'facilityTypeName',
            title: '测站类型'
        }, {
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                'click .delete': function (e, value, row, index) {
                    //删除（一条）
                    this.deleteOne(row.id);
                }.bind(this.containerMain)
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    '<a class="delete" href="javascript:;" title="删除">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            }
        }]);

        this.containerMain.initForm();

        //刷新列表
        this.containerMain.refreshList();

        this.containerFacility.init(this, "/facility", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'facilityTypeId',
            title: '测站类型'
        }, {
            field: 'createDate',
            title: '创建日期'
        }]);

        this.containerFacility.initForm();
    },
    methods: {
        showFacilityList: function (e, value, row, index) {
            this.containerMain.showList = false;
            this.containerFacility.showList = true;

            this.containerFacility.refreshList();
        },
        backFacilityList: function () {
            this.containerFacility.showList = false;
            this.containerMain.showList = true;
        },
    }
});

module.exports = comm;