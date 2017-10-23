var template = require('./login.html');
var loginCtrl = require('controllers/loginController');
var eventHelper = require('../../utils/eventHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {}
    },
    methods: {
        login: function () {
            eventHelper.emit('loading-start');
            var userName = $('#userName').val();
            var password = $('#password').val();
            loginCtrl.login(userName, password, function (token) {
                eventHelper.emit('loading-end');
                eventHelper.emit('loginSuccess', token);
                console.log('Login Success:', token);
                this.loginComplete = true;
            }.bind(this), function (error) {
                $('#app').hide();
                $('#loginPanel').show();
                eventHelper.emit('loading-end');
                this.$message.error('密码错误');
            }.bind(this));
        }
    },
    mounted: function () {
        var cache = window.sessionStorage.getItem('cescToken');
        eventHelper.on('startLogin', function () {
            this.login();
        }.bind(this));
        if (!!cache) {
            this.$nextTick(function () {
                loginCtrl.setToken(cache);
                eventHelper.emit('loading-end');
                eventHelper.emit('loginSuccess', cache);
                console.log('Login Success:', cache);
                this.loginComplete = true;
            }.bind(this));
        }
        /* if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
         $('input:not(input[type=submit])').each(function(){
         var outHtml = this.outerHTML;
         $(this).append(outHtml);
         });
         }*/
    },
    components: {}
});
module.exports = comm;