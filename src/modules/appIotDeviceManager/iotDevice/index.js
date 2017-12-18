//引用组件或视图

//此功能对应的视图（html）
var template = require('./iotDevice.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var modifyDeviceInfo = require('modules/appIotDeviceManager/modifyDeviceInfo');
var commandInfo = require('modules/appIotDeviceManager/commandInfo');
var containerDeviceCommands = require('./containerDeviceCommands');

var comm = crudBase.extend({
    //设置模板
    template: template,
     // data: function () {
     //     return {
     //     }
     // },
    components: {
        //引用vue组件
        'modifyDeviceInfo': modifyDeviceInfo,
        'commandInfo': commandInfo,
        'containerDeviceCommands': containerDeviceCommands
    },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    facilityId:null,
                    facilityDict:null,
                    iotDeviceTypeIds: {},
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                }
            },

            methods: {
                //初始化表单
                initForm: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();
                    serviceHelper.getJson(serviceHelper.getBasicPath()+'/iotDevice/getInitFormValue',formData,function (result) {
                        this.facilityDict = result.facilitys;
                    }.bind(this));
                },
                //刷新录入表单后的回调
                afterRefreshFormHandler: function (row) {
                    if(!!row){
                        this.facilityId = row.facilityId;
                    }else{
                        this.facilityId = null;
                    }
                },
                //获取自定义保存的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
                getCustomSaveValue: function () {
                    var formData = {};
                    formData.facilityId = this.facilityId;
                    return formData;
                },
                //获取设备状态
                getDeviceStatus: function () {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/getDeviceStatus",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;

                                    layer.msg("操作成功");

                                    this.refreshList();
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                //修改设备信息
                modifyDeviceInfo: function (e, value, row, index) {
                    //点击确定后的回调，可以这样获取到从组件传过来的值
                    this.vm.$refs.modifyDeviceInfo1.okHandler = function () {

                        var formData = {};
                        formData.token = serviceHelper.getToken();
                        formData.r = Math.random();
                        formData.iotDeviceId = row.iotDeviceId;
                        formData.manufacturerId = this.vm.$refs.modifyDeviceInfo1.manufacturerId;
                        formData.manufacturerName = this.vm.$refs.modifyDeviceInfo1.manufacturerName;
                        formData.deviceType = this.vm.$refs.modifyDeviceInfo1.deviceType;
                        formData.model = this.vm.$refs.modifyDeviceInfo1.model;
                        formData.protocolType = this.vm.$refs.modifyDeviceInfo1.protocolType;

                        $.ajax({
                            type: "get",
                            dataType: "json",
                            url: serviceHelper.getBasicPath() + this.controllerUrl + "/modifyDeviceInfo",
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
                    }.bind(this);

                    //弹出窗口
                    this.vm.$refs.modifyDeviceInfo1.showForm(row);
                },
                //获取设备信息
                getDeviceInfo: function (e, value, row, index) {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();
                    formData.iotDeviceId = row.iotDeviceId;

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/getDeviceInfo",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;

                                    //消息太长，输出到console方便看
                                    console.log(result);

                                    layer.msg("此消息同时输出到浏览器的console。" + result);
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                //订阅设备信息
                subscribeDeviceInfo: function (e, value, row, index) {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();
                    formData.iotDeviceId = row.iotDeviceId;

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/subscribeDeviceInfo",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;

                                    //消息太长，输出到console方便看
                                    //console.log(result);

                                    layer.msg("操作成功");
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                registerDevice: function (e, value, row, index) {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();
                    formData.imei = row.imei;
                    formData.id = row.id;

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/registerDevice",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;

                                    this.refreshList();

                                    layer.msg("操作成功");
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },

                deleteRegisterDevice: function (e, value, row, index) {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();
                    formData.iotDeviceId = row.iotDeviceId;

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/deleteRegisterDevice",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;
                                    //取消注册后重新刷新列表
                                    this.refreshList();
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                registerSendDataCommand: function (e, value, row, index) {
                    //每次点击都清空旧数据
                    this.vm.$refs.commandInfo1.commandAddress="";
                    this.vm.$refs.commandInfo1.commandValue="";
                    this.vm.$refs.commandInfo1.cleanCommand();

                    //点击确定后的回调，可以这样获取到从组件传过来的值
                    this.vm.$refs.commandInfo1.okHandler = function () {
                        var formData = {};
                        formData.token = serviceHelper.getToken();
                        formData.r = Math.random();
                        formData.iotDeviceId = row.iotDeviceId;
                        formData.id = row.id;
                        formData.watingPostCommand = this.vm.$refs.commandInfo1.watingPostCommand;
                        formData.watingPostCommand = $("#wating_post_command").val();

                        $.ajax({
                            type: "get",
                            dataType: "json",
                            url: serviceHelper.getBasicPath() + this.controllerUrl + "/registerSendDataCommand",
                            data: formData,
                            success: function (ajaxResult) {
                                if (ajaxResult) {
                                    if (ajaxResult.success == true) {
                                        var result = ajaxResult.data;

                                        layer.msg("系统已保存数据，等候发送",{time:1200});
                                    } else {
                                        //后台操作失败的代码
                                        alert(ajaxResult.msg);
                                    }
                                }
                            }.bind(this)
                        });
                    }.bind(this);

                    //弹出窗口
                    this.vm.$refs.commandInfo1.showForm();
                },
                iotDeviceTypeIdChange: function () {

                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/getInitIotDeviceTypeValue",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;
                                    this.iotDeviceTypeIds = result.iotDeviceTypeIds;
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
        this.containerDeviceCommands = this.$refs.containerDeviceCommands1;
        //初始化
        this.containerDeviceCommands.initContainer(this);
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/iotDevice", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'iotDeviceTypeId',
            title: 'Iot设备类型'
        }, {
            field: 'imei',
            title: 'IMEI'
        }, {
            field: 'iotDeviceId',
            title: 'Iot设备Id'
        },{
            field: 'facilityName',
            title: '测站名称'
        },/*{
            field: 'lastDataReal',
            title: '最新数据时间'
        },{
            field: 'betweenTime',
            title: '最新通讯时间'
        },{
            field: 'onlineDays',
            title: '主机工作时间'
        },{
            field: 'dValue',
            title: '液位'
        },{
            field: 'dataRealCurrent',
            title: '中继剩余电量'
        },{
            field: 'overflow',
            title: '溢流风险'
        },{
            field: 'waterSpeed',
            title: '流速(m/s)'
        },{
            field: 'waterTraffic',
            title: '流量(L/s)'
        },{
            field: 'solids',
            title: '悬浮物(mg/L)'
        },{
            field: 'humidity',
            title: '湿度(%)'
        },{
            field: 'temperature',
            title: '温度(℃)'
        },*/{
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                //事件字符串格式：click .+a的class名称
                'click .edit': function (e, value, row, index) {
                    //编辑
                    this.edit(row.id);
                }.bind(this.containerMain),
                'click .delete': function (e, value, row, index) {
                    //删除（一条）
                    this.deleteOne(row.id);
                }.bind(this.containerMain),
                'click .getDeviceInfo': function (e, value, row, index) {
                    this.getDeviceInfo(e, value, row, index);
                }.bind(this.containerMain),
                'click .subscribeDeviceInfo': function (e, value, row, index) {
                    this.subscribeDeviceInfo(e, value, row, index);
                }.bind(this.containerMain),
                'click .modifyDeviceInfo': function (e, value, row, index) {
                    this.modifyDeviceInfo(e, value, row, index);
                }.bind(this.containerMain),
                'click .registerDevice': function (e, value, row, index) {
                    this.registerDevice(e, value, row, index);
                }.bind(this.containerMain),
                'click .registerSendDataCommand': function (e, value, row, index) {
                    this.registerSendDataCommand(e, value, row, index);
                }.bind(this.containerMain),
                'click .getDeviceCommands': function (e, value, row, index) {
                    this.vm.showContainerDeviceCommands(e, value, row, index);
                }.bind(this.containerMain),
                'click .deleteRegisterDevice': function (e, value, row, index) {
                    //编辑
                    this.deleteRegisterDevice(e, value, row, index);
                }.bind(this.containerMain),
            },
            //操作类的内容
            formatter: function (value, row, index) {
            if(row.communicationMethodText=="socket"){
                return [
                    '<a class="registerSendDataCommand" href="javascript:;" title="">',
                    '注册发送数据命令',
                    '</a>  ',
                    '<a class="edit" href="javascript:;" title="编辑">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>  ',
                    '<a class="delete" href="javascript:;" title="删除">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            }else{
                return [
                    //格式：一个功能是一个a，class必填因为跟点击事件有关
                    '<a class="registerDevice" href="javascript:;" title="">',
                    '注册设备',
                    '</a>  ',
                    '<a class="deleteRegisterDevice" href="javascript:;" title="">',
                    '取消注册',
                    '</a>  ',
                    '<a class="modifyDeviceInfo" href="javascript:;" title="">',
                    '修改设备信息',
                    '</a>  ',
                    '<a class="getDeviceInfo" href="javascript:;" title="">',
                    '获取设备信息',
                    '</a>  ',
                    '<a class="subscribeDeviceInfo" href="javascript:;" title="">',
                    '订阅设备信息',
                    '</a>  ',
                    '<a class="registerSendDataCommand" href="javascript:;" title="">',
                    '注册发送数据命令',
                    '</a>  ',
                    '<a class="getDeviceCommands" href="javascript:;" title="">',
                    '查询设备命令',
                    '</a>  ',
                    '<a class="edit" href="javascript:;" title="编辑">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>  ',
                    '<a class="delete" href="javascript:;" title="删除">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            }
            }
        }]);
        //初始化表单
        this.containerMain.initForm();
        //刷新列表
        this.containerMain.refreshList();

        //加载elte设备类型值
        this.containerMain.iotDeviceTypeIdChange();
    },
    methods: {
        //显示设备命令列表
        showContainerDeviceCommands: function (e, value, row, index) {
            //隐藏前一列表
            this.containerMain.showList = false;
            //对下一列表容器赋值外键
            this.containerDeviceCommands["currentIotDeviceId"] = row.iotDeviceId;
            //对下一列表容器赋值当前列表容器
            this.containerDeviceCommands.lastContainer = this.containerMain;
            //刷新并显示下一列表
            this.containerDeviceCommands.refreshList(this);
        },
    }
});

module.exports = comm;