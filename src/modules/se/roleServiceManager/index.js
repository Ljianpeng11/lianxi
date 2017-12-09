//引用组件或视图

//此功能对应的视图（html）
var template = require('./roleServiceManager.html');
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
            containerSeServiceRoleRlt: null,
            containerService: null,
        }
    },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                }
            },
            methods: {
                //初始化表单
                initForm: function () {

                },
            }
        });

        //容器（角色与服务关联）
        this.containerSeServiceRoleRlt = new container({
            data: function () {
                return {
                    //列表id，同一页面如果有多个实体列表需要修改
                    tableId: "tableSeServiceRoleRlt",
                    //表单（弹窗）id，同一页面如果有多个实体列表需要修改
                    // formId: "formMember",
                    //当前角色id（主表id）
                    roleId: 0,
                    //控制列表是否显示（此属性在容器基类），子表默认不显示
                    showList: false,
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                }
            },
            methods: {
                getCustomQueryParam: function () {
                    var formData = {};
                    //查询前把当前主表id传到后台，列表查询用到
                    formData.roleId = this.roleId;

                    return formData;
                },
                getCustomSaveValue: function () {
                    var formData = {};
                    //保存前把当前主表id传到后台，保存时用到
                    formData.roleId = this.roleId;

                    return formData;
                },
                //选择服务
                selectService: function () {
                    this.vm.showServiceList();
                }
            }
        });

        //容器（服务列表）
        this.containerService = new container({
            data: function () {
                return {
                    //列表id，同一页面如果有多个实体列表需要修改
                    tableId: "tableService",
                    //控制列表是否显示（此属性在容器基类），子表默认不显示
                    showList: false,
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                }
            },
            methods: {
                //选择
                select: function () {
                    var rows = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getSelections");
                    var ids = rows.map(t => t.id);

                    var formData = serviceHelper.getDefaultAjaxParam();
                    formData.roleId = this.vm.containerSeServiceRoleRlt.roleId;
                    formData.serviceIds = window.JSON.stringify(ids);

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/seServiceRoleRlt/selectService", formData, function (result) {
                        this.vm.backServiceList();
                        this.vm.containerSeServiceRoleRlt.refreshList();
                    }.bind(this));
                }
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/role", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                //事件字符串格式：click .+a的class名称
                'click .service': function (e, value, row, index) {
                    this.vm.showSeServiceRoleRltList(e, value, row, index);
                }.bind(this.containerMain),
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    '<a class="service" href="javascript:;" title="共享服务">',
                    '共享服务',
                    '</a>  ',
                ].join('');
            }
        }]);

        this.containerMain.initForm();

        //刷新列表
        this.containerMain.refreshList();

        //容器（用户与角色关联）
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；列表的列设置
        this.containerSeServiceRoleRlt.init(this, "/seServiceRoleRlt", [{
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'url',
            title: 'url'
        }, {
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                'click .delete': function (e, value, row, index) {
                    //删除（一条）
                    this.deleteOne(row.id);
                }.bind(this.containerSeServiceRoleRlt),
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

        this.containerService.init(this, "/seService", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'url',
            title: 'url'
        }]);
    },
    methods: {
        showSeServiceRoleRltList: function (e, value, row, index) {
            this.containerMain.showList = false;
            this.containerSeServiceRoleRlt.showList = true;

            this.containerSeServiceRoleRlt.roleId = row.id;
            this.containerSeServiceRoleRlt.refreshList();
        },
        backSeServiceRoleRltList: function () {
            this.containerSeServiceRoleRlt.showList = false;
            this.containerMain.showList = true;
        },
        showServiceList: function (e, value, row, index) {
            this.containerSeServiceRoleRlt.showList = false;
            this.containerService.showList = true;

            this.containerService.refreshList();
        },
        backServiceList: function () {
            this.containerService.showList = false;
            this.containerSeServiceRoleRlt.showList = true;
        },
    }
});

module.exports = comm;