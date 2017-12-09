//引用组件或视图

//此功能对应的视图（html）
var template = require('./syslog.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');
//其他使用方法可以baidu或者访问moment.js的官网http://momentjs.cn/docs/
var moment = require('moment');

var comm = crudBase.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            operDates: '',
            pickerOptions_2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        }
    },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    addDefaultOperateColumn: false,
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                }
            },
            methods: {
                //获取自定义查询条件
                getCustomQueryParam: function () {
                    //返回结果的类型是object
                    var formData = {};
                    //可以通过如下方式添加任意值
                    if (this.operDates != '' && this.operDates[0] != null && this.operDates[1] != null) {
                        formData.startDate = moment(new Date(this.operDates[0])).format("YYYY-MM-DD HH:mm:ss");
                        formData.endDate = moment(new Date(this.operDates[1])).format("YYYY-MM-DD HH:mm:ss");
                    }
                    return formData;
                }.bind(this),
                //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
                initToolbarQueryParam: function () {
                    //列表查询条件的初始化
                    //虽然基类也有初始化，但部分控件的部分使用情况需要单独地初始化
                    this.toolbarQueryParam = {};
                    //select控件，用vue绑定，绑定的属性要存在，否则就无法设初始值
                    this.toolbarQueryParam.type = "";
                    this.vm.operDates = "";
                },
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/systemLog", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            //列绑定数据的属性的名称
            field: 'type',
            //列的显示名称
            title: '操作类型'
        }, {
            field: 'funName',
            title: '功能名称'
        }, {
            field: 'loginName',
            title: '登录名称'
        }, {
            field: 'clientIp',
            title: '客户端IP'
        }, {
            field: 'clientType',
            title: '客户端类型'
        }, {
            field: 'bowser',
            title: '浏览器'
        }, {
            field: 'operDate',
            title: '发生时间'
        }]);

        //刷新列表
        this.containerMain.refreshList();
    },
    methods: {}
});

module.exports = comm;