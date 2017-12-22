//引用组件或视图

//此功能对应的视图（html）
var template = require('./containerDevice.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var comm = container.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            //列表id，同一页面如果有多个实体列表需要修改
            tableId: "tableDevice",
            //表单（弹窗）id，同一页面如果有多个实体列表需要修改
            formId: "formDevice",
            //当前测站id
            currentFacilityId: 0,
            //控制列表是否显示（此属性在容器基类），子表默认不显示
            showList: false,
            //上一级列表的容器（用于返回）
            lastContainer: null,
            //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
            addDefaultOperateColumn: false,
            //设备类型下拉菜单所有值
            deviceTypeIds: [],
        }
    },
    methods: {
        //初始化表单
        initForm: function () {
            var formData = {};
            formData.token = serviceHelper.getToken();
            formData.r = Math.random();
            formData.facilityId = this.currentFacilityId;

            $.ajax({
                type: "get",
                dataType: "json",
                url: serviceHelper.getBasicPath() + this.controllerUrl + "/getInitFormValue",
                data: formData,
                success: function (ajaxResult) {
                    if (ajaxResult) {
                        if (ajaxResult.success == true) {
                            var result = ajaxResult.data;
                            //设备类型下拉菜单所有值
                            this.deviceTypeIds = result.deviceTypeIds;
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
            //触发设备类型下拉框change事件
            this.deviceTypeIdChange();
        },
        getCustomQueryParam: function () {
            var formData = {};
            formData.facilityId = this.currentFacilityId;

            return formData;
        },
        getCustomSaveValue: function () {
            var formData = {};
            formData.facilityId = this.currentFacilityId;

            //获取设备关联的值
            var deviceRelates = [];
            $(".deviceRelateInput", $('#deviceFieldContainer', $("#" + this.vm.mainContentDivId))).each(function (i, element) {
                var $input = $(element);
                var deviceRelate = {};
                //设备关联类型id
                deviceRelate.deviceRelateTypeId = $input.attr("deviceRelateTypeId");
                //关联的设备的id
                deviceRelate.relateDeviceId = $input.val();

                deviceRelates.push(deviceRelate);
            });

            formData.deviceRelates = JSON.stringify(deviceRelates);

            //获取设备字段的值
            var deviceFields = [];
            $(".deviceFieldInput", $('#deviceFieldContainer', $("#" + this.vm.mainContentDivId))).each(function (i, element) {
                var $input = $(element);
                var deviceField = {};
                //设备类型字段id
                deviceField.deviceTypeFieldId = $input.attr("deviceTypeFieldId");
                //设备字段值
                deviceField.value = $input.val();

                deviceFields.push(deviceField);
            });

            formData.deviceFields = JSON.stringify(deviceFields);

            return formData;
        },
        //返回上一列表
        backToLastList: function () {
            //把上一列表显示
            this.lastContainer.showList = true;
            //隐藏当前列表
            this.showList = false;
        },
        //设备类型下拉框change事件
        deviceTypeIdChange: function (e) {
            //设备类型id
            var deviceTypeId = this.currentEntity.deviceTypeId;

            var formData = {};
            formData.token = serviceHelper.getToken();
            formData.r = Math.random();
            formData.deviceTypeId = deviceTypeId;
            formData.deviceId = this.currentEntity.id;
            formData.facilityId = this.currentFacilityId;
            //查询此设备类型所有设备类型字段
            $.ajax({
                type: "get",
                dataType: "json",
                url: serviceHelper.getBasicPath() + "/deviceType/getDeviceFieldByDeviceTypeId",
                data: formData,
                success: function (ajaxResult) {
                    if (ajaxResult) {
                        if (ajaxResult.success == true) {
                            var result = ajaxResult.data;

                            //设备关联
                            var deviceRelates = result.deviceRelates;
                            //根据设备类型字段的配置，构建录入表单的字段
                            $('#deviceFieldContainer', $("#" + this.vm.mainContentDivId)).empty();
                            for (var i = 0; i < deviceRelates.length; i++) {
                                var field = deviceRelates[i];

                                //设备字段类型，因为此数组既有设备关联字段，也有普通的设备字段，因此要区分
                                //此值写在input或select的class里
                                var deviceFieldInputType;
                                //input的自定义值
                                var inputCustomValue = "";
                                if (field.deviceRelate) {
                                    //设备关联字段
                                    deviceFieldInputType = "deviceRelateInput";
                                    inputCustomValue = ' deviceRelateTypeId="' + field.deviceRelateTypeId + '" ';
                                }
                                else {
                                    //设备字段
                                    deviceFieldInputType = "deviceFieldInput";
                                    inputCustomValue = ' deviceTypeFieldId="' + field.deviceTypeFieldId + '" ';
                                }

                                var $input;

                                //不同字段类型使用不用的控件
                                //字段名写在input的id里，class写入itemFieldInput代表是监测项动态字段
                                if (field.fieldType === "string") {
                                    $input = $('<div class="row">' +
                                        '<div class="form-group">' +
                                        '<label class="col-sm-3 control-label">' + field.nameCn + '</label>' +
                                        '<div class="col-sm-9">' +
                                        '<input type="text" id="' + field.name + '" class="form-control ' + deviceFieldInputType + '" ' + inputCustomValue + '>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>');

                                } else if (field.fieldType === "double" || field.fieldType === "int") {
                                    $input = $('<div class="row">' +
                                        '<div class="form-group">' +
                                        '<label class="col-sm-3 control-label">' + field.nameCn + '</label>' +
                                        '<div class="col-sm-9">' +
                                        '<input type="number" id="' + field.name + '" class="form-control ' + deviceFieldInputType + '" ' + inputCustomValue + '>' +
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
                                        ' <select id="' + field.name + '" class="form-control ' + deviceFieldInputType + '" ' + inputCustomValue + '>' +
                                        strItem +
                                        '</select>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>');
                                }
                                else {
                                    alert("不支持的字段类型：" + field.fieldType);
                                }

                                $('#deviceFieldContainer', $("#" + this.vm.mainContentDivId)).append($input);
                            }

                            //对录入表单字段赋值
                            for (var i = 0; i < deviceRelates.length; i++) {
                                var field = deviceRelates[i];

                                $('#' + field.name, $('#deviceFieldContainer', $("#" + this.vm.mainContentDivId))).val(field.fieldValue);
                            }
                        } else {
                            //后台操作失败的代码
                            alert(ajaxResult.msg);
                        }
                    }
                }.bind(this)
            });
        },
        //初始化容器
        initContainer: function (vm) {
            this.init(vm, "/device", [{
                //checkbox列，用于勾选多选行
                field: 'state',
                checkbox: 'true'
            }, {
                field: 'name',
                title: '名称'
            }, {
                field: 'deviceTypeId',
                title: '设备类型'
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
                    }.bind(this),
                    'click .delete': function (e, value, row, index) {
                        //删除（一条）
                        this.deleteOne(row.id);
                    }.bind(this),
                    'click .item': function (e, value, row, index) {
                        this.vm.showItemList(e, value, row, index);
                    }.bind(this),
                },
                //操作类的内容
                formatter: function (value, row, index) {
                    return [
                        '<a class="item" href="javascript:;">',
                        '监测项',
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
        }
    }
});

module.exports = comm;