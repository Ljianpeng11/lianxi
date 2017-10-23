//此功能对应的视图（html）
var template = require('./deviceCommand.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

//设备命令项
var deviceCommandItem = require('modules/appIotDeviceManager/deviceCommand/deviceCommandItem');

var comm = crudBase.extend({

    template: template,

    components: {
        'deviceCommandItem': deviceCommandItem,

    },
    created: function () {

        this.containerMain = new container({
            data: function () {
                return {
                    addDefaultOperateColumn: false,
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                }
            },
            methods: {

                reSend: function () {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    var rows = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getSelections");
                    if (rows.length == 0) {
                        layer.msg("请选择记录");
                        return;
                    }
                    //支持一次删除多条，id用逗号隔开
                    formData.ids = "";
                    for (var i = 0; i < rows.length; i++) {
                        if (formData.ids)
                            formData.ids += ",";

                        formData.ids += rows[i].id;
                    }

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath()+ "/iotDevice/reSendFailedDeviceCommand",
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

                //打开窗口后回调
                afterRefreshFormHandler: function () {

                }
            }
        })
    },

    mounted: function () {

        //设备命令项
        this.deviceCommandItem = this.$refs.deviceCommandItem1;
        //初始化
        this.deviceCommandItem.initContainer(this);

        this.containerMain.init(this, "/deviceCommand", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        },{
            field: 'iotDeviceName',
            title: '设备名称'
        }, {
            field: 'imei',
            title: 'imei码'
        },{
            field: 'createUser',
            title: '创建用户名'
        },{
            field: 'createDate',
            title: '创建时间'
        }, {
            field: 'sendDate',
            title: '发送时间'
        },{
            field: '_state',
            title: '状态'
        },{
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                'click .commandItem': function (e, value, row, index) {
                    this.vm.showCommandItemList(e, value, row, index);
                }.bind(this.containerMain),
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    '<a class="commandItem" href="javascript:;">',
                    '设备命令项',
                    '</a>  '
                ].join('');
            }
        }])

        //刷新列表
        this.containerMain.refreshList();

    },

    methods: {
        /**
         * 跳转到下一列表
         * @param row
         * @param containerThis 当前列表容器
         * @param containerNext 下一列表容器
         * @param fkFieldName 下一列表容器字段名
         */
        showNextList: function (row, containerThis, containerNext, fkFieldName) {
            //隐藏当前列表
            containerThis.showList = false;
            //显示下一列表
            containerNext.showList = true;

            containerNext.deviceCommandName = row.iotDeviceName;
            containerNext.deviceCommandimsi = row.imei;

            //对下一列表容器赋值外键
            containerNext[fkFieldName] = row.id;
            //对下一列表容器赋值当前列表容器
            containerNext.lastContainer = containerThis;
            //刷新下一列表
            containerNext.refreshList();
        },
        //设备命令项列表
        showCommandItemList: function (e, value, row, index) {
            this.showNextList(row, this.containerMain, this.deviceCommandItem, "currentDeviceCommandId");
        },
    },
    //初始化日期控件
    initDatetimepicker: function () {
        //需要自定义日期控件格式，可以重写基类的initDatetimepicker方法
        //同一表单内多个日期控件，当控件需要不同的日期显示格式，可以分开初始化
        //用于查找控件的class要新建，且每种格式的class都不同，也要保留原来的class：datetimepicker

        //日期控件叫bootstrap-datetimepicker，更多使用方法请看官网：http://www.bootcss.com/p/bootstrap-datetimepicker/，https://github.com/smalot/bootstrap-datetimepicker，

        $('.datetimepicker', $("#" + this.mainContentDivId)).datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose: true,
            startView: 2,
            minView: 2
        }).on('changeDate', function (ev) {
            alert("help!");
        });

        //格式1，注意class
        $('.dtp-format1', $("#" + this.mainContentDivId)).datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose: true,
            startView: 2,
            minView: 2,
            todayBtn: true
        }).on('changeDate', function (ev) {
            alert("help!");
        });

    },
})

module.exports = comm;