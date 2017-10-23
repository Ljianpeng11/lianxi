define(['./serviceHelper'], function (serviceHelper) {
    return {
        login: function (userName, password, cb, errorCb) {
            var parameter = {
                id: 'login',
                parameter: {
                    username: userName,
                    password: password
                }
            };
            $.get(serviceHelper.getPath(parameter), function (result) {
                if (!!result) {
                    if (!!result.success) {
                        serviceHelper.setToken(result.data);
                        cb(result.data);
                        window.sessionStorage.setItem('cescToken', result.data);
                        setInterval(function () {
                            //refreshToken
                            $.get(serviceHelper.getPath('refreshToken'), function (result) {
                                if (!!result) {
                                    if (!!result.success) {
                                        console.log('Refresh Token');
                                    }
                                }
                                else {
                                    console.log('Failed to refresh token');
                                }
                            });
                        }, 30000);
                    } else {
                        errorCb();

                    }
                }
                else {
                    errorCb();
                }
            });
        },
        getUserRole: function (token, cb, errorCb) {
            $.get(serviceHelper.getPath('userRole'), function (result) {
                if (!!result) {
                    var resultObj = JSON.parse(result);
                    if (resultObj.state == 1) {
                        cb(resultObj.data.result);
                    }
                }
                else {
                    errorCb();
                }
            });
        }
    }
});