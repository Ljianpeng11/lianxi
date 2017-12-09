var Vue = require('vue');
var template = require('./main-view.html');
var eventHelper = require('../../utils/eventHelper');
var moduleController = require('controllers/moduleController');
var serviceHelper = require('../../services/serviceHelper');
var appNoticeBox = require('modules/appNoticeBox');
var arcgisDraw = require('modules/arcgisPlugin/plugin/arcgisExpand/arcgis-load-map');
var mapHelper = require('utils/mapHelper');
var components = {
    'app-notice-box': appNoticeBox
};
//components = $.extend(components, moduleController);
var userTemplate = '';
for (var key in moduleController) {
    var newKey = key.toLowerCase();
    components[newKey] = moduleController[key];
    userTemplate += '<' + newKey + '>' + '</' + newKey + '>';
}
template = template.replace('@@', userTemplate);
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isLoading: false,
            currentView: '',
            isLoginSuccess: false
        }
    },
    methods: {
        changeView: function (view) {
            clearTimeout(this.changeViewTimer);
            this.changeViewTimer = setTimeout(function () {
                if (!!components[view.funUrl.toLowerCase()]) {
                    this.currentView = view.funUrl.toLowerCase();
                    eventHelper.emit('change-menu-success', view);
                } else {
                    eventHelper.emit(view.funUrl);
                    console.log('出错了！！找不到这个地址[' + view + ']');
                }
            }.bind(this), 10);
        },
        // toggleSearch: function () {
        //     eventHelper.emit('openPointSearch');
        // }
    },
    mounted: function () {
        eventHelper.on('loginSuccess', function () {
            this.isLoginSuccess = true;
        }.bind(this));
        eventHelper.on('mapCreated', function (map) {
            this.map = map;
        }.bind(this));

        this.currentView = 'arcgis-plugin';
        eventHelper.on('change-menu', function (model) {
            this.changeView(model);
        }.bind(this));
        eventHelper.on('active-tab', function (tabID) {
            this.changeView({funUrl: tabID});
        }.bind(this));
    },
    components: components
});
module.exports = comm;