define(['./serviceHelper'], function (serviceHelper) {
    return {
        login: function (userName, password, cb,errorCb) {
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
                        serviceHelper.setToken(result.data.token);
                        cb(result.data);
                        window.sessionStorage.setItem('cescToken', result.data.token);

                        //开始定时刷新token
                        this.startRefreshTokenInterval();
                    }
                    else {
                        errorCb(result.msg);
                    }
                }
                else {
                    errorCb();
                }
            }.bind(this));
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
        },
        //开始定时刷新token
        //原则上每次进入页面要且只能执行一次此方法
        startRefreshTokenInterval: function () {
            setInterval(function () {
                //refreshToken
                //间隔一段时间（目前暂时5分钟更新一次）往后台更新一下token，保证token在后台不过期
                $.get(serviceHelper.getPath('refreshToken'), function (result) {
                    if (!!result) {
                        if (!!result.success) {
                            console.log('刷新Token成功');
                        }
                    }
                    else {
                        console.log('刷新Token失败');
                    }
                });
            }, 300000);
        }
    }
});