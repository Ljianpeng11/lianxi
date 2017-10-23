require('./css/main.css');
var Vue = require('vue');
var VueRouter = require('vue-router');
var appMenu = require('modules/appMenu');
var appProfile = require('modules/appProfile');
var appNavigator = require('modules/appNavigator');
var appFooter = require('modules/appFooter');
var moduleController = require('controllers/moduleController');
var appHome = require('modules/appHome');
var appTab = require('modules/appTab');
var mainView = require('modules/mainView');
var appLogin = require('modules/login');
var eventHelper = require('utils/eventHelper');
var ElementUI = require('element-ui');
var appSearch = require('modules/appSearch');
var arcgisAPI = require('utils/arcgisAPI');
var mapHelper = require('utils/mapHelper');
Vue.use(ElementUI);
Vue.use(VueRouter);

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
/*var routes = [{
 path: '/' ,
 component: appHome
 }];
 for (var key in moduleController) {
 routes.push({
 path: '/' + key,
 component: moduleController[key]
 })
 }


 // 3. 创建 router 实例，然后传 `routes` 配置
 // 你还可以传别的配置参数, 不过先这么简单着吧。
 var router = new VueRouter({
 routes // （缩写）相当于 routes: routes
 });
 */
// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
var app = new Vue({
    mounted: function () {
        $('#loadingMask').hide();
        eventHelper.on('loginSuccess', function () {
            this.isLoginSuccess = true;
          //  $('#app').show();
        }.bind(this));
        eventHelper.on('loading-start', function () {
            $('#loadingMask').show();
        });
        eventHelper.on('loading-end', function () {
            $('#loadingMask').hide();
        });
        eventHelper.on('toggle-menu', function (flag) {
            this.isMenuToggleOff = flag;
        }.bind(this));
        window.eventHelper = eventHelper;
    }, data: function () {
        return {
            isLoginSuccess: false,
            isMenuToggleOff: false
        }
    },
    components: {
        'app-menu': appMenu,
        'app-login': appLogin,
        'app-profile': appProfile,
        'app-navigator': appNavigator,
        'app-tab': appTab,
        'main-view': mainView,
        // 'app-search': appSearch,
        'app-footer': appFooter
    }
});
mapHelper.register(arcgisAPI, function (apiInstance) {
    app.$mount('#app');
});
