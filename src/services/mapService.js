define(['./serviceHelper'], function (serviceHelper) {
    return {
        getUserProjects: function (cb) {
            $.get(serviceHelper.getPath('getProjects'), function (result, errorCb) {
                if (!!result) {
                    if (!!result.success) {
                        var defaultProject = result.data;
                        cb(defaultProject);
                    }
                }
                else {
                    alert(result)
                //    errorCb(result);
                }
            });

        },
        getProjectById: function (projectId, cb) {
            var parameter = {
                id: 'getProjectById',
                parameter: {
                    projectId: projectId
                }
            };
            $.get(serviceHelper.getPath(parameter), function (result) {
                if (!!result.success) {
                    cb(result.data);
                }
            });
        }
    }
});