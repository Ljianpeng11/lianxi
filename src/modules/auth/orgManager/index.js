//引用组件或视图

//此功能对应的视图（html）
var template = require('./orgManager.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//默认（最简）功能基类
var defaultBase = require('modules/common/defaultBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

//表单验证
var eFormValid = require('modules/common/eFormValid.js');

//ztree树控件
require('ztree/js/jquery.ztree.all.js');
require('ztree/css/metroStyle/metroStyle.css');

//菜单树样式
require('./orgManager.css');

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
            //ztree的id
            treeId: "",
            //是否显示组织列表
            showList: true,
            //容器（选择用户）
            containerUser: null,
        }
    },
    created: function () {
        //ztree的id，ztree在系统全局不能重复
        this.treeId = "tree" + Math.random().toString(36).substr(2);

        //容器（用户列表）
        this.containerUser = new container({
            data: function () {
                return {
                    //列表id，同一页面如果有多个实体列表需要修改
                    tableId: "tableUser",
                    //控制列表是否显示（此属性在容器基类），子表默认不显示
                    showList: false,
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: false,
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                }
            },
            methods: {
                //选择用户添加到组织
                select: function () {
                    var rows = $("#" + this.tableId, $("#" + this.vm.mainContentDivId)).bootstrapTable("getSelections");
                    var ids = rows.map(t => t.id);

                    var nodeSelect = this.vm.getSelectOrgUseParent();

                    var formData = serviceHelper.getDefaultAjaxParam();
                    //组织id
                    formData.orgId = nodeSelect.id;
                    formData.userIds = window.JSON.stringify(ids);

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/orgUserRlt/selectUser", formData, function (result) {
                        this.vm.backUserList();

                        var users = result;
                        //添加此次添加的用户到树节点
                        for (var i = 0; i < users.length; i++) {
                            var user = users[i];
                            var nodeNew = {};
                            nodeNew.id = user.id;
                            nodeNew.sysUserId = user.sysUserId;
                            nodeNew.name = user.name;
                            nodeNew.parentId = nodeSelect.id;
                            nodeNew.type = "user";
                            nodeNew.iconSkin = "orgManager_user";
                            nodeNew.isParent = false;

                            //添加节点
                            var nodeReal = this.vm.getZTreeObject().addNodes(nodeSelect, nodeNew);
                        }
                    }.bind(this));
                }
            }
        });
    },
    mounted: function () {
        //刷新菜单树
        this.refreshTree();

        this.containerUser.init(this, "/sysUser", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'loginName',
            title: '登录名'
        }, {
            field: 'name',
            title: '姓名'
        }, {
            field: 'roles',
            title: '角色'
        }]);
    },
    methods: {
        //获取ztree对象
        getZTreeObject: function () {
            return $.fn.zTree.getZTreeObj(this.treeId);
        },
        //初始化和刷新菜单树
        refreshTree: function () {
            var formData = serviceHelper.getDefaultAjaxParam();

            serviceHelper.getJson(serviceHelper.getBasicPath() + "/org/getTreeData", formData, function (result) {

                //节点拖动时判断是否能停靠到某节点
                function canPrevAndNext(treeId, nodes, targetNode) {
                    //只允许在同一父节点之间拖动
                    //目标节点的父节点
                    var targetParentNode = targetNode.getParentNode();
                    //当前节点的父节点
                    var currentNode = nodes[0];
                    //用户节点不能拖动调整顺序
                    if (currentNode.type && currentNode.type === "user")
                        return false;
                    //组织节点不能拖动到用户节点使得用户节点顺序变化
                    if (targetNode.type && targetNode.type === "user")
                        return false;

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

                            serviceHelper.getJson(serviceHelper.getBasicPath() + "/org/updateNodeSort", formData, function (result) {

                            }.bind(this));
                        }.bind(this)
                    }
                }, result);

                //展开根节点
                this.getZTreeObject().expandNode(this.getZTreeObject().getNodes()[0]);
            }.bind(this));
        },
        //获取选择的要作为父图层的组织
        getSelectOrgUseParent: function () {
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
        //新增组织
        addOrg: function () {
            var nodeSelect = this.getSelectOrgUseParent();
            if (!(nodeSelect))
                return;

            if (nodeSelect.type !== "org") {
                layer.msg('组织只能添加到组织');
                return;
            }

            //添加组图层节点
            this.addNode(nodeSelect, "org");
        },
        //新增用户
        addUser: function () {
            var nodeSelect = this.getSelectOrgUseParent();
            if (!(nodeSelect))
                return;

            if (nodeSelect.type !== "org") {
                layer.msg('用户只能添加到组织');
                return;
            }

            //显示用户列表（选择用户后，保存到数据库，再添加新的树节点）
            this.showUserList();
        },
        //添加节点
        //parentNode=父节点，type=菜单类型
        addNode: function (parentNode, type) {
            var nodeNew = {};
            nodeNew.id = 0;
            var name;
            if (type === "org") {
                name = "新组织";
            }
            nodeNew.name = name;
            //父节点为null就是根节点
            nodeNew.parentId = parentNode.id;
            nodeNew.type = type;
            //图标
            var iconSkin = "";
            if (type === "org") {
                iconSkin = "orgManager_org";
            }
            nodeNew.iconSkin = iconSkin;

            nodeNew.isParent = type === "org";
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

                    serviceHelper.getJson(serviceHelper.getBasicPath() + "/org/get", formData, function (result) {
                        this.currentEntity = result;
                        this.currentEntity.type = "org";
                        this.setFormControlVisible();
                    }.bind(this));
                }
            }
        },
        //根据节点类型，设置界面控件的显示和隐藏
        setFormControlVisible: function () {
            var type = this.currentNode && this.currentNode.type ? this.currentNode.type : "";

            //清除上一次验证的痕迹
            if (this.eFormValid) {
                this.eFormValid.clearValidResult();
            }

            //根据不同菜单显示，显示该类型特有的字段控件，以及不同的字段验证
            if (type === "org") {
                //显示或隐藏表单控件
                $("#btnSave", $("#" + this.mainContentDivId)).show();
                this.setFormControlShow("name");

                //表单验证
                this.eFormValid = new eFormValid();
                this.eFormValid.mainContentDivId = this.mainContentDivId;
                this.eFormValid.addNotNullRule("name", "名称");
            }
            else {
                //显示或隐藏表单控件
                $("#btnSave", $("#" + this.mainContentDivId)).hide();
                this.setFormControlHide("name");
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
            if (!this.currentEntity || this.currentNode.type !== "org" || this.currentNode.id === -1) return;

            //复制当前实体（因为保存的表单对象不一定等于当前实体，防止污染当前实体，因此把复制一份作为保存对象）
            var formData = $.extend(serviceHelper.getDefaultAjaxParam(), this.currentEntity);

            //表单验证
            if (!this.eFormValid.valid())
                return;

            serviceHelper.postJson(serviceHelper.getBasicPath() + "/org/save", formData, function (result) {
                //保存后同步信息到树节点
                this.currentEntity = result;

                this.currentNode.isSave = true;
                this.currentNode.id = this.currentEntity.id;
                this.currentNode.name = this.currentEntity.name;

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

                    //删除组织节点和用户节点有不同的url
                    var deleteUrl;
                    if (nodeSelect.type === "org") {
                        deleteUrl = "/org/delete";
                    } else if (nodeSelect.type === "user") {
                        deleteUrl = "/orgUserRlt/delete";
                    }

                    serviceHelper.getJson(serviceHelper.getBasicPath() + deleteUrl, formData, function (result) {
                        //删除树节点
                        this.getZTreeObject().removeNode(nodeSelect);

                        //删除后，要把当前选择节点清空
                        this.selectNode(null);
                    }.bind(this));
                }
            }.bind(this));
        },
        showUserList: function (e, value, row, index) {
            this.showList = false;
            this.containerUser.showList = true;

            this.containerUser.refreshList();
        },
        backUserList: function () {
            this.containerUser.showList = false;
            this.showList = true;
        },
    }
});

module.exports = comm;