//bootstrap的js
require('bootstrap/dist/js/bootstrap.js');

//此功能对应的视图（html）
var template = require('./modifyDeviceInfo.html');
var serviceHelper = require('services/serviceHelper.js');

// Vue.extend实现vue组件
module.exports = Vue.extend({
    //设置模板
    template: template,
    //vue组件外部给组件内部传值使用props
    props: ["companyName"],
    data: function () {
        return {
            //当前整个html元素的id，考虑到页面内可能同时存在多个这个控件，因此id随机生成，保证不重复
            //需要id是因为bootstrap的model弹窗是基于jquery实现的
            divId: "div" + Math.random().toString(36).substr(2),
            //选择后的回调
            okHandler: null,
            manufacturerId: "",
            manufacturerName: "",
            deviceType: "",
            model: "",
            protocolType: "",
        }
    },
    created: function () {

    },
    mounted: function () {

    },
    methods: {
        //初始化
        init: function () {

        },
        //弹窗
        showForm: function (row) {
            //弹出模态窗
            $("#" + this.divId).modal("show");

            //获取设备信息
            var formData = {};
            formData.token = serviceHelper.getToken();
            formData.r = Math.random();
            formData.id = row.id;


            $.ajax({
                type: "get",
                dataType: "json",
                url: serviceHelper.getBasicPath() + "/iotDevice/getModifyDeviceInfo",
                data: formData,
                success: function (ajaxResult) {
                    if (ajaxResult) {
                        if (ajaxResult.success == true) {
                            var result = ajaxResult.data;

                            this.manufacturerId = result.manufacturerId;
                            this.manufacturerName = result.manufacturerName;
                            this.deviceType = result.deviceType;
                            this.model = result.model;
                            this.protocolType = result.protocolType;

                        } else {
                            //后台操作失败的代码
                            alert(ajaxResult.msg);
                        }
                    }
                }.bind(this)
            });
        },
        //关闭窗体
        hideForm: function () {
            //关闭模态窗
            $("#" + this.divId).modal("hide");
        },
        //确定按钮点击事件
        okClick: function () {
            //调用选择后回调函数
            if (this.okHandler) {
                this.okHandler();
            }
            //关闭窗体
            this.hideForm();
        }
    }
});