var template = require('./tab.html');
var eventHelper = require('utils/eventHelper');
var Sortable = require('sortablejs');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        var defaultTab = {
            id: 'arcgis-plugin',
            name: '主页',
            showClose: false,
            active: true
        };
        window.cesc.currentTab = defaultTab;
        return {
            isLoginSuccess: false,
            isMenuToggleOff: false,
            tabs: [
                defaultTab
            ]
        }
    },
    methods: {
        activateTab: function (tab) {
            if (!!this.preTab) {
                this.preTab.active = false;
            }
            if(!!tab){
                tab.active = true;
                eventHelper.emit('active-tab', tab.id);
                this.preTab = tab;
            }
        },
        removeTab: function (removeTab) {
            for (var i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].id == removeTab.id) {
                    if (!!this.tabs[i].active) {
                        if (i > 0) {
                            this.activateTab(this.tabs[i - 1]);
                        }
                        else {
                            this.activateTab(this.tabs[1]);
                        }
                    }
                    if(this.tabs.length >1){//最后必须留下一个tab
                        this.tabs.splice(i, 1);
                    }
                }
            }
        }
    },
    mounted: function () {
        eventHelper.on('loginSuccess', function () {
            this.isLoginSuccess = true;
        }.bind(this));
        var el = document.getElementById('simpleList');
        var sortable = Sortable.create(el);
        this.preTab = this.tabs[0];
        eventHelper.on('close-tab', function (tabID) {
            this.removeTab({id: tabID});
        }.bind(this));
        eventHelper.on('change-menu-success', function (menu) {
            var newTab = {
                id: menu.funUrl,
                name: menu.title,
                showClose: false,
                active: true
            };
            var isNewTab = true;
            this.tabs.forEach(function (tab) {
                if (tab.id === newTab.id) {
                    isNewTab = false;
                    newTab = tab;
                }
            });
            this.activateTab(newTab);
            if (isNewTab) {
                this.tabs.push(newTab);
            }
            this.preTab = newTab;
        }.bind(this));
        eventHelper.on('tab-status', function (cb) {
            cb({
                currentTab: this.preTab,
                tabs: this.tabs.slice(0)
            })
        }.bind(this));
        eventHelper.on('toggle-menu',function (flag) {
            this.isMenuToggleOff = flag;
        }.bind(this));
    },
    components: {}
});
module.exports = comm;