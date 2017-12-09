define(['./serviceHelper'], function (serviceHelper) {
    return {
        getApplicationMenu: function (token, cb, errorCb) {
            $.get(serviceHelper.getPath('userMenu'), function (result) {
                if (!!result) {
                    if (!!result.success) {
                        cb(result.data);
                    }
                    else {
                        alert(result.msg);
                    }
                }
                else {
                    errorCb();
                }
            });
        }
    }
});