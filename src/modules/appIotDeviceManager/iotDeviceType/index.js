//此功能对应的视图（html）
var template = require('./iotDeviceType.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');
//iot监测项类型
var containerIotItemType = require('modules/appIotDeviceManager/iotDeviceType/containerIotItemType');

var comm = crudBase.extend({

    template: template,

    components: {
        'containerIotItemType': containerIotItemType,

    },
    created: function () {

        this.containerMain = new container({
            data: function () {
                return {
                    companyItem: [],
                    productItem: [],
                    versionItem: [],
                    communicationTypeItem: [],
                    communicationMethodsItem: [],
                    addDefaultOperateColumn: false,
                }
            },
            methods: {
                //获取所有的数据字典
                getAllDictItem: function () {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + "/iotDeviceType/getAllDictItem",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;

                                    this.companyItem = result.companyItem;
                                    this.productItem = result.productItem;
                                    this.versionItem = result.versionItem;
                                    this.communicationTypeItem = result.communicationTypeItem;
                                    this.communicationMethodsItem = result.communicationMethodsItem;
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

        //iot监测类型
        this.containerIotItemType = this.$refs.containerIotItemType1;
        //初始化
        this.containerIotItemType.initContainer(this);

        this.containerMain.init(this, "/iotDeviceType", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'nameCn',
            title: '中文名'
        }, {
            field: 'company',
            title: '公司'
        },{
            field: 'product',
            title: '产品'
        }, {
            field: 'version',
            title: '版本'
        }, {
            field: 'communicationType',
            title: '通讯方式'
        }, {
            field: 'communicationMethods',
            title: '通讯模式'
        }, {
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
                'click .iotItemType': function (e, value, row, index) {
                    this.vm.showIotItemTypeList(e, value, row, index);
                }.bind(this.containerMain),
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    '<a class="iotItemType" href="javascript:;">',
                    'iot监测项类型',
                    '</a>  ',
                    '<a class="edit" href="javascript:;" title="编辑">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>  ',
                    '<a class="delete" href="javascript:;" title="删除">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            }
        }])

        //刷新列表
        this.containerMain.refreshList();
        //获取数据字典
        this.containerMain.getAllDictItem();

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

            //对下一列表容器赋值外键
            containerNext[fkFieldName] = row.id;
            //对下一列表容器赋值当前列表容器
            containerNext.lastContainer = containerThis;
            //刷新下一列表
            containerNext.refreshList();
        },
        //iot设备类型列表跳转到iot监测类型列表
        showIotItemTypeList: function (e, value, row, index) {
            this.showNextList(row, this.containerMain, this.containerIotItemType, "currentIotDeviceTypeId");
        },
    },
})

module.exports = comm;