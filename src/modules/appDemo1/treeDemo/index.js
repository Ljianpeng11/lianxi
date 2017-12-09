/**
 * 树控件demo
 */

var template = require('./treeDemo.html');
var serviceHelper = require('services/serviceHelper.js');
//默认（最简）功能基类
var defaultBase = require('modules/common/defaultBase');

module.exports = defaultBase.extend({
    template: template,
    data: function () {
        return {
            //树控件的数据（所有节点，整棵树的数据）
            treeData: [],
            //树控件配置
            defaultProps: {
                //数据的子项的属性名
                children: 'children',
                //数据的节点标注的属性名
                label: 'name'
            },
            //当前节点（最近一次点击的节点）
            currentNode: {},
            //当前节点数据
            currentData: {},
            //右侧节点内容属性（名称）
            currentName: ""
        }
    },
    mounted: function () {
        var formData = {};
        formData.token = serviceHelper.getToken();
        formData.r = Math.random();

        //到后台加载树节点数据
        $.ajax({
            type: "get",
            dataType: "json",
            url: serviceHelper.getBasicPath() + "/companyDemoExt/getTreeDemoData",
            data: formData,
            success: function (ajaxResult) {
                if (ajaxResult) {
                    if (ajaxResult.success == true) {
                        var result = ajaxResult.data;
                        //获取到树节点数据并绑定
                        this.treeData = result;
                    } else {
                        //后台操作失败的代码
                        alert(ajaxResult.msg);
                    }
                }
            }.bind(this)
        });
    },
    methods: {
        btn1Click: function () {
            //获取所有选择的（checked box勾选中的）节点
            var nodeChecks = this.$refs.treeMain.getCheckedNodes()

            for (var i = 0; i < nodeChecks.length; i++) {
                var nodeCheck = nodeChecks[i];

                console.log(nodeCheck);
            }
        },
        //节点单击事件
        //获取当前节点也是通过此方法实现
        nodeClick: function (data, node, tree) {
            //data是节点绑定的数据
            //node是节点对象，里面很多有用属性，具体自己看
            //tree是树控件

            //获取当前节点
            this.currentNode = node;
            //当前节点数据
            this.currentData = node.data;

            this.currentName = node.data.name;

            //节点关键属性
            //父节点
            //注意：顶级节点的parent也不是null
            var nodeParent = node.parent;
            //节点层级，从1开始
            var level = node.level;
            //是否叶子节点
            var isLeaf = node.isLeaf;
            //子节点集合
            var childNodes = node.childNodes;
        },
        btnSaveClick: function () {
            if (this.currentNode) {
                //修改某个树节点的显示名称，直接改绑定的数据就行
                this.currentNode.data.name = this.currentName;
            }
        },
        btn2Click: function () {
            if (this.currentNode) {
                //删除当前节点
                //删除节点要从父节点删除，因此this.currentNode.parent是获取当前节点的父节点
                //当当前节点是根节点时（根节点是默认存在的唯一的隐藏的根节点），this.currentNode会有，但this.currentNode.parent会没有
                if (this.currentNode.parent)
                    this.currentNode.parent.removeChild(this.currentNode);
            }
        },
        btn3Click: function () {
            if (this.currentNode) {
                //往当前节点的子级添加新节点
                //删除节点要从父节点删除，因此this.currentNode.parent是获取当前节点的父节点

                //新节点的data（数据）
                var dataNew = {};
                dataNew.name = "新节点";
                dataNew.children = [];
                //往当前节点的children添加新节点，树控件会根据绑定的数据自己同步
                this.currentData.children.push(dataNew);
            }
        },
        renderContent: function (createElement, {node, data, store}) {
            //给节点添加自定义图标，这里用了节点自定义内容实现，理论上可以灵活性可以很大
            //官网例子是JSX语法，而这里改成使用普通的createElement，详细用户请看vue的Render函数
            return createElement("span", {}, [
                createElement("span", {}, [
                    //节点图标，使用glyphicon图标
                    createElement("span", {
                        'class': {
                            glyphicon: true,
                            'glyphicon-star': true
                        }
                    }),
                    //节点文字
                    createElement("span", node.label)
                ])
            ])
        }
    }
});
