//引用组件或视图

//此功能对应的视图（html）
var template = require('./projectManager.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

//表单验证
var eFormValid = require('modules/common/eFormValid.js');

//ztree树控件
require('ztree/js/jquery.ztree.all.js');
require('ztree/css/metroStyle/metroStyle.css');

//图层管理的css（与当前功能共用）
require('modules/map/layerManager/layerManager.css');

var comm = crudBase.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            //容器（专题图层）
            containerLayer: null,
            //容器（选择导入图层）
            containerSelectLayer: null,
        }
    },
    created: function () {
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                    //实体部分字段，为了绑定控件需要单独提出来
                    entityEnabled: true,
                }
            },
            watch: {
                currentEntity: function (val) {
                    if (val) {
                        //currentEntity提取字段的赋值
                        this.entityEnabled = val.enabled == 0 ? false : true;
                    }
                },
            },
            methods: {
                //获取自定义保存的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
                getCustomSaveValue: function () {
                    var formData = {};

                    //把提取出来的实体字段设回去实体
                    formData.enabled = this.entityEnabled === false ? 0 : 1;

                    return formData;
                },
            }
        });

        //容器（专题图层）
        this.containerLayer = new Vue({
            data: function () {
                return {
                    //当前专题id
                    projectId: 0,
                    //当前节点
                    currentNode: null,
                    //当前实体
                    currentEntity: {},
                    //实体部分字段，为了绑定控件需要单独提出来
                    entityDisplay: true,
                    entityEnabled: true,
                    //表单验证对象
                    eFormValid: null,
                    //ztree的id
                    treeId: ""
                }
            },
            watch: {
                currentEntity: function (val) {
                    if (val) {
                        //currentEntity提取字段的赋值
                        this.entityDisplay = val.display === 0 ? false : true;
                        this.entityEnabled = val.enabled === 0 ? false : true;
                    }
                },
            },
            methods: {
                //初始化表单
                initForm: function () {
                    //ztree的id，ztree在系统全局不能重复
                    this.treeId = "tree" + Math.random().toString(36).substr(2);

                    //表单验证
                    this.eFormValid = new eFormValid();
                    this.eFormValid.mainContentDivId = this.vm.mainContentDivId;
                    this.eFormValid.addNotNullRule("name", "名称");
                },
                //获取ztree对象
                getZTreeObject: function () {
                    return $.fn.zTree.getZTreeObj(this.treeId);
                },
                //初始化和刷新菜单树
                refreshTree: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();
                    formData.projectId = this.projectId;

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/projectLayer/getProjectLayerTreeByProjectId", formData, function (result) {

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

                                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/projectLayer/updateNodeSort", formData, function (result) {

                                    }.bind(this));
                                }.bind(this)
                            }
                        }, result);

                        //展开根节点
                        this.getZTreeObject().expandNode(this.getZTreeObject().getNodes()[0]);
                        this.selectNode(this.getZTreeObject().getNodes()[0]);
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
                //新增组图层
                addGroupLayer: function () {
                    var nodeSelect = this.getSelectMenuUseParent();
                    if (!(nodeSelect))
                        return;

                    if (nodeSelect.type !== "Group") {
                        layer.msg('组图层只能添加到组图层');
                        return;
                    }

                    //添加组图层节点
                    this.addNode(nodeSelect, "Group");
                },
                //加载图层
                addLayer: function () {
                    var nodeSelect = this.getSelectMenuUseParent();
                    if (!(nodeSelect))
                        return;

                    if (nodeSelect.type !== "Group") {
                        layer.msg('图层只能添加到组图层');
                        return;
                    }

                    //刷新选择图层的图层树
                    this.vm.containerSelectLayer.refreshTree();
                    //弹出选择图层弹窗
                    this.vm.showForm("editFormLayer");
                },
                //添加节点
                //parentNode=父节点，type=图层类型
                addNode: function (parentNode, type) {
                    var nodeNew = {};
                    nodeNew.id = 0;
                    nodeNew.name = type === "Group" ? "新组图层" : "新图层";
                    //父节点id
                    nodeNew.parentId = parentNode.id;
                    nodeNew.type = type;
                    //图标
                    var iconSkin = "";
                    if (type === "Group") {
                        iconSkin = "layerGroup";
                    }
                    else {
                        iconSkin = "layerLayer";
                    }
                    nodeNew.iconSkin = iconSkin;

                    nodeNew.isParent = type === "Group";
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
                    }
                    else {
                        //存放当前节点
                        this.currentNode = node;
                        //根节点不需要显示属性
                        if (node.isRoot == true) {
                            this.currentEntity = {};
                            return;
                        }

                        if (node.isSave === false) {
                            //新节点（未保存过的）
                            //把节点的属性复制到实体
                            this.currentEntity = $.extend({}, node);
                        }
                        else {
                            //已保存的节点，后台查询获取实体
                            var formData = serviceHelper.getDefaultAjaxParam();
                            formData.id = node.id;

                            serviceHelper.getJson(serviceHelper.getBasicPath() + "/projectLayer/get", formData, function (result) {
                                this.currentEntity = result;
                            }.bind(this));
                        }
                    }
                },
                //获取自定义保存的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
                getCustomSaveValue: function () {
                    var formData = {};

                    formData.projectId = this.projectId;
                    //把提取出来的实体字段设回去实体
                    formData.display = this.entityDisplay === false ? 0 : 1;
                    formData.enabled = this.entityEnabled === false ? 0 : 1;

                    return formData;
                },
                //保存
                save: function () {
                    //通过currentEntity的type是否有值判断当前是否可保存
                    if (!this.currentEntity || !this.currentEntity.type) return;

                    //复制当前实体（因为保存的表单对象不一定等于当前实体，防止污染当前实体，因此把复制一份作为保存对象）
                    var formData = $.extend(serviceHelper.getDefaultAjaxParam(), this.currentEntity);

                    //加上自定义保存的值
                    var customSaveValue = this.getCustomSaveValue();
                    if (customSaveValue)
                        $.extend(formData, customSaveValue);

                    //表单验证
                    if (!this.eFormValid.valid())
                        return;

                    serviceHelper.postJson(serviceHelper.getBasicPath() + "/projectLayer/save", formData, function (result) {
                        //保存后同步信息到树节点
                        this.currentEntity = result;

                        this.currentNode.isSave = true;
                        this.currentNode.id = this.currentEntity.id;
                        this.currentNode.name = this.currentEntity.name;

                        this.getZTreeObject().updateNode(this.currentNode);

                        layer.msg('保存成功');
                    }.bind(this));
                },
                //删除
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

                            serviceHelper.getJson(serviceHelper.getBasicPath() + "/projectLayer/delete", formData, function (result) {
                                //删除树节点
                                this.getZTreeObject().removeNode(nodeSelect);

                                //删除后，要把当前选择节点清空
                                this.selectNode(null);
                            }.bind(this));
                        }
                    }.bind(this));
                },
                //保存加载的图层
                saveLoadLayer: function () {
                    //获取选择的图层节点
                    var nodelayer = this.vm.containerSelectLayer.getSelectNode();
                    //获取选择的工程图层节点
                    var lstNodeSelect = this.getZTreeObject().getSelectedNodes();
                    var nodeSelect = lstNodeSelect[0];

                    var formData = serviceHelper.getDefaultAjaxParam();
                    //工程id
                    formData.projectId = this.projectId;
                    //导入到的工程图层id
                    formData.parentId = nodeSelect.id;
                    //要导入的图层id
                    formData.layerId = nodelayer.id;

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/projectLayer/addProjectLayerWithLayer", formData, function (result) {
                        var nodes = result;

                        var addNodeLoop = function (nodes, parentNode) {
                            for (var i = 0; i < nodes.length; i++) {
                                var node = nodes[i];

                                //新建时，添加节点
                                //只要添加第一层节点即可，因为第一层节点的children属性就包括第二层级以下的节点数据，添加节点时会把子节点一并添加
                                var nodeReal = this.getZTreeObject().addNodes(parentNode, node);

                                //继续遍历子节点
                                // if (node.children) {
                                //     addNodeLoop(node.children, nodeReal[0]);
                                // }
                            }
                        }.bind(this);

                        //添加新的工程图层树节点到树
                        addNodeLoop(nodes, nodeSelect);
                        //关闭弹窗
                        this.vm.hideForm("editFormLayer");
                        layer.msg('保存成功');
                    }.bind(this));
                }
            }
        });

        //容器（选择图层）
        this.containerSelectLayer = new Vue({
            data: function () {
                return {
                    //当前节点
                    currentNode: null,
                    //当前实体
                    currentEntity: {},
                    //ztree的id
                    treeId: ""
                }
            },
            methods: {
                //初始化表单
                initForm: function () {
                    //ztree的id，ztree在系统全局不能重复
                    this.treeId = "tree" + Math.random().toString(36).substr(2);
                },
                //获取ztree对象
                getZTreeObject: function () {
                    return $.fn.zTree.getZTreeObj(this.treeId);
                },
                //初始化和刷新菜单树
                refreshTree: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/layer/getTreeData", formData, function (result) {
                        //初始化树控件并填充数据
                        $.fn.zTree.init($("#" + this.treeId), {
                            data: {
                                keep: {
                                    //没此设置时，非子叶节点的最后一个子节点被删除后，会自动变成子叶节点
                                    parent: true
                                }
                            },

                            callback: {
                                onClick: function (event, treeId, treeNode) {
                                    //单击树节点事件
                                    // this.selectNode(treeNode);
                                }.bind(this),
                            }
                        }, result);

                        //展开根节点
                        this.getZTreeObject().expandNode(this.getZTreeObject().getNodes()[0]);
                        this.selectNode(this.getZTreeObject().getNodes()[0]);
                    }.bind(this));
                },
                //获取选择的节点
                getSelectNode: function () {
                    //获取当前选择节点
                    var lstNodeSelect = this.getZTreeObject().getSelectedNodes();
                    if (lstNodeSelect.length === 0) {
                        layer.msg('请选择节点');
                        return null;
                    }

                    var nodeSelect = lstNodeSelect[0];

                    return nodeSelect;
                },
            }
        });
    },
    mounted: function () {
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；grid的列头设置
        this.containerMain.init(this, "/project", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '名称'
        }, {
            field: 'enabled',
            title: '是否启用'
        }, {
            field: 'sort',
            title: '序号'
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
                //图层配置
                'click .layerConfig': function (e, value, row, index) {
                    //显示图层配置
                    this.vm.showLayerList(e, value, row, index);
                }.bind(this.containerMain)
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    //格式：一个功能是一个a，class必填因为跟点击事件有关
                    '<a class="layerConfig" href="javascript:;" title="图层配置">',
                    '图层配置',
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

        this.containerLayer.vm = this;
        this.containerSelectLayer.vm = this;

        //初始化
        this.containerLayer.initForm();
        this.containerSelectLayer.initForm();
    },
    methods: {
        //显示图层配置
        showLayerList: function (e, value, row, index) {
            this.containerMain.showList = false;
            this.containerLayer.showList = true;

            this.containerLayer.projectId = row.id;
            this.containerLayer.refreshTree();
        },
        //图层配置返回
        backLayerList: function () {
            this.containerLayer.showList = false;
            this.containerMain.showList = true;
        },
        //显示
        showForm: function (formId) {
            $("#" + formId, $("#" + this.mainContentDivId)).modal("show");
        },
        //隐藏
        hideForm: function (formId) {
            $("#" + formId, $("#" + this.mainContentDivId)).modal("hide");
        },
    }
});

module.exports = comm;