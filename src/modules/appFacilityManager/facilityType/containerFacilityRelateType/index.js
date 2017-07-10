//引用组件或视图

//此功能对应的视图（html）
var template = require('./containerFacilityRelateType.html');
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
            tableId: "tableFacilityRelateType",
            //表单（弹窗）id，同一页面如果有多个实体列表需要修改
            formId: "formFacilityRelateType",
            //当前测站类型id
            currentFacilityTypeId: 0,
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
            formData.facilityTypeId = this.currentFacilityTypeId;

            return formData;
        },
        getCustomSaveValue: function () {
            var formData = {};
            //保存前把当前主表id传到后台，保存时用到
            formData.facilityTypeId = this.currentFacilityTypeId;

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
            this.init(vm, "/facilityRelateType", [{
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
                field: 'relateFacilityTypeName',
                title: '可关联测站类型'
            }]);
        }
    }
});

module.exports = comm;