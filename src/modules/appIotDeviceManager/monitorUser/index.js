//引用组件或视图

//此功能对应的视图（html）
var template = require('./monitorUser.html');
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
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: true,
                }
            },

            methods: {
                // //刷新列表后的回调
                // afterRefreshListHandler: function () {
                //     // layer.msg('afterRefreshListHandler');
                // },
            }
        });

    },
    mounted: function () {

        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/monitorUser", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'userName',
            title: '用户名'
        }, {
            field: 'password',
            title: '密码'
        }, {
            field: 'unit',
            title: '单位名称'
        },/*{
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                //事件字符串格式：click .+a的class名称
                'click .monitorData': function (e, value, row, index) {
                    this.getMonitorData(e, value, row, index);
                }.bind(this)
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    '<a class="monitorData" href="javascript:;" title="">',
                    '接口测试',
                    '</a>  ',
                ].join('');
            }
        }*/]);
        //刷新列表
        this.containerMain.refreshList();

    },
    methods: {
        // getMonitorData: function (e, value, row, index) {
        //
        //     var formData = serviceHelper.getDefaultAjaxParam();
        //     formData.userName = row.userName;
        //     formData.password = row.password;
        //     formData.imei = "863703031771459";
        //     formData.paramType = "current";
        //     formData.dateStart = "2017-10-15 18:47:17";
        //     formData.dateEnd = "2017-10-16 18:47:16";
        //
        //     $.ajax({
        //         type: "get",
        //         dataType: "json",
        //         url: serviceHelper.getBasicPath() +"/monitorData/getDataReal",
        //         data: formData,
        //         success: function (ajaxResult) {
        //             if (ajaxResult) {
        //                 if (ajaxResult.success == true) {
        //                     var result = ajaxResult.data;
        //
        //                     //输出到console方便看
        //                     console.log(result);
        //
        //                 } else {
        //                     //后台操作失败的代码
        //                     alert(ajaxResult.msg);
        //                 }
        //             }
        //         }.bind(this)
        //     });
        //
        //
        //     $.ajax({
        //         type: "get",
        //         dataType: "json",
        //         url: serviceHelper.getBasicPath() +"/monitorData/getHistoryData",
        //         data: formData,
        //         success: function (ajaxResult) {
        //             if (ajaxResult) {
        //                 if (ajaxResult.success == true) {
        //                     var result = ajaxResult.data;
        //
        //                     //输出到console方便看
        //                     console.log(result);
        //
        //                 } else {
        //                     //后台操作失败的代码
        //                     alert(ajaxResult.msg);
        //                 }
        //             }
        //         }.bind(this)
        //     });
        //
        // }
    }
});

module.exports = comm;