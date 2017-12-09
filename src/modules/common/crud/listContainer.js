var eventHelper = require('utils/eventHelper');
var serviceHelper = require('services/serviceHelper.js');

//bootstrap原版js
require('bootstrap/dist/js/bootstrap.js');
//bootstrap-table列表控件
require('bootstrap-table/dist/bootstrap-table.css');
require('bootstrap-table/dist/bootstrap-table.js');
require('bootstrap-table/dist/locale/bootstrap-table-zh-CN.js');
//bootstrap-datetimepicker日期选择控件
require('lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css');
require('lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js');
require('lib/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js');
//layui.layer弹窗组件
require('lib/layer/skin/default/layer.css');
require('lib/layer/layer.js');
//文件上传控件
require('bootstrap-fileinput/js/fileinput.js');
require('bootstrap-fileinput/js/locales/zh.js');
require('bootstrap-fileinput/css/fileinput.min.css');

//增删改列表容器
//一个容器代表一个表
var container = Vue.extend({
    data: function () {
        return {
            //全局vm对象，用于容器里访问
            vm: null,
            //列表id，同一页面如果有多个实体列表需要修改
            tableId: "tableMain",
            //表单（弹窗）id，同一页面如果有多个实体列表需要修改
            formId: "formMain",
            //容器对应的表的controller的url
            controllerUrl: "",
            //增删改几大常用操作url
            saveUrl: "",
            listUrl: "",
            getUrl: "",
            deleteUrl: "",
            //当前编辑实体
            currentEntity: {},
            //当前实体是否保存过（例如新增时，就是没保存，编辑时就是保存了）
            currentEntityHasSave: false,
            //工具条（界面）查询条件
            toolbarQueryParam: {},
            //是否分页
            pagination: true,
            //是否单选
            singleSelect: false,
            //是否能编辑（影响编辑功能，例如双击编辑功能）
            canEdit: true,
            //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
            addDefaultOperateColumn: true,
            //控制列表是否显示（通常在多表时使用，单表是不需要）
            showList: true,
        }
    },
    watch: {
        currentEntity: function (val) {
            // 赋值 当前实体是否保存过
            if (val && val.id && val.id > 0) {
                this.currentEntityHasSave = true;
            }
            else {
                this.currentEntityHasSave = false;
            }

            //日期选择控件处理
            $('.datetimepicker', $("#" + this.vm.mainContentDivId)).each(function (i, n) {
                //获取属性名
                var fieldName = $(this).attr('field');
                //把实体的属性的值写到控件，如果没有该属性的值就是新建，那就给界面值设空值
                //这里没用vue而是用jquery因为vue的绑定在此控件使用时，造成手动选择的值会丢失
                if (val && val[fieldName]) {
                    $(this).val(val[fieldName]);
                }
                else {
                    $(this).val("");
                }
            });
        },
    },
    methods: {
        /**
         * 初始化
         * @param vm 全局vm对象，传入容器用于在容器访问
         * @param controllerUrl 容器对应的表的controller的url
         * @param gridConfig grid配置
         */
        init: function (vm, controllerUrl, fields) {
            //全局vue对象传到此容器，供容器内部访问外部的其他vue对象
            this.vm = vm;

            //以下各初始化方法顺序不能乱
            //以下初始化方法可以按需屏蔽或修改，但请在熟悉此基类情况时才进行修改

            //初始化常用url，包括获取列表数据，保存，删除的url
            this.initCommonUrl(controllerUrl);
            //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
            this.initToolbarQueryParam();
            //初始化列表也就是table控件的列配置
            this.initTableField(fields);
            //初始化列表也就是table控件
            this.initLoadTableData(fields);
        },
        //初始化常用url，包括获取列表数据，保存，删除的url
        initCommonUrl: function (controllerUrl) {
            this.controllerUrl = controllerUrl;
            //增删改常用controller的url自动拼写
            this.saveUrl = controllerUrl + "/save";
            this.listUrl = controllerUrl + "/list";
            this.getUrl = controllerUrl + "/get";
            this.deleteUrl = controllerUrl + "/delete";
        },
        //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
        initToolbarQueryParam: function () {
            this.toolbarQueryParam = {};
        },
        //初始化列表也就是table控件的列配置
        initTableField: function (fields) {
            //添加默认操作列
            if (this.addDefaultOperateColumn) {
                //往传入的列配置添加
                fields.push({
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
                        }.bind(this)
                    },
                    //操作类的内容
                    formatter: function (value, row, index) {
                        return [
                            //格式：一个功能是一个a，class必填因为跟点击事件有关
                            '<a class="edit" href="javascript:;" title="编辑">',
                            '<i class="glyphicon glyphicon-edit"></i>',
                            '</a>  ',
                            '<a class="delete" href="javascript:;" title="删除">',
                            '<i class="glyphicon glyphicon-remove"></i>',
                            '</a>'
                        ].join('');
                    }
                });
            }
        },
        //初始化列表也就是table控件
        initLoadTableData: function (fields) {
            //初始化列表
            //注意，此处jquery查找会在$("#" + this.vm.mainContentDivId)这个元素内进行查找，这是由于不同页面的元素id可能有重复，因此要限制在此功能的元素内
            $('#' + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable({
                //是否分页
                pagination: this.pagination,
                //服务端还是客户端分页（server/client）
                sidePagination: "server",
                //单击选中行
                clickToSelect: true,
                //是否单选
                singleSelect: this.singleSelect,
                //分页触发事件
                onPageChange: function (number, size) {
                    this.refreshList(number, size);
                }.bind(this),
                //列定义
                columns: fields,
                //双击行事件
                onDblClickRow: function (row, $element, field) {
                    if (this.canEdit) {
                        //双击开启编辑行
                        this.edit(row.id, row);
                    }
                }.bind(this)
            });
        },
        //获取自定义查询条件（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
        getCustomQueryParam: function () {
            return null;
        },
        //获取自定义保存的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
        getCustomSaveValue: function () {
            return null;
        },
        //获取自定义删除的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
        getCustomDeleteValue: function () {
            return null;
        },
        //刷新列表后的回调
        afterRefreshListHandler: function () {

        },
        //刷新录入表单后的回调
        afterRefreshFormHandler: function () {

        },
        //表单保存前触发，可用于表单验证
        //需要有返回值，返回true就是继续保存，false就是不保存
        beforeSaveForm: function () {
            return true;
        },
        //删除后的回调
        afterDeleteHandler: function () {

        },
        //查询
        search: function () {
            this.refreshList();
        },
        //新增
        add: function () {
            this.openWin();
        },
        //编辑
        edit: function (id) {
            //支持传入id，如果没id就从当前选中的行获取
            //有时会传入事件参数不过非数字，要验证
            if (!(id) || isNaN(id)) {
                var rows = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getSelections");
                if (rows.length == 0) {
                    //layui组件，用来代替alert
                    layer.msg('请选择记录');
                    return;
                }
                var row = rows[0];
                id = row.id;
            }
            this.openWin(id);
        },
        //打开编辑窗口
        openWin: function (id) {
            //新增时没id，编辑时有
            if (id) {
                var formData = serviceHelper.getDefaultAjaxParam();
                formData.id = id;

                serviceHelper.getJson(serviceHelper.getBasicPath() + this.getUrl, formData, function (result) {
                    this.currentEntity = result;

                    if (this.afterRefreshFormHandler)
                    //刷新录入表单后的回调
                        this.afterRefreshFormHandler(result);

                    //弹出编辑窗口
                    this.showForm();
                }.bind(this));
            }
            else {
                //新增时要清空当前实体
                this.currentEntity = {};

                if (this.afterRefreshFormHandler)
                //刷新录入表单后的回调
                    this.afterRefreshFormHandler();

                //弹出编辑窗口
                this.showForm();
            }
        },
        //刷新列表
        refreshList: function (pageNumber, pageSize) {
            //获取刷新列表的查询参数
            var formData = this.getRefreshListParam(pageNumber, pageSize);

            serviceHelper.getJson(serviceHelper.getBasicPath() + this.listUrl, formData, function (result) {
                //填充数据到grid

                //按bootstrap table要求的格式组织数据，并加载数据到table
                var tableData = {};
                tableData.total = result.totalRecord;
                tableData.rows = result.records;

                $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("load", tableData);

                //分页部分，选择每页行数下拉菜单不能弹出的修复
                //此下拉菜单使用bootstrap的Dropdowns控件，可能由于已经过了bootstrap初始化的时机，导致此控件没有正常初始化，因此在此手动初始化
                $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).parent().parent().find('.dropdown-toggle').dropdown();

                //触发刷新列表后的回调
                if (this.afterRefreshListHandler)
                    this.afterRefreshListHandler();
            }.bind(this));
        },
        //获取刷新列表的查询参数
        getRefreshListParam: function (pageNumber, pageSize) {
            //获取分页信息（分为外部传入和使用当前分页信息）
            //获取分页信息（分为外部传入和使用当前分页信息）
            pageNumber = pageNumber || $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getOptions").pageNumber;
            pageSize = pageSize || $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getOptions").pageSize;

            //查询条件
            var formData = serviceHelper.getDefaultAjaxParam();
            //分页
            formData.pageNumber = pageNumber;
            formData.pageSize = pageSize;

            //加上工具条（界面）查询条件
            if (this.toolbarQueryParam)
                $.extend(formData, this.toolbarQueryParam);

            //加上自定义查询条件
            var queryParam = this.getCustomQueryParam();
            if (queryParam)
                $.extend(formData, queryParam);

            return formData;
        },
        //显示
        showForm: function () {
            $("#" + this.formId, $("#" + this.vm.mainContentDivId)).modal("show");
        },
        //隐藏
        hideForm: function () {
            $("#" + this.formId, $("#" + this.vm.mainContentDivId)).modal("hide");
        },
        //编辑表单提交按钮事件
        submit: function () {
            //处理日期控件的值，从控件把值取出来并赋值到实体
            $('.datetimepicker', $("#" + this.formId, $("#" + this.vm.mainContentDivId))).each(function (i, n) {
                //从控件取出字段名
                var fieldName = $(n).attr('field');

                if (fieldName) {
                    //赋值到实体
                    this.currentEntity[fieldName] = $(n).val();
                }
            }.bind(this));

            //复制当前实体（因为保存的表单对象不一定等于当前实体，防止污染当前实体，因此把复制一份作为保存对象）
            var formData = $.extend(serviceHelper.getDefaultAjaxParam(), this.currentEntity);

            //加上自定义保存的值
            var customSaveValue = this.getCustomSaveValue();
            if (customSaveValue)
                $.extend(formData, customSaveValue);

            //表单保存前触发，可用于表单验证
            //需要有返回值，返回true就是继续保存，false就是不保存
            if (!this.beforeSaveForm()) {
                return;
            }

            serviceHelper.postJson(serviceHelper.getBasicPath() + this.saveUrl, formData, function (result) {
                //关闭弹窗
                this.hideForm();

                //修改数据后刷新列表
                this.refreshList();
            }.bind(this));
        },
        //删除选择的多条记录
        del: function () {
            var rows = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getSelections");
            if (rows.length == 0) {
                layer.msg('请选择记录');
                return;
            }

            this.deleteData(rows);
        },
        //删除一条记录
        deleteOne: function (id) {
            var rows = [];
            rows.push({id: id});

            this.deleteData(rows);
        },
        //删除
        deleteData: function (rows) {
            layer.confirm('确定删除记录？', {
                btn: ['确定', '取消']
            }, function (index) {
                //关闭弹窗
                layer.close(index);

                var formData = {};
                //支持一次删除多条，id用逗号隔开
                formData.ids = "";
                for (var i = 0; i < rows.length; i++) {
                    if (formData.ids)
                        formData.ids += ",";

                    formData.ids += rows[i].id;
                }

                //加上自定义删除的值
                var customDeleteValue = this.getCustomDeleteValue();
                if (customDeleteValue)
                    $.extend(formData, customDeleteValue);

                serviceHelper.getJson(serviceHelper.getBasicPath() + this.deleteUrl, formData, function (result) {
                    this.refreshList();

                    //删除后的回调
                    if (this.afterDeleteHandler)
                        this.afterDeleteHandler();
                }.bind(this));
            }.bind(this), function () {

            });
        },
        /**
         * 初始化或刷新文件上传控件
         * @param id input的id
         * @param bizType 功能类型
         * @param options 上传控件的配置项，具体属性说明请看方法内的注释
         * @param fileSelectHandler 选择文件后回调
         * @param fileUploadedHandler 上传文件成功回调
         */
        refreshFileUpload: function (id, bizType, options, fileSelectHandler, fileUploadedHandler) {
            //由于文件上传控件没提供清除initialPreviewConfig数据的方法，因此每次刷新数据只能destroy
            $('#' + id, $("#" + this.vm.mainContentDivId)).fileinput('destroy');

            //获取当前行的上传文件
            var formData = serviceHelper.getDefaultAjaxParam();
            formData.bizType = bizType;
            if (this.currentEntity && this.currentEntity.id) {
                formData.bizId = this.currentEntity.id;
            } else {
                formData.bizId = 0;
            }

            $.ajax({
                type: "get",
                dataType: "json",
                url: serviceHelper.getBasicPath() + "/uploadFile/getUploadFilesByBizId",
                data: formData,
                success: function (ajaxResult) {
                    if (ajaxResult) {
                        if (ajaxResult.success == true) {
                            var result = ajaxResult.data;

                            //已上传的文件赋值到initialPreview和initialPreviewConfig
                            var initialPreviews = [];
                            var initialPreviewConfigs = [];
                            for (var i = 0; i < result.length; i++) {
                                var uploadFile = result[i];
                                //文件下载url
                                initialPreviews.push(serviceHelper.getBasicPath() + "/uploadFile/downloadFileById?id=" + uploadFile.id + "&token=" + serviceHelper.getToken());

                                var initialPreviewConfig = {};

                                //预览类型，就是使用什么方式来预览文件，跟文件类型有关，具体所有可选值请看官方文档
                                //其中other可以理解为没有预览，就显示一个张固定图片
                                var previewType = "other";
                                if (uploadFile.fileExt == "jpg" || uploadFile.fileExt == "bmp" || uploadFile.fileExt == "gif" || uploadFile.fileExt == "png") {
                                    previewType = "image";
                                }
                                initialPreviewConfig.type = previewType;
                                //标题
                                initialPreviewConfig.caption = uploadFile.sourceFileName;
                                //是否显示放大按钮
                                initialPreviewConfig.showZoom = false;
                                initialPreviewConfig.key = uploadFile.id;
                                //删除文件的url
                                initialPreviewConfig.url = serviceHelper.getBasicPath() + "/uploadFile/deleteById?id=" + uploadFile.id + "&token=" + serviceHelper.getToken();

                                initialPreviewConfigs.push(initialPreviewConfig);
                            }

                            options = options || {};
                            //以下是文件上传控件的默认值
                            //此文件上传控件叫bootstrap fileinput，更多用法可以网上搜索或者看http://plugins.krajee.com/file-input
                            var options = $.extend({
                                //初始化时数据的配置
                                initialPreview: initialPreviews,
                                initialPreviewAsData: true,
                                initialPreviewConfig: initialPreviewConfigs,
                                overwriteInitial: false,
                                //语言
                                language: 'zh',
                                //上传的地址（下面还有上传的参数（uploadExtraData））
                                uploadUrl: serviceHelper.getBasicPath() + "/uploadFile/batchUploadFile",
                                //是否显示预览窗
                                // showPreview: false,
                                //默认是否显示拖拽文件的窗
                                dropZoneEnabled: false,
                                // previewFileType: "image",
                                //可以预览的文件类型
                                allowedPreviewTypes: ['image'],
                                //接收的文件后缀,array类型，例如：['jpg', 'png','gif']
                                allowedFileExtensions: ['jpg', 'png', 'gif', 'bmp'],
                                //最大上传文件数
                                maxFileCount: 100,
                                //自定义界面（包括各个按钮，预览框都都能改变）
                                // layoutTemplates: {
                                //     actionZoom: '<a href="{dataUrl}"><button type="button" class="kv-file-zoom {zoomClass}" title="下载">{zoomIcon}</button></a>',
                                // },
                                // otherActionButtons: '<button type="button" class="kv-cust-btn btn btn-xs btn-default" title="Download" data-key="{data}">' +
                                // '<i class="glyphicon glyphicon-download"></i>' +
                                // '</button>',
                                //预览框下方附加按钮
                                //下载功能实现
                                otherActionButtons: '<a type="button" class="kv-cust-btn btn btn-xs btn-default" title="下载" href="{data}">' +
                                '<i class="glyphicon glyphicon-download"></i>' +
                                '</a>',
                                //上传时发起请求，额外加入请求的值
                                uploadExtraData: function (previewId, index) {
                                    var formData = serviceHelper.getDefaultAjaxParam();
                                    formData.bizType = bizType;
                                    formData.bizId = this.currentEntity.id;

                                    return formData;
                                }.bind(this),
                            }, options);

                            $('#' + id, $("#" + this.vm.mainContentDivId)).fileinput(options).on("filebatchselected", function (event, files) {
                                if (fileSelectHandler) {
                                    fileSelectHandler(event, files);
                                }
                            }.bind(this)).on("fileuploaded", function (event, data) {
                                if (fileUploadedHandler)
                                    fileUploadedHandler(event, data);
                            }.bind(this));
                        } else {
                            //后台操作失败的代码
                            alert(ajaxResult.msg);
                        }
                    }
                }.bind(this)
            });
        },
    },
});

module.exports = container;
