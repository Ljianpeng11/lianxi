//引用组件或视图

//此功能对应的视图（html）
var template = require('./serviceLogManager.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var moment = require('moment');

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
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                    //查询条件，发生时间
                    queryOperDate: "",
                }
            },
            methods: {
                getCustomQueryParam: function () {
                    var formData = {};

                    //查询条件，发生时间
                    if (this.queryOperDate && this.queryOperDate[0] && this.queryOperDate[1]) {
                        formData.dateStart = moment(this.queryOperDate[0]).format("YYYY-MM-DD");
                        formData.dateEnd = moment(this.queryOperDate[1]).format("YYYY-MM-DD");
                    }

                    return formData;
                },
                //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
                initToolbarQueryParam: function () {
                    this.toolbarQueryParam = {};

                    //查询条件，发生时间
                    this.queryOperDate = "";
                },
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/serviceLog", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'serviceName',
            title: '服务名称'
        }, {
            field: 'serviceUrl',
            title: '服务url'
        }, {
            field: 'userName',
            title: '用户姓名'
        }, {
            field: 'loginName',
            title: '用户登录名'
        }, {
            field: 'roleName',
            title: '角色名称'
        }, {
            field: 'clientIp',
            title: '客户端ip'
        }, {
            field: 'dataSize',
            title: '流量（KB）'
        }, {
            field: 'operDate',
            title: '发生时间'
        }]);

        this.containerMain.listUrl = this.containerMain.controllerUrl + "/getList";

        //刷新列表
        this.containerMain.refreshList();
    },
    methods: {}
});

module.exports = comm;