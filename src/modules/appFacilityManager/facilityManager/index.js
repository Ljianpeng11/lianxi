//引用组件或视图

//此功能对应的视图（html）
var template = require('./facilityManager.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

//设备
var containerDevice = require('modules/appFacilityManager/facilityManager/containerDevice');
//监测项
var containerItem = require('modules/appFacilityManager/facilityManager/containerItem');

var comm = crudBase.extend({
    //设置模板
    template: template,
    // data: function () {
    //     return {}
    // },
    components: {
        //设备
        'containerDevice': containerDevice,
        //监测项
        'containerItem': containerItem,
    },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    //测站类型下拉框所有值
                    facilityTypeIds: [],
                    //选择的测站类型
                    lstFacilityTypeId: null,
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                }
            },
            methods: {
                //初始化表单
                initForm: function () {
                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + this.controllerUrl + "/getInitFormValue",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;
                                    //测站类型下拉框所有值
                                    this.facilityTypeIds = result.facilityTypeIds;
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                //刷新录入表单后的回调
                afterRefreshFormHandler: function () {
                    this.refreshFileUpload("inputUploadPic", "Facility");

                    //触发测站类型下拉框change事件
                    this.facilityTypeIdChange();
                },
                //测站类型下拉框change事件
                facilityTypeIdChange: function (e) {
                    //测站类型id
                    var facilityTypeId = this.currentEntity.facilityTypeId;

                    var formData = {};
                    formData.token = serviceHelper.getToken();
                    formData.r = Math.random();
                    formData.facilityTypeId = facilityTypeId;
                    formData.facilityId = this.currentEntity.id;
                    //根据测站类型查询测站的动态字段
                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: serviceHelper.getBasicPath() + "/facilityType/getFacilityFieldByFacilityTypeId",
                        data: formData,
                        success: function (ajaxResult) {
                            if (ajaxResult) {
                                if (ajaxResult.success == true) {
                                    var result = ajaxResult.data;

                                    //测站关联
                                    var facilityRelates = result.facilityRelates;
                                    //根据测站类型字段的配置，构建录入表单的字段
                                    $('#facilityFieldContainer', $("#" + this.vm.mainContentDivId)).empty();
                                    for (var i = 0; i < facilityRelates.length; i++) {
                                        var field = facilityRelates[i];

                                        //测站字段类型，因为此数组既有测站关联字段，也有普通的测站字段，因此要区分
                                        //此值写在input或select的class里
                                        var facilityFieldInputType;
                                        //input的自定义值
                                        var inputCustomValue = "";
                                        if (field.facilityRelate) {
                                            //测站关联字段
                                            facilityFieldInputType = "facilityRelateInput";
                                            inputCustomValue = ' facilityRelateTypeId="' + field.facilityRelateTypeId + '" ';
                                        }
                                        else {
                                            //测站字段
                                            facilityFieldInputType = "facilityFieldInput";
                                            inputCustomValue = ' facilityTypeFieldId="' + field.facilityTypeFieldId + '" ';
                                        }

                                        var $input;

                                        //不同字段类型使用不用的控件
                                        //字段名写在input的id里，class写入itemFieldInput代表是监测项动态字段
                                        if (field.fieldType === "string") {
                                            $input = $('<div class="row">' +
                                                '<div class="form-group">' +
                                                '<label class="col-sm-3 control-label">' + field.nameCn + '</label>' +
                                                '<div class="col-sm-9">' +
                                                '<input type="text" id="' + field.name + '" class="form-control ' + facilityFieldInputType + '" ' + inputCustomValue + '>' +
                                                '</div>' +
                                                '</div>' +
                                                '</div>');

                                        } else if (field.fieldType === "double" || field.fieldType === "int") {
                                            $input = $('<div class="row">' +
                                                '<div class="form-group">' +
                                                '<label class="col-sm-3 control-label">' + field.nameCn + '</label>' +
                                                '<div class="col-sm-9">' +
                                                '<input type="number" id="' + field.name + '" class="form-control ' + facilityFieldInputType + '" ' + inputCustomValue + '>' +
                                                '</div>' +
                                                '</div>' +
                                                '</div>');
                                        }
                                        else if (field.fieldType === "select") {
                                            //select下拉框
                                            //下拉框所有值
                                            var strItem = "";
                                            if (field.selectItems) {
                                                var selectItems = field.selectItems;
                                                //插入一条没值的，让用户可以选择空值
                                                strItem += '<option value=""></option>';
                                                for (var s = 0; s < selectItems.length; s++) {
                                                    var selectItem = selectItems[s];

                                                    strItem += '<option value="' + selectItem.value + '">' + selectItem.text + '</option>';
                                                }
                                            }

                                            $input = $('<div class="row">' +
                                                '<div class="form-group">' +
                                                '<label class="col-sm-3 control-label">' + field.nameCn + '</label>' +
                                                '<div class="col-sm-9">' +
                                                ' <select id="' + field.name + '" class="form-control ' + facilityFieldInputType + '" ' + inputCustomValue + '>' +
                                                strItem +
                                                '</select>' +
                                                '</div>' +
                                                '</div>' +
                                                '</div>');
                                        }
                                        else {
                                            alert("不支持的字段类型：" + field.fieldType);
                                        }

                                        $('#facilityFieldContainer', $("#" + this.vm.mainContentDivId)).append($input);
                                    }

                                    //对录入表单字段赋值
                                    for (var i = 0; i < facilityRelates.length; i++) {
                                        var field = facilityRelates[i];

                                        $('#' + field.name, $('#facilityFieldContainer', $("#" + this.vm.mainContentDivId))).val(field.fieldValue);
                                    }
                                } else {
                                    //后台操作失败的代码
                                    alert(ajaxResult.msg);
                                }
                            }
                        }.bind(this)
                    });
                },
                getCustomSaveValue: function () {
                    var formData = {};

                    //获取测站关联的值
                    var facilityRelates = [];
                    $(".facilityRelateInput", $('#facilityFieldContainer', $("#" + this.vm.mainContentDivId))).each(function (i, element) {
                        var $input = $(element);
                        var facilityRelate = {};
                        //测站关联类型id
                        facilityRelate.facilityRelateTypeId = $input.attr("facilityRelateTypeId");
                        //关联的测站的id
                        facilityRelate.relateFacilityId = $input.val();

                        facilityRelates.push(facilityRelate);
                    });

                    formData.facilityRelates = JSON.stringify(facilityRelates);

                    //获取测站字段的值
                    var facilityFields = [];
                    $(".facilityFieldInput", $('#facilityFieldContainer', $("#" + this.vm.mainContentDivId))).each(function (i, element) {
                        var $input = $(element);
                        var facilityField = {};
                        //测站类型字段id
                        facilityField.facilityTypeFieldId = $input.attr("facilityTypeFieldId");
                        //测站字段值
                        facilityField.value = $input.val();

                        facilityFields.push(facilityField);
                    });

                    formData.facilityFields = JSON.stringify(facilityFields);

                    return formData;
                },

                //获取自定义查询条件
                getCustomQueryParam: function () {
                    //返回结果的类型是object
                    var formData = {};
                    //可以通过如下方式添加任意值
                    formData.lstFacilityTypeId = this.containerMain.lstFacilityTypeId.toString();

                    return formData;
                }.bind(this),
                //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
                initToolbarQueryParam: function () {
                    //列表查询条件的初始化
                    //虽然基类也有初始化，但部分控件的部分使用情况需要单独地初始化
                    this.toolbarQueryParam = {};
                    //select控件，用vue绑定，绑定的属性要存在，否则就无法设初始值
                    this.lstFacilityTypeId = [];
                },
            }
        });
    },
    mounted: function () {
        //由于此功能子表太多，因此除了主表以外其他表都封装成组件
        //子表组件对象即容器，此处把组件赋值回容器的属性，保留原来“容器”的设计模式
        //设备
        this.containerDevice = this.$refs.containerDevice1;
        //初始化
        this.containerDevice.initContainer(this);

        //监测项
        this.containerItem = this.$refs.containerItem1;
        this.containerItem.initContainer(this);

        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/facility", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'facilityTypeId',
            title: '测站类型'
        }, {
            field: 'createDate',
            title: '创建日期'
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
                'click .device': function (e, value, row, index) {
                    this.vm.showDeviceList(e, value, row, index);
                }.bind(this.containerMain),
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    '<a class="device" href="javascript:;">',
                    '设备',
                    '</a>  ',
                    '<a class="edit" href="javascript:;" title="编辑">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>  ',
                    '<a class="delete" href="javascript:;" title="删除">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            }
        }]);

        //刷新列表
        this.containerMain.refreshList();
        //初始化表单（设备）
        this.containerMain.initForm();
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
            //初始化（不一定有此方法）
            if (containerNext.initForm) {
                containerNext.initForm();
            }
            //刷新下一列表
            containerNext.refreshList();
        },
        //测站跳转到设备列表
        showDeviceList: function (e, value, row, index) {
            this.showNextList(row, this.containerMain, this.containerDevice, "currentFacilityId");
        },
        //设备跳转到监测项列表
        showItemList: function (e, value, row, index) {
            this.showNextList(row, this.containerDevice, this.containerItem, "currentDeviceId");
        },
    }
});

module.exports = comm;