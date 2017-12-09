var template = require('./login.html');
var loginCtrl = require('controllers/loginController');
var eventHelper = require('../../utils/eventHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        var cescUser = window.localStorage.getItem('cescUser');
        cescUser = JSON.parse(cescUser);
        return {
            ruleForm10: {
                name: '',
                sex: '',
                eMail: '',
                telphone: '',
                date: ''
            },
            password: !!cescUser ? cescUser.password : '',
            userName: !!cescUser ? cescUser.userName : '',
            loginComplete: false
        }
    },
    methods: {
        login: function () {
            eventHelper.emit('loading-start');
            loginCtrl.login(this.userName, this.password, function (token) {
                var user = {
                    userName: this.userName,
                    password: this.password
                };
                window.sessionStorage.setItem('cescToken',token);
                window.localStorage.setItem('cescUser', JSON.stringify(user));
                //eventHelper.emit('loading-end');
                eventHelper.emit('loading-end');
                eventHelper.emit('loginSuccess', token);
                console.log('Login Success:', token);
                this.loginComplete = true;
                $('#loginPage').hide();
            }.bind(this), function (error) {
                this.$message.error('错误:'+error);
                this.password = '';
                eventHelper.emit('loading-end');
            }.bind(this));
        }
    },
    mounted: function () {
        var self = this;
        document.onkeydown = function (e) {
            var ev = document.all ? window.event : e;
            if (ev.keyCode == 13) {
                self.login();
            }
        }
        var cache = window.sessionStorage.getItem('cescToken');
        if (!!cache) {
            //当页面初始化有token时（也就是已登录）会进入这里
            this.$nextTick(function () {
                loginCtrl.setToken(cache);
                eventHelper.emit('loading-end');
                eventHelper.emit('loginSuccess', cache);
                console.log('Login Success:', cache);
                this.loginComplete = true;

                //开始定时刷新token
                loginCtrl.startRefreshTokenInterval();

                $('#loginPage').hide();
            }.bind(this));
        }
        else {
            var loginFlag = true;
            eventHelper.on('login-start', function () {
                this.userName = $('#userName').val();
                this.password = $('#password').val();
                if (loginFlag) {
                    this.login();
                }
                loginFlag = false;
            }.bind(this));
        }
    },
    components: {}
});
module.exports = comm;