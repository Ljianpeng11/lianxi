//引用组件或视图

//此功能对应的视图（html）
var template = require('./userServiceManager.html');
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
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                    //全部用户对象
                    users: [],
                    //查询条件，用户
                    queryUser: null,
                    //全部网络环境
                    networkEnvironments: [],
                    networkEnvironment: null
                }
            },
            methods: {
                //初始化
                initForm: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();
                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/sysUser/getAllEntites", formData, function (result) {
                        //获取所有用户
                        this.users = result;
                    }.bind(this));

                    formData = serviceHelper.getDefaultAjaxParam();
                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/networkEnvironment/getAllEntites", formData, function (result) {
                        this.networkEnvironments = result;
                    }.bind(this));
                },
                //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
                initToolbarQueryParam: function () {
                    //列表查询条件的初始化
                    //虽然基类也有初始化，但部分控件的部分使用情况需要单独地初始化
                    this.toolbarQueryParam = {};
                    //select控件，用vue绑定，绑定的属性要存在，否则就无法设初始值
                    this.queryUser = null;
                },
                //获取自定义查询条件
                getCustomQueryParam: function () {
                    //返回结果的类型是object
                    var formData = {};

                    formData.userId = this.queryUser;

                    return formData;
                },
                networkEnvironmentChange: function (val) {
                    this.refreshList();
                }
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/seService", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'url',
            title: 'url',
            formatter: function (value, row, index) {
                //把网络环境的url拼到服务的url
                var hostUrl = this.containerMain.networkEnvironment;
                if (hostUrl) {
                    return hostUrl + value;
                }
                else {
                    return value;
                }
            }.bind(this)
        }]);

        this.containerMain.listUrl = "/seService/getUserServiceList";

        this.containerMain.initForm();

        //刷新列表
        this.containerMain.refreshList();
    },
    methods: {}
});

module.exports = comm;