//引用组件或视图

//此功能对应的视图（html）
var template = require('./menuManager.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//默认（最简）功能基类
var defaultBase = require('modules/common/defaultBase');

//表单验证
var eFormValid = require('modules/common/eFormValid.js');

//ztree树控件
require('ztree/js/jquery.ztree.all.js');
require('ztree/css/metroStyle/metroStyle.css');

//菜单树样式
require('./menuManager.css');

var comm = defaultBase.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            //当前节点
            currentNode: null,
            //当前实体
            currentEntity: {},
            //表单验证对象
            eFormValid: null,
            //当前导入到的节点
            nodeImport: null,
            //ztree的id
            treeId: ""
        }
    },
    created: function () {
        //ztree的id，ztree在系统全局不能重复
        this.treeId = "tree" + Math.random().toString(36).substr(2);
    },
    mounted: function () {
        //刷新菜单树
        this.refreshTree();
        //初始化导入的文件控件
        this.initFileImport();
    },
    methods: {
        //获取ztree对象
        getZTreeObject: function () {
            return $.fn.zTree.getZTreeObj(this.treeId);
        },
        //初始化和刷新菜单树
        refreshTree: function () {
            var formData = serviceHelper.getDefaultAjaxParam();

            serviceHelper.getJson(serviceHelper.getBasicPath() + "/menu/getTreeData", formData, function (result) {

                //节点拖动时判断是否能停靠到某节点
                function canPrevAndNext(treeId, nodes, targetNode) {
                    //只允许在同一父节点之间拖动
                    //目标节点的父节点
                    var targetParentNode = targetNode.getParentNode();
                    //当前节点的父节点
                    var currentNode = nodes[0];
                    var currentParentNode = currentNode.getParentNode();
                    //目标节点和当前节点要同一个父节点
                    if (targetParentNode == currentParentNode)
                        return true;
                    else
                        return false;
                }

                //初始化树控件并填充数据
                $.fn.zTree.init($("#" + this.treeId), {
                    data: {
                        keep: {
                            //没此设置时，非子叶节点的最后一个子节点被删除后，会自动变成子叶节点
                            parent: true
                        }
                    },
                    //编辑设置，开启了拖动编辑
                    edit: {
                        enable: true,
                        showRemoveBtn: false,
                        showRenameBtn: false,
                        drag: {
                            prev: canPrevAndNext,
                            next: canPrevAndNext,
                            inner: false
                        }
                    },
                    callback: {
                        onClick: function (event, treeId, treeNode) {
                            //单击树节点事件
                            this.selectNode(treeNode);
                        }.bind(this),
                        onDrop: function (event, treeId, treeNodes, targetNode, moveType) {
                            var currentNode = treeNodes[0];
                            //子节点集合
                            var nodes;
                            //父id
                            var parentId;
                            if (currentNode.getParentNode()) {
                                //非根节点
                                nodes = currentNode.getParentNode().children;
                                parentId = currentNode.getParentNode().id;
                            }
                            else {
                                //根节点
                                nodes = $.fn.zTree.getZTreeObj(treeId).getNodes();
                                parentId = -1;
                            }

                            //当前节点的父节点的所有子节点，获取其id和序号，id在key，序号在value
                            var idAndSort = {};
                            for (var i = 0; i < nodes.length; i++) {
                                var node = nodes[i];
                                //排除未保存的新节点
                                if (!(node.id) || node.id <= 0) continue;

                                idAndSort["" + node.id] = i;
                            }

                            //在后台保存顺序
                            var formData = serviceHelper.getDefaultAjaxParam();
                            formData.parentId = parentId;
                            formData.idAndSort = JSON.stringify(idAndSort);

                            serviceHelper.getJson(serviceHelper.getBasicPath() + "/menu/updateNodeSort", formData, function (result) {

                            }.bind(this));
                        }.bind(this)
                    }
                }, result);

                //展开根节点
                this.getZTreeObject().expandNode(this.getZTreeObject().getNodes()[0]);
            }.bind(this));
        },
        //获取选择的要作为父图层的图层
        getSelectMenuUseParent: function () {
            //获取当前选择节点
            var lstNodeSelect = this.getZTreeObject().getSelectedNodes();
            if (lstNodeSelect.length === 0) {
                layer.msg('请选择节点');
                return null;
            }

            var nodeSelect = lstNodeSelect[0];
            //父节点要先保存（因为需求parentId）
            if (nodeSelect.isSave === false) {
                layer.msg('请先保存父节点');
                return null;
            }

            return nodeSelect;
        },
        //新增组菜单
        addGroupMenu: function () {
            var nodeSelect = this.getSelectMenuUseParent();
            if (!(nodeSelect))
                return;

            if (nodeSelect.type !== "组菜单") {
                layer.msg('组菜单只能添加到组菜单');
                return;
            }

            //添加组图层节点
            this.addNode(nodeSelect, "组菜单");
        },
        //新增功能菜单
        addFunMenu: function () {
            var nodeSelect = this.getSelectMenuUseParent();
            if (!(nodeSelect))
                return;

            if (nodeSelect.type !== "组菜单") {
                layer.msg('功能菜单只能添加到组菜单');
                return;
            }

            //添加组图层节点
            this.addNode(nodeSelect, "功能菜单");
        },
        //新增功能
        addFun: function () {
            var nodeSelect = this.getSelectMenuUseParent();
            if (!(nodeSelect))
                return;

            if (nodeSelect.type !== "功能菜单") {
                layer.msg('功能只能添加到功能菜单');
                return;
            }

            //添加组图层节点
            this.addNode(nodeSelect, "功能");
        },
        //添加节点
        //parentNode=父节点，type=菜单类型
        addNode: function (parentNode, type) {
            var nodeNew = {};
            nodeNew.id = 0;
            var name = "新" + type;
            nodeNew.name = name;
            //父节点为null就是根节点
            nodeNew.parentId = parentNode.id;
            nodeNew.type = type;
            //图标
            var iconSkin = "";
            if (type === "组菜单") {
                iconSkin = "group";
            }
            else if (type === "功能菜单") {
                iconSkin = "funMenu";
            }
            else if (type === "功能") {
                iconSkin = "fun";
            }
            nodeNew.iconSkin = iconSkin;

            nodeNew.isParent = type === "组菜单" || type === "功能菜单";
            if (nodeNew.isParent)
                nodeNew.children = [];
            nodeNew.isSave = false;
            //添加节点
            var nodeReal = this.getZTreeObject().addNodes(parentNode, nodeNew);
            //选中节点
            this.getZTreeObject().selectNode(nodeReal[0]);

            this.selectNode(nodeReal[0]);
        },
        //选择节点
        selectNode: function (node) {
            if (!node) {
                //传入空对象时，要把界面清空
                this.currentNode = null;
                this.currentEntity = {};

                this.setFormControlVisible();
            }
            else {
                //存放当前节点
                this.currentNode = node;
                //根节点不需要显示属性
                if (node.isRoot == true) {
                    this.currentEntity = {};
                    this.setFormControlVisible();
                    return;
                }

                if (node.isSave === false) {
                    //新节点（未保存过的）
                    //把节点的属性复制到实体
                    this.currentEntity = $.extend({}, node);
                    this.setFormControlVisible();
                }
                else {
                    //已保存的节点，后台查询获取实体
                    var formData = serviceHelper.getDefaultAjaxParam();
                    formData.id = node.id;

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/menu/get", formData, function (result) {
                        this.currentEntity = result;
                        this.setFormControlVisible();
                    }.bind(this));
                }
            }
        },
        //根据菜单类型，设置界面控件的显示和隐藏
        setFormControlVisible: function () {
            var type = this.currentNode && this.currentNode.type ? this.currentNode.type : "";

            //清除上一次验证的痕迹
            if (this.eFormValid) {
                this.eFormValid.clearValidResult();
            }

            //根据不同菜单显示，显示该类型特有的字段控件，以及不同的字段验证
            if (type === "功能菜单") {
                this.setFormControlShow("funId");
                this.setFormControlShow("funUrl");
                this.setFormControlShow("icon1");
                this.setFormControlShow("icon2");
                this.setFormControlShow("icon3");
                this.setFormControlShow("operType");
                this.setFormControlShow("enabled");

                //表单验证
                this.eFormValid = new eFormValid();
                this.eFormValid.mainContentDivId = this.mainContentDivId;
                this.eFormValid.addNotNullRule("title", "标题");
                this.eFormValid.addNotNullRule("funUrl", "功能url");
                this.eFormValid.addNotNullRule("enabled", "是否启用");
                this.eFormValid.addNotNullRule("operType", "操作类型");

                //初始值
                this.currentEntity.enabled = typeof(this.currentEntity.enabled) !== 'undefined' ? this.currentEntity.enabled : 1;
                this.currentEntity.operType = typeof(this.currentEntity.operType) !== 'undefined' ? this.currentEntity.operType : "跳转";
            }
            else if (type === "功能") {
                this.setFormControlShow("funId");
                this.setFormControlShow("funUrl");
                this.setFormControlHide("icon1");
                this.setFormControlHide("icon2");
                this.setFormControlHide("icon3");
                this.setFormControlHide("operType");
                this.setFormControlShow("enabled");

                //表单验证
                this.eFormValid = new eFormValid();
                this.eFormValid.mainContentDivId = this.mainContentDivId;
                this.eFormValid.addNotNullRule("title", "标题");
                this.eFormValid.addNotNullRule("enabled", "是否启用");

                //初始值
                this.currentEntity.enabled = typeof(this.currentEntity.enabled) !== 'undefined' ? this.currentEntity.enabled : 1;
            }
            else {
                this.setFormControlHide("funId");
                this.setFormControlHide("funUrl");
                this.setFormControlShow("icon1");
                this.setFormControlShow("icon2");
                this.setFormControlShow("icon3");
                this.setFormControlHide("operType");
                this.setFormControlShow("enabled");

                //表单验证
                this.eFormValid = new eFormValid();
                this.eFormValid.mainContentDivId = this.mainContentDivId;
                this.eFormValid.addNotNullRule("title", "标题");
                this.eFormValid.addNotNullRule("enabled", "是否启用");

                //初始值
                this.currentEntity.enabled = typeof(this.currentEntity.enabled) !== 'undefined' ? this.currentEntity.enabled : 1;
            }
        },
        //设置表单中单个控件显示
        setFormControlHide: function (controlId) {
            //传入的id是具体输入的控件，例如input的id，但控制显隐要控制上级的bootstrap row
            $("#" + controlId, $("#" + this.mainContentDivId)).parent().parent().parent().hide();
        },
        //设置表单中单个控件隐藏
        setFormControlShow: function (controlId) {
            $("#" + controlId, $("#" + this.mainContentDivId)).parent().parent().parent().show();
        },
        //保存
        save: function () {
            //通过currentEntity的type是否有值判断当前是否可保存
            if (!this.currentEntity || !this.currentEntity.type) return;

            //复制当前实体（因为保存的表单对象不一定等于当前实体，防止污染当前实体，因此把复制一份作为保存对象）
            var formData = $.extend(serviceHelper.getDefaultAjaxParam(), this.currentEntity);

            //表单验证
            if (!this.eFormValid.valid())
                return;

            serviceHelper.postJson(serviceHelper.getBasicPath() + "/menu/save", formData, function (result) {
                //保存后同步信息到树节点
                this.currentEntity = result;

                this.currentNode.isSave = true;
                this.currentNode.id = this.currentEntity.id;
                this.currentNode.name = this.currentEntity.title;

                this.getZTreeObject().updateNode(this.currentNode);

                layer.msg('保存成功');
            }.bind(this));
        },
        //删除菜单
        del: function () {
            //获取当前选择节点
            var lstNodeSelect = this.getZTreeObject().getSelectedNodes();
            if (lstNodeSelect.length === 0) {
                layer.msg('请选择节点');
                return;
            }

            var nodeSelect = lstNodeSelect[0];
            //根节点不能删除
            if (nodeSelect.isRoot) {
                layer.msg('根节点不能删除');
                return;
            }

            layer.confirm('确定删除记录？', {
                //定义按钮，可以多个
                btn: ['确定', '取消']
                //接下来是每个按钮的回调函数，一般有一个按钮就有几个回调
                //参数1是弹窗的index，可以用此标识弹窗
            }, function (index) {
                //关闭弹窗（代码关闭弹窗的方法，但有时不用这句都会自己关闭，原因不明）
                layer.close(index);

                if (nodeSelect.isSave === false) {
                    //没保存的直接删节点
                    this.getZTreeObject().removeNode(nodeSelect);
                }
                else {
                    //已保存的，先从数据库删节点
                    var formData = serviceHelper.getDefaultAjaxParam();
                    //一次只能选择一个节点
                    formData.ids = "" + nodeSelect.id;

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/menu/delete", formData, function (result) {
                        //删除树节点
                        this.getZTreeObject().removeNode(nodeSelect);

                        //删除后，要把当前选择节点清空
                        this.selectNode(null);
                    }.bind(this));
                }
            }.bind(this));
        },
        //导出菜单
        exportMenu: function () {
            //获取当前选择节点
            var lstNodeSelect = this.getZTreeObject().getSelectedNodes();
            if (lstNodeSelect.length === 0) {
                layer.msg('请选择节点');
                return;
            }

            var nodeSelect = lstNodeSelect[0];
            //以下载文件方式下载导出菜单的文件
            window.location.href = serviceHelper.getBasicPath() + "/menu/exportMenu?token=" + serviceHelper.getToken() + "&meunId=" + nodeSelect.id;
        },
        //导入菜单
        importMenu: function () {
            //获取当前选择节点
            var lstNodeSelect = this.getZTreeObject().getSelectedNodes();
            if (lstNodeSelect.length === 0) {
                layer.msg('请选择节点');
                return;
            }

            var nodeSelect = lstNodeSelect[0];

            if (nodeSelect.isSave === false) {
                layer.msg('不能导入到未保存节点');
                return null;
            }

            if (nodeSelect.type !== "组菜单") {
                layer.msg('只能导入到组菜单');
                return;
            }

            this.nodeImport = nodeSelect;

            this.showForm("formImport");
        },
        //显示
        showForm: function (formId) {
            $("#" + formId, $("#" + this.mainContentDivId)).modal("show");
        },
        //隐藏
        hideForm: function (formId) {
            $("#" + formId, $("#" + this.mainContentDivId)).modal("hide");
        },
        //初始化导入的文件控件
        initFileImport: function () {
            $('#inputUploadImport', $("#" + this.mainContentDivId)).fileinput({
                language: 'zh', //设置语言
                uploadUrl: serviceHelper.getBasicPath() + "/menu/importMenu", //上传的地址
                allowedFileExtensions: ['conf'],//接收的文件后缀,array类型，例如：['jpg', 'png','gif']
                // showUpload: true, //是否显示上传按钮
                // showCaption: false,//是否显示标题
                dropZoneEnabled: false,//默认不显示拖拽文件的窗
                maxFileCount: 1,//最大上传文件数
                //上传时发起请求，额外加入请求的值
                uploadExtraData: function (previewId, index) {
                    var formData = serviceHelper.getDefaultAjaxParam();
                    formData.importMenuId = this.nodeImport.id;

                    return formData;
                }.bind(this),
            }).on("filebatchselected", function (event, files) {
                //选择文件后马上上传
                $(this).fileinput("upload");
            }).on("fileuploaded", function (event, data) {
                //上传成功后回调
                var ajaxResult = data.response;
                //请求结果格式要求按ewater标准
                if (ajaxResult) {
                    if (ajaxResult.success === true) {
                        var result = ajaxResult.data;

                        //关闭弹窗
                        this.hideForm("formImport");
                        //刷新菜单树
                        this.refreshTree();

                        layer.msg('导入成功');
                    } else {
                        //后台操作失败的代码
                        alert(ajaxResult.msg);
                    }
                }
            }.bind(this));
        }
    }
});

module.exports = comm;