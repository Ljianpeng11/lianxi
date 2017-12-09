//引用组件或视图

//此功能对应的视图（html）
var template = require('./userManager.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

//表单验证
var eFormValid = require('modules/common/eFormValid.js');

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
                    //全部性别
                    sexs: [],
                    //全部角色
                    roles: [],
                    //当前用户关联角色id
                    userRole: null,
                    //表单验证对象
                    eFormValid: null,
                }
            },
            methods: {
                //初始化表单
                initForm: function () {
                    //表单验证
                    this.eFormValid = new eFormValid();
                    this.eFormValid.mainContentDivId = this.vm.mainContentDivId;
                    this.eFormValid.addNotNullRule("loginName", "登录名");
                    this.eFormValid.addNotNullRule("name", "姓名");
                    this.eFormValid.addNotNullRule("password", "密码");
                    this.eFormValid.addNotNullRule("password2", "确认密码");

                    var formData = serviceHelper.getDefaultAjaxParam();

                    serviceHelper.getJson(serviceHelper.getBasicPath() + this.controllerUrl + "/getInitFormValue", formData, function (result) {
                        //动态select项demo
                        //[{value: "", text: ""}].concat()意思是在数组前面插入一个值为空的项，让用户可以选空值
                        this.sexs = [{value: "", text: ""}].concat(result.sexs);
                        this.roles = result.roles;
                    }.bind(this));
                },
                //表单保存前触发，可用于表单验证
                //需要有返回值，返回true就是继续保存，false就是不保存
                beforeSaveForm: function () {
                    var password = $("#password", $("#" + this.vm.mainContentDivId)).val();
                    var password2 = $("#password2", $("#" + this.vm.mainContentDivId)).val();

                    if (!!password && !!password2 && password !== password2) {
                        layer.msg('密码 和 确认密码 不一样');
                        return;
                    }

                    return this.eFormValid.valid();
                },
                afterRefreshFormHandler: function () {
                    if (this.currentEntity && this.currentEntity.password) {
                        this.currentEntity.password2 = this.currentEntity.password;
                    }
                    //currentEntity更新后，要把当前用户关联的角色id赋值到userRole
                    this.userRole = this.currentEntity.roleIds || [];
                },
                //获取自定义保存的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
                getCustomSaveValue: function () {
                    var formData = {};

                    this.userRole = this.userRole || [];
                    formData.roleIds = JSON.stringify(this.userRole);

                    return formData;
                },
                //生成setoken
                createSeToken: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();

                    serviceHelper.getJson(serviceHelper.getBasicPath() + this.controllerUrl + "/createSeToken", formData, function (result) {
                        this.currentEntity.setoken = result;
                    }.bind(this));
                }
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/sysUser", [{
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

        //刷新列表
        this.containerMain.refreshList();
        this.containerMain.initForm();
    },
    methods: {}
});

module.exports = comm;