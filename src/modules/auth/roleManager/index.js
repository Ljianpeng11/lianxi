//引用组件或视图

//此功能对应的视图（html）
var template = require('./roleManager.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

//ztree树控件
require('ztree/js/jquery.ztree.all.js');
require('ztree/css/metroStyle/metroStyle.css');

//表单验证
var eFormValid = require('modules/common/eFormValid.js');

//菜单树样式
require('modules/auth/menuManager/menuManager.css');

var comm = crudBase.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            containerUserRoleRlt: null,
            containerUser: null,
        }
    },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    //是否显示编辑表单
                    showEditForm: false,
                    //表单验证对象
                    eFormValid: null,
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                    //ztree的id
                    treeId: ""
                }
            },
            methods: {
                //初始化表单
                initForm: function () {
                    //ztree的id，ztree在系统全局不能重复
                    this.treeId = "tree" + Math.random().toString(36).substr(2);

                    //表单验证
                    this.eFormValid = new eFormValid();
                    this.eFormValid.mainContentDivId = this.vm.mainContentDivId;
                    this.eFormValid.addNotNullRule("name", "名称");
                },
                //显示
                showForm: function () {
                    this.showEditForm = true;
                    this.showList = false;
                },
                //隐藏
                hideForm: function () {
                    this.showEditForm = false;
                    this.showList = true;
                },
                //表单保存前触发，可用于表单验证
                //需要有返回值，返回true就是继续保存，false就是不保存
                beforeSaveForm: function () {
                    return this.eFormValid.valid();
                },
                //刷新录入表单后的回调
                afterRefreshFormHandler: function () {
                    //刷新菜单树
                    this.refreshTree();
                },
                //获取自定义保存的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
                getCustomSaveValue: function () {
                    //获取所有选中节点
                    var nodeCheckeds = this.getZTreeObject().getCheckedNodes(true);

                    //返回给后端的有权限的菜单
                    var menuIds = [];
                    for (var i = 0; i < nodeCheckeds.length; i++) {
                        var nodeChecked = nodeCheckeds[i];
                        menuIds.push(nodeChecked.id);
                    }

                    var formData = {};
                    formData.menuIds = JSON.stringify(menuIds);

                    return formData;
                },
                //获取ztree对象
                getZTreeObject: function () {
                    return $.fn.zTree.getZTreeObj(this.treeId);
                },
                //初始化和刷新菜单树
                refreshTree: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();
                    formData.roleId = this.currentEntity.id || 0;

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/roleMenuRlt/getRoleMenuTreeData", formData, function (result) {

                        //初始化树控件并填充数据
                        $.fn.zTree.init($("#" + this.treeId), {
                            data: {
                                keep: {
                                    //没此设置时，非子叶节点的最后一个子节点被删除后，会自动变成子叶节点
                                    parent: true
                                }
                            },
                            //checkbox设置
                            check: {
                                enable: true,
                            },
                            // callback: {
                            //     onClick: function (event, treeId, treeNode) {
                            //         //单击树节点事件
                            //         // this.selectNode(treeNode);
                            //     }.bind(this),
                            // }
                        }, result);

                        //展开根节点
                        this.getZTreeObject().expandNode(this.getZTreeObject().getNodes()[0]);
                    }.bind(this));
                },
            }
        });

        //容器（角色与用户关联）
        this.containerUserRoleRlt = new container({
            data: function () {
                return {
                    //列表id，同一页面如果有多个实体列表需要修改
                    tableId: "tableUserRoleRlt",
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
                //选择用户
                selectUser: function () {
                    this.vm.showUserList();
                }
            }
        });

        //容器（用户列表）
        this.containerUser = new container({
            data: function () {
                return {
                    //列表id，同一页面如果有多个实体列表需要修改
                    tableId: "tableUser",
                    //控制列表是否显示（此属性在容器基类），子表默认不显示
                    showList: false,
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                }
            },
            methods: {
                //选择用户
                select: function () {
                    var rows = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getSelections");
                    var ids = rows.map(t => t.id);

                    var formData = serviceHelper.getDefaultAjaxParam();
                    formData.roleId = this.vm.containerUserRoleRlt.roleId;
                    formData.userIds = window.JSON.stringify(ids);

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/userRoleRlt/selectUser", formData, function (result) {
                        this.vm.backUserList();
                        this.vm.containerUserRoleRlt.refreshList();
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
                'click .edit': function (e, value, row, index) {
                    //编辑
                    this.edit(row.id);
                }.bind(this.containerMain),
                'click .delete': function (e, value, row, index) {
                    //删除（一条）
                    this.deleteOne(row.id);
                }.bind(this.containerMain),
                //用户列表
                'click .user': function (e, value, row, index) {
                    //显示员工列表
                    this.vm.showUserRoleRltList(e, value, row, index);
                }.bind(this.containerMain)
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    '<a class="user" href="javascript:;" title="用户">',
                    '用户',
                    '</a>  ',
                    '<a class="edit" href="javascript:;" title="编辑">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>  ',
                    '<a class="delete" href="javascript:;" title="删除">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            }
        }]);

        this.containerMain.initForm();

        //刷新列表
        this.containerMain.refreshList();

        //容器（用户与角色关联）
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；列表的列设置
        this.containerUserRoleRlt.init(this, "/userRoleRlt", [{
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'loginName',
            title: '登录名'
        }, {
            field: 'name',
            title: '姓名'
        }, {
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                'click .delete': function (e, value, row, index) {
                    //删除（一条）
                    this.deleteOne(row.id);
                }.bind(this.containerUserRoleRlt),
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

        this.containerUser.init(this, "/sysUser", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'loginName',
            title: '登录名'
        }, {
            field: 'name',
            title: '姓名'
        }, {
            field: 'roles',
            title: '角色'
        }]);
    },
    methods: {
        showUserRoleRltList: function (e, value, row, index) {
            this.containerMain.showList = false;
            this.containerUserRoleRlt.showList = true;

            this.containerUserRoleRlt.roleId = row.id;
            this.containerUserRoleRlt.refreshList();
        },
        backUserRoleRltList: function () {
            this.containerUserRoleRlt.showList = false;
            this.containerMain.showList = true;
        },
        showUserList: function (e, value, row, index) {
            this.containerUserRoleRlt.showList = false;
            this.containerUser.showList = true;

            this.containerUser.refreshList();
        },
        backUserList: function () {
            this.containerUser.showList = false;
            this.containerUserRoleRlt.showList = true;
        },
    }
});

module.exports = comm;