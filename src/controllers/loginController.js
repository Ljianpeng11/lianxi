define(['services/loginService', 'services/serviceHelper'], function (loginService, serviceHelper) {
    return {
        login: function (userName, password, cb,errorCB) {
            loginService.login(userName, password, cb,errorCB);
        },
        getUserRole: function (token, cb) {
            loginService.getUserRole(token, cb, function () {
                console.log('Error');
            })
        },
        setToken: function (token) {
            serviceHelper.setToken(token);
        },
        //开始定时刷新token
        startRefreshTokenInterval: function () {
            loginService.startRefreshTokenInterval();
        },
    }
});