//引用组件或视图

//此功能对应的视图（html）
var template = require('./facilityTypeRoleManager.html');
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
                    //数据角色
                    dataRoles: [],
                    //设备类型
                    facilityTypes: [],
                    //行政区
                    district: [],
                    //角色ID
                    dataRoleId: null,
                    //测站ID
                    facilityTypeId: null,
                    //行政区
                    admin: null,
                    //查找角色ID
                    dataRoleIds: null,
                    //查找测站ID
                    facilityTypeIds: null,
                }
            },
            methods: {
                //初始化表单
                initForm: function () {

                    var formData = serviceHelper.getDefaultAjaxParam();

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/facilityTypeAdminRlt/getInitFormValue", formData, function (result) {
                        //动态select项demo
                        this.dataRoles = result.dataRoles;
                        this.facilityTypes = result.facilityTypes;
                        this.district = [{value: "", text: "全部区域"}].concat(result.district);
                    }.bind(this));
                },
                //表单保存前触发，可用于表单验证
                //需要有返回值，返回true就是继续保存，false就是不保存
                beforeSaveForm: function () {
                    //这里可以写保存前的验证代码，返回false就是终止保存
                    if(this.dataRoleId==null||this.dataRoleId==""){
                        layer.msg("请选择数据角色");
                        return false;
                    }

                    return true;
                },
                //刷新录入表单后的回调
                afterRefreshFormHandler: function () {
                    //初始化
                    this.dataRoleId = this.currentEntity.dataRoleId || null;
                    this.facilityTypeId = this.currentEntity.facilityTypeId || null;
                    this.admin = this.currentEntity.admin || null;
                },
                //获取自定义保存的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
                getCustomSaveValue: function () {
                    var formData = {};
                    formData.dataRoleId = this.dataRoleId;
                    formData.facilityTypeId = this.facilityTypeId;
                    formData.admin = this.admin;
                    return formData;
                },
                //获取自定义查询条件
                getCustomQueryParam: function () {
                    //返回结果的类型是object
                    var formData = {};
                    formData.dataRoleIds = this.dataRoleIds;
                    formData.facilityTypeIds = this.facilityTypeIds;
                    return formData;
                },
                //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
                initToolbarQueryParam: function () {
                    //列表查询条件的初始化
                    //虽然基类也有初始化，但部分控件的部分使用情况需要单独地初始化
                    this.toolbarQueryParam = {};
                    //select控件，用vue绑定，绑定的属性要存在，否则就无法设初始值
                    this.dataRoleIds = null;
                    this.facilityTypeIds = null;
                },
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/facilityTypeAdminRlt", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'dataRoleName',
            title: '数据角色名'
        }, {
            field: 'facilityTypeName',
            title: '设备类型名'
        }, {
            field: 'facilityTypeNameCn',
            title: '设备类型中文名'
        }, {
            field: 'districtName',
            title: '行政区'
        }]);

        //刷新列表
        this.containerMain.refreshList();
        this.containerMain.initForm();
    },
    methods: {
        refreshRlt: function () {

            var formData = serviceHelper.getDefaultAjaxParam();
            var index = layer.load(0, {shade: [0.3, '#000']});
            serviceHelper.getJson(serviceHelper.getBasicPath() + "/facilityTypeAdminRlt/refreshRlt", formData, function (result) {
                //关闭loading效果
                layer.close(index);
                layer.msg(result.msg);
            }.bind(this));
        },
    }
});

module.exports = comm;