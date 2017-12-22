//引用组件或视图

//此功能对应的视图（html）
var template = require('./containerItem.html');
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
            tableId: "tableItem",
            //表单（弹窗）id，同一页面如果有多个实体列表需要修改
            formId: "formItem",
            //当前设备id
            currentDeviceId: 0,
            //控制列表是否显示（此属性在容器基类），子表默认不显示
            showList: false,
            //上一级列表的容器（用于返回）
            lastContainer: null,
            //监测项类型下拉菜单所有值
            itemTypeIds: [],
        }
    },
    methods: {
        //初始化表单
        initForm: function () {
            var formData = {};
            formData.token = serviceHelper.getToken();
            formData.r = Math.random();
            //当前设备id
            formData.deviceId = this.currentDeviceId;

            $.ajax({
                type: "get",
                dataType: "json",
                url: serviceHelper.getBasicPath() + this.controllerUrl + "/getInitFormValue",
                data: formData,
                success: function (ajaxResult) {
                    if (ajaxResult) {
                        if (ajaxResult.success == true) {
                            var result = ajaxResult.data;
                            //监测项类型下拉菜单所有值
                            this.itemTypeIds = result.itemTypeIds;
                        } else {
                            //后台操作失败的代码
                            alert(ajaxResult.msg);
                        }
                    }
                }.bind(this)
            });
        },
        //获取自定义查询条件
        getCustomQueryParam: function () {
            var formData = {};
            formData.deviceId = this.currentDeviceId;

            return formData;
        },
        //获取自定义保存的值
        getCustomSaveValue: function () {
            var formData = {};
            formData.deviceId = this.currentDeviceId;

            //动态获取监测项字段的值
            $(".itemFieldInput", $('#itemFieldContainer', $("#" + this.vm.mainContentDivId))).each(function (i, element) {
                //input的id是字段名
                var $input = $(element);
                var elmentName = $input.attr("id");
                formData[elmentName] = $input.val();
            });

            return formData;
        },
        //刷新录入表单后的回调
        afterRefreshFormHandler: function () {
            //触发监测项类型下拉框change事件
            this.itemTypeIdChange();
        },
        //监测项类型下拉框change事件
        itemTypeIdChange: function (e) {
            //监测项类型id
            var itemTypeId = this.currentEntity.itemTypeId;

            var formData = {};
            formData.token = serviceHelper.getToken();
            formData.r = Math.random();
            formData.itemTypeId = itemTypeId;
            formData.itemId = this.currentEntity.id;
            //查询此设备类型所有设备类型字段
            $.ajax({
                type: "get",
                dataType: "json",
                url: serviceHelper.getBasicPath() + "/itemType/getItemFieldByItemTypeId",
                data: formData,
                success: function (ajaxResult) {
                    if (ajaxResult) {
                        if (ajaxResult.success == true) {
                            var result = ajaxResult.data;

                            var fields = result.fields;
                            fields = fields || [];
                            //根据监测项类型字段的配置，构建录入表单的字段
                            $('#itemFieldContainer', $("#" + this.vm.mainContentDivId)).empty();
                            for (var i = 0; i < fields.length; i++) {
                                var field = fields[i];

                                var $input;

                                //不同字段类型使用不用的控件
                                //字段名写在input的id里，class写入itemFieldInput代表是监测项动态字段
                                if (field.fieldType === "string") {
                                    $input = $('<div class="row">' +
                                        '<div class="form-group">' +
                                        '<label class="col-sm-3 control-label">' + field.nameCn + '</label>' +
                                        '<div class="col-sm-9">' +
                                        '<input type="text" id="' + field.name + '" class="form-control itemFieldInput" >' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>');
                                } else if (field.fieldType === "double" || field.fieldType === "int") {
                                    $input = $('<div class="row">' +
                                        '<div class="form-group">' +
                                        '<label class="col-sm-3 control-label">' + field.nameCn + '</label>' +
                                        '<div class="col-sm-9">' +
                                        '<input type="number" id="' + field.name + '" class="form-control itemFieldInput" >' +
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
                                        '<select id="' + field.name + '" class="form-control itemFieldInput">' +
                                        strItem +
                                        '</select>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>');
                                }
                                else {
                                    alert("不支持的字段类型：" + field.fieldType);
                                }

                                $('#itemFieldContainer', $("#" + this.vm.mainContentDivId)).append($input);
                            }

                            //对录入表单字段赋值
                            for (var i = 0; i < fields.length; i++) {
                                var field = fields[i];

                                if (field.fieldType == "string" || field.fieldType == "double" || field.fieldType == "int" || field.fieldType == "select") {
                                    $('#' + field.name, $('#itemFieldContainer', $("#" + this.vm.mainContentDivId))).val(field.fieldValue);
                                }
                            }
                        } else {
                            //后台操作失败的代码
                            alert(ajaxResult.msg);
                        }
                    }
                }.bind(this)
            });
        },
        //返回上一列表
        backToLastList: function () {
            //把上一列表显示
            this.lastContainer.showList = true;
            //隐藏当前列表
            this.showList = false;
        },
        //初始化容器
        initContainer: function (vm) {
            this.init(vm, "/item", [{
                //checkbox列，用于勾选多选行
                field: 'state',
                checkbox: 'true'
            }, {
                field: 'name',
                title: '名称'
            }, {
                field: 'itemTypeId',
                title: '监测项类型'
            }, {
                field: 'createDate',
                title: '创建日期'
            }]);
        }
    }
});

module.exports = comm;