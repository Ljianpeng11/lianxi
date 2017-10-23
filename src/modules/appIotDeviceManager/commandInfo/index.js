//bootstrap的js
require('bootstrap/dist/js/bootstrap.js');

//此功能对应的视图（html）
var template = require('./commandInfo.html');
var serviceHelper = require('services/serviceHelper.js');

var commandTextArrary = '';

var commandArray = '';

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
            commandAddress: "",
            commandValue: "",
            deviceID: "",
            watingPostCommand: "",
            commandAddressItem:[],
        }
    },
    created: function () {
        //获取命令的数据字典
        var formData = {};
        formData.token = serviceHelper.getToken();
        formData.r = Math.random();

        $.ajax({
            type: "get",
            dataType: "json",
            url: serviceHelper.getBasicPath() + "/deviceCommandItem/getAllDictItem",
            data: formData,
            success: function (ajaxResult) {
                if (ajaxResult) {
                    if (ajaxResult.success == true) {
                        var result = ajaxResult.data;

                        this.commandAddressItem = result.commandAddressItem;
                    } else {
                        //后台操作失败的代码
                        alert(ajaxResult.msg);
                    }
                }
            }.bind(this)
        });
    },
    mounted: function () {

    },
    methods: {
        //初始化
        init: function () {

        },
        //弹窗
        showForm: function () {
            //弹出模态窗
            $("#" + this.divId).modal("show");
        },
        //关闭窗体
        hideForm: function () {
            //关闭模态窗
            $("#" + this.divId).modal("hide");
        },
        //确定按钮点击事件--发送
        okClick: function () {
            //调用选择后回调函数
            if (this.okHandler) {
                this.okHandler();
            }
            //关闭窗体
            this.hideForm();
        },
        //添加待发送命令
        addCommand: function () {
            commandTextArrary += "命令：" +
                $.trim($('#command_address option:selected').text()) + " -> 指令值：" + $.trim($("#command_value").val()) + "\n";


            commandArray += $("#command_address").val() + '->' + $("#command_value").val() + ',';

            $("#wating_post_command_text").val(commandTextArrary);//JSON.stringify(commandTextArrary)
            $("#wating_post_command").val(commandArray);


        },
        cleanCommand: function () {
            $("#wating_post_command_text").val('');
            $("#wating_post_command").val('');
            commandTextArrary = '';
            commandArray = '';
        }

    }
});
