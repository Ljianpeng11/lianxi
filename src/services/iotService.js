define(['./serviceHelper'], function (serviceHelper) {
    return {
        geIotFacilityInfo: function (parameter,cb) {
            var ajaxParam = {
                id: 'iotFacilityInfo',
                parameter: parameter
            }
            $.get(serviceHelper.getPath(ajaxParam), function (result) {
                //console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getIotDeviceRunningState:function(cb){
            var parameter = {
                id:'getIotDeviceRunningState'
            }
            $.get(serviceHelper.getPath(parameter),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            })
        }
    }
});