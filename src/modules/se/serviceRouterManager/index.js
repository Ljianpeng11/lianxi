//引用组件或视图

//此功能对应的视图（html）
var template = require('./serviceRouterManager.html');
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
            methods: {
                //通知共享交换服务端刷新服务路由配置
                seServerRefreshServiceRouterConfig: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();

                    serviceHelper.getJson(serviceHelper.getBasicPath() + this.controllerUrl + "/seServerRefreshServiceRouterConfig", formData, function (result) {
                        layer.msg('操作成功');
                    }.bind(this));
                }
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/serviceRouter", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'visitUrl',
            title: '访问url'
        }, {
            field: 'targetUrl',
            title: '目标url'
        }, {
            field: 'targetUrlType',
            title: '目标url类型'
        }]);

        //刷新列表
        this.containerMain.refreshList();
    },
    methods: {}
});

module.exports = comm;