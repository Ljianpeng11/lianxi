//引用组件或视图

//此功能对应的视图（html）
var template = require('./eiotMaintenance.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var comm = crudBase.extend({
    //设置模板
    template: template,

    components: {
        //引用vue组件
    },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {

                }
            },

            methods: {
                //登录
                login: function () {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/login",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;

                                    layer.msg("登录成功");
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                //获取登录信息
                getLoginInfo: function () {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/getLoginInfo",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;

                                    layer.msg(result);
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                //刷新iot设备配置缓存
                refresIotSettingCaches: function () {

                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/refreshIotSettingCache",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;
                                    layer.msg("操作成功");

                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
            }
        });

    },
    mounted: function () {
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/iotDevice");
    },
    methods: {

    }
});

module.exports = comm;