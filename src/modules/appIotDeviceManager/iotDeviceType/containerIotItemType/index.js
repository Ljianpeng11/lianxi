//此功能对应的视图（html）
var template = require('./containerIotItemType.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

var comm = container.extend({
    template: template,

    data: function () {
        return {
            //列表id，同一页面如果有多个实体列表需要修改
            tableId: "tableIotItemType",
            //表单（弹窗）id，同一页面如果有多个实体列表需要修改
            formId: "formIotItemType",
            //上传（弹窗）id
            formUploadId: "formUploadFromProfile",
            //当前iot监测项类型id
            currentIotDeviceTypeId: 0,
            //控制列表是否显示（此属性在容器基类），子表默认不显示
            showList: false,
            //上一级列表的容器（用于返回）
            lastContainer: null,
        }
    },
    methods: {
        getCustomQueryParam: function () {
            var formData = {};
            //查询前把当前主表id传到后台，列表查询用到
            formData.iotDeviceTypeId = this.currentIotDeviceTypeId;

            return formData;
        },
        getCustomSaveValue: function () {
            var formData = {};
            //保存前把当前主表id传到后台，保存时用到
            formData.iotDeviceTypeId = this.currentIotDeviceTypeId;

            return formData;
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
            this.init(vm, "/iotItemType", [{
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
                field: 'classId',
                title: '类标识'
            }, {
                field: 'translateSymbol',
                title: '转换类型'
            }, {
                field: 'translateValue',
                title: '转换参数'
            }, {
                field: 'maxVal',
                title: '最大值'
            }, {
                field: 'minVal',
                title: '最小值'
            }, {
                field: 'reportStartIndex',
                title: '报文索引'
            }, {
                field: 'reportLength',
                title: '报文长度'
            }]);
        },
        //显示上传窗口
        showFormUploadFromProfile: function () {

            $("#" + this.formUploadId).modal("show");
            this.customUploadFile("inputUploadProfile");
        },

        closeNRefresh: function () {
            this.refreshList();
        },
        //自定义上传
        customUploadFile: function (id) {
            var options = {
                //语言
                language: 'zh',
                //上传的地址（下面还有上传的参数（uploadExtraData））
                //地址可以随便改
                uploadUrl: serviceHelper.getBasicPath() + "/iotItemType/customUploadFile",
                //是否显示预览窗
                showPreview: false,
                //默认是否显示拖拽文件的窗
                dropZoneEnabled: false,
                // previewFileType: "image",
                //可以预览的文件类型
                allowedPreviewTypes: ['json'],
                //接收的文件后缀,array类型，例如：['jpg', 'png','gif']
                allowedFileExtensions: ['json'],
                //最大上传文件数
                maxFileCount: 100,
                //上传时发起请求，额外加入请求的值
                uploadExtraData: function (previewId, index) {
                    //这里可以定义上传时传到后台的参数
                    var formData = {};
                    formData.iotDeviceTypeId = this.currentIotDeviceTypeId;
                    // formData.bizId = this.currentEntity.id;
                    formData.token = serviceHelper.getToken();
                    return formData;
                }.bind(this),
            };

            //真正的初始化代码，on方法写定义的是事件
            $('#' + id, $("#" + this.vm.mainContentDivId)).fileinput(options).on("filebatchselected", function (event, files) {
                //选择文件事件。选择文件后触发，例如要选择文件就马上上传可以在这里加代码
                //选择文件后马上上传
                // $(this).fileinput("upload");
            }).on("fileuploaded", function (event, data) {
                //上传文件成功事件。上传文件后执行的代码可以写在这

                //上传成功后回调
                if (data.response.success == true) {

                } else {
                    alert(data.response.msg);
                }
            });

        },
    }
})

module.exports = comm;