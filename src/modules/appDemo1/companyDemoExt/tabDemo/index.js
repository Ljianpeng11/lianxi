//bootstrap的js
require('bootstrap/dist/js/bootstrap.js');

//此功能对应的视图（html）
var template = require('./tabDemo.html');
var serviceHelper = require('services/serviceHelper.js');

// Vue.extend实现vue组件
module.exports = Vue.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            //当前整个html元素的id，考虑到页面内可能同时存在多个这个控件，因此id随机生成，保证不重复
            //需要id是因为bootstrap的model弹窗是基于jquery实现的
            divId: "div" + Math.random().toString(36).substr(2),
            //选择后的回调
            okHandler: null,
        }
    },
    created: function () {

    },
    mounted: function () {

    },
    methods: {
        getTabInfo: function () {
            eventHelper.emit('tab-status', function (tabModel) {
                debugger;
                // tabModel.currentTab //当前tab
                // tabModel.tabs //tab列表
            }.bind(this));//获取标签信息
        },
        //弹窗
        showForm: function () {
            $("#" + this.divId).modal("show");
        },
        //关闭窗体
        hideForm: function () {
            $("#" + this.divId).modal("hide");
        },
        //确定按钮点击事件
        okClick: function () {
            //调用选择后回调函数
            if (this.okHandler) {
                this.okHandler(this.companyName);
            }
            //关闭窗体
            this.hideForm();
        }
    }
});