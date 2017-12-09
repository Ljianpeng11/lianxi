define(['./serviceHelper', 'moment'], function (serviceHelper, moment) {
    return {
        getAllEmployee: function (cb) {
            $.get(serviceHelper.getPath('queryEmployee'), function (result) {
                if (!!result.status) {
                    cb(result.data);
                }
            });
        }
    }
});